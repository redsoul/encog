const FreeformPropagationTraining = require(PATHS.FREEFORM + 'training/propagation');
const CONFIGS = {
    TEMP_GRADIENT: 0,
    TEMP_LAST_GRADIENT: 1,
    TEMP_UPDATE: 2,
    TEMP_LAST_WEIGHT_DELTA: 3
};
const RPROPConst = require(PATHS.TRAINING + 'resilientConst');

class FreeformResilientPropagation extends FreeformPropagationTraining {

    /**
     * Construct the RPROP trainer.
     * @param theNetwork {FreeformNetwork} The network to train.
     * @param theInput {Array} The input set.
     * @param theOuput {Array} The input set.
     * @param initialUpdate The initial update.
     * @param theMaxStep The max step.
     */
    constructor(theNetwork, theInput, theOuput, initialUpdate = RPROPConst.DEFAULT_INITIAL_UPDATE, theMaxStep = RPROPConst.DEFAULT_MAX_STEP) {
        super(theNetwork, theInput, theOuput);

        this.maxStep = theMaxStep;
        theNetwork.tempTrainingAllocate(1, 4);
        theNetwork.performConnectionTask((c) => {
            c.setTempTraining(CONFIGS.TEMP_UPDATE, initialUpdate);
        });
    }

    /**
     * {@inheritDoc}
     */
    learnConnection(connection) {
        // multiply the current and previous gradient, and take the
        // sign. We want to see if the gradient has changed its sign.
        const change = EncogMath.sign(connection.getTempTraining(CONFIGS.TEMP_GRADIENT)
            * connection.getTempTraining(CONFIGS.TEMP_LAST_GRADIENT));
        let weightChange = 0;

        // if the gradient has retained its sign, then we increase the
        // delta so that it will converge faster
        if (change > 0) {
            let delta = connection.getTempTraining(CONFIGS.TEMP_UPDATE) * RPROPConst.POSITIVE_ETA;
            delta = Math.min(delta, this.maxStep);
            weightChange = EncogMath.sign(connection.getTempTraining(FreeformResilientPropagation.TEMP_GRADIENT)) * delta;
            connection.setTempTraining(CONFIGS.TEMP_UPDATE, delta);
            connection.setTempTraining(CONFIGS.TEMP_LAST_GRADIENT, connection.getTempTraining(CONFIGS.TEMP_GRADIENT));
        } else if (change < 0) {
            // if change<0, then the sign has changed, and the last
            // delta was too big
            let delta = connection.getTempTraining(CONFIGS.TEMP_UPDATE) * RPROPConst.NEGATIVE_ETA;
            delta = Math.max(delta, RPROPConst.DELTA_MIN);
            connection.setTempTraining(CONFIGS.TEMP_UPDATE, delta);
            weightChange = -connection.getTempTraining(CONFIGS.TEMP_LAST_WEIGHT_DELTA);
            // set the previous gradient to zero so that there will be no
            // adjustment the next iteration
            connection.setTempTraining(CONFIGS.TEMP_LAST_GRADIENT, 0);
        } else if (change == 0) {
            // if change==0 then there is no change to the delta
            let delta = connection.getTempTraining(CONFIGS.TEMP_UPDATE);
            weightChange = EncogMath.sign(connection.getTempTraining(CONFIGS.TEMP_GRADIENT)) * delta;
            connection.setTempTraining(CONFIGS.TEMP_LAST_GRADIENT, connection.getTempTraining(CONFIGS.TEMP_GRADIENT));
        }

        // apply the weight change, if any
        connection.addWeight(weightChange);
        connection.setTempTraining(CONFIGS.TEMP_LAST_WEIGHT_DELTA, weightChange);
    }

}

module.exports = FreeformResilientPropagation;