const _ = require('lodash');

global.PATHS = require('./paths.js');
global.__LOG_LEVEL__ = 'debug';

const requireAll = require('require-all');
const requireDir = (dir)=> {
    return requireAll({
        dirname: dir,
        filter: /(\w+).js$/,
        map: (name)=> {
            return _.upperFirst(name);
        }
    });
};

const ActivationFunctions = requireDir(PATHS.ACTIVATION_FUNCTIONS);
const ErrorFunctions = requireDir(PATHS.ERROR_FUNCTIONS);
const Layers = requireDir(PATHS.LAYERS);
const Networks = requireDir(PATHS.NETWORKS);
const Freeform = requireDir(PATHS.FREEFORM);
const FreeformPropagation = requireDir(PATHS.FREEFORM_PROPAGATION);
const Neural = requireDir(PATHS.NEURAL);
const Patterns = requireDir(PATHS.PATTERNS);
const Training = {Propagation: requireDir(PATHS.PROPAGATION), SGD:requireDir(PATHS.SGD)};
const Strategies = requireDir(PATHS.STRATEGIES);
const MathUtils = requireDir(PATHS.MATH_UTILS);
const ErrorCalculation = requireDir(PATHS.ERROR_CALCULATION);
const Utils = requireDir(PATHS.UTILS);
const Preprocessing = requireDir(PATHS.PREPROCESSING);

module.exports = {
    ActivationFunctions,
    ErrorFunctions,
    Layers,
    Networks,
    Freeform,
    FreeformPropagation,
    Neural,
    Patterns,
    Training,
    Strategies,
    MathUtils,
    ErrorCalculation,
    Utils,
    Preprocessing,
    Log: require(PATHS.UTILS + 'encogLog')
};
