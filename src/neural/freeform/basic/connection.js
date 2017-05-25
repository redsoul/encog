const FreeformConnection = require(PATHS.FREEFORM + 'interfaces/connection');
/**
 * A basic freeform connection.
 *
 */
class BasicFreeformConnection extends FreeformConnection {


    /**
     * Construct a basic freeform connection.
     * @param theSource {FreeformNeuron} The source neuron.
     * @param theTarget {FreeformNeuron} The target neuron.
     */
    constructor(theSource, theTarget) {
        super();
        this.recurrent = false;
        this.weight = 0.0;
        this.source = theSource;
        this.target = theTarget;
        this.tempTraining = [];
    }

    /**
     * {@inheritDoc}
     */
    addTempTraining(i, value) {
        this.tempTraining[i] += value;

    }

    /**
     * {@inheritDoc}
     */
    addWeight(delta) {
        this.weight += delta;
    }

    /**
     * {@inheritDoc}
     */
    allocateTempTraining(l) {
        this.tempTraining = new double[l];

    }

    /**
     * {@inheritDoc}
     */
    clearTempTraining() {
        this.tempTraining = null;

    }

    /**
     * {@inheritDoc}
     */
    getSource() {
        return this.source;
    }

    /**
     * {@inheritDoc}
     */
    getTarget() {
        return this.target;
    }

    /**
     * {@inheritDoc}
     */
    getTempTraining(index) {
        return this.tempTraining[index];
    }

    /**
     * {@inheritDoc}
     */
    getWeight() {
        return this.weight;
    }

    /**
     * {@inheritDoc}
     */
    isRecurrent() {
        return this.recurrent;
    }

    /**
     * {@inheritDoc}
     */
    setRecurrent(recurrent) {
        this.recurrent = recurrent;
    }

    /**
     * {@inheritDoc}
     */
    setSource(source) {
        this.source = source;
    }

    /**
     * {@inheritDoc}
     */
    setTarget(target) {
        this.target = target;
    }

    /**
     * {@inheritDoc}
     */
    setTempTraining(index, value) {
        this.tempTraining[index] = value;

    }

    /**
     * {@inheritDoc}
     */
    setWeight(weight) {
        this.weight = weight;
    }
}

module.exports = BasicFreeformConnection;