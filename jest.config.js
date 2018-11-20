const PATHS = require('./paths.js');

module.exports = {
    globals: {
        "__LOG_LEVEL__": 'fatal',
        "PATHS": PATHS
    },
    testRegex: "(/tests/.*|(\\.|/)(specs))\\.js$"
};