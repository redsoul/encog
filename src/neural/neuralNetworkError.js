const EncogError = require(PATHS.UTILS + 'encogError');
/**
 * Used by the neural network classes to indicate an error.
 */
class NeuralNetworkError extends EncogError {
    /**
     * @inheritDoc
     */
    constructor(message) {
        super(message);
    }
}

module.exports = NeuralNetworkError;