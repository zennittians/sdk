"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBlockTracker = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("@stkon-js/utils");
var emitter_1 = require("../providers/emitter");
var sec = 1000;
var calculateSum = function (accumulator, currentValue) { return accumulator + currentValue; };
var blockTrackerEvents = ['sync', 'latest'];
var BaseBlockTracker = /** @class */ (function (_super) {
    tslib_1.__extends(BaseBlockTracker, _super);
    function BaseBlockTracker(opts) {
        if (opts === void 0) { opts = {
            blockResetDuration: undefined,
            retryTimeout: undefined,
            keepEventLoopActive: undefined,
            setSkipCacheFlag: false,
        }; }
        var _this = _super.call(this) || this;
        // config
        _this._blockResetDuration = opts.blockResetDuration || 20 * sec;
        // state
        // tslint:disable-next-line: no-unused-expression
        _this._blockResetTimeout;
        _this._currentBlock = null;
        _this._isRunning = false;
        // bind functions for internal use
        // this._onNewListener = this._onNewListener.bind(this);
        // this._onRemoveListener = this._onRemoveListener.bind(this);
        // this._resetCurrentBlock = this._resetCurrentBlock.bind(this);
        // listen for handler changes
        // this._setupInternalEvents();
        _this._maybeStart();
        return _this;
    }
    BaseBlockTracker.prototype.isRunning = function () {
        return this._isRunning;
    };
    BaseBlockTracker.prototype.getCurrentBlock = function () {
        return this._currentBlock;
    };
    BaseBlockTracker.prototype.getLatestBlock = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var latestBlock;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // return if available
                        if (this._currentBlock) {
                            return [2 /*return*/, this._currentBlock];
                        }
                        return [4 /*yield*/, new Promise(function (resolve) { return _this.once('latest', resolve); })];
                    case 1:
                        latestBlock = _a.sent();
                        // return newly set current block
                        return [2 /*return*/, latestBlock];
                }
            });
        });
    };
    // dont allow module consumer to remove our internal event listeners
    BaseBlockTracker.prototype.removeAllListeners = function (eventName) {
        // perform default behavior, preserve fn arity
        if (eventName) {
            _super.prototype.removeEventListener.call(this, eventName);
        }
        else {
            _super.prototype.removeEventListener.call(this, '*');
        }
        // re-add internal events
        this._setupInternalEvents();
        // trigger stop check just in case
        this._onRemoveListener('*');
    };
    //
    // to be implemented in subclass
    //
    BaseBlockTracker.prototype._start = function () {
        // default behavior is noop
    };
    BaseBlockTracker.prototype._end = function () {
        // default behavior is noop
    };
    //
    // private
    //
    BaseBlockTracker.prototype._setupInternalEvents = function () {
        // first remove listeners for idempotence
        this.removeEventListener('newListener', this._onNewListener);
        this.removeEventListener('removeListener', this._onRemoveListener);
        // then add them
        this.on('newListener', this._onNewListener);
        this.on('removeListener', this._onRemoveListener);
    };
    BaseBlockTracker.prototype._onNewListener = function (eventName, handler) {
        // `newListener` is called *before* the listener is added
        if (!blockTrackerEvents.includes(eventName)) {
            return;
        }
        this._maybeStart();
    };
    BaseBlockTracker.prototype._onRemoveListener = function (eventName, handler) {
        // `removeListener` is called *after* the listener is removed
        if (this._getBlockTrackerEventCount() > 0) {
            return;
        }
        this._maybeEnd();
    };
    BaseBlockTracker.prototype._maybeStart = function () {
        if (this._isRunning) {
            return;
        }
        this._isRunning = true;
        // cancel setting latest block to stale
        this._cancelBlockResetTimeout();
        this._start();
    };
    BaseBlockTracker.prototype._maybeEnd = function () {
        if (!this._isRunning) {
            return;
        }
        this._isRunning = false;
        this._setupBlockResetTimeout();
        this._end();
    };
    BaseBlockTracker.prototype._getBlockTrackerEventCount = function () {
        var _this = this;
        return blockTrackerEvents
            .map(function (eventName) { return _this.listenerCount(eventName); })
            .reduce(calculateSum);
    };
    BaseBlockTracker.prototype._newPotentialLatest = function (newBlock) {
        var currentBlock = this._currentBlock;
        // only update if blok number is higher
        if (currentBlock &&
            (0, utils_1.isHex)(currentBlock) &&
            (0, utils_1.isHex)(newBlock) &&
            (0, utils_1.hexToNumber)(newBlock) <= (0, utils_1.hexToNumber)(currentBlock)) {
            return;
        }
        this._setCurrentBlock(newBlock);
    };
    BaseBlockTracker.prototype._setCurrentBlock = function (newBlock) {
        var oldBlock = this._currentBlock;
        this._currentBlock = newBlock;
        this.emit('latest', newBlock);
        this.emit('sync', { oldBlock: oldBlock, newBlock: newBlock });
    };
    BaseBlockTracker.prototype._setupBlockResetTimeout = function () {
        // clear any existing timeout
        this._cancelBlockResetTimeout();
        // clear latest block when stale
        this._blockResetTimeout = setTimeout(this._resetCurrentBlock, this._blockResetDuration);
        // nodejs - dont hold process open
        if (this._blockResetTimeout.unref) {
            this._blockResetTimeout.unref();
        }
    };
    BaseBlockTracker.prototype._cancelBlockResetTimeout = function () {
        clearTimeout(this._blockResetTimeout);
    };
    BaseBlockTracker.prototype._resetCurrentBlock = function () {
        this._currentBlock = null;
    };
    return BaseBlockTracker;
}(emitter_1.Emitter));
exports.BaseBlockTracker = BaseBlockTracker;
//# sourceMappingURL=baseTracker.js.map