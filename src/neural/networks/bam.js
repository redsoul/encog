const ThermalNetwork = require(PATHS.NETWORKS + 'thermal');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
const Matrix = require(PATHS.MATRICES + 'matrix');
const MatrixMath = require(PATHS.MATRICES + 'math');
const ArrayUtils = require(PATHS.PREPROCESSING + 'array');
const BiPolarUtil = require(PATHS.UTILS + 'biPolar');
const BiPolarNeuralData = require(PATHS.NEURAL + 'biPolarNeuralData');
/**
 * Bidirectional associative memory (BAM) is a type of neural network
 * developed by Bart Kosko in 1988. The BAM is a recurrent neural network
 * that works similarly that allows patterns of different lengths to be
 * mapped bidirectionally to other patterns. This allows it to act as
 * almost a two-way hash map. During training the BAM is fed pattern pairs.
 * The two halves of each pattern do not have to be the to be of the
 * same length. However all patterns must be of the same overall structure.
 * The BAM can be fed a distorted pattern on either side and will attempt
 * to map to the correct value.
 *
 * @author jheaton
 *
 */
class BAMNetwork {
    /**
     * Construct the BAM network.
     * @param theF1Count {Number} The F1 count.
     * @param theF2Count {Number} The F2 count.
     */
    constructor(theF1Count, theF2Count) {
        this.f1Count = theF1Count;
        this.f2Count = theF2Count;

        this.weightsF1toF2 = new Matrix(theF1Count, theF2Count);
        this.weightsF2toF1 = new Matrix(theF2Count, theF1Count);
    }

    /**
     * Add a pattern to the neural network.
     *
     * @param inputPattern {Array} The input pattern.
     * @param outputPattern {Array} The output pattern(for this input).
     */
    addPattern(inputPattern, outputPattern) {
        let weight;

        for (let i = 0; i < this.f1Count; i++) {
            for (let j = 0; j < this.f2Count; j++) {
                weight = parseInt(inputPattern[i] * outputPattern[j], 10);
                this.weightsF1toF2.addValue(i, j, weight);
                this.weightsF2toF1.addValue(j, i, weight);
            }
        }
    }

    /**
     * Clear any connection weights.
     */
    clear() {
        this.weightsF1toF2.clear();
        this.weightsF2toF1.clear();
    }

    /**
     * Compute the network for the specified input.
     *
     * @param fromPattern {Array} The input to the network.
     * @param toPattern {Array} The input to the network.
     * @return {Array} The output from the network.
     */
    compute(fromPattern) {
        let stable1 = true;
        let stable2 = true;
        let toPattern = ArrayUtils.newIntArray(this.f2Count);

        do {
            stable1 = this.propagateLayer(this.weightsF1toF2, fromPattern, toPattern);
            stable2 = this.propagateLayer(this.weightsF2toF1, toPattern, fromPattern);
        } while (!stable1 && !stable2);

        return toPattern;
    }

    /**
     * Get the specified weight.
     *
     * @param matrix {Matrix} The matrix to use.
     * @param input {Array}
     *            The input, to obtain the size from.
     * @param x {Number}
     *            The x matrix value. (could be row or column, depending on
     *            input)
     * @param y {Number}
     *            The y matrix value. (could be row or column, depending on
     *            input)
     * @return {Number} The value from the matrix.
     */
    getWeight(matrix, input, x, y) {
        if (matrix.getRows() != input.length) {
            return matrix.get(x, y);
        } else {
            return matrix.get(y, x);
        }
    }

    /**
     * Propagate the layer.
     *
     * @param matrix {Matrix}
     *            The matrix for this layer.
     * @param input {Array}
     *            The input pattern.
     * @param output {Array}
     *            The output pattern.
     * @return {Boolean} True if the network has become stable.
     */
    propagateLayer(matrix, input, output) {
        let i;
        let j;
        let sum;
        let out = 0;
        let stable = true;

        for (i = 0; i < output.length; i++) {
            sum = 0;
            for (j = 0; j < input.length; j++) {
                sum += this.getWeight(matrix, input, i, j) * input[j];
            }

            if (sum != 0) {
                out = (sum < 0) ? -1 : 1;
                if (out != parseInt(output[i], 10)) {
                    stable = false;
                    output[i] = out;
                }
            }
        }
        return stable;
    }

    /**
     * @returns {Object}
     */
    toJSON() {
        let networkJSON = {};
        networkJSON.type = 'BamNetwork';
        networkJSON.f1Count = this.f1Count;
        networkJSON.f2Count = this.f2Count;

        networkJSON.weightsF1toF2 = this.weightsF1toF2.getData();
        networkJSON.weightsF2toF1 = this.weightsF2toF1.getData();

        return networkJSON;
    }

    /**
     * @param obj {Object}
     */
    fromJSON(obj) {
        this.f1Count = obj.f1Count;
        this.f2Count = obj.f2Count;
        this.weightsF1toF2 = new Matrix(obj.weightsF1toF2);
        this.weightsF2toF1 = new Matrix(obj.weightsF2toF1);
    }
}

module.exports = BAMNetwork;