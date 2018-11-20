const _ = require('lodash');
const colors = require('colors/safe');

let instance = null;

class EncogLog {
    constructor(options) {
        if (instance) {
            return instance;
        }

        instance = this;

        this.levels = {
            fatal: 'fatal',
            error: 'error',
            warn: 'warn',
            info: 'info',
            debug: 'debug'
        };
        this.levelsColors = {};
        this.levelsColors[this.levels.fatal] = colors.red;
        this.levelsColors[this.levels.error] = colors.yellow;
        this.levelsColors[this.levels.warn] = colors.cyan;
        this.levelsColors[this.levels.info] = colors.green;
        this.levelsColors[this.levels.debug] = colors.white;

        this.levelsInheritance = {};
        this.levelsInheritance[this.levels.fatal] = [];
        this.levelsInheritance[this.levels.error] = [this.levels.fatal];
        this.levelsInheritance[this.levels.warn] = [this.levels.error, this.levels.fatal];
        this.levelsInheritance[this.levels.info] = [this.levels.warn, this.levels.error, this.levels.fatal];
        this.levelsInheritance[this.levels.debug] = [this.levels.info, this.levels.warn, this.levels.error, this.levels.fatal];

        const defaultOptions = {
            logLevel: this.levels.debug,
            color: true,
            outputType: function (level) {
                return '[' + level + '] » ';
            },
            outputMessage: function (message) {
                const date = new Date();
                return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' » ' + message;
            }
        };
        this.options = _.merge(defaultOptions, options);
        this.messages = {
            debug: [],
            info: [],
            warn: [],
            error: [],
            fatal: []
        }
    }

    _print(level) {
        for (let message of this.messages[level]) {
            let msg = this.options.outputType(level) + this.options.outputMessage(message);
            // eslint-disable-next-line no-console
            console.log(this.levelsColors[level](msg));
        }
        this.messages[level] = [];
    }

    print() {
        const logLevel = __LOG_LEVEL__ || this.options.logLevel;
        this._print(logLevel);
        for (let level of this.levelsInheritance[logLevel]) {
            this._print(level);
        }
    }

    _pushNewMessage(msg, level) {
        this.messages[level].push(msg);
        return this;
    }

    debug(msg) {
        return this._pushNewMessage(msg, this.levels.debug);
    }

    info(msg) {
        return this._pushNewMessage(msg, this.levels.info);
    }

    warn(msg) {
        return this._pushNewMessage(msg, this.levels.warn);
    }

    error(msg) {
        return this._pushNewMessage(msg, this.levels.error);
    }

    fatal(msg) {
        return this._pushNewMessage(msg, this.levels.fatal);
    }
}

module.exports = new EncogLog();