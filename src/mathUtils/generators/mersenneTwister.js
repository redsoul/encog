/**
 * The Mersenne twister is a pseudo random number generator developed in 1997 by Makoto Matsumoto and
 * Takuji Nishimura that is based on a matrix linear recurrence over a finite binary field F2.
 *
 * References:
 * http://www.cs.gmu.edu/~sean/research
 * http://en.wikipedia.org/wiki/Mersenne_twister/
 *
 * Makato Matsumoto and Takuji Nishimura, "Mersenne Twister: A 623-Dimensionally Equidistributed Uniform
 * Pseudo-Random Number Generator", ACM Transactions on Modeling and. Computer Simulation,
 * Vol. 8, No. 1, January 1998, pp 3--30.
 */
class MersenneTwisterGenerateRandom {

    constructor(seed) {
        this.N = 624;
        this.M = 397;
        this.MATRIX_A = 0x9908b0df;
        this.UPPER_MASK = 0x80000000;
        this.LOWER_MASK = 0x7fffffff;
        this.TEMPERING_MASK_B = 0x9d2c5680;
        this.TEMPERING_MASK_C = 0xefc60000;

        this.stateVector = [];
        this.mti = null;
        this.mag01 = [];

        if (!seed) {
            seed = Date.now();
        }
        this.setSeed(seed);
    }

    /**
     * @param seed {float}
     */
    setSeed(seed) {
        let mag01 = [];

        mag01[0] = 0x0;
        mag01[1] = this.MATRIX_A;

        this.stateVector[0] = parseInt(seed, 10);
        for (this.mti = 1; this.mti < this.N; this.mti++) {
            this.stateVector[this.mti] = (1812433253 * (this.stateVector[this.mti - 1] ^ (this.stateVector[this.mti - 1] >>> 30)) + this.mti);
        }
    }

    /**
     * @param bits {number}
     * @returns {float}
     */
    next(bits) {
        let y;

        if (this.mti >= this.N) {
            let kk;

            for (kk = 0; kk < this.N - this.M; kk++) {
                y = (this.stateVector[kk] & this.UPPER_MASK) | (this.stateVector[kk + 1] & this.LOWER_MASK);
                this.stateVector[kk] = this.stateVector[kk + this.M] ^ (y >>> 1) ^ this.mag01[y & 0x1];
            }
            for (; kk < this.N - 1; kk++) {
                y = (this.stateVector[kk] & this.UPPER_MASK) | (this.stateVector[kk + 1] & this.LOWER_MASK);
                this.stateVector[kk] = this.stateVector[kk + (this.M - this.N)] ^ (y >>> 1) ^ this.mag01[y & 0x1];
            }
            y = (this.stateVector[this.N - 1] & this.UPPER_MASK) | (this.stateVector[0] & this.LOWER_MASK);
            this.stateVector[this.N - 1] = this.stateVector[this.M - 1] ^ (y >>> 1) ^ this.mag01[y & 0x1];

            this.mti = 0;
        }

        y = this.stateVector[this.mti++];
        y ^= y >>> 11;
        y ^= (y << 7) & this.TEMPERING_MASK_B;
        y ^= (y << 15) & this.TEMPERING_MASK_C;
        y ^= (y >>> 18);

        return y >>> (32 - bits);
    }

    /**
     * @returns {number}
     */
    nextDouble() {
        return parseFloat(((this.next(26) << 27) + this.next(27)) / (1.0 << 53));
    }

    /**
     * @returns {boolean}
     */
    nextBoolean() {
        return this.nextDouble() > 0.5;
    }

    /**
     * @returns {number}
     */
    nextFloat() {
        return this.nextDouble();
    }

    /**
     * @returns {number}
     */
    nextInt() {
        return parseint(this.nextDouble(), 10);
    }
}

module.exports = MersenneTwisterGenerateRandom;