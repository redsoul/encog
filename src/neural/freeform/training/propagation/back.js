const FreeformPropagationTraining = require(PATHS.FREEFORM + 'training/propagation.js');
/**
 * Perform backpropagation for a freeform neural network.
 */
class FreeformBackPropagation extends FreeformPropagationTraining {

    /**
     * Construct a back propagation trainer.
     * @param theNetwork {FreeformNetwork} The network to train.
     * @param theInput {Array} The training data to use. The coefficient for how much of the gradient is applied to each weight.
     * @param theOuput {Array}
     * @param theLearningRate {Number} The learning rate. The coefficient for how much of the previous delta is applied to each weight.
     * In theory, prevents local minima stall.
     * @param theMomentum {Number} The momentum.
     */
    constructor(theNetwork, theInput, theOuput, theLearningRate = 0.7, theMomentum = 0.9) {
        super(theNetwork, theInput, theOuput);
        theNetwork.tempTrainingAllocate(1, 2);
        this.learningRate = theLearningRate;
        this.momentum = theMomentum;
    }

    /**
     * @inheritDoc
     */
    learnConnection(connection) {
        const gradient = connection.getTempTraining(0);
        const delta = (gradient * this.learningRate) + (connection.getTempTraining(1) * this.momentum);
        connection.setTempTraining(1, delta);
        connection.addWeight(delta);

        EncogLog.debug(connection.getSource().layerName + ' (' + connection.getSource().name + ') weight update: '
            + connection.getWeight() + ' + ' + delta);
    }

}

module.exports = FreeformBackPropagation;