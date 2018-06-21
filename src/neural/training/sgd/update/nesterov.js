const UpdateRule = require('./updateRule');
const ArrayUtils = require(PATHS.PREPROCESSING + 'array');

class Nesterov extends UpdateRule {

    /**
     * @inheritDoc
     */
    init(theTraining) {
        this.training = theTraining;
        this.lastDelta = ArrayUtils.newFloatArray(theTraining.getFlat().getWeights().length);
    }

    /**
     * @inheritDoc
     */
    update(gradients, weights) {
        let prevNesterov;
        let delta;

        for (let i = 0; i < weights.length; i++) {
            prevNesterov = this.lastDelta[i];
            this.lastDelta[i] = (this.training.getMomentum() * prevNesterov)
                + (gradients[i] * this.training.getLearningRate());
            delta = (this.training.getMomentum() * prevNesterov) - ((1 + this.training.getMomentum()) * this.lastDelta[i]);
            weights[i] += delta;
        }
    }
}

module.exports = Nesterov;