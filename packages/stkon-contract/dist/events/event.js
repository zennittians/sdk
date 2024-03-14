"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventMethod = void 0;
var tslib_1 = require("tslib");
var network_1 = require("@stkon-js/network");
var decoder_1 = require("../utils/decoder");
var formatter_1 = require("../utils/formatter");
var EventMethod = /** @class */ (function (_super) {
    tslib_1.__extends(EventMethod, _super);
    function EventMethod(methodKey, params, abiItem, contract) {
        var _this = _super.call(this, (0, formatter_1.inputLogFormatter)(params), contract.wallet.messenger, contract.shardID) || this;
        _this.methodKey = methodKey;
        _this.contract = contract;
        _this.params = params;
        _this.abiItem = abiItem;
        return _this;
        // this.subscribe();
    }
    // call() {}
    // estimateGas() {}
    // encodeABI() {}
    EventMethod.prototype.onNewSubscriptionItem = function (subscriptionItem) {
        var formatted = (0, formatter_1.outputLogFormatter)(subscriptionItem.method !== undefined ? subscriptionItem.params.result : subscriptionItem);
        var log = (0, decoder_1.decode)(this.contract.abiCoder, this.abiItem, formatted);
        if (log.removed && this.emitter) {
            this.emitter.emit('changed', log);
        }
        return log;
    };
    return EventMethod;
}(network_1.LogSub));
exports.EventMethod = EventMethod;
//# sourceMappingURL=event.js.map