const Encog = require('../index');
const _ = require('lodash');

const dataEncoder = new Encog.Preprocessing.DataEncoder();
let irisDataset = Encog.Utils.Datasets.getIrisDataSet();
irisDataset = _.shuffle(irisDataset);
irisDataset = Encog.Preprocessing.DataToolbox.trainTestSplit(irisDataset);

/******************/
//data normalization
/******************/

//apply a specific mapping to each column
const mappings = {
    'Sepal.Length': new Encog.Preprocessing.DataMappers.MinMaxScaller(),
    'Sepal.Width': new Encog.Preprocessing.DataMappers.MinMaxScaller(),
    'Petal.Length': new Encog.Preprocessing.DataMappers.MinMaxScaller(),
    'Petal.Width': new Encog.Preprocessing.DataMappers.MinMaxScaller(),
    'Species': new Encog.Preprocessing.DataMappers.OneHot(),
};

//Fit to data, then transform it.
let trainData = dataEncoder.fit_transform(irisDataset.train, mappings);
//transform the test data based on the train data
let testData = dataEncoder.transform(irisDataset.test, mappings);

//slice the data in input and output
trainData = Encog.Preprocessing.DataToolbox.sliceOutput(trainData.values, 3);
testData = Encog.Preprocessing.DataToolbox.sliceOutput(testData.values, 3);

// create a neural network
const network = new Encog.Networks.Basic();
network.addLayer(new Encog.Layers.Basic(null, true, 4));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 10));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 5));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), false, 3));
network.randomize();

// train the neural network
const train = new Encog.Training.Propagation.Resilient(network, trainData.input, trainData.output);
Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5});

//validate the neural network
let accuracy = Encog.Utils.Network.validateNetwork(network, testData.input, testData.output);
console.log('Accuracy:', accuracy);

//save the trained network
Encog.Utils.File.saveNetwork(network, 'iris.dat');

//load a pretrained network
const newNetwork = Encog.Utils.File.loadNetwork('iris.dat');

//validate the neural network
accuracy = Encog.Utils.Network.validateNetwork(newNetwork, testData.input, testData.output);
console.log('accuracy: ', accuracy);