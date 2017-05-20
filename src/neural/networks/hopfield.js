const ThermalNetwork = require(PATHS.NETWORKS + 'thermal');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
const Matrix = require(PATHS.MATRICES + 'matrix');
const MatrixMath = require(PATHS.MATRICES + 'math');
const ArrayUtils = require(PATHS.UTILS + 'array');
const BiPolarUtil = require(PATHS.UTILS + 'biPolar');
const BiPolarNeuralData = require(PATHS.NEURAL + 'biPolarNeuralData');
/**
 * Implements a Hopfield network.
 *
 */
class HopfieldNetwork extends ThermalNetwork {
    /**
     * Construct a Hopfield with the specified neuron count.
     * @param neuronCount {Number} The neuron count.
     */
    constructor(neuronCount) {
        super(neuronCount);
    }

    /**
     * Train the neural network for the specified pattern. The neural network
     * can be trained for more than one pattern. To do this simply call the
     * train method more than once.
     *
     * @param pattern {Array} The pattern to train for.
     */
    addPattern(pattern) {

        if (pattern.length != this.getNeuronCount()) {
            throw new NeuralNetworkError("Network with " + this.getNeuronCount()
                + " neurons, cannot learn a pattern of size "
                + pattern.length);
        }

        const biPolarPattern = pattern.map(BiPolarUtil.toBiPolar);
        const patternMatrix = new Matrix([biPolarPattern]);
        // Create a row matrix from the input, convert boolean to bipolar
        // Transpose the matrix and multiply by the original input matrix
        const m1 = MatrixMath.transpose(patternMatrix);
        const m3 = MatrixMath.multiply(m1, patternMatrix);

        // matrix 3 should be square by now, so create an identity
        // matrix of the same size.
        const identity = MatrixMath.identity(m3.getRows());

        // subtract the identity matrix
        const m4 = MatrixMath.subtract(m3, identity);

        // now add the calculated matrix, for this pattern, to the
        // existing weight matrix.
        this.__convertHopfieldMatrix(m4);
    }

    /**
     * Note: for Hopfield networks, you will usually want to call the "run"
     * method to compute the output.
     *
     * This method can be used to copy the input data to the current state. A
     * single iteration is then run, and the new current state is returned.
     *
     * @param input {Array} The input pattern.
     * @return {Array} The new current state.
     */
    compute(input) {
        const result = new BiPolarNeuralData(input.length);
        ArrayUtils.arrayCopy(input, this.getCurrentState().getData());
        this.run();

        for (let i = 0; i < this.getCurrentState().size(); i++) {
            result.setData(i, BiPolarUtil.double2bipolar(this.getCurrentState().getData(i)));
        }
        ArrayUtils.arrayCopy(this.getCurrentState().getData(), result.getData());
        return BiPolarUtil.bipolar2binary(result.getData());
    }

    /**
     * Update the Hopfield weights after training.
     *
     * @param delta {Matrix} The amount to change the weights by.
     */
    __convertHopfieldMatrix(delta) {
        // add the new weight matrix to what is there already
        for (let row = 0; row < delta.getRows(); row++) {
            for (let col = 0; col < delta.getRows(); col++) {
                this.addWeight(row, col, delta.get(row, col));
            }
        }
    }

    /**
     * @returns {Number}
     */
    getInputCount() {
        return this.getNeuronCount();
    }

    /**
     * @returns {Number}
     */
    getOutputCount() {
        return this.getNeuronCount();
    }

    /**
     * Perform one Hopfield iteration.
     */
    run() {
        let sum;
        for (let toNeuron = 0; toNeuron < this.getNeuronCount(); toNeuron++) {
            sum = 0;
            for (let fromNeuron = 0; fromNeuron < this.getNeuronCount(); fromNeuron++) {
                sum += this.getCurrentState().getData(fromNeuron) * this.getWeight(fromNeuron, toNeuron);
            }
            this.getCurrentState().setData(toNeuron, sum);
        }
    }

    /**
     * Run the network until it becomes stable and does not change from more
     * runs.
     *
     * @param max {Number} The maximum number of cycles to run before giving up.
     * @return {Number} The number of cycles that were run.
     */
    runUntilStable(max) {
        let done = false;
        let lastStateStr = this.getCurrentState().toString();
        let currentStateStr = this.getCurrentState().toString();

        let cycle = 0;
        do {
            this.run();
            cycle++;

            lastStateStr = this.getCurrentState().toString();
            EncogLog.debug('CurrentState: ' + lastStateStr);
            EncogLog.print();
            if (currentStateStr !== lastStateStr) {
                if (cycle > max) {
                    done = true;
                }
            } else {
                done = true;
            }

            currentStateStr = lastStateStr;

        } while (!done);

        return cycle;
    }
}

module.exports = HopfieldNetwork;