const BasicTraining = require(PATHS.TRAINING + 'basic');
const ErrorCalculation = require(PATHS.ERROR_CALCULATION + 'errorCalculation');
const ArrayUtils = require(PATHS.UTILS + 'array');
const RangeRandomizer = require(PATHS.RANDOMIZERS + 'range');

class StochasticGradientDescent extends BasicTraining {
    constructor(network, training, theRandomizer = new RangeRandomizer()) {
        super();

        this.setTraining(training);

        this.setBatchSize(25);

        this.method = network;
        this.flat = network.getFlat();
        this.layerDelta = ArrayUtils.newFloatArray(this.flat.getLayerOutput().length);
        this.gradients = ArrayUtils.newFloatArray(this.flat.getWeights().length);
        this.errorCalculation = new ErrorCalculation();
        this.rnd = theRandomizer;
        this.learningRate = 0.001;
        this.momentum = 0.9;
    }

    process(pair) {
    this.errorCalculation = new ErrorCalculation();

    const actual = ArrayUtils.newFloatArray(this.flat.getOutputCount());

    this.flat.compute(pair.getInputArray(), actual);

        this.errorCalculation.updateError(actual, pair.getIdealArray(), pair.getSignificance());

    // Calculate error for the output layer.
    this.errorFunction.calculateError(
    flat.getActivationFunctions()[0], this.flat.getLayerSums(),this.flat.getLayerOutput(),
    pair.getIdeal().getData(), actual, this.layerDelta, 0,
    pair.getSignificance());

    // Apply regularization, if requested.
    if( this.l1> Encog.DEFAULT_DOUBLE_EQUAL
|| this.l2>Encog.DEFAULT_DOUBLE_EQUAL  ) {
    double[] lp = new double[2];
    calculateRegularizationPenalty(lp);
    for(int i=0;i<actual.length;i++) {
    double p = (lp[0]*this.l1) + (lp[1]*this.l2);
    this.layerDelta[i]+=p;
}
}

// Propagate backwards (chain rule from calculus).
for (int i = this.flat.getBeginTraining(); i < this.flat
    .getEndTraining(); i++) {
    processLevel(i);
}
}

}

module.exports = StochasticGradientDescent;