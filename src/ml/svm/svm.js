/**
 * The default degree.
 */
const DEFAULT_DEGREE = 3;

/**
 * The default COEF0.
 */
const DEFAULT_COEF0 = 0;

/**
 * The default NU.
 */
const DEFAULT_NU = 0.5;

/**
 * The default cache size.
 */
const DEFAULT_CACHE_SIZE = 100;

/**
 * The default C.
 */
const DEFAULT_C = 1;

/**
 * The default EPS.
 */
const DEFAULT_EPS = 1e-3;

/**
 * The default P.
 */
const DEFAULT_P = 0.1;

/**
 * This is a network that is backed by one or more Support Vector Machines
 * (SVM). It is designed to function very similarly to an Encog neural network,
 * and is largely interchangeable with an Encog neural network.
 *
 * The support vector machine supports several types. Regression is used when
 * you want the network to predict a value, given the input. Function
 * approximation is a good example of regression. Classification is used when
 * you want the SVM to group the input data into one or more classes.
 *
 * Support Vector Machines typically have a single output. Neural networks can
 * have multiple output neurons. To get around this issue, this class will
 * create multiple SVM's if there is more than one output specified.
 *
 * Because a SVM is trained quite differently from a neural network, none of the
 * neural network training classes will work. This class must be trained using
 * SVMTrain.
 */

class SVM {

}

module.exports = SVM;