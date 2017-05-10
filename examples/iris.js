const Encog = require('../index');
const _ = require('lodash');

const irisDataset = Encog.NetworkUtil.getIrisDataset();
let inputDataset = Encog.DataSet.trainTestSpit(irisDataset.input);
let outputDataset = Encog.DataSet.trainTestSpit(irisDataset.output);

// create a neural network, without using a factory
network = new Encog.Networks.Basic();
network.addLayer(new Encog.Layers.Basic(null, true, 4));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 10));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 5));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), false, 3));
network.structure.finalizeStructure();
network.reset();

Encog.DataSet.normalizeData(inputDataset.train);
Encog.DataSet.normalizeData(inputDataset.test);

// train the neural network
const train = new Encog.Training.Propagation.Resilient(network, inputDataset.train, outputDataset.train);

Encog.NetworkUtil.trainNetwork(train, {minError: 0.01, minIterations: 5});
const accuracy = Encog.NetworkUtil.validateNetwork(network, inputDataset.test, outputDataset.test);