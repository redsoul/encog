const Encog = require('../index');
const irisDataset = Encog.Utils.Datasets.getIrisDataSet();
const inputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.input, 0.2);
const outputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.output, 0.2);
let accuracy;

Encog.Log.options.logLevel = 'info';

// create a neural network, without using a factory
const network = new Encog.Networks.Basic();
network.addLayer(new Encog.Layers.Basic(null, true, 4));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 10));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 5));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), false, 3));
network.randomize();

// Encog.Utils.DataToolbox.normalizeData(inputDataset.train);
// Encog.Utils.DataToolbox.normalizeData(inputDataset.test);

// train the neural network
const train = new Encog.Training.Propagation.Resilient(network, inputDataset.train, outputDataset.train);

Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5, maxIterations: 25});
accuracy = Encog.Utils.Network.validateNetwork(network, inputDataset.test, outputDataset.test);
console.log('accuracy: ', accuracy);

Encog.Utils.File.saveNetwork(network, 'iris.dat');

const newNetwork = Encog.Utils.File.loadNetwork('iris.dat');

// retrain the neural network
accuracy = Encog.Utils.Network.validateNetwork(newNetwork, inputDataset.test, outputDataset.test);
console.log('accuracy: ', accuracy);