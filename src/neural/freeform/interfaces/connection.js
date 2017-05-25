/**
 * Defines a freeform connection between neurons.
 */
class FreeformConnection {

    /**
     * Add to the connection weight.
     * @param delta {Number} THe value to add.
     */
    addWeight(delta){}

    /**
     * @return {FreeformNeuron} The source neuron.
     */
    getSource(){}

    /**
     * @return {FreeformNeuron} The target neuron.
     */
    getTarget(){}

    /**
     * @return {Number} The weight.
     */
    getWeight(){}

    /**
     * @return {Boolean} Is this a recurrent connection?
     */
    isRecurrent(){}

    /**
     * Determine if this is a recurrent connecton.
     * @param recurrent {Boolean} True, if this is a recurrent connection.
     */
    setRecurrent(recurrent){}

    /**
     * Set the source neuron.
     * @param source {FreeformNeuron} The source neuron.
     */
    setSource(source){}

    /**
     * Set the target neuron.
     * @param target {FreeformNeuron} The target neuron.
     */
    setTarget(target){}

    /**
     * Set the weight.
     * @param weight {Number} The weight.
     */
    setWeight(weight){}

    /**
     * Add to the specified temp value.
     * @param i {Number} The index.
     * @param value {Number} The value to add.
     */
    addTempTraining(i, value){}

    /**
     * Allocate the specified length of temp training.
     * @param l {Number} The length.
     */
    allocateTempTraining(l){}

    /**
     * Clear the temp training.
     */
    clearTempTraining(){}

    /**
     * Get the specified temp training.
     * @param index {Number} The indfex.
     * @return {Number} The temp training value.
     */
    getTempTraining(index){}

    /**
     * Set a temp training value.
     * @param index {Number} The index.
     * @param value {Number} The value.
     */
    setTempTraining(index, value){}

}

module.exports = FreeformConnection;