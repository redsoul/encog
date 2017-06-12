const InputSummation = require(PATHS.FREEFORM + 'interfaces/inputSummation');
const ArrayUtils = require(PATHS.UTILS + 'array');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
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
     * @inheritDoc
     */
    add(connection) {
        this.inputs.push(connection);
    }

    /**
     * @inheritDoc
     */
    calculate() {
        let sumArray = ArrayUtils.newFloatArray(1);
        this.sum = 0;
        let gateActivation = 0;
        let useGate=false;
        let connectionSource;
        let sum;

        // sum the input connections
        for (let connection of this.inputs) {
            connectionSource = connection.getSource();
            if (connectionSource.layer.isGate()) {
                connectionSource.performCalculation();
                gateActivation += connectionSource.getActivation();
                useGate = true;
            }
        }


        // sum the input connections
        for (let connection of this.inputs) {
            connectionSource = connection.getSource();

            if (!connectionSource.layer.isGate()) {
                connectionSource.performCalculation();
            }
            EncogLog.debug(connection.getSource().layerName + ' (' + connection.getSource().name + ') --> '
                + connection.getTarget().layerName + ' (' + connection.getTarget().name + '): '
                + "weight: " + connection.getWeight()
                + '; activation:' + connectionSource.getActivation());

            // if (connectionSource.layer.isGate()) {
            //     gateActivation += connectionSource.getActivation();
            //     useGate = true;
            // } else {
                sum = connection.getWeight() * connectionSource.getActivation();
                if(useGate){
                    sum*=gateActivation;
                }
                this.sum += sum;
            // }

            if (isNaN(sum)) {
                throw new NeuralNetworkError(connection.getSource().layerName
                    + ' - ' + connection.getSource().name
                    + ' - local sum is not a number');
            }
        }

        // perform the activation function
        sumArray[0] = this.sum;
        this.activationFunction.activationFunction(sumArray, 0, sumArray.length);

        // if (useGate) {
        //     sumArray[0] *= gateActivation;
        // }

        return sumArray[0];
    }

    /**
     * @inheritDoc
     */
    getActivationFunction() {
        return this.activationFunction;
    }

    /**
     * @inheritDoc
     */
    getSum() {
        return this.sum;
    }

    /**
     * @inheritDoc
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