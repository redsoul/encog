const BasicNetwork = require(PATHS.NETWORKS + 'basic');
const BasicLayer = require(PATHS.LAYERS + 'basic');
const ActivationSigmoid = require(PATHS.ACTIVATION_FUNCTIONS + 'sigmoid');
const _ = require('lodash');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');

class NetworkUtil {

    /**
     * @return {Array}
     */
    static getXORDataset() {
        return {
            input: [[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [1.0, 1.0]],
            output: [[0.0], [1.0], [1.0], [0.0]]
        };
    }

    /**
     * @return {Array}
     */
    static getIrisDataset() {
        let irisDataset = require('ml-dataset-iris').getDataset();
        irisDataset = _.shuffle(irisDataset);

        let irisInput = [];
        let irisOutput = [];
        //split the dataset in input and output
        irisDataset.map(function (val) {
            irisInput.push(val.slice(0, -1));
            //convert the output column in to 3 independent columns
            switch (val[val.length - 1]) {
                case 'setosa':
                    irisOutput.push([0, 0, 1]);
                    break;
                case 'versicolor':
                    irisOutput.push([0, 1, 0]);
                    break;
                case 'virginica':
                    irisOutput.push([1, 0, 0]);
                    break;
            }
        });

        return {
            input: irisInput,
            output: irisOutput
        };
    }

    /**
     * @return {BasicNetwork}
     */
    static createXORNetwork() {
        const network = new BasicNetwork();
        network.addLayer(new BasicLayer(null, true, 2));
        network.addLayer(new BasicLayer(new ActivationSigmoid(), true, 4));
        network.addLayer(new BasicLayer(new ActivationSigmoid(), false, 1));
        network.structure.finalizeStructure();

        network.reset();

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
        network.structure.finalizeStructure();
        network.reset();

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

        EncogLog.debug('Total test size: ' + testDataset.length);
        EncogLog.debug('Accuracy: ' + accuracy + '%');

        EncogLog.print();
        return accuracy;
    }
}

module.exports = NetworkUtil;