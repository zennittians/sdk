"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeBlockTracker = void 0;
var tslib_1 = require("tslib");
var ws_1 = require("../providers/ws");
var baseTracker_1 = require("./baseTracker");
var rpc_1 = require("../rpcMethod/rpc");
var SubscribeBlockTracker = /** @class */ (function (_super) {
    tslib_1.__extends(SubscribeBlockTracker, _super);
    // tslint:disable-next-line: variable-name
    function SubscribeBlockTracker(messenger, opts) {
        if (opts === void 0) { opts = {}; }
        var _this = this;
        // parse + validate args
        if (!messenger) {
            throw new Error('SubscribeBlockTracker - no provider specified.');
        }
        if (!(messenger.provider instanceof ws_1.WSProvider)) {
            throw new Error('This provider not supported');
        }
        // BaseBlockTracker constructor
        _this = _super.call(this, opts) || this;
        // config
        _this.messenger = messenger;
        _this.subscriptionId = null;
        return _this;
    }
    SubscribeBlockTracker.prototype.checkForLatestBlock = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLatestBlock()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    SubscribeBlockTracker.prototype._start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var blockNumber, subs, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.messenger.send(rpc_1.RPCMethod.BlockNumber, [])];
                    case 1:
                        blockNumber = _a.sent();
                        if (!blockNumber.isError()) return [3 /*break*/, 2];
                        throw blockNumber.message;
                    case 2:
                        if (!blockNumber.isResult()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.messenger.subscribe(rpc_1.RPCMethod.Subscribe, ['newHeads'])];
                    case 3:
                        subs = _a.sent();
                        this.subscriptionId = subs;
                        subs[0].onData(this._handleSubData);
                        this._newPotentialLatest(blockNumber);
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        this.emit('error', error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SubscribeBlockTracker.prototype._end = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (this.subscriptionId != null) {
                    this.messenger.unsubscribe(rpc_1.RPCMethod.UnSubscribe, [this.subscriptionId]);
                    delete this.subscriptionId;
                }
                return [2 /*return*/];
            });
        });
    };
    SubscribeBlockTracker.prototype._handleSubData = function (data) {
        if (
        // data.method === 'eth_subscription' &&
        data.params.subscription === this.subscriptionId) {
            this._newPotentialLatest(data.params.result.number);
        }
    };
    return SubscribeBlockTracker;
}(baseTracker_1.BaseBlockTracker));
exports.SubscribeBlockTracker = SubscribeBlockTracker;
//# sourceMappingURL=subscribeTracker.js.map