const BasicTraining = require(PATHS.TRAINING + 'basic');
const ErrorCalculation = require(PATHS.ERROR_CALCULATION + 'errorCalculation');
const ArrayUtils = require(PATHS.UTILS + 'array');
const AdamUpdate = require(PATHS.SGD + 'update/adamUpdate');
const CrossEntropyErrorFunction = require(PATHS.ERROR_FUNCTIONS + 'crossEntropy');

class StochasticGradientDescent extends BasicTraining {
    constructor(network, input, output, updateRule = new AdamUpdate()) {
        super();

        this.input = input;
        this.output = output;

        this.method = network;
        this.flat = network.getFlat();
        this.layerDelta = ArrayUtils.newFloatArray(this.flat.getLayerOutput().length);
        this.gradients = ArrayUtils.newFloatArray(this.flat.getWeights().length);
        this.errorCalculation = new ErrorCalculation();
        this.learningRate = 0.001;
        this.momentum = 0.9;
        this.updateRule = updateRule;
        this.errorFunction = new CrossEntropyErrorFunction();
        this.iterationCount = 0;
    }

    process(input, output) {
        let i;
        let p;

        this.errorCalculation = new ErrorCalculation();

        const actual = this.flat.compute(input);

        this.errorCalculation.updateError(actual, output);

        // Calculate error for the output layer.
        this.errorFunction.calculateError(
            this.flat.getActivationFunctions()[0], this.flat.getLayerSums(), this.flat.getLayerOutput(),
            output, actual, this.layerDelta, 0);

        // Apply regularization, if requested.
        if (this.l1 > PATHS.CONSTANTS.DEFAULT_DOUBLE_EQUAL
            || this.l2 > PATHS.CONSTANTS.DEFAULT_DOUBLE_EQUAL) {
            const lp = new ArrayUtils.newFloatArray(2);
            this.calculateRegularizationPenalty(lp);

            for (i = 0; i < actual.length; i++) {
                p = (lp[0] * this.l1) + (lp[1] * this.l2);
                this.layerDelta[i] += p;
            }
        }

        // Propagate backwards (chain rule from calculus).
        for (i = this.flat.getBeginTraining(); i < this.flat.getEndTraining(); i++) {
            this.processLevel(i);
        }
    }

    update() {
        if (this.getIteration() === 0) {
            this.updateRule.init(this);
        }

        this.preIteration();

        this.updateRule.update(this.gradients, this.flat.getWeights());
        this.setError(this.errorCalculation.calculate());

        this.postIteration();

        ArrayUtils.fill(this.gradients, 0);
        this.errorCalculation.reset();
    }

    resetError() {
        this.errorCalculation.reset();
    }

    /**
     * @param currentLevel {Number}
     * */
    processLevel(currentLevel) {
        const fromLayerIndex = this.flat.getLayerIndex()[currentLevel + 1];
        const toLayerIndex = this.flat.getLayerIndex()[currentLevel];
        const fromLayerSize = this.flat.getLayerCounts()[currentLevel + 1];
        const toLayerSize = this.flat.getLayerFeedCounts()[currentLevel];
        const index = this.flat.getWeightIndex()[currentLevel];
        const activation = this.flat.getActivationFunctions()[currentLevel];

        // handle weights
        const weights = this.flat.getWeights();
        const layerOutput = this.flat.getLayerOutput();
        const layerSums = this.flat.getLayerSums();
        let yi = fromLayerIndex;

        for (let y = 0; y < fromLayerSize; y++) {
            const output = layerOutput[yi];
            let sum = 0;
            let wi = index + y;
            const loopEnd = toLayerIndex + toLayerSize;

            for (let xi = toLayerIndex; xi < loopEnd; xi++, wi += fromLayerSize) {
                this.gradients[wi] += output * this.layerDelta[xi];
                sum += weights[wi] * this.layerDelta[xi];
            }
            this.layerDelta[yi] = sum * (activation.derivativeFunction(layerSums[yi], layerOutput[yi]));

            yi++;
        }
    }

    iteration() {
        for (let i = 0; i < this.input.length; i++) {
            this.process(this.input[i], this.output[i]);
        }

        if (this.getIteration() === 0) {
            this.updateRule.init(this);
        }

        this.preIteration();

        this.update();
        this.postIteration();
    }

    getLearningRate() {
        return this.learningRate;
    }

    setLearningRate(rate) {
        this.learningRate = rate;
    }

    getMomentum() {
        return this.momentum;
    }

    setMomentum(m) {
        this.momentum = m;
    }

    getL1() {
        return l1;
    }

    setL1(l1) {
        this.l1 = l1;
    }

    getL2() {
        return l2;
    }

    setL2(l2) {
        this.l2 = l2;
    }

    /**
     * @param l {Array}
     * */
    calculateRegularizationPenalty(l) {
        for (let i = 0; i < this.flat.getLayerCounts().length - 1; i++) {
            this.layerRegularizationPenalty(i, l);
        }
    }

    /**
     * @param fromLayer {Number}
     * @param l {Array}
     * */
    layerRegularizationPenalty(fromLayer, l) {
        const fromCount = this.flat.getLayerTotalNeuronCount(fromLayer);
        const toCount = this.flat.getLayerNeuronCount(fromLayer + 1);

        for (let fromNeuron = 0; fromNeuron < fromCount; fromNeuron++) {
            for (let toNeuron = 0; toNeuron < toCount; toNeuron++) {
                let w = this.flat.getWeight(fromLayer, fromNeuron, toNeuron);
                l[0] += Math.abs(w);
                l[1] += w * w;
            }
        }
    }

    getFlat() {
        return this.flat;
    }

    getUpdateRule() {
        return this.updateRule;
    }

    setUpdateRule(updateRule) {
        this.updateRule = updateRule;
    }
}

module.exports = StochasticGradientDescent;