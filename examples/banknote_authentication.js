const Encog = require('../index');
const _ = require('lodash');
const dataEncoder = new Encog.Preprocessing.DataEncoder();

//adjust the log level
Encog.Log.options.logLevel = 'info';

(async () => {
    const dataset = await Encog.Preprocessing.DataToolbox.readTrainingCSV(
        './data/data_banknote_authentication.csv'
    );
    const shuffledDataset = _.shuffle(dataset);

    const splittedDataset = Encog.Preprocessing.DataToolbox.trainTestSplit(shuffledDataset);

    /******************/
    //data normalization
    /******************/
    //apply a specific mapping to each column
    const mappings = {
        'variance': new Encog.Preprocessing.DataMappers.MinMaxScaller(),
        'skewness': new Encog.Preprocessing.DataMappers.MinMaxScaller(),
        'curtosis': new Encog.Preprocessing.DataMappers.MinMaxScaller(),
        'entropy': new Encog.Preprocessing.DataMappers.MinMaxScaller(),
        'class': new Encog.Preprocessing.DataMappers.IntegerParser()
    };
    //Fit to data, then transform it.
    let trainData = dataEncoder.fit_transform(splittedDataset.train, mappings);
    //transform the test data based on the train data
    let testData = dataEncoder.transform(splittedDataset.test, mappings);

    //slice the data in input and output
    trainData = Encog.Preprocessing.DataToolbox.sliceOutput(trainData.values, 1);
    testData = Encog.Preprocessing.DataToolbox.sliceOutput(testData.values, 1);

    // create a neural network
    const network = new Encog.Networks.Basic();
    network.addLayer(new Encog.Layers.Basic(null, true, 4));
    network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 40));
    network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 40));
    network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 40));
    network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), false, 1));
    network.randomize();

    // train the neural network
    const train = new Encog.Training.SGD.StochasticGradientDescent(network, trainData.input, trainData.output, new Encog.Training.SGD.Update.Adam());
    Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 50, maxIterations: 200});

    //validate the neural network
    let accuracy = Encog.Utils.Network.validateNetwork(network, testData.input, testData.output);
    console.log('Accuracy:', accuracy);

    //save the trained network
    Encog.Utils.File.saveNetwork(network, 'banknote_authentication.dat');

    //load a pretrained network
    const newNetwork = Encog.Utils.File.loadNetwork('banknote_authentication.dat');

    //validate the neural network
    accuracy = Encog.Utils.Network.validateNetwork(newNetwork, testData.input, testData.output);
    console.log('accuracy: ', accuracy);
})();