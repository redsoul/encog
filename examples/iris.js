require('../index');
const BasicNetwork = require(__NETWORKS + 'basic');
const BasicLayer = require(__LAYERS + 'basic');
const ActivationSigmoid = require(__ACTIVACTION_FUNCTIONS + 'sigmoid');
const BackPropagation = require(__TRAINERS + 'back');
const ManhattanPropagation = require(__TRAINERS + 'manhattan');
const ResilientPropagation = require(__TRAINERS + 'resilient');
let irisDataset = require('ml-dataset-iris').getDataset();
const _ = require('lodash');

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
let network;
let trainDatasetInput;
let trainDatasetOutput;
let testDatasetInput;
let testDatasetOutput;


//split the input and output in train and test dataset, following the 80%/20% ratio
trainDatasetInput = irisInput.slice(0, irisInput.length * 0.8);
trainDatasetOutput = irisOutput.slice(0, irisOutput.length * 0.8);
testDatasetInput = irisInput.slice(-irisInput.length * 0.2);
testDatasetOutput = irisOutput.slice(-irisOutput.length * 0.2);

// create a neural network, without using a factory
network = new BasicNetwork();
network.addLayer(new BasicLayer(null, true, 4));
network.addLayer(new BasicLayer(new ActivationSigmoid(), true, 10));
network.addLayer(new BasicLayer(new ActivationSigmoid(), true, 5));
network.addLayer(new BasicLayer(new ActivationSigmoid(), false, 3));
network.structure.finalizeStructure();
network.reset();


// train the neural network
const train = new ResilientPropagation(network, trainDatasetInput, trainDatasetOutput);

let epoch = 1;

do {
    train.iteration();
    console.log("Epoch #" + epoch + " Error:" + train.error);
    epoch++;
} while (train.error > 0.01);
// } while (epoch < 10);
train.finishTraining();

// test the neural network
console.log("Neural Network Results:");
let i = 0;
for (let input of testDatasetInput) {
    const output = network.compute(input);
    console.log(input + ", actual=" + output + ",ideal=" + testDatasetOutput[i]);
    i++;
}