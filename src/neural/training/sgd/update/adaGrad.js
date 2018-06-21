const UpdateRule = require('./updateRule');
const ArrayUtils = require(PATHS.PREPROCESSING + 'array');

class AdaGrad extends UpdateRule {

    /**
     * @inheritDoc
     */
    init(theTraining) {
        this.eps = 1e-8;
        this.cache = [];
        this.training = theTraining;
        this.cache = ArrayUtils.newFloatArray(theTraining.getFlat().getWeights().length);
    }

    /**
     * @inheritDoc
     */
    update(gradients, weights) {
        let delta;
        for (let i = 0; i < weights.length; i++) {
            this.cache[i] += gradients[i] * gradients[i];
            delta = (this.training.getLearningRate() * gradients[i]) / (Math.sqrt(this.cache[i]) + this.eps);
            weights[i] += delta;
        }
    }

    getEps() {
        return eps;
    }

    setEps(eps) {
        this.eps = eps;
    }
}

module.exports = AdaGrad;