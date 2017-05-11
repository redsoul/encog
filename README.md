# encog-js
EncogJS is a Javascript ES6 port of the popular Encog Machine Learning Framework by Jeff Heaton.

All credits of the framework should go to Jeff Heaton - http://www.heatonresearch.com/encog/

Based on the encog-java-core v3.4 - https://github.com/encog/encog-java-core

# Example

```javascript
const Encog = require('encog');
const XORdataset = Encog.Utils.Network.getXORDataset();

// create a neural network, without using a factory
network = new Encog.Networks.Basic();
network.addLayer(new Encog.Layers.Basic(null, true, 2));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), true, 4));
network.addLayer(new Encog.Layers.Basic(new Encog.ActivationFunctions.Sigmoid(), false, 1));
network.structure.finalizeStructure();
network.reset();

// train the neural network
const train = new Encog.Training.Propagation.Resilient(network, XORdataset.input, XORdataset.output);

Encog.Utils.Network.trainNetwork(train, {minError: 0.01, minIterations: 5});
const accuracy = Encog.Utils.Network.validateNetwork(network, XORdataset.input, XORdataset.output);
console.log('Accuracy:',accuracy);
```
