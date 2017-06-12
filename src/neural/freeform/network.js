const FreeformNetworkError = require(PATHS.ERROR_HANDLING + 'freeformNetwork');
const ActivationSigmoid = require(PATHS.ACTIVATION_FUNCTIONS + 'sigmoid');
const ActivationTanh = require(PATHS.ACTIVATION_FUNCTIONS + 'tanh');
const ActivationLinear = require(PATHS.ACTIVATION_FUNCTIONS + 'linear');
const BasicFreeformNeuron = require(PATHS.FREEFORM + 'basic/neuron');
const BasicActivationSummation = require(PATHS.FREEFORM + 'basic/activationSummation');
const BasicFreeformConnection = require(PATHS.FREEFORM + 'basic/connection');
const WeightlessConnection = require(PATHS.FREEFORM + 'basic/weightlessConnection');
const BasicFreeformLayer = require(PATHS.FREEFORM + 'basic/layer');
const GateLayer = require(PATHS.FREEFORM + 'basic/gate');
const FreeformContextNeuron = require(PATHS.FREEFORM + 'contextNeuron');
const ErrorUtil = require(PATHS.UTILS + 'error');
const RangeRandomizer = require(PATHS.RANDOMIZERS + 'range');
const ArrayUtils = require(PATHS.UTILS + 'array');
/**
 * Implements a freefrom neural network. A freeform neural network can represent
 * much more advanced structures than the flat networks that the Encog
 * BasicNetwork implements. However, while freeform networks are more advanced
 * than the BasicNetwork, they are also much slower.
 *
 * Freeform networks allow just about any neuron to be connected to another
 * neuron. You can have neuron layers if you want, but they are not required.
 *
 */
class FreeformNetwork {

    /**
     * Create a freeform network from a basic network.
     *
     * @param network {BasicNetwork} The basic network to use.
     */
    constructor(network) {
        if (arguments.length === 0) {
            return;
        }

        if (network.getLayerCount() < 2) {
            throw new FreeformNetworkError("The BasicNetwork must have at least two layers to be converted.");
        }

        this.__loadBasicNetwork(network);
    }

    /**
     * Classify the input into a group.
     * @param {Array} input The input data to classify.
     * @return {number} The group that the data was classified into.
     */
    classify(input) {
        const output = this.compute(input);
        return _.max(output);
    }

    /**
     * Clear any data from any context layers.
     */
    clearContext() {
        this.performNeuronTask((neuron)=> {
            if (neuron.constructor.name === 'FreeformContextNeuron') {
                neuron.setActivation(0);
            }
        });
    }

    /**
     * Compute the output for this network.
     *
     * @param input {Array} The input.
     * @return {Array} The output.
     */
    compute(input) {
        // Allocate result
        const result = ArrayUtils.newFloatArray(this.outputLayer.size());

        // Copy the input
        for (let i = 0; i < input.length; i++) {
            this.inputLayer.setActivation(i, input[i]);
        }

        // Request calculation of outputs
        for (let i = 0; i < this.outputLayer.size(); i++) {
            const outputNeuron = this.outputLayer.getNeurons()[i];
            outputNeuron.performCalculation();
            result[i] = outputNeuron.getActivation();
        }

        this.updateContext();

        return result;
    }

    /**
     * Connect two layers.
     *
     * @param source {FreeformLayer} The source layer.
     * @param target {FreeformLayer} The target layer.
     * @param theActivationFunction {ActivationFunction} The activation function to use.
     * @param biasActivation {Number} The bias activation to use.
     */
    connectLayers(source, target, theActivationFunction = new ActivationTanh(), biasActivation = 1.0, connectionType = BasicFreeformConnection) {
        source.connectWith(target, theActivationFunction, biasActivation, connectionType);
    }

    gateLayers(source, target, layerName = 'GateLayer', theActivationFunction = new ActivationTanh()) {
        if (source.id === target.id) {
            source = this.createContext(source, target, source.name + ' Context Layer', WeightlessConnection);
        }

        const gateLayer = new GateLayer(layerName);
        const gateMul = new BasicFreeformLayer(source.name + ' Gate Multiplier');

        gateLayer.add(new BasicFreeformNeuron());
        for (let i = 0; i < source.size(); i++) {
            gateMul.add(new BasicFreeformNeuron());
        }

        source.connectWith(gateMul, theActivationFunction, 1, WeightlessConnection);
        gateLayer.connectWith(gateMul, new ActivationSigmoid(), 0, WeightlessConnection);
        gateMul.connectWith(target, new ActivationLinear(), 0, WeightlessConnection);

        return gateLayer;
    }

    createLSTMUnit(inputNeurons, memoryCellNeuron, outputNeurons) {
        const input = this.createLayer(inputNeurons, 'LSTM Input');
        const output = this.createLayer(outputNeurons, 'LSTM Ouput');
        const memoryCell = this.createLayer(memoryCellNeuron, 'Memory Cell');

        const inputGate = this.gateLayers(input, memoryCell, 'Input Gate');
        const outputGate = this.gateLayers(memoryCell, output, 'Output Gate');
        const forgetGate = this.gateLayers(memoryCell, memoryCell, 'Forget Gate');

        this.createContext(output, inputGate, 'LSTM Ouput to inputGate context');
        this.createContext(output, outputGate, 'LSTM Ouput to outputGate context');
        this.createContext(output, forgetGate, 'LSTM Ouput to forgetGate context');

        return {
            input,
            output,
            inputGate,
            outputGate,
            forgetGate
        };
    }

    /**
     * Create a context connection, such as those used by Jordan/Elmann.
     *
     * @param source {FreeformLayer} The source layer.
     * @param target {FreeformLayer} The target layer.
     * @param layerName {String} The layer name.
     * @return {FreeformLayer} The newly created context layer.
     */
    createContext(source, target, layerName = 'Context Layer', connectionType = BasicFreeformConnection) {
        const biasActivation = 0.0;
        let activationFunction;
        let contextLayerNeuron;

        // if (source.getNeurons()[0].getOutputs().length < 1) {
        //     throw new FreeformNetworkError(
        //         "A layer cannot have a context layer connected if there are no other outbound connections from the source layer." +
        //         "  Please connect the source layer somewhere else first.");
        // }

        activationFunction = source.getNeurons()[0].getInputSummation().getActivationFunction();

        // first create the context layer
        const contextLayer = new BasicFreeformLayer(layerName);
        for (let neuron of source.getNeurons()) {
            if (neuron.isBias()) {
                contextLayerNeuron = new BasicFreeformNeuron(null);
                contextLayerNeuron.setBias(true);
                contextLayerNeuron.setActivation(neuron.getActivation());
            } else {
                contextLayerNeuron = new FreeformContextNeuron(neuron);
            }
            contextLayer.add(contextLayerNeuron);
        }

        // now connect the context layer to the target layer
        this.connectLayers(contextLayer, target, activationFunction, biasActivation, connectionType);

        return contextLayer;
    }

    /**
     * Create the input layer.
     *
     * @param neuronCount {Number} The input neuron count.
     * @param layerName {String} The layer name.
     * @return {FreeformLayer} The newly created layer.
     */
    createInputLayer(neuronCount, layerName = 'Input Layer') {
        if (neuronCount < 1) {
            throw new FreeformNetworkError("Input layer must have at least one neuron.");
        }
        this.inputLayer = this.createLayer(neuronCount, layerName);
        return this.inputLayer;
    }

    /**
     * Create a hidden layer.
     *
     * @param neuronCount {Number} The neuron count.
     * @param layerName {String} The layer name.
     * @return {FreeformLayer} The newly created layer.
     */
    createLayer(neuronCount, layerName = 'Layer') {
        if (neuronCount < 1) {
            throw new FreeformNetworkError("Layer must have at least one neuron.");
        }

        const result = new BasicFreeformLayer(layerName);

        // Add the neurons for this layer
        for (let i = 0; i < neuronCount; i++) {
            result.add(new BasicFreeformNeuron());
        }

        return result;
    }

    /**
     * Create the output layer.
     *
     * @param neuronCount {Number} The neuron count.
     * @param layerName {String} The layer name.
     * @return {FreeformLayer} The newly created output layer.
     */
    createOutputLayer(neuronCount, layerName = 'Output Layer') {
        if (neuronCount < 1) {
            throw new FreeformNetworkError("Output layer must have at least one neuron.");
        }
        this.outputLayer = this.createLayer(neuronCount, layerName);
        return this.outputLayer;
    }

    /**
     * @inheritDoc
     */
    decodeFromArray(encoded) {
        let index = 0;
        const visited = [];
        const queue = [];
        let neuron;

        // first copy outputs to queue
        for (let neuron of this.outputLayer.getNeurons()) {
            queue.push(neuron);
        }

        while (queue.length > 0) {
            // pop a neuron off the queue
            neuron = queue[0];
            queue.shift();
            visited.push(neuron);

            // find anymore neurons and add them to the queue.
            if (neuron.getInputSummation() != null) {
                for (let connection of neuron.getInputSummation().list()) {
                    connection.setWeight(encoded[index++]);
                    const nextNeuron = connection.getSource();
                    if (visited.indexOf(nextNeuron) === -1) {
                        queue.push(nextNeuron);
                    }
                }
            }
        }
    }

    /**
     * @inheritDoc
     */
    encodedArrayLength() {
        let result = 0;
        const visited = [];
        const queue = [];

        // first copy outputs to queue
        for (let neuron of this.outputLayer.getNeurons()) {
            queue.push(neuron);
        }

        while (queue.length > 0) {
            // pop a neuron off the queue
            const neuron = queue[0];
            queue.shift();
            visited.push(neuron);

            // find anymore neurons and add them to the queue.
            if (neuron.getInputSummation() != null) {
                for (let connection of neuron.getInputSummation().list()) {
                    result++;
                    const nextNeuron = connection.getSource();
                    if (visited.indexOf(nextNeuron) === -1) {
                        queue.push(nextNeuron);
                    }
                }
            }
        }

        return result;
    }

    /**
     * @inheritDoc
     */
    encodeToArray(encoded) {
        let index = 0;
        const visited = [];
        const queue = [];

        // first copy outputs to queue
        for (let neuron of this.outputLayer.getNeurons()) {
            queue.push(neuron);
        }

        while (queue.length > 0) {
            // pop a neuron off the queue
            const neuron = queue[0];
            queue.shift();
            visited.push(neuron);

            // find anymore neurons and add them to the queue.
            if (neuron.getInputSummation() != null) {
                for (let connection of neuron.getInputSummation().list()) {
                    encoded[index++] = connection.getWeight();
                    const nextNeuron = connection.getSource();
                    if (visited.indexOf(nextNeuron) === -1) {
                        queue.push(nextNeuron);
                    }
                }
            }
        }

    }

    /**
     * @inheritDoc
     */
    getInputCount() {
        return this.inputLayer.sizeNonBias();
    }

    /**
     * @inheritDoc
     */
    getOutputCount() {
        return this.outputLayer.sizeNonBias();
    }

    /**
     * @return {FreeformLayer} The output layer.
     */
    getOutputLayer() {
        return this.outputLayer;
    }

    /**
     * Perform the specified connection task. This task will be performed over
     * all connections.
     *
     * @param task {Function}
     *            The connection task.
     */
    performConnectionTask(task) {
        const visited = [];

        for (let neuron of this.outputLayer.getNeurons()) {
            this.__performConnectionTask(visited, neuron, task);
        }
    }

    /**
     * Perform the specified neuron task. This task will be executed over all
     * neurons.
     *
     * @param task {Function} The neuron task to perform.
     */
    performNeuronTask(task) {
        const visited = [];

        for (let neuron of this.outputLayer.getNeurons()) {
            this.__performNeuronTask(visited, neuron, task);
        }
    }


    /**
     * @inheritDoc
     */
    reset() {
        const randomizer = new RangeRandomizer(-1, 1);

        EncogLog.debug('==> Randomize weights');
        this.performConnectionTask((connection) => {
            connection.setWeight(randomizer.nextDouble());
            EncogLog.debug(connection.getSource().layerName + ' (' + connection.getSource().name + ') --> '
                + connection.getTarget().layerName + ' (' + connection.getTarget().name + '): '
                + "initial weight: " + connection.getWeight());
        });
        EncogLog.debug('==> Finish randomize weights');
        EncogLog.print();
    }

    /**
     * Allocate temp training space.
     * @param neuronSize {Number} The number of elements to allocate on each neuron.
     * @param connectionSize {Number} The number of elements to allocate on each connection.
     */
    tempTrainingAllocate(neuronSize, connectionSize) {
        this.performNeuronTask((neuron) => {
            neuron.allocateTempTraining(neuronSize);
            if (neuron.getInputSummation() != null) {
                for (let connection of neuron.getInputSummation().list()) {
                    connection.allocateTempTraining(connectionSize);
                }
            }
        });
    }

    /**
     * Clear the temp training data.
     */
    tempTrainingClear() {
        this.performNeuronTask((neuron) => {
            neuron.clearTempTraining();
            if (neuron.getInputSummation() != null) {
                for (let connection of neuron.getInputSummation().list()) {
                    connection.clearTempTraining();
                }
            }
        });
    }

    /**
     * Update context.
     */
    updateContext() {
        this.performNeuronTask((neuron) => {
            neuron.updateContext();
        });
    }

    /**
     * Calculate the error for this neural network.  We always calculate the error
     * using the "regression" calculator.  Neural networks don't directly support
     * classification, rather they use one-of-encoding or similar.  So just using
     * the regression calculator gives a good approximation.
     *
     * @param input {Array}
     * @param output {Array}
     * @return {Number} The error percentage.
     */
    calculateError(input, output) {
        return ErrorUtil.calculateRegressionError(this, input, output);
    }

    /**
     * Connect layers from a BasicNetwork. Used internally only.
     *
     * @param network {BasicNetwork} The BasicNetwork.
     * @param fromLayerIdx {Number} The from layer index.
     * @param source {FreeformLayer} The from layer.
     * @param target {FreeformLayer} The target.
     */
    connectLayersFromBasic(network, fromLayerIdx, source, target) {
        for (let targetNeuronIdx = 0; targetNeuronIdx < target.size(); targetNeuronIdx++) {
            for (let sourceNeuronIdx = 0; sourceNeuronIdx < source.size(); sourceNeuronIdx++) {
                const sourceNeuron = source.getNeurons()[sourceNeuronIdx];
                const targetNeuron = target.getNeurons()[targetNeuronIdx];

                // neurons with no input (i.e. bias neurons)
                if (targetNeuron.getInputSummation() == null) {
                    continue;
                }

                const connection = new BasicFreeformConnection(sourceNeuron, targetNeuron);
                sourceNeuron.addOutput(connection);
                targetNeuron.addInput(connection);
                connection.setWeight(network.getWeight(fromLayerIdx, sourceNeuronIdx, targetNeuronIdx));
            }
        }
    }


    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    __loadBasicNetwork(network) {
        // handle each layer
        let previousLayer = null;
        let currentLayer;

        for (let currentLayerIndex = 0; currentLayerIndex < network.getLayerCount(); currentLayerIndex++) {
            // create the layer
            currentLayer = new BasicFreeformLayer();

            // Is this the input layer?
            if (this.inputLayer == null) {
                this.inputLayer = currentLayer;
            }

            // Add the neurons for this layer
            for (let i = 0; i < network.getLayerNeuronCount(currentLayerIndex); i++) {
                // obtain the summation object.
                let summation = null;

                if (previousLayer != null) {
                    summation = new BasicActivationSummation(network.getActivation(currentLayerIndex));
                }

                // add the new neuron
                currentLayer.add(new BasicFreeformNeuron(summation));
            }

            // Fully connect this layer to previous
            if (previousLayer != null) {
                this.connectLayersFromBasic(network, currentLayerIndex - 1, previousLayer, currentLayer);
            }

            // Add the bias neuron
            // The bias is added after connections so it has no inputs
            if (network.isLayerBiased(currentLayerIndex)) {
                const biasNeuron = new FreeformContextNeuron(null);
                biasNeuron.setBias(true);
                biasNeuron.setActivation(network.getLayerBiasActivation(currentLayerIndex));
                currentLayer.add(biasNeuron);
            }

            // update previous layer
            previousLayer = currentLayer;
            currentLayer = null;
        }

        // finally, set the output layer.
        this.outputLayer = previousLayer;
    }

    /**
     * Perform the specified neuron task.
     * @param visited {Array} The visited list.
     * @param parentNeuron {FreeformNeuron} The neuron to start with.
     * @param task {Function} The task to perform.
     */
    __performNeuronTask(visited, parentNeuron, task) {
        visited.push(parentNeuron.id);
        task(parentNeuron);

        // does this neuron have any inputs?
        if (parentNeuron.getInputSummation() != null) {
            // visit the inputs
            for (let connection of parentNeuron.getInputSummation().list()) {
                const neuron = connection.getSource();
                // have we already visited this neuron?
                if (visited.indexOf(neuron.id) === -1) {
                    this.__performNeuronTask(visited, neuron, task);
                }
            }
        }
    }

    /**
     * Perform the specified connection task.
     *
     * @param visited {Array}
     *            The list of visited neurons.
     * @param parentNeuron {FreeformNeuron}
     *            The parent neuron.
     * @param task {Function}
     *            The task.
     */
    __performConnectionTask(visited, parentNeuron, task) {
        let neuron;
        visited.push(parentNeuron.id);

        // does this neuron have any inputs?
        if (parentNeuron.getInputSummation() != null) {
            // visit the inputs
            for (let connection of parentNeuron.getInputSummation().list()) {
                task(connection);
                neuron = connection.getSource();
                // have we already visited this neuron?
                if (visited.indexOf(neuron.id) === -1) {
                    this.__performConnectionTask(visited, neuron, task);
                }
            }
        }
    }
}

module.exports = FreeformNetwork;