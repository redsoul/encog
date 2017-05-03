const ErrorCalculation = require(__ERROR_CALCULATION + 'errorCalculation');
const ArrayUtils = require(__UTILS + 'array');

/**
 * Worker class for the mulithreaded training of flat networks.
 */
class GradientWorker {
    /**
     * Construct a gradient worker.
     *
     * @param theNetwork {FlatNetwork}
     *            The network to train.
     * @param theOwner {Propagation}
     *            The owner that is doing the training.
     * @param input {Array}
     *            The input array
     * @param output {Array}
     *            The output array
     * @param theLow {number}
     *            The low index to use in the training data.
     * @param theHigh {number}
     *            The high index to use in the training data.
     * @param flatSpot {Array}
     *            The flatspot additions for each layer
     * @param ef {ErrorFunction}
     *            Error function
     */
    constructor(theNetwork, theOwner, input, output, theLow, theHigh, flatSpot, ef) {
        this.network = theNetwork;
        this.input = input;
        this.output = output;
        this.low = theLow;
        this.high = theHigh;
        this.owner = theOwner;
        this.flatSpot = flatSpot;
        this.errorFunction = ef;

        this.layerDelta = ArrayUtils.newFloatArray(this.network.layerOutput.length);
        this.gradients = ArrayUtils.newFloatArray(this.network.weights.length);
        this.actual = ArrayUtils.newFloatArray(this.network.outputCount.length);

        this.weights = this.network.weights;
        this.layerIndex = this.network.layerIndex;
        this.layerCounts = this.network.layerCounts;
        this.layerDropoutRates = this.network.layerDropoutRates;
        this.weightIndex = this.network.weightIndex;
        this.layerOutput = this.network.layerOutput;
        this.layerSums = this.network.layerSums;
        this.layerFeedCounts = this.network.layerFeedCounts;

        this.errorCalculation = new ErrorCalculation();
    }


    /**
     * Process one training set element.
     *
     * @param input {Array}
     *          the input data information
     * @param output {Array}
     *          the output data information
     */
    process(input, output) {
        this.actual = this.network.compute(input);

        this.errorCalculation.updateError(this.actual, output);

        // Calculate error for the output layer.
        this.errorFunction.calculateError(
            this.network.activationFunctions[0],
            this.layerSums,
            this.layerOutput,
            output,
            this.actual,
            this.layerDelta,
            this.flatSpot[0]);

        // Apply regularization, if requested.
        if (this.owner.l1 > __CONSTANTS.DEFAULT_DOUBLE_EQUAL
            || this.owner.l2 > __CONSTANTS.DEFAULT_DOUBLE_EQUAL) {
            let lp = [];

            this.calculateRegularizationPenalty(lp);
            for (let i = 0; i < this.actual.length; i++) {
                this.layerDelta[i] += (lp[0] * this.owner.l1) + (lp[1] * this.owner.l2);
            }
        }

        // Propagate backwards (chain rule from calculus).
        for (let i = this.network.beginTraining; i < this.network.endTraining; i++) {
            this.processLevel(i);
        }
    }

    /**
     * Process one level.
     *
     * @param currentLevel {number}
     *            The level.
     */
    processLevel(currentLevel) {
        const fromLayerIndex = this.layerIndex[currentLevel + 1];
        const toLayerIndex = this.layerIndex[currentLevel];
        const fromLayerSize = this.layerCounts[currentLevel + 1];
        const toLayerSize = this.layerFeedCounts[currentLevel];
        let dropoutRate = 0;
        if (this.layerDropoutRates.length > currentLevel && this.layerDropoutRates[currentLevel] != 0) {
            dropoutRate = this.layerDropoutRates[currentLevel];
        }

        const index = this.weightIndex[currentLevel];
        const activation = this.network.activationFunctions[currentLevel];
        const currentFlatSpot = this.flatSpot[currentLevel + 1];

        // handle weights
        let yi = fromLayerIndex;
        for (let y = 0; y < fromLayerSize; y++) {
            let output = this.layerOutput[yi];
            let sum = 0;

            let wi = index + y;
            let loopEnd = toLayerIndex + toLayerSize;
            if (dropoutRate == 0) {
                for (let xi = toLayerIndex; xi < loopEnd; xi++, wi += fromLayerSize) {
                    this.gradients[wi] += output * this.layerDelta[xi];
                    sum += this.weights[wi] * this.layerDelta[xi];
                }
                this.layerDelta[yi] = sum
                    * (activation.derivativeFunction(this.layerSums[yi], this.layerOutput[yi]) + currentFlatSpot);
            } else {
                this.layerDelta[yi] = 0;
            }
            yi++;
        }
    }

    /**
     * @param l {Array}
     */
    calculateRegularizationPenalty(l) {
        for (let i = 0; i < network.layerCounts.length - 1; i++) {
            this.layerRegularizationPenalty(i, l);
        }
    }

    /**
     * @param fromLayer {number}
     * @param l {Array}
     */
    layerRegularizationPenalty(fromLayer, l) {
        const fromCount = network.getLayerTotalNeuronCount(fromLayer);
        const toCount = network.getLayerNeuronCount(fromLayer + 1);

        for (let fromNeuron = 0; fromNeuron < fromCount; fromNeuron++) {
            for (let toNeuron = 0; toNeuron < toCount; toNeuron++) {
                let w = this.network.getWeight(fromLayer, fromNeuron, toNeuron);
                l[0] += Math.abs(w);
                l[1] += w * w;
            }
        }
    }

    /**
     * Perform the gradient calculation for the specified index range.
     * @param index {number}
     */
    run(index = 1) {
        this.errorCalculation.reset();

        if (arguments.length == 0) {
            this.process(this.input[index], this.output[index]);
        } else {
            for (let i = this.low; i <= this.high; i++) {
                this.process(this.input[i], this.output[i]);
            }
        }

        this.owner.report(this.gradients, this.errorCalculation.calculate(), null);
        ArrayUtils.fillArray(this.gradients, 0);
    }
}

module.exports = GradientWorker;