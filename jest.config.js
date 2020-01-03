const PATHS = require('./paths.js');

module.exports = {
    globals: {
        "PATHS": PATHS
    },
    testRegex: "(/tests/.*|(\\.|/)(specs))\\.js$"
};