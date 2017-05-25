const EncogError = require(PATHS.ERROR_HANDLING + 'encog');
/**
 * Used by the neural network classes to indicate an error.
 */
class FreeformNetworkError extends EncogError {
    /**
     * @inheritDoc
     */
    constructor(message) {
        super(message);
    }
}

module.exports = FreeformNetworkError;