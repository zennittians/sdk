"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewPendingTransactions = void 0;
var tslib_1 = require("tslib");
var Subscription_1 = require("./Subscription");
/**
 * ### Description:
 * Subscribes to incoming pending transactions
 */
var NewPendingTransactions = /** @class */ (function (_super) {
    tslib_1.__extends(NewPendingTransactions, _super);
    function NewPendingTransactions(messenger, shardID) {
        if (shardID === void 0) { shardID = 0; }
        var _this = _super.call(this, 'newPendingTransactions', undefined, messenger, shardID) || this;
        _this.start();
        return _this;
    }
    return NewPendingTransactions;
}(Subscription_1.SubscriptionMethod));
exports.NewPendingTransactions = NewPendingTransactions;
//# sourceMappingURL=NewPendingTransactionsSub.js.map