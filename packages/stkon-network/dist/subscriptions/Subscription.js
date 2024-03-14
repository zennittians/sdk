"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionMethod = void 0;
var tslib_1 = require("tslib");
var rpc_1 = require("../rpcMethod/rpc");
var ws_1 = require("../providers/ws");
var SubscriptionMethod = /** @class */ (function (_super) {
    tslib_1.__extends(SubscriptionMethod, _super);
    function SubscriptionMethod(param, options, messenger, shardID) {
        if (shardID === void 0) { shardID = 0; }
        var _this = _super.call(this, shardID !== 0 ? messenger.getShardProvider(shardID).url : messenger.provider.url) || this;
        _this.subscriptionId = null;
        _this.shardID = shardID;
        _this.param = param;
        _this.options = options;
        _this.messenger = messenger;
        return _this;
    }
    SubscriptionMethod.prototype.constructPayload = function (method, param, options) {
        var rpcMethod = method;
        var payload = [];
        payload.push(param);
        if (options) {
            payload.push(options);
        }
        rpcMethod = this.messenger.setRPCPrefix(method, this.messenger.chainPrefix);
        return this.jsonRpc.toPayload(rpcMethod, payload);
    };
    SubscriptionMethod.prototype.start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var subscribePayload, id_1, error_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        subscribePayload = this.constructPayload(rpc_1.RPCMethod.Subscribe, this.param, this.options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, _super.prototype.subscribe.call(this, subscribePayload)];
                    case 2:
                        id_1 = _a.sent();
                        this.subscriptionId = id_1;
                        this.on(id_1, function (result) {
                            var output = _this.onNewSubscriptionItem(result);
                            _this.emitter.emit('data', output);
                        });
                        this.once('error', function (error) {
                            _this.removeEventListener(id_1);
                            _this.emitter.emit('error', error);
                            _this.removeEventListener('*');
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.emitter.emit('error', error_1);
                        this.removeEventListener('*');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, this];
                }
            });
        });
    };
    SubscriptionMethod.prototype.unsubscribe = function () {
        var unsubscribePayload = this.constructPayload(rpc_1.RPCMethod.UnSubscribe, this.subscriptionId);
        return _super.prototype.unsubscribe.call(this, unsubscribePayload);
    };
    SubscriptionMethod.prototype.onNewSubscriptionItem = function (subscriptionItem) {
        return subscriptionItem;
    };
    return SubscriptionMethod;
}(ws_1.WSProvider));
exports.SubscriptionMethod = SubscriptionMethod;
//# sourceMappingURL=Subscription.js.map