const UpdateRule = require('./updateRule');
const ArrayUtils = require(PATHS.UTILS + 'array');

class AdamUpdate extends UpdateRule {
    /**
     * @inheritDoc
     */
    init(theTraining) {
        this.beta1 = 0.9;
        this.beta2 = 0.999;
        this.eps = 1e-8;
        this.training = theTraining;
        this.m = ArrayUtils.newFloatArray(theTraining.getFlat().getWeights().length);
        this.v = ArrayUtils.newFloatArray(theTraining.getFlat().getWeights().length);
    }

    /**
     * @inheritDoc
     */
    update(gradients, weights) {
        let mCorrect;
        let vCorrect;
        let delta;

        for (let i = 0; i < weights.length; i++) {

            this.m[i] = (this.beta1 * this.m[i]) + (1 - this.beta1) * gradients[i];
            this.v[i] = (this.beta2 * this.v[i]) + (1 - this.beta2) * gradients[i] * gradients[i];

            mCorrect = this.m[i] / (1 - Math.pow(this.beta1, this.training.getIteration()));
            vCorrect = this.v[i] / (1 - Math.pow(this.beta2, this.training.getIteration()));

            delta = (this.training.getLearningRate() * mCorrect) / (Math.sqrt(vCorrect) + this.eps);
            weights[i] += delta;
        }
    }
}

module.exports = AdamUpdate;