const Encog = require('../index');
const irisDataset = Encog.Utils.Network.getIrisDataset();
let inputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.input);
let outputDataset = Encog.Utils.DataToolbox.trainTestSpit(irisDataset.output);

// create a neural network, without using a factory
network = new Encog.Networks.Basic();
network.addLayer(new Encog.Layers.Basic(null, true, 4));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 10));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 5));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), false, 3));
network.structure.finalizeStructure();
network.reset();

Encog.Utils.DataToolbox.normalizeData(inputDataset.train);
Encog.Utils.DataToolbox.normalizeData(inputDataset.test);

// train the neural network
const train = new Encog.Training.Propagation.Resilient(network, inputDataset.train, outputDataset.train);

Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5});
const accuracy = Encog.Utils.Network.validateNetwork(network, inputDataset.test, outputDataset.test);