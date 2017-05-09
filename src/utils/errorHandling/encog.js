/**
 * General error class for Encog. All Encog errors should extend from this
 * class. Doing this ensures that they will be caught as Encog errors. This also
 * ensures that any subclasses will be logged.
 */
class EncogError extends Error {
    /**
     * Construct a message exception.
     *
     * @param message {string}
     *            The exception message.
     */
    constructor(message) {
        // Calling parent constructor of base Error class.
        super(message);

        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);

        // Saving class name in the property of our custom error as a shortcut.
        this.name = this.constructor.name;

        EncogLog.fatal(message).print();
    }
}

module.exports = EncogError;