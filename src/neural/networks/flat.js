const ActivationLinear = require(__ACTIVACTION_FUNCTIONS + 'linear');
const ActivationTanh = require(__ACTIVACTION_FUNCTIONS + 'tanh');
const ActivationSigmoid = require(__ACTIVACTION_FUNCTIONS + 'sigmoid');
const FlatLayer = require(__LAYERS + 'flat');
const ErrorCalculation = require(__ERROR_CALCULATION + 'errorCalculation');
const _ = require('lodash');
const ArrayUtils = require(__UTILS + 'array');
const EncogError = require(__UTILS + 'encogError');
const NeuralNetworkError = require(__NETWORKS + '../neuralNetworkError');

/**
 * Implements a flat (vector based) neural network in the Encog Engine. This is
 * meant to be a very highly efficient feedforward, or simple recurrent, neural
 * network. It uses a minimum of objects and is designed with one principal in
 * mind-- SPEED. Readability, code reuse, object oriented programming are all
 * secondary in consideration.
 *
 * Vector based neural networks are also very good for GPU processing. The flat
 * network classes will make use of the GPU if you have enabled GPU processing.
 * See the Encog class for more info.
 */
class FlatNetwork {
    /**
     * Construct a flat neural network.
     *
     * @param inputLayers {number}
     *            Neurons in the input layer.
     * @param hidden1 {number}
     *            Neurons in the first hidden layer. Zero for no first hidden
     *            layer.
     * @param hidden2 {number}
     *            Neurons in the second hidden layer. Zero for no second hidden
     *            layer.
     * @param output {number}
     *            Neurons in the output layer.
     * @param tanh {boolean}
     *            True if this is a tanh activation, false for sigmoid.
     */
    constructor(inputLayers, hidden1, hidden2, output, tanh) {
        if (arguments.length == 1 && typeof arguments[0] == 'object') {
            this.init(arguments[0], false);
        } else if (arguments.length == 2 && typeof arguments[0] == 'object') {
            this.init(arguments[0], arguments[1]);
        } else {
            const linearAct = new ActivationLinear();
            let layers = [];
            const act = tanh ? new ActivationTanh() : new ActivationSigmoid();
            this.DEFAULT_BIAS_ACTIVATION = 1.0;
            this.NO_BIAS_ACTIVATION = 0.0;

            if ((hidden1 == 0) && (hidden2 == 0)) {
                layers.push(new FlatLayer(linearAct, inputLayers, this.DEFAULT_BIAS_ACTIVATION));
                layers.push(new FlatLayer(act, output, this.NO_BIAS_ACTIVATION));
            } else if ((hidden1 == 0) || (hidden2 == 0)) {
                const count = Math.max(hidden1, hidden2);
                layers.push(new FlatLayer(linearAct, inputLayers, this.DEFAULT_BIAS_ACTIVATION));
                layers.push(new FlatLayer(act, count, this.DEFAULT_BIAS_ACTIVATION));
                layers.push(new FlatLayer(act, output, this.NO_BIAS_ACTIVATION));
            } else {
                layers.push(new FlatLayer(linearAct, inputLayers, this.DEFAULT_BIAS_ACTIVATION));
                layers.push(new FlatLayer(act, hidden1, this.DEFAULT_BIAS_ACTIVATION));
                layers.push(new FlatLayer(act, hidden2, this.DEFAULT_BIAS_ACTIVATION));
                layers.push(new FlatLayer(act, output, this.NO_BIAS_ACTIVATION));
            }

            this.isLimited = false;
            this.connectionLimit = 0.0;

            this.init(layers, false);
        }
    }

    /**
     * Calculate the error for this neural network. The error is calculated
     * using root-mean-square(RMS).
     *
     * @param inputData {Array}
     *            The input data
     * @param idealData {Array}
     *            The output data
     * @return {number} The error percentage.
     */
    calculateError(inputData, idealData) {
        let errorCalculation = new ErrorCalculation();
        let output;
        let input;
        let ideal;

        for (let i = 0; i < inputData.length; i++) {
            input = inputData[i];
            ideal = idealData[i];
            output = this.compute(input);
            errorCalculation.updateError(output, ideal);
        }

        return errorCalculation.calculate();
    }

    /**
     * Returns the root mean square error for a complete training set.
     *
     * @return The current error for the neural network.
     */
    // calculate() {
    //     if (this.setSize == 0) {
    //         return 0;
    //     }
    //
    //     switch (ErrorCalculation.getMode()) {
    //         case RMS:
    //             return this.calculateRMS();
    //         case MSE:
    //             return calculateMSE();
    //         case ESS:
    //             return calculateESS();
    //         case LOGLOSS:
    //         case HOT_LOGLOSS:
    //             return calculateLogLoss();
    //         case NRMSE_MEAN:
    //             return calculateMeanNRMSE();
    //         case NRMSE_RANGE:
    //             return calculateRangeNRMSE();
    //
    //         default:
    //             return calculateMSE();
    //     }
    // }

    /**
     * Clear any connection limits.
     */
    clearConnectionLimit() {
        this.connectionLimit = 0.0;
        this.isLimited = false;
    }

    /**
     * Clear any context neurons.
     */
    clearContext() {
        let index = 0;

        for (let i = 0; i < this.layerIndex.length; i++) {

            const hasBias = (this.layerContextCount[i] + this.layerFeedCounts[i]) != this.layerCounts[i];

            // fill in regular neurons
            ArrayUtils.fillArray(this.layerOutput, index, index + this.layerFeedCounts[i], 0);
            index += this.layerFeedCounts[i];

            // fill in the bias
            if (hasBias) {
                this.layerOutput[index++] = this.biasActivation[i];
            }

            // fill in context
            ArrayUtils.fillArray(this.layerOutput, index, index + this.layerContextCount[i], 0);
            index += this.layerContextCount[i];
        }
    }

    /**
     * Calculate the output for the given input.
     *
     * @param {float} input
     *            The input.
     * @returns {Array}
     *            The Output
     */
    compute(input) {
        const sourceIndex = this.layerOutput.length - this.layerCounts[this.layerCounts.length - 1];
        let output = ArrayUtils.newFloatArray(this.outputCount);

        ArrayUtils.arrayCopy(input, 0, this.layerOutput, sourceIndex, this.inputCount);

        for (let i = this.layerIndex.length - 1; i > 0; i--) {
            this.computeLayer(i);
        }

        // update context values
        const offset = this.contextTargetOffset[0];

        ArrayUtils.arrayCopy(this.layerOutput, 0, this.layerOutput, offset, this.contextTargetOffset[0]);
        ArrayUtils.arrayCopy(this.layerOutput, 0, output, 0, this.outputCount);

        return output;
    }

    /**
     * Calculate a layer.
     *
     * @param {number} currentLayer
     *            The layer to calculate.
     */
    computeLayer(currentLayer) {
        const inputIndex = this.layerIndex[currentLayer];
        const outputIndex = this.layerIndex[currentLayer - 1];
        const inputSize = this.layerCounts[currentLayer];
        const outputSize = this.layerFeedCounts[currentLayer - 1];
        let dropoutRate;

        if (this.layerDropoutRates.length > currentLayer - 1) {
            dropoutRate = this.layerDropoutRates[currentLayer - 1];
        } else {
            dropoutRate = 0;
        }

        let index = this.weightIndex[currentLayer - 1];

        const limitX = outputIndex + outputSize;
        const limitY = inputIndex + inputSize;

        // weight values
        let sum;
        for (let x = outputIndex; x < limitX; x++) {
            sum = 0;
            for (let y = inputIndex; y < limitY; y++) {
                sum += this.weights[index] * this.layerOutput[y];
                index++;
            }
            this.layerSums[x] = sum;
            this.layerOutput[x] = sum;
        }

        this.activationFunctions[currentLayer - 1].activationFunction(this.layerOutput, outputIndex, outputSize);

        // update context values
        const offset = this.contextTargetOffset[currentLayer];
        ArrayUtils.arrayCopy(
            this.layerOutput, outputIndex,
            this.layerOutput, this.contextTargetOffset[currentLayer],
            this.contextTargetSize[currentLayer]
        );
    }

    /**
     * @return {number} The neuron count.
     */
    getNeuronCount() {
        let result = 0;
        for (let element of this.layerCounts) {
            result += element;
        }
        return result;
    }

    /**
     * Construct a flat network.
     *
     * @param layers {Array}
     *            The layers of the network to create.
     * @param dropout {boolean}
     *            Flag to enable dropout rate for each layer.
     */
    init(layers, dropout) {

        const layerCount = layers.length;

        this.inputCount = layers[0].getCount();
        this.outputCount = layers[layerCount - 1].getCount();

        this.layerCounts = ArrayUtils.newIntArray(layerCount);
        this.layerContextCount = ArrayUtils.newIntArray(layerCount);
        this.weightIndex = ArrayUtils.newIntArray(layerCount);
        this.layerIndex = ArrayUtils.newIntArray(layerCount);

        if (dropout) {
            this.layerDropoutRates = ArrayUtils.newFloatArray(layerCount);
        } else {
            this.layerDropoutRates = ArrayUtils.newFloatArray(0);
        }

        this.activationFunctions = [];
        this.layerFeedCounts = ArrayUtils.newIntArray(layerCount);
        this.contextTargetOffset = ArrayUtils.newIntArray(layerCount);
        this.contextTargetSize = ArrayUtils.newIntArray(layerCount);
        this.biasActivation = ArrayUtils.newIntArray(layerCount);

        let index = 0;
        let neuronCount = 0;
        let weightCount = 0;

        for (let i = layers.length - 1; i >= 0; i--) {

            let layer = layers[i];
            let nextLayer = null;

            if (i > 0) {
                nextLayer = layers[i - 1];
            }

            this.biasActivation[index] = layer.getBiasActivation();
            this.layerCounts[index] = layer.getTotalCount();
            this.layerFeedCounts[index] = layer.getCount();
            this.layerContextCount[index] = layer.getContextCount();
            this.activationFunctions[index] = layer.activation;
            if (dropout) {
                this.layerDropoutRates[index] = layer.dropoutRate;
            }

            neuronCount += layer.getTotalCount();

            if (nextLayer != null) {
                weightCount += layer.getCount() * nextLayer.getTotalCount();
            }

            if (index == 0) {
                this.weightIndex[index] = 0;
                this.layerIndex[index] = 0;
            } else {
                this.weightIndex[index] = this.weightIndex[index - 1] + (this.layerCounts[index] * this.layerFeedCounts[index - 1]);
                this.layerIndex[index] = this.layerIndex[index - 1] + this.layerCounts[index - 1];
            }

            let neuronIndex = 0;
            let contextCount;
            let contextTotal;
            for (let j = layers.length - 1; j >= 0; j--) {
                contextTotal = layers[j].getTotalCount();
                if (layers[j].contextFedBy == layer) {
                    this.hasContext = true;
                    contextCount = layers[j].getContextCount();
                    this.contextTargetSize[index] = contextCount;
                    this.contextTargetOffset[index] = neuronIndex + (contextTotal - contextCount);
                }
                neuronIndex += contextTotal;
            }

            index++;
        }

        this.beginTraining = 0;
        this.endTraining = this.layerCounts.length - 1;

        this.weights = ArrayUtils.newFloatArray(weightCount);
        this.layerOutput = ArrayUtils.newFloatArray(neuronCount);
        this.layerSums = ArrayUtils.newFloatArray(neuronCount);

        this.clearContext();
    }

    /**
     * Perform a simple randomization of the weights of the neural network
     * between -1 and 1.
     */
    randomize() {
        if (arguments.length == 0) {
            this._randomize(1, -1);
        } else if (arguments.length == 2) {
            this._randomize(arguments[0], arguments[1]);
        }

    }

    /**
     * Perform a simple randomization of the weights of the neural network
     * between the specified hi and lo.
     *
     * @param hi
     *            The network high.
     * @param lo
     *            The network low.
     */
    _randomize(hi, lo) {
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] = (Math.random() * (hi - lo)) + lo;
        }
    }

    /**
     * Get the weight between the two layers.
     * @param fromLayer {number} The from layer.
     * @param fromNeuron {number} The from neuron.
     * @param toNeuron {number} The to neuron.
     * @return {number} The weight value.
     */
    getWeight(fromLayer, fromNeuron, toNeuron) {
        this.validateNeuron(fromLayer, fromNeuron);
        this.validateNeuron(fromLayer + 1, toNeuron);
        const fromLayerNumber = this.layerContextCount.length - fromLayer - 1;
        const toLayerNumber = fromLayerNumber - 1;

        if (toLayerNumber < 0) {
            throw new NeuralNetworkError("The specified layer is not connected to another layer: " + fromLayer);
        }

        const weightBaseIndex = this.weightIndex[toLayerNumber];
        const count = this.layerCounts[fromLayerNumber];
        const weightIndex = weightBaseIndex + fromNeuron + (toNeuron * count);

        return this.weights[weightIndex];
    }

    /**
     * Validate the the specified targetLayer and neuron are valid.
     * @param targetLayer {number} The target layer.
     * @param neuron {number} The target neuron.
     */
    validateNeuron(targetLayer, neuron) {
        if ((targetLayer < 0) || (targetLayer >= this.layerCounts.length)) {
            throw new NeuralNetworkError("Invalid layer count: " + targetLayer);
        }

        if ((neuron < 0) || (neuron >= this.getLayerTotalNeuronCount(targetLayer))) {
            throw new NeuralNetworkError("Invalid neuron number: " + neuron);
        }
    }

    /**
     * Get the total (including bias and context) neuron cont for a layer.
     * @param layer {number} The layer.
     * @return {number} The count.
     */
    getLayerTotalNeuronCount(layer) {
        const layerNumber = this.layerCounts.length - layer - 1;
        return this.layerCounts[layerNumber];
    }

    /**
     * Get the neuron count.
     * @param layer {number} The layer.
     * @return {number} The neuron count.
     */
    getLayerNeuronCount(layer) {
        const layerNumber = this.layerCounts.length - layer - 1;
        return this.layerFeedCounts[layerNumber];
    }

    /**
     * Clone the network.
     *
     * @return {FlatNetwork} A clone of the network.
     */
    clone() {
        const result = new FlatNetwork();
        this.cloneFlatNetwork(result);
        return result;
    }

    /**
     * Clone into the flat network passed in.
     *
     * @param result {FlatNetwork}
     *            The network to copy into.
     */
    cloneFlatNetwork(result) {
        result.inputCount = this.inputCount;
        result.layerCounts = _.clone(this.layerCounts);
        result.layerIndex = _.clone(this.layerIndex);
        result.layerOutput = _.clone(this.layerOutput);
        result.layerSums = _.clone(this.layerSums);
        result.layerFeedCounts = _.clone(this.layerFeedCounts);
        result.contextTargetOffset = _.clone(this.contextTargetOffset);
        result.contextTargetSize = _.clone(this.contextTargetSize);
        result.layerContextCount = _.clone(this.layerContextCount);
        result.biasActivation = _.clone(this.biasActivation);
        result.outputCount = this.outputCount;
        result.weightIndex = this.weightIndex;
        result.weights = this.weights;
        result.layerDropoutRates = _.clone(this.layerDropoutRates);

        result.activationFunctions = [];
        for (let i = 0; i < this.activationFunctions.length; i++) {
            result.activationFunctions[i] = this.activationFunctions[i].clone();
        }

        result.beginTraining = this.beginTraining;
        result.endTraining = this.endTraining;
    }

    /**
     * Decode the specified data into the weights of the neural network. This
     * method performs the opposite of encodeNetwork.
     *
     * @param data {array}
     *            The data to be decoded.
     */
    decodeNetwork(data) {
        if (data.length != this.weights.length) {
            throw new EncogError(
                "Incompatible weight sizes, can't assign length="
                + data.length + " to length=" + this.weights.length);
        }
        this.weights = ArrayUtils.arrayClone(data);
    }

    /**
     * Encode the neural network to an array of doubles. This includes the
     * network weights. To read this into a neural network, use the
     * decodeNetwork method.
     *
     * @return {array} The encoded network.
     */
    encodeNetwork() {
        return this.weights;
    }

    /**
     * @return {number} The length of the array the network would encode to.
     */
    getEncodeLength() {
        return this.weights.length;
    }
}

module.exports = FlatNetwork;