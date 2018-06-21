const UpdateRule = require('./updateRule');
const ArrayUtils = require(PATHS.PREPROCESSING + 'array');

class Momentum extends UpdateRule {
    /**
     * @inheritDoc
     */
    init(theTraining) {
        this.lastDelta = [];
        this.training = theTraining;
        this.lastDelta = ArrayUtils.newFloatArray(theTraining.getFlat().getWeights().length);
    }

    /**
     * @inheritDoc
     */
    update(gradients, weights) {
        let delta;
        for (let i = 0; i < weights.length; i++) {
            delta = (this.training.getLearningRate() * gradients[i]) + (this.training.getMomentum() * this.lastDelta[i]);
            weights[i] += delta;
            this.lastDelta[i] = delta;
        }
    }
}

module.exports = Momentum;