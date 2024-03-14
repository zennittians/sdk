"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogSub = void 0;
var tslib_1 = require("tslib");
var Subscription_1 = require("./Subscription");
var rpc_1 = require("../rpcMethod/rpc");
var LogSub = /** @class */ (function (_super) {
    tslib_1.__extends(LogSub, _super);
    function LogSub(options, messenger, shardID) {
        if (shardID === void 0) { shardID = 0; }
        var _this = _super.call(this, 'logs', options, messenger, shardID) || this;
        _this.preprocess();
        return _this;
    }
    LogSub.prototype.preprocess = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var getPastLogs, logs, error_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((this.options.fromBlock && this.options.fromBlock !== 'latest') ||
                            this.options.fromBlock === 0 ||
                            this.options.fromBlock === '0x')) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.messenger.send(rpc_1.RPCMethod.GetPastLogs, tslib_1.__spreadArray([], tslib_1.__read(this.options), false), this.messenger.chainType, this.shardID)];
                    case 2:
                        getPastLogs = _a.sent();
                        if (getPastLogs.isError()) {
                            this.emitter.emit('error', getPastLogs.error.message);
                        }
                        else {
                            logs = getPastLogs.result;
                            logs.forEach(function (log) {
                                var formattedLog = _this.onNewSubscriptionItem(log);
                                _this.emitter.emit('data', formattedLog);
                            });
                        }
                        delete this.options.fromBlock;
                        // const sub = this.start();
                        return [2 /*return*/, this.start()];
                    case 3:
                        error_1 = _a.sent();
                        this.emitter.emit('error', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/, this.start()];
                }
            });
        });
    };
    LogSub.prototype.onNewSubscriptionItem = function (subscriptionItem) {
        // todo log formatter
        var log = subscriptionItem;
        if (log.removed) {
            this.emitter.emit('changed', log);
        }
        return log;
    };
    return LogSub;
}(Subscription_1.SubscriptionMethod));
exports.LogSub = LogSub;
//# sourceMappingURL=LogSub.js.map