const ArrayUtils = require(PATHS.PREPROCESSING + 'array');
const Matrix = require(PATHS.MATRICES + 'matrix');
/**
 * A threaded worker that is used to calculate the first derivatives of the
 * output of the neural network. These values are ultimatly used to calculate
 * the Hessian.
 *
 */
class ChainRuleWorker {
    /**
     * Construct the chain rule worker.
     * @param theNetwork {FlatNetwork} The network to calculate a Hessian for.
     * @param input {Array} The training data.
     * @param output {Array} The training data.
     * @param theLow {Number} The low range.
     * @param theHigh {Number} The high range.
     */
    constructor(theNetwork, input, output, theLow, theHigh) {
        this.weightCount = theNetwork.weights.length;
        this.hessianMatrix = new Matrix(this.weightCount, this.weightCount);

        this.flat = theNetwork;

        this.layerDelta = ArrayUtils.newFloatArray(theNetwork.layerOutput.length);
        this.actual = ArrayUtils.newFloatArray(theNetwork.outputCount);
        this.totDeriv = ArrayUtils.newFloatArray(this.weightCount);
        this.gradients = ArrayUtils.newFloatArray(this.weightCount);

        this.weights = theNetwork.weights;
        this.layerIndex = theNetwork.layerIndex;
        this.layerCounts = theNetwork.layerCounts;
        this.weightIndex = theNetwork.weightIndex;
        this.layerOutput = theNetwork.layerOutput;
        this.layerSums = theNetwork.layerSums;
        this.layerFeedCounts = theNetwork.layerFeedCounts;
        this.low = theLow;
        this.high = theHigh;
        this.input = input;
        this.output = output;
        this.outputNeuron = 0;
    }

    /**
     * @inheritDoc
     */
    run() {
        this.error = 0;
        this.hessianMatrix.clear();
        ArrayUtils.fill(this.totDeriv, 0);
        ArrayUtils.fill(this.gradients, 0);

        let derivative = ArrayUtils.newFloatArray[this.weightCount];

        // Loop over every training element
        for (let i = this.low; i <= this.high; i++) {
            ArrayUtils.fill(derivative, 0);

            this.process(this.outputNeuron, derivative, this.input[i], this.output[i]);
        }
    }

    /**
     * Process one training set element.
     *
     * @param outputNeuron {Number}
     * @param derivative {Array}
     * @param input {Array}
     *            The network input.
     * @param ideal {Array}
     *            The ideal values.
     */
    process(outputNeuron, derivative, input, ideal) {

        this.actual = this.flat.compute(input);

        let e = ideal[outputNeuron] - this.actual[outputNeuron];
        this.error += e * e;

        for (let i = 0; i < this.actual.length; i++) {
            if (i == outputNeuron) {
                this.layerDelta[i] = this.flat.activationFunctions[0].derivativeFunction(this.layerSums[i], this.layerOutput[i]);
            } else {
                this.layerDelta[i] = 0;
            }
        }

        for (let i = this.flat.beginTraining; i < this.flat.endTraining; i++) {
            this.processLevel(i, derivative);
        }

        // calculate gradients
        for (let j = 0; j < this.weights.length; j++) {
            this.gradients[j] += e * derivative[j];
            this.totDeriv[j] += derivative[j];
        }

        // update hessian
        for (let i = 0; i < this.weightCount; i++) {
            for (let j = 0; j < this.weightCount; j++) {
                this.hessianMatrix.inc(i, j, derivative[i] * derivative[j]);
            }
        }
    }

    /**
     * Calculate a layer.
     *
     * @param currentLayer {Number}
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
        for (let x = outputIndex; x < limitX; x++) {
            let sum = 0;
            for (let y = inputIndex; y < limitY; y++) {
                sum += this.weights[index++] * this.layerOutput[y] * (1 - dropoutRate);
            }
            this.layerSums[x] = sum;
            this.layerOutput[x] = sum;
        }

        this.activationFunctions[currentLayer - 1].activationFunction(
            this.layerOutput, outputIndex, outputSize);

        // update context values
        const offset = this.contextTargetOffset[currentLayer];

        ArrayUtils.arrayCopy(this.layerOutput, outputIndex,
            this.layerOutput, offset, this.contextTargetSize[currentLayer]);
    }

}

module.exports = ChainRuleWorker;