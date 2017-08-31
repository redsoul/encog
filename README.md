# encog 
Encog is a NodeJs ES6 port of the popular Encog Machine Learning Framework by Jeff Heaton.

All credits of the framework should go to Jeff Heaton - http://www.heatonresearch.com/encog/

Based on the encog-java-core v3.4 - https://github.com/encog/encog-java-core

Full documentation and source code - https://github.com/redsoul/encog

[![Build Status](https://travis-ci.org/redsoul/encog.svg?branch=master)](https://travis-ci.org/redsoul/encog)

## Installation

    npm install encog --save
    
## Usage

Just require the library and all of Encog namespace will be available to you:

```javascript
const Encog = require('encog');
```

## Unit Tests

    npm install --only=dev
    npm test

## Implemented algorithms
* **Networks**
  * Basic Network
  * Hopfield Network
  * BAM (Bidirectional associative memory) Network
  * Freeform Network
* **Training**
  * Back Propagation
  * Manhattan Propagation
  * Resilient Propagation
  * Levenberg Marquardt
  * Neural Simulated Annealing
* **Patterns**
  * ADALINE
  * Feed Forward (Perceptron)
  * Elman Network
  * Jordan Network
  * Hopfield Network
  * BAM Network
* **Activation Functions**
  * Elliott
  * Symmetric Elliott
  * Gaussian
  * Linear
  * Ramp
  * ReLu
  * Sigmoid
  * Softmax
  * Steepened Sigmoid
  * Hyperbolic tangent
* **Error Functions**
  * Arctangent
  * Cross Entropy
  * Linear
  * Output
    

# Examples

### Back Propagation example using XOR Data Set

```javascript
const Encog = require('encog');
const XORdataset = Encog.Utils.Datasets.getXORDataSet();

// create a neural network
const network = new Encog.Networks.Basic();
network.addLayer(new Encog.Layers.Basic(null, true, 2));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 4));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), false, 1));
network.randomize();

const train = new Encog.Training.Propagation.Back(network, XORdataset.input, XORdataset.output);

Encog.Utils.Network.trainNetwork(train, {maxIterations: 250});
const accuracy = Encog.Utils.Network.validateNetwork(network, XORdataset.input, XORdataset.output);
console.log('Accuracy:', accuracy);
```

### Resilient Propagation example using Iris Flower Data Set (https://en.wikipedia.org/wiki/Iris_flower_data_set)

```javascript
const Encog = require('encog');
const irisDataset = Encog.Utils.Datasets.getIrisDataSet();
let inputDataset = Encog.Utils.DataToolbox.trainTestSplit(irisDataset.input);
let outputDataset = Encog.Utils.DataToolbox.trainTestSplit(irisDataset.output);

// create a neural network
const network = new Encog.Networks.Basic();
network.addLayer(new Encog.Layers.Basic(null, true, 4));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 10));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 5));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), false, 3));
network.randomize();

Encog.Utils.DataToolbox.normalizeData(inputDataset.train);
Encog.Utils.DataToolbox.normalizeData(inputDataset.test);

// train the neural network
const train = new Encog.Training.Propagation.Resilient(network, inputDataset.train, outputDataset.train);

Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5});
const accuracy = Encog.Utils.Network.validateNetwork(network, inputDataset.test, outputDataset.test);
console.log('Accuracy:', accuracy);
```

### Hopfield Network example custom binary dataset

```javascript
const Encog = require('encog');
const _ = require('lodash');
const hopfieldPatterns = Encog.Utils.Network.getHopfieldPatterns();
const HopfieldPattern = new Encog.Patterns.Hopfield();

HopfieldPattern.setInputLayer(35);
const network = HopfieldPattern.generate();

_.each(hopfieldPatterns, function (pattern) {
    network.addPattern(pattern);
});

network.runUntilStable(10);
const input = [
    0, 0, 0, 0, 0,
    0, 1, 1, 1, 0,
    0, 0, 0, 0, 0,
    0, 1, 1, 0, 0,
    0, 0, 0, 0, 0,
    0, 1, 1, 1, 0,
    0, 0, 0, 0, 0
];
const result = network.compute(input);
console.log('Result:', result);

/*
Output:

0, 0, 0, 0, 0,
0, 1, 1, 1, 0,
0, 1, 0, 0, 0,
0, 1, 1, 0, 0,
0, 1, 0, 0, 0,
0, 1, 1, 1, 0,
0, 0, 0, 0, 0
*/
```

# Node.js version compatibility

6.0.0 or higher