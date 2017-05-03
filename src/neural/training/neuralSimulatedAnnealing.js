const BasicTraining = require(__TRAINING + 'basic');
const SimulatedAnnealing = require(__ML + 'simulatedAnnealing');
/**
 * The cutoff for random data.
 */
const CUT = 0.5;
/**
 * This class implements a simulated annealing training algorithm for neural
 * networks. It is based on the generic SimulatedAnnealing class. It is used in
 * the same manner as any other training class that implements the Train
 * interface. There are essentially two ways you can make use of this class.
 *
 * Either way, you will need a score object. The score object tells the
 * simulated annealing algorithm how well suited a neural network is.
 *
 * If you would like to use simulated annealing with a training set you should
 * make use TrainingSetScore class. This score object uses a training set to
 * score your neural network.
 *
 * If you would like to be more abstract, and not use a training set, you can
 * create your own implementation of the CalculateScore method. This class can
 * then score the networks any way that you like.
 *
 */
class NeuralSimulatedAnnealing extends BasicTraining {
    /**
     * Construct a simulated annleaing trainer for a encodable MLMethod.
     *
     * @param network {BasicNetwork}
     *            The neural network to be trained.
     * @param scoreAlgorithm {CalculateScore}
     *            Used to calculate the score for a MLMethod.
     * @param startTemp {Number}
     *            The starting temperature.
     * @param stopTemp {Number}
     *            The ending temperature.
     * @param cycles {Number}
     *            The number of cycles in a training iteration.
     */
    constructor(network, scoreAlgorithm, startTemp, stopTemp, cycles) {
        super();
        this.network = network;
        this.scoreAlgorithm = scoreAlgorithm;

        this.anneal = new SimulatedAnnealing();
        this.anneal.temperature = startTemp;
        this.anneal.startTemperature = startTemp;
        this.anneal.stopTemperature = stopTemp;
        this.anneal.cycles = cycles;
        this.anneal.shouldMinimize = scoreAlgorithm.shouldMinimize();
    }

    /**
     * Perform one iteration of simulated annealing.
     */
    iteration() {
        EncogLog.info("Performing Simulated Annealing iteration.");

        this.preIteration();
        this.anneal.iteration();
        this.error = this.calculateScore();
        this.postIteration();
    }

    /**
     * @return A copy of the annealing array.
     */
    getArrayCopy() {
        return this.network.encodeNetwork();
    }

    /**
     * @inheritDoc
     * */
    calculateScore() {
        return this.scoreAlgorithm.calculateScore(this.network);
    }

    /**
     * @inheritDoc
     */
    randomize() {
        this.network.randomize();
    }

    /**
     * Store the array.
     *
     * @param array {Array}
     *            The array to be stored.
     */
    putArray(array) {
        this.network.decodeNetwork(array);
    }
}


module.exports = NeuralSimulatedAnnealing;