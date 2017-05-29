const FreeformNetworkError = require(PATHS.ERROR_HANDLING + 'freeformNetwork');
const ActivationTANH = require(PATHS.ACTIVATION_FUNCTIONS + 'tanh');
const BasicFreeformNeuron = require(PATHS.FREEFORM + 'basic/neuron');
const BasicActivationSummation = require(PATHS.FREEFORM + 'basic/activationSummation');
const BasicFreeformConnection = require(PATHS.FREEFORM + 'basic/connection');
const BasicFreeformLayer = require(PATHS.FREEFORM + 'basic/layer');
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
                this.connectLayersFromBasic(network, currentLayerIndex - 1,
                    previousLayer, currentLayerIndex, currentLayer,
                    currentLayerIndex, false);
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
     * Create a freeform network from a basic network.
     *
     * @param network {BasicNetwork} The basic network to use.
     */
    constructor(network) {
        if (arguments.length === 0) {
            return;
        }

        if (network.getLayerCount() < 2) {
            throw new FreeformNetworkError(
                "The BasicNetwork must have at least two layers to be converted.");
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
     * @param input {Array}
     *            The input.
     * @return {Array}
     *            The output.
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
     * @param source {FreeformLayer}
     *            The source layer.
     * @param target {FreeformLayer}
     *            The target layer.
     * @param theActivationFunction {ActivationFunction}
     *            The activation function to use.
     * @param biasActivation {Number}
     *            The bias activation to use.
     * @param isRecurrent {Boolean}
     *            True, if this is a recurrent connection.
     */
    connectLayers(source, target, theActivationFunction = new ActivationTANH(), biasActivation = 1.0, isRecurrent = false) {
        // create bias, if requested
        if (biasActivation > PATHS.CONSTANTS.DEFAULT_DOUBLE_EQUAL) {
            // does the source already have a bias?
            if (source.hasBias()) {
                throw new FreeformNetworkError("The source layer already has a bias neuron, you cannot create a second.");
            }
            const biasNeuron = new BasicFreeformNeuron(null);
            biasNeuron.setActivation(biasActivation);
            biasNeuron.setBias(true);
            source.add(biasNeuron);
        }

        // create connections
        for (let targetNeuron of target.getNeurons()) {
            // create the summation for the target
            let summation = targetNeuron.getInputSummation();

            // do not create a second input summation
            if (summation == null) {
                summation = new BasicActivationSummation(theActivationFunction);
                targetNeuron.setInputSummation(summation);
            }

            // connect the source neurons to the target neuron
            for (let sourceNeuron of source.getNeurons()) {
                const connection = new BasicFreeformConnection(sourceNeuron, targetNeuron);
                sourceNeuron.addOutput(connection);
                targetNeuron.addInput(connection);
            }
        }
    }


    /**
     * Connect layers from a BasicNetwork. Used internally only.
     *
     * @param network {BasicNetwork}
     *            The BasicNetwork.
     * @param fromLayerIdx {Number}
     *            The from layer index.
     * @param source {FreeformLayer}
     *            The from layer.
     * @param sourceIdx {Number}
     *            The source index.
     * @param target {FreeformLayer}
     *            The target.
     * @param targetIdx {Number}
     *            The target index.
     * @param isRecurrent {Boolean}
     *            True, if this is recurrent.
     */
    connectLayersFromBasic(network, fromLayerIdx, source, sourceIdx, target, targetIdx, isRecurrent) {
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

    /**
     * Create a context connection, such as those used by Jordan/Elmann.
     *
     * @param source {FreeformLayer}
     *            The source layer.
     * @param target {FreeformLayer}
     *            The target layer.
     * @return {FreeformLayer} The newly created context layer.
     */
    createContext(source, target) {
        const biasActivation = 0.0;
        let activatonFunction;

        if (source.getNeurons()[0].getOutputs().length < 1) {
            throw new FreeformNetworkError(
                "A layer cannot have a context layer connected if there are no other outbound connections from the source layer." +
                "  Please connect the source layer somewhere else first.");
        }

        activatonFunction = source.getNeurons()[0].getInputSummation().getActivationFunction();

        // first create the context layer
        const result = new BasicFreeformLayer();

        for (let i = 0; i < source.size(); i++) {
            const neuron = source.getNeurons()[i];
            if (neuron.isBias()) {
                const biasNeuron = new BasicFreeformNeuron(null);
                biasNeuron.setBias(true);
                biasNeuron.setActivation(neuron.getActivation());
                result.add(biasNeuron);
            } else {
                result.add(new FreeformContextNeuron(neuron));
            }
        }

        // now connect the context layer to the target layer
        this.connectLayers(result, target, activatonFunction, biasActivation, false);

        return result;
    }

    /**
     * Create the input layer.
     *
     * @param neuronCount {Number} The input neuron count.
     * @return {FreeformLayer} The newly created layer.
     */
    createInputLayer(neuronCount) {
        if (neuronCount < 1) {
            throw new FreeformNetworkError("Input layer must have at least one neuron.");
        }
        this.inputLayer = this.createLayer(neuronCount);
        return this.inputLayer;
    }

    /**
     * Create a hidden layer.
     *
     * @param neuronCount {Number} The neuron count.
     * @return {FreeformLayer} The newly created layer.
     */
    createLayer(neuronCount) {
        if (neuronCount < 1) {
            throw new FreeformNetworkError("Layer must have at least one neuron.");
        }

        const result = new BasicFreeformLayer();

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
     * @return {FreeformLayer} The newly created output layer.
     */
    createOutputLayer(neuronCount) {
        if (neuronCount < 1) {
            throw new FreeformNetworkError("Output layer must have at least one neuron.");
        }
        this.outputLayer = this.createLayer(neuronCount);
        return this.outputLayer;
    }

    /**
     * {@inheritDoc}
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
     * {@inheritDoc}
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
     * {@inheritDoc}
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
     * {@inheritDoc}
     */
    getInputCount() {
        return this.inputLayer.sizeNonBias();
    }

    /**
     * {@inheritDoc}
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
        visited.push(parentNeuron);

        // does this neuron have any inputs?
        if (parentNeuron.getInputSummation() != null) {
            // visit the inputs
            for (let connection of parentNeuron.getInputSummation().list()) {
                task(connection);
                const neuron = connection.getSource();
                // have we already visited this neuron?
                if (visited.indexOf(neuron) === -1) {
                    this.__performConnectionTask(visited, neuron, task);
                }
            }
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
     * Perform the specified neuron task.
     * @param visited {Array} The visited list.
     * @param parentNeuron {FreeformNeuron} The neuron to start with.
     * @param task {Function} The task to perform.
     */
    __performNeuronTask(visited, parentNeuron, task) {
        visited.push(parentNeuron);
        task(parentNeuron);

        // does this neuron have any inputs?
        if (parentNeuron.getInputSummation() != null) {
            // visit the inputs
            for (let connection of parentNeuron.getInputSummation().list()) {
                const neuron = connection.getSource();
                // have we already visited this neuron?
                if (visited.indexOf(neuron) === -1) {
                    this.__performNeuronTask(visited, neuron, task);
                }
            }
        }
    }


    /**
     * {@inheritDoc}
     */
    reset() {
        const randomizer = new RangeRandomizer(-1, 1);

        /**
         * {@inheritDoc}
         */
        this.performConnectionTask((connection) => {
            connection.setWeight(randomizer.nextDouble());
        });
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
}

module.exports = FreeformNetwork;