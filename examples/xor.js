const Encog = require('../index');
const XORdataset = Encog.Utils.Network.getXORDataset();

// create a neural network, without using a factory
network = new Encog.Networks.Basic();
network.addLayer(new Encog.Layers.Basic(null, true, 2));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 4));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), false, 1));
network.reset();

// train the neural network
const train = new Encog.Training.Propagation.Resilient(network, XORdataset.input, XORdataset.output);

Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5});
let accuracy = Encog.Utils.Network.validateNetwork(network, XORdataset.input, XORdataset.output);
console.log('accuracy: ', accuracy);

Encog.Utils.File.saveNetwork(network, 'xor.dat');


const newNetwork = Encog.Utils.File.loadNetwork('xor.dat');

// retrain the neural network
accuracy = Encog.Utils.Network.validateNetwork(newNetwork, XORdataset.input, XORdataset.output);
console.log('accuracy: ', accuracy);