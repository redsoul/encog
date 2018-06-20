const ArrayUtils = require(PATHS.PREPROCESSING + 'array');
const Matrix = require(PATHS.MATRICES + 'matrix');
/**
 * Some basic code used to calculate Hessian matrixes.
 */
class BasicHessian {
    /**
     * @param network {BasicNetwork}
     * @param input {Array}
     * @param output {Array}
     */
    init(network, input, output) {
        const weightCount = network.getFlat().weights.length;
        this.flat = network.getFlat();
        this.input = input;
        this.output = output;
        this.network = network;
        this.gradients = ArrayUtils.newFloatArray(weightCount);
        this.hessianMatrix = new Matrix(weightCount, weightCount);
        /**
         * The sum of square error.
         */
        this.sse = null;
    }

    /**
     * Clear the Hessian and gradients.
     */
    clear() {
        ArrayUtils.fill(this.gradients, 0);
        this.hessianMatrix.clear();
    }

    /**
     * Update the Hessian, sum's with what is in the Hessian already.  Call clear to clear out old Hessian.
     * @param d {Array} Vector to update with.
     */
    updateHessian(d) {
        let weightCount = this.network.getFlat().weights.length;
        for (let i = 0; i < weightCount; i++) {
            for (let j = 0; j < weightCount; j++) {
                this.hessianMatrix.inc(i, j, d[i] * d[j]);
            }
        }
    }
}

module.exports = BasicHessian;