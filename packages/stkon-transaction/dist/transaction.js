"use strict";
/**
 * @packageDocumentation
 * @module stkon-transaction
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
var tslib_1 = require("tslib");
var crypto_1 = require("@stkon-js/crypto");
var utils_1 = require("@stkon-js/utils");
var network_1 = require("@stkon-js/network");
var types_1 = require("./types");
var utils_2 = require("./utils");
var transactionBase_1 = require("./transactionBase");
var Transaction = /** @class */ (function (_super) {
    tslib_1.__extends(Transaction, _super);
    /**
     *
     * @Params
     * ```javascript
     * id:               string;
      from:             string;
      to:               string;
      nonce:            number | string;
      gasLimit:         number | string | BN;
      gasPrice:         number | string | BN;
      shardID:          number | string;
      toShardID:        number | string;
      data:             string;
      value:            number | string | BN;
      chainId:          number;
      rawTransaction:   string;
      unsignedRawTransaction: string;
      signature:        Signature;
      receipt?:         TransasctionReceipt;
     * ```
     */
    function Transaction(params, messenger, txStatus) {
        if (messenger === void 0) { messenger = utils_2.defaultMessenger; }
        if (txStatus === void 0) { txStatus = types_1.TxStatus.INTIALIZED; }
        var _this = _super.call(this, messenger, txStatus) || this;
        // intialize transaction
        _this.id = params && params.id ? params.id : '0x';
        _this.from = params && params.from ? params.from : '0x';
        _this.nonce = params && params.nonce ? params.nonce : 0;
        _this.gasPrice =
            params && params.gasPrice
                ? new utils_1.Unit(params.gasPrice).asWei().toWei()
                : new utils_1.Unit(0).asWei().toWei();
        _this.gasLimit =
            params && params.gasLimit
                ? new utils_1.Unit(params.gasLimit).asWei().toWei()
                : new utils_1.Unit(0).asWei().toWei();
        _this.shardID =
            params && params.shardID !== undefined ? params.shardID : _this.messenger.currentShard;
        _this.toShardID =
            params && params.toShardID !== undefined ? params.toShardID : _this.messenger.currentShard;
        _this.to = params && params.to ? Transaction.normalizeAddress(params.to) : '0x';
        _this.value =
            params && params.value ? new utils_1.Unit(params.value).asWei().toWei() : new utils_1.Unit(0).asWei().toWei();
        _this.data = params && params.data ? params.data : '0x';
        // chainid should change with different network settings
        _this.chainId = params && params.chainId ? params.chainId : _this.messenger.chainId;
        _this.rawTransaction = params && params.rawTransaction ? params.rawTransaction : '0x';
        _this.unsignedRawTransaction =
            params && params.unsignedRawTransaction ? params.unsignedRawTransaction : '0x';
        _this.signature =
            params && params.signature
                ? params.signature
                : {
                    r: '',
                    s: '',
                    recoveryParam: 0,
                    v: 0,
                };
        _this.receipt = params && params.receipt ? params.receipt : undefined;
        _this.cxStatus = _this.isCrossShard() ? types_1.TxStatus.INTIALIZED : types_1.TxStatus.NONE;
        return _this;
    }
    /**
     *
     * @example
     * ```javascript
     * const unsigned = txn.getRLPUnsigned(txn);
     * console.log(unsigned);
     * ```
     */
    Transaction.prototype.getRLPUnsigned = function () {
        var _this = this;
        var raw = [];
        // temp setting to be compatible with eth
        var fields = this.messenger.chainType === utils_1.ChainType.Stkon ? utils_2.transactionFields : utils_2.transactionFieldsETH;
        fields.forEach(function (field) {
            var value = _this.txParams[field.name] || [];
            value = (0, crypto_1.arrayify)((0, crypto_1.hexlify)(field.transform === 'hex' ? (0, utils_1.add0xToString)(value.toString(16)) : value));
            // Fixed-width field
            if (field.fix === true && field.length && value.length !== field.length && value.length > 0) {
                throw new Error("invalid length for ".concat(field.name));
            }
            // Variable-width (with a maximum)
            if (field.fix === false && field.length) {
                value = (0, crypto_1.stripZeros)(value);
                if (value.length > field.length) {
                    throw new Error("invalid length for ".concat(field.name));
                }
            }
            raw.push((0, crypto_1.hexlify)(value));
        });
        if (this.txParams.chainId != null && this.txParams.chainId !== 0) {
            raw.push((0, crypto_1.hexlify)(this.txParams.chainId));
            raw.push('0x');
            raw.push('0x');
        }
        return [(0, crypto_1.encode)(raw), raw];
    };
    Transaction.prototype.getRLPSigned = function (raw, signature) {
        // temp setting to be compatible with eth
        var rawLength = this.messenger.chainType === utils_1.ChainType.Stkon ? 11 : 9;
        var sig = (0, crypto_1.splitSignature)(signature);
        var v = 27 + (sig.recoveryParam || 0);
        if (raw.length === rawLength) {
            raw.pop();
            raw.pop();
            raw.pop();
            v += this.chainId * 2 + 8;
        }
        raw.push((0, crypto_1.hexlify)(v));
        raw.push((0, crypto_1.stripZeros)((0, crypto_1.arrayify)(sig.r) || []));
        raw.push((0, crypto_1.stripZeros)((0, crypto_1.arrayify)(sig.s) || []));
        return (0, crypto_1.encode)(raw);
    };
    /**
     * @example
     * ```javascript
     * console.log(txn.getRawTransaction());
     * ```
     */
    Transaction.prototype.getRawTransaction = function () {
        return this.rawTransaction;
    };
    /** @hidden */
    Transaction.prototype.recover = function (rawTransaction) {
        // temp setting to be compatible with eth
        var recovered = this.messenger.chainType === utils_1.ChainType.Stkon
            ? (0, utils_2.recover)(rawTransaction)
            : (0, utils_2.recoverETH)(rawTransaction);
        this.setParams(recovered);
        return this;
    };
    Object.defineProperty(Transaction.prototype, "txPayload", {
        /**
         * get the payload of transaction
         *
         * @example
         * ```
         * const payload = txn.txPayload;
         * console.log(payload);
         * ```
         */
        get: function () {
            return {
                from: this.txParams.from || '0x',
                to: this.txParams.to || '0x',
                shardID: this.txParams.shardID ? (0, utils_1.numberToHex)(this.shardID) : '0x',
                toShardID: this.txParams.toShardID ? (0, utils_1.numberToHex)(this.toShardID) : '0x',
                gas: this.txParams.gasLimit ? (0, utils_1.numberToHex)(this.txParams.gasLimit) : '0x',
                gasPrice: this.txParams.gasPrice ? (0, utils_1.numberToHex)(this.txParams.gasPrice) : '0x',
                value: this.txParams.value ? (0, utils_1.numberToHex)(this.txParams.value) : '0x',
                data: this.txParams.data || '0x',
                nonce: this.txParams.nonce ? (0, utils_1.numberToHex)(this.nonce) : '0x',
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "txParams", {
        /**
         * get transaction params
         *
         * @example
         * ```
         * const txParams = txn.txParams;
         * console.log(txParams)
         * ```
         */
        get: function () {
            return {
                id: this.id || '0x',
                from: this.from || '',
                nonce: this.nonce || 0,
                gasPrice: this.gasPrice || new utils_1.Unit(0).asWei().toWei(),
                gasLimit: this.gasLimit || new utils_1.Unit(0).asWei().toWei(),
                shardID: this.shardID !== undefined ? this.shardID : this.messenger.currentShard,
                toShardID: this.toShardID !== undefined ? this.toShardID : this.messenger.currentShard,
                to: Transaction.normalizeAddress(this.to) || '0x',
                value: this.value || new utils_1.Unit(0).asWei().toWei(),
                data: this.data || '0x',
                chainId: this.chainId || 0,
                rawTransaction: this.rawTransaction || '0x',
                unsignedRawTransaction: this.unsignedRawTransaction || '0x',
                signature: this.signature || '0x',
            };
        },
        enumerable: false,
        configurable: true
    });
    /**
     * set the params to the txn
     *
     * @example
     * ```
     * txn.setParams({
     *   to: 'one1ew56rqrucu6p6n598fmjmnfh8dd4xpg6atne9c',
     *   value: '1200',
     *   gasLimit: '230000',
     *   shardID: 1,
     *   toShardID: 0,
     *   gasPrice: new stk.utils.Unit('101').asGwei().toWei(),
     *   signature: {
     *     r: '0xd693b532a80fed6392b428604171fb32fdbf953728a3a7ecc7d4062b1652c042',
     *     s: '0x24e9c602ac800b983b035700a14b23f78a253ab762deab5dc27e3555a750b354',
     *     v: 0
     *   },
     * });
     * console.log(txn);
     * ```
     */
    Transaction.prototype.setParams = function (params) {
        this.id = params && params.id ? params.id : '0x';
        this.from = params && params.from ? params.from : '0x';
        this.nonce = params && params.nonce ? params.nonce : 0;
        this.gasPrice =
            params && params.gasPrice
                ? new utils_1.Unit(params.gasPrice).asWei().toWei()
                : new utils_1.Unit(0).asWei().toWei();
        this.gasLimit =
            params && params.gasLimit
                ? new utils_1.Unit(params.gasLimit).asWei().toWei()
                : new utils_1.Unit(0).asWei().toWei();
        this.shardID =
            params && params.shardID !== undefined ? params.shardID : this.messenger.currentShard;
        this.toShardID =
            params && params.toShardID !== undefined ? params.toShardID : this.messenger.currentShard;
        this.to = params && params.to ? Transaction.normalizeAddress(params.to) : '0x';
        this.value =
            params && params.value ? new utils_1.Unit(params.value).asWei().toWei() : new utils_1.Unit(0).asWei().toWei();
        this.data = params && params.data ? params.data : '0x';
        this.chainId = params && params.chainId ? params.chainId : 0;
        this.rawTransaction = params && params.rawTransaction ? params.rawTransaction : '0x';
        this.unsignedRawTransaction =
            params && params.unsignedRawTransaction ? params.unsignedRawTransaction : '0x';
        this.signature =
            params && params.signature
                ? params.signature
                : {
                    r: '',
                    s: '',
                    recoveryParam: 0,
                    v: 0,
                };
        if (this.rawTransaction !== '0x') {
            this.setTxStatus(types_1.TxStatus.SIGNED);
        }
        else {
            this.setTxStatus(types_1.TxStatus.INTIALIZED);
        }
    };
    /** @hidden */
    Transaction.prototype.map = function (fn) {
        var newParams = fn(this.txParams);
        this.setParams(newParams);
        return this;
    };
    /**
     * Check whether the transaction is cross shard
     *
     * @example
     * ```javascript
     * console.log(txn.isCrossShard());
     * ```
     */
    Transaction.prototype.isCrossShard = function () {
        return new crypto_1.BN(this.txParams.shardID).toString() !== new crypto_1.BN(this.txParams.toShardID).toString();
    };
    /**
     *
     * @example
     * ```
     * txn.sendTransaction().then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Transaction.prototype.sendTransaction = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.rawTransaction === 'tx' || this.rawTransaction === undefined) {
                            throw new Error('Transaction not signed');
                        }
                        if (!this.messenger) {
                            throw new Error('Messenger not found');
                        }
                        return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.SendRawTransaction, this.rawTransaction, this.messenger.chainType, typeof this.shardID === 'string' ? Number.parseInt(this.shardID, 10) : this.shardID)];
                    case 1:
                        res = _a.sent();
                        // temporarilly hard coded
                        if (res.isResult()) {
                            this.id = res.result;
                            this.emitTransactionHash(this.id);
                            this.setTxStatus(types_1.TxStatus.PENDING);
                            // await this.confirm(this.id, 20, 1000);
                            return [2 /*return*/, [this, res.result]];
                        }
                        else if (res.isError()) {
                            this.emitConfirm("transaction failed:".concat(res.error.message));
                            this.setTxStatus(types_1.TxStatus.REJECTED);
                            return [2 /*return*/, [this, "transaction failed:".concat(res.error.message)]];
                        }
                        else {
                            this.emitError('transaction failed');
                            throw new Error('transaction failed');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Transaction.prototype.confirm = function (txHash_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (txHash, maxAttempts, interval, shardID, toShardID) {
            var txConfirmed, cxConfirmed;
            if (maxAttempts === void 0) { maxAttempts = 20; }
            if (interval === void 0) { interval = 1000; }
            if (shardID === void 0) { shardID = this.txParams.shardID; }
            if (toShardID === void 0) { toShardID = this.txParams.toShardID; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.txConfirm(txHash, maxAttempts, interval, shardID)];
                    case 1:
                        txConfirmed = _a.sent();
                        if (!this.isCrossShard()) {
                            return [2 /*return*/, txConfirmed];
                        }
                        if (!txConfirmed.isConfirmed()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.cxConfirm(txHash, maxAttempts, interval, toShardID)];
                    case 2:
                        cxConfirmed = _a.sent();
                        return [2 /*return*/, cxConfirmed];
                    case 3: return [2 /*return*/, txConfirmed];
                }
            });
        });
    };
    return Transaction;
}(transactionBase_1.TransactionBase));
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map