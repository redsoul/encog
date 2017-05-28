/**
 * Specifies how the inputs to a neuron are to be summed.
 */
class InputSummation {

    /**
     * Add an input connection.
     * @param connection {FreeformConnection} The connection to add.
     */
    add(connection){}

    /**
     * Perform the summation, and apply the activation function.
     * @return {Number} The sum.
     */
    calculate(){}

    /**
     * @return {ActivationFunction} The activation function
     */
    getActivationFunction(){}

    /**
     * @return {Number} The preactivation sum.
     */
    getSum(){}

    /**
     * @return {Array} The input connections.
     */
    list(){}
}

module.exports = InputSummation;