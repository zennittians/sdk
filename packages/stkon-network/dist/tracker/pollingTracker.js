"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollingBlockTracker = exports.timeout = void 0;
var tslib_1 = require("tslib");
var baseTracker_1 = require("./baseTracker");
var rpc_1 = require("../rpcMethod/rpc");
var sec = 1000;
function timeout(duration, unref) {
    return new Promise(function (resolve) {
        var timoutRef = setTimeout(resolve, duration);
        // don't keep process open
        if (timoutRef.unref && unref) {
            timoutRef.unref();
        }
    });
}
exports.timeout = timeout;
var PollingBlockTracker = /** @class */ (function (_super) {
    tslib_1.__extends(PollingBlockTracker, _super);
    function PollingBlockTracker(messenger, opts) {
        if (opts === void 0) { opts = {
            pollingInterval: undefined,
            retryTimeout: undefined,
            keepEventLoopActive: false,
            setSkipCacheFlag: false,
        }; }
        var _this = this;
        // parse + validate args
        if (!messenger) {
            throw new Error('PollingBlockTracker - no provider specified.');
        }
        var pollingInterval = opts.pollingInterval || 20 * sec;
        var retryTimeout = opts.retryTimeout || pollingInterval / 10;
        var keepEventLoopActive = opts.keepEventLoopActive !== undefined ? opts.keepEventLoopActive : true;
        var setSkipCacheFlag = opts.setSkipCacheFlag || false;
        // BaseBlockTracker constructor
        _this = _super.call(this, {
            blockResetDuration: pollingInterval,
            retryTimeout: retryTimeout,
            keepEventLoopActive: keepEventLoopActive,
            setSkipCacheFlag: setSkipCacheFlag,
        }) || this;
        // config
        _this.messenger = messenger;
        _this._pollingInterval = pollingInterval;
        _this._retryTimeout = retryTimeout;
        _this._keepEventLoopActive = keepEventLoopActive;
        _this._setSkipCacheFlag = setSkipCacheFlag;
        return _this;
    }
    //
    // public
    //
    // trigger block polling
    PollingBlockTracker.prototype.checkForLatestBlock = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._updateLatestBlock()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getLatestBlock()];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    //
    // private
    //
    PollingBlockTracker.prototype._start = function () {
        var _this = this;
        this._performSync().catch(function (err) { return _this.emit('error', err); });
    };
    PollingBlockTracker.prototype._performSync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var err_1, newErr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._isRunning) return [3 /*break*/, 7];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 6]);
                        return [4 /*yield*/, this._updateLatestBlock()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, timeout(this._pollingInterval, !this._keepEventLoopActive)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        err_1 = _a.sent();
                        newErr = new Error("PollingBlockTracker - encountered an error while attempting to update latest block:\n".concat(err_1.stack));
                        try {
                            this.emit('error', newErr);
                        }
                        catch (emitErr) {
                            console.error(newErr);
                        }
                        return [4 /*yield*/, timeout(this._retryTimeout, !this._keepEventLoopActive)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 0];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PollingBlockTracker.prototype._updateLatestBlock = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var latestBlock;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._fetchLatestBlock()];
                    case 1:
                        latestBlock = _a.sent();
                        this._newPotentialLatest(latestBlock);
                        return [2 /*return*/];
                }
            });
        });
    };
    PollingBlockTracker.prototype._fetchLatestBlock = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.messenger.send(rpc_1.RPCMethod.BlockNumber, [])];
                    case 1:
                        result = _a.sent();
                        if (result.isError()) {
                            throw result.message;
                        }
                        else if (result.isResult()) {
                            return [2 /*return*/, result.result];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PollingBlockTracker;
}(baseTracker_1.BaseBlockTracker));
exports.PollingBlockTracker = PollingBlockTracker;
//# sourceMappingURL=pollingTracker.js.map