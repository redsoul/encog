var _ = require('lodash');
var colors = require('colors/safe');

class EncogLog {
    constructor(options) {
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

        var defaultOptions = {
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
        this.options = _.merge(options, defaultOptions);
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
            console.log(this.levelsColors[level](msg));
        }
        this.messages[level] = [];
    }

    print() {
        this._print(this.options.logLevel);
        for (let level of this.levelsInheritance[this.options.logLevel]) {
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

module.exports = EncogLog;