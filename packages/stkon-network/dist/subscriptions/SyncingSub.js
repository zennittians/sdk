"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Syncing = void 0;
var tslib_1 = require("tslib");
var Subscription_1 = require("./Subscription");
var Syncing = /** @class */ (function (_super) {
    tslib_1.__extends(Syncing, _super);
    function Syncing(messenger, shardID) {
        if (shardID === void 0) { shardID = 0; }
        var _this = _super.call(this, 'syncing', undefined, messenger, shardID) || this;
        _this.isSyncing = null;
        _this.start();
        return _this;
    }
    Syncing.prototype.onNewSubscriptionItem = function (subscriptionItem) {
        var isSyncing = subscriptionItem.params.result.syncing;
        if (this.isSyncing === null) {
            this.isSyncing = isSyncing;
            this.emitter.emit('changed', this.isSyncing);
        }
        if (this.isSyncing === true && isSyncing === false) {
            this.isSyncing = isSyncing;
            this.emitter.emit('changed', this.isSyncing);
        }
        if (this.isSyncing === false && isSyncing === true) {
            this.isSyncing = isSyncing;
            this.emitter.emit('changed', this.isSyncing);
        }
        // todo formatter
        return subscriptionItem;
    };
    return Syncing;
}(Subscription_1.SubscriptionMethod));
exports.Syncing = Syncing;
//# sourceMappingURL=SyncingSub.js.map