const BasicNetwork = require(PATHS.NETWORKS + 'basic');
const BasicLayer = require(PATHS.LAYERS + 'basic');
const ActivationSigmoid = require(PATHS.ACTIVATION_FUNCTIONS + 'sigmoid');
const _ = require('lodash');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
const ErrorUtil = require(PATHS.UTILS + 'error');

class NetworkUtil {

    /**
     * @return {BasicNetwork}
     */
    static createXORNetwork() {
        const network = new BasicNetwork();
        network.addLayer(new BasicLayer(null, true, 2));
        network.addLayer(new BasicLayer(new ActivationSigmoid(), true, 4));
        network.addLayer(new BasicLayer(new ActivationSigmoid(), false, 1));
        network.randomize();

        return network;
    }

    /**
     * @return {BasicNetwork}
     */
    static createIrisNetwork() {
        const network = new BasicNetwork();
        network.addLayer(new BasicLayer(null, true, 4));
        network.addLayer(new BasicLayer(new ActivationSigmoid(), true, 10));
        network.addLayer(new BasicLayer(new ActivationSigmoid(), true, 5));
        network.addLayer(new BasicLayer(new ActivationSigmoid(), false, 3));
        network.randomize();

        return network;
    }

    /**
     * @param train {Propagation}
     * @param options {Object}
     */
    static trainNetwork(train, options = {}) {
        let epoch = 1;
        let defaultOptions = {minError: 0.01, maxIterations: 100, minIterations: 1};
        options = _.merge(defaultOptions, options);

        do {
            train.iteration();
            EncogLog.debug("Epoch #" + epoch + " Error:" + train.error);

            if ((train.error < options.minError && options.minIterations == null) ||
                (train.error < options.minError && options.minIterations != null && epoch >= options.minIterations)) {
                break;
            }

            if (options.maxIterations != null && epoch >= options.maxIterations) {
                break;
            }

            epoch++;
        } while (true);
        train.finishTraining();

        EncogLog.print();
    }

    /**
     * @param network {BasicNetwork}
     * @param testDataset {Array}
     * @param idealOutput {Array}
     */
    static validateNetwork(network, testDataset, idealOutput) {
        if (testDataset.length != idealOutput.length) {
            throw new NeuralNetworkError('test and ideal dataset must have equal lengths');
        }

        EncogLog.debug("Neural Network Results:");

        let i = 0;
        let output;
        let accuratePredictions = 0;

        for (let input of testDataset) {
            output = network.compute(input);
            output = output.map(Math.round);

            if (_.isEqual(output, idealOutput[i])) {
                accuratePredictions++;
            }
            EncogLog.debug("input=" + input);
            EncogLog.debug("actual=" + output);
            EncogLog.debug("ideal=" + idealOutput[i]);
            EncogLog.debug("------------------------");
            i++;
        }

        let accuracy = accuratePredictions / testDataset.length * 100;
        let error = _.round(ErrorUtil.calculateRegressionError(network, testDataset, idealOutput) * 100, 4);

        EncogLog.debug('Total test size: ' + testDataset.length);
        EncogLog.debug('Accuracy: ' + accuracy + '%');
        EncogLog.debug('Error: ' + error + '%');

        EncogLog.print();
        return accuracy;
    }
}

module.exports = NetworkUtil;