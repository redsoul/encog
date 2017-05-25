/**
 * This interface defines a freeform neuron. By freeform that this neuron is not
 * necessarily part of a layer.
 */
class FreeformNeuron {

    /**
     * Add an input connection to this neuron.
     *
     * @param inputConnection {FreeformConnection}
     *            The input connection.
     */
    addInput(inputConnection) {
    }

    /**
     * Add an output connection to this neuron.
     *
     * @param outputConnection {FreeformConnection}
     *            The output connection.
     */
    addOutput(outputConnection) {
    }

    /**
     * @return The activation for this neuron. This is the final output after
     *         the activation function has been applied.
     */
    getActivation() {
    }

    /**
     * @return {InputSummation} The input summation method.
     */
    getInputSummation() {
    }

    /**
     * @return {Array} The outputs from this neuron.
     */
    getOutputs() {
    }

    /**
     * @return {Number} The output sum for this neuron. This is the output prior to the
     *         activation function being applied.
     */
    getSum() {
    }

    /**
     * @return {Boolean} True, if this is a bias neuron.
     */
    isBias(){}

    /**
     * Perform the internal calculation for this neuron.
     */
    performCalculation() {
    }

    /**
     * Set the activation, or final output for this neuron.
     * @param {Number} activation THe activation.
     */
    setActivation(activation){}

    /**
     * Determine if this neuron is a bias neuron.
     * @param b {Boolean} True, if this neuron is considered a bias neuron.
     */
    setBias(b){}

    /**
     * Set the input summation method.
     * @param {InputSummation} theInputSummation The input summation method.
     */
    setInputSummation(theInputSummation){}

    /**
     * Update the context value for this neuron.
     */
    updateContext(){}

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

module.exports = FreeformNeuron;