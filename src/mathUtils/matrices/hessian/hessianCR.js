const BasicHessian = require(PATHS.HESSIAN + 'basic');
const ChainRuleWorker = require(PATHS.HESSIAN + 'chainRuleWorker');
const ArrayUtils = require(PATHS.UTILS + 'array');
/**
 * Calculate the Hessian matrix using the chain rule method.
 */
class HessianCR extends BasicHessian {
    /**
     * Init the class.
     * @param network {BasicNetwork}
     * @param input {Array}
     * @param output {Array}
     */
    init(network, input, output) {
        super.init(network, input, output);
        const weightCount = network.getFlat().weights.length;

        this.workers = [];
        this.workers.push(
            new ChainRuleWorker(
                this.flat.clone(),
                input,
                output,
                0,
                input.length - 1)
        );
    }


    /**
     * Compute the Hessian.
     */
    compute() {
        this.clear();
        let e = 0;
        const weightCount = this.network.getFlat().weights.length;

        for (let outputNeuron = 0; outputNeuron < this.network.outputCount; outputNeuron++) {

            // handle context
            if (this.flat.hasContext) {
                this.workers[0].network.clearContext();
            }

            this.workers[0].outputNeuron = outputNeuron;
            this.workers[0].run();

            // aggregate workers
            for (worker of this.workers) {
                e += worker.error;
                for (let i = 0; i < weightCount; i++) {
                    this.gradients[i] += worker.getGradients()[i];
                }
                this.hessianMatrix.add(worker.hessianMatrix);
            }
        }

        this.sse = e / 2;
    }
}

module.exports = HessianCR;