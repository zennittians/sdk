"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewHeaders = void 0;
var tslib_1 = require("tslib");
var Subscription_1 = require("./Subscription");
/**
 * ### Description:
 * Subscribes to incoming block headers. This can be used as timer to check for changes on the blockchain.
 */
var NewHeaders = /** @class */ (function (_super) {
    tslib_1.__extends(NewHeaders, _super);
    function NewHeaders(messenger, shardID) {
        if (shardID === void 0) { shardID = 0; }
        var _this = _super.call(this, 'newHeads', undefined, messenger, shardID) || this;
        _this.start();
        return _this;
    }
    return NewHeaders;
}(Subscription_1.SubscriptionMethod));
exports.NewHeaders = NewHeaders;
//# sourceMappingURL=NewHeadersSub.js.map