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
const accuracy = Encog.Utils.Network.validateNetwork(network, XORdataset.input, XORdataset.output);

