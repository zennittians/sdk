"use strict";
/**
 * @packageDocumentation
 * @module stkon-transaction
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShardingTransaction = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("@stkon-js/utils");
var transaction_1 = require("./transaction");
var types_1 = require("./types");
var utils_2 = require("./utils");
var ShardingTransaction = /** @class */ (function (_super) {
    tslib_1.__extends(ShardingTransaction, _super);
    function ShardingTransaction(params, messenger, txStatus) {
        if (messenger === void 0) { messenger = utils_2.defaultMessenger; }
        if (txStatus === void 0) { txStatus = types_1.TxStatus.INTIALIZED; }
        var fromAddress = params.from;
        var toAddress = params.to;
        var fromExtraction = fromAddress !== undefined ? fromAddress.split(utils_1.AddressSuffix) : ['0x', undefined];
        var toExtraction = toAddress !== undefined ? toAddress.split(utils_1.AddressSuffix) : ['0x', undefined];
        var from = fromExtraction[0];
        var shardID = fromExtraction[1] !== undefined
            ? Number.parseInt(fromExtraction[1], 10)
            : params.shardID !== undefined
                ? params.shardID
                : 0;
        var to = toExtraction[0];
        var toShardID = toExtraction[1] !== undefined
            ? Number.parseInt(toExtraction[1], 10)
            : params.toShardID !== undefined
                ? params.toShardID
                : 0;
        var reParams = tslib_1.__assign(tslib_1.__assign({}, params), { from: from, to: to, shardID: shardID, toShardID: toShardID });
        return _super.call(this, reParams, messenger, txStatus) || this;
    }
    return ShardingTransaction;
}(transaction_1.Transaction));
exports.ShardingTransaction = ShardingTransaction;
//# sourceMappingURL=shardingTransaction.js.map