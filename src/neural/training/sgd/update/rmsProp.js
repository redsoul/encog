const UpdateRule = require('./updateRule');
const ArrayUtils = require(PATHS.PREPROCESSING + 'array');

class RMSProp extends UpdateRule {
    /**
     * @inheritDoc
     */
    init(theTraining) {
        this.eps = 1e-8;
        this.decayRate = 0.99;
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
            this.cache[i] = this.decayRate * this.cache[i] + (1 - this.decayRate) * gradients[i] * gradients[i];
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

    getDecayRate() {
        return decayRate;
    }

    setDecayRate(decayRate) {
        this.decayRate = decayRate;
    }
}

module.exports = RMSProp;