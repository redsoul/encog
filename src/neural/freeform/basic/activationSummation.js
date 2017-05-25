const InputSummation = require(PATHS.FREEFORM + 'interfaces/inputSummation');
const ArrayUtils = require(PATHS.UTILS + 'array');
/**
 * Provides a basic implementation of an input summation. The inputs are summed
 * and applied to the activation function.
 */
class BasicActivationSummation extends InputSummation {

    /**
     * Construct the activation summation.
     * @param theActivationFunction {ActivationFunction} The activation function.
     */
    constructor(theActivationFunction) {
        super();
        this.inputs = [];
        this.activationFunction = theActivationFunction;
    }

    /**
     * {@inheritDoc}
     */
    add(connection) {
        this.inputs.push(connection);
    }

    /**
     * {@inheritDoc}
     */
    calculate() {
        let sumArray = ArrayUtils.newFloatArray(1);
        this.sum = 0;

        // sum the input connections
        for (let connection in this.inputs) {
            connection.getSource().performCalculation();
            this.sum += connection.getWeight() * connection.getSource().getActivation();
        }

        // perform the activation function
        sumArray[0] = this.sum;
        this.activationFunction.activationFunction(sumArray, 0, sumArray.length);

        return sumArray[0];
    }

    /**
     * {@inheritDoc}
     */
    getActivationFunction() {
        return this.activationFunction;
    }

    /**
     * {@inheritDoc}
     */
    getSum() {
        return this.sum;
    }

    /**
     * {@inheritDoc}
     */
    list() {
        return this.inputs;
    }

    /**
     * Set the activation function.
     * @param activationFunction {ActivationFunction} The activation function.
     */
    setActivationFunction(activationFunction) {
        this.activationFunction = activationFunction;
    }
}

module.exports = BasicActivationSummation;