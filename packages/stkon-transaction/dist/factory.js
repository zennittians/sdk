"use strict";
/**
 * ## hhahaha
 *
 * @packageDocumentation
 * @module stkon-transaction
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionFactory = void 0;
var crypto_1 = require("@stkon-js/crypto");
var transaction_1 = require("./transaction");
var shardingTransaction_1 = require("./shardingTransaction");
var types_1 = require("./types");
var TransactionFactory = /** @class */ (function () {
    function TransactionFactory(messenger) {
        this.messenger = messenger;
    }
    TransactionFactory.getContractAddress = function (tx) {
        var _a = tx.txParams, from = _a.from, nonce = _a.nonce;
        return (0, crypto_1.getAddress)((0, crypto_1.getContractAddress)((0, crypto_1.getAddress)(from).checksum, Number.parseInt("".concat(nonce), 10))).checksum;
    };
    TransactionFactory.prototype.setMessenger = function (messenger) {
        this.messenger = messenger;
    };
    /**
     * Create a new Transaction
     * @params
     * ```
     * // to: Address of the receiver
     * // value: value transferred in wei
     * // gasLimit: the maximum gas would pay, can use string
     * // shardID: send token from shardID
     * // toShardId: send token to shardID
     * // gasPrice: you can use Unit class, and use Gwei, then remember to use toWei(), which will be transformed to BN
     * ```
     *
     * @example
     * ```javascript
     * const txn = stk.transactions.newTx({
     *   to: 'one166axnkjmghkf3df7xfvd0hn4dft8kemrza4cd2',
     *   value: '10000',
     *   gasLimit: '210000',
     *   shardID: 0,
     *   toShardID: 0,
     *   gasPrice: new stk.utils.Unit('100').asGwei().toWei(),
     * });
     * ```
     */
    TransactionFactory.prototype.newTx = function (txParams, sharding) {
        if (sharding === void 0) { sharding = false; }
        if (!sharding) {
            return new transaction_1.Transaction(txParams, this.messenger, types_1.TxStatus.INTIALIZED);
        }
        return new shardingTransaction_1.ShardingTransaction(txParams, this.messenger, types_1.TxStatus.INTIALIZED);
    };
    /**
     * clone the transaction
     *
     * @param transaction
     *
     * @example
     * ```javascript
     * const cloneTxn = stk.transactions.clone(txn);
     * console.log(cloneTxn)
     * ```
     */
    TransactionFactory.prototype.clone = function (transaction) {
        return new transaction_1.Transaction(transaction.txParams, this.messenger, types_1.TxStatus.INTIALIZED);
    };
    /**
     *
     * @example
     * ```javascript
     * txHash = '0xf8698085174876e8008252088080949d72989b68777a1f3ffd6f1db079f1928373ee52830186a08027a0ab8229ff5d5240948098f26372eaed9ab2e9be23e8594b08e358ca56a47f8ae9a0084e5c4d1fec496af444423d8a714f65c079260ff01a1be1de7005dd424adf44'
     *
     * const recoverTx = stk.transactions.recover(txHash);
     * console.log(recoverTx);
     * ```
     */
    TransactionFactory.prototype.recover = function (txHash) {
        var newTxn = new transaction_1.Transaction({}, this.messenger, types_1.TxStatus.INTIALIZED);
        newTxn.recover(txHash);
        return newTxn;
    };
    return TransactionFactory;
}());
exports.TransactionFactory = TransactionFactory;
//# sourceMappingURL=factory.js.map