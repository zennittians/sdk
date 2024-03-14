"use strict";
/**
 * @packageDocumentation
 * @module stkon-transaction
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionBase = void 0;
var tslib_1 = require("tslib");
var crypto_1 = require("@stkon-js/crypto");
var utils_1 = require("@stkon-js/utils");
var network_1 = require("@stkon-js/network");
var types_1 = require("./types");
var utils_2 = require("./utils");
var TransactionBase = /** @class */ (function () {
    function TransactionBase(messenger, txStatus) {
        this.blockNumbers = [];
        this.confirmations = 0;
        this.confirmationCheck = 0;
        this.cxStatus = types_1.TxStatus.INTIALIZED;
        this.cxBlockNumbers = [];
        this.cxConfirmations = 0;
        this.cxConfirmationCheck = 0;
        this.messenger = messenger;
        this.txStatus = txStatus;
        this.emitter = new network_1.Emitter();
        this.id = '0x';
        this.shardID = this.messenger.currentShard;
    }
    TransactionBase.normalizeAddress = function (address) {
        if (address === '0x') {
            return '0x';
        }
        else if (crypto_1.StkonAddress.isValidChecksum(address) ||
            crypto_1.StkonAddress.isValidBech32(address) ||
            crypto_1.StkonAddress.isValidBech32TestNet(address)) {
            return (0, crypto_1.getAddress)(address).checksum;
        }
        else {
            throw new Error("Address format is not supported");
        }
    };
    TransactionBase.prototype.setMessenger = function (messenger) {
        this.messenger = messenger;
    };
    TransactionBase.prototype.setTxStatus = function (txStatus) {
        this.txStatus = txStatus;
    };
    TransactionBase.prototype.getTxStatus = function () {
        return this.txStatus;
    };
    TransactionBase.prototype.setCxStatus = function (cxStatus) {
        this.cxStatus = cxStatus;
    };
    TransactionBase.prototype.getCxStatus = function () {
        return this.cxStatus;
    };
    // get status
    TransactionBase.prototype.isInitialized = function () {
        return this.getTxStatus() === types_1.TxStatus.INTIALIZED;
    };
    TransactionBase.prototype.isSigned = function () {
        return this.getTxStatus() === types_1.TxStatus.SIGNED;
    };
    TransactionBase.prototype.isPending = function () {
        return this.getTxStatus() === types_1.TxStatus.PENDING;
    };
    TransactionBase.prototype.isRejected = function () {
        return this.getTxStatus() === types_1.TxStatus.REJECTED;
    };
    TransactionBase.prototype.isConfirmed = function () {
        return this.getTxStatus() === types_1.TxStatus.CONFIRMED;
    };
    TransactionBase.prototype.isCxPending = function () {
        return this.getCxStatus() === types_1.TxStatus.PENDING;
    };
    TransactionBase.prototype.isCxRejected = function () {
        return this.getCxStatus() === types_1.TxStatus.REJECTED;
    };
    TransactionBase.prototype.isCxConfirmed = function () {
        return this.getCxStatus() === types_1.TxStatus.CONFIRMED;
    };
    TransactionBase.prototype.observed = function () {
        return this.emitter;
    };
    TransactionBase.prototype.trackTx = function (txHash, shardID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, currentBlock, currentBlock;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.messenger) {
                            throw new Error('Messenger not found');
                        }
                        return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetTransactionReceipt, txHash, this.messenger.chainType, typeof shardID === 'string' ? Number.parseInt(shardID, 10) : shardID)];
                    case 1:
                        res = _a.sent();
                        if (!(res.isResult() && res.result !== null)) return [3 /*break*/, 5];
                        this.receipt = res.result;
                        this.emitReceipt(this.receipt);
                        this.id = res.result.transactionHash;
                        this.confirmations += 1;
                        if (!this.receipt) return [3 /*break*/, 2];
                        if (this.receipt.status && this.receipt.status === '0x1') {
                            this.receipt.byzantium = true;
                            this.txStatus = types_1.TxStatus.CONFIRMED;
                        }
                        else if (this.receipt.status && this.receipt.status === '0x0') {
                            this.receipt.byzantium = true;
                            this.txStatus = types_1.TxStatus.REJECTED;
                        }
                        else if (this.receipt.status === undefined && this.receipt.root) {
                            this.receipt.byzantium = false;
                            this.txStatus = types_1.TxStatus.CONFIRMED;
                        }
                        return [2 /*return*/, true];
                    case 2:
                        this.txStatus = types_1.TxStatus.PENDING;
                        return [4 /*yield*/, this.getBlockNumber(shardID)];
                    case 3:
                        currentBlock = _a.sent();
                        this.blockNumbers.push('0x' + currentBlock.toString('hex'));
                        this.confirmationCheck += 1;
                        return [2 /*return*/, false];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        this.txStatus = types_1.TxStatus.PENDING;
                        return [4 /*yield*/, this.getBlockNumber(shardID)];
                    case 6:
                        currentBlock = _a.sent();
                        this.blockNumbers.push('0x' + currentBlock.toString('hex'));
                        this.confirmationCheck += 1;
                        return [2 /*return*/, false];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    TransactionBase.prototype.txConfirm = function (txHash_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (txHash, maxAttempts, interval, shardID) {
            var oldBlock, checkBlock, attempt, newBlock, nextBlock, err_1, result, error_1;
            if (maxAttempts === void 0) { maxAttempts = 20; }
            if (interval === void 0) { interval = 1000; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.messenger.provider instanceof network_1.HttpProvider)) return [3 /*break*/, 13];
                        this.txStatus = types_1.TxStatus.PENDING;
                        return [4 /*yield*/, this.getBlockNumber(shardID)];
                    case 1:
                        oldBlock = _a.sent();
                        checkBlock = oldBlock;
                        attempt = 0;
                        _a.label = 2;
                    case 2:
                        if (!(attempt < maxAttempts)) return [3 /*break*/, 12];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 8, , 9]);
                        return [4 /*yield*/, this.getBlockNumber(shardID)];
                    case 4:
                        newBlock = _a.sent();
                        nextBlock = checkBlock.add(new crypto_1.BN(attempt === 0 ? attempt : 1));
                        if (!newBlock.gte(nextBlock)) return [3 /*break*/, 6];
                        checkBlock = newBlock;
                        this.emitTrack({
                            txHash: txHash,
                            attempt: attempt,
                            currentBlock: checkBlock.toString(),
                            shardID: shardID,
                        });
                        return [4 /*yield*/, this.trackTx(txHash, shardID)];
                    case 5:
                        if (_a.sent()) {
                            this.emitConfirm(this.txStatus);
                            return [2 /*return*/, this];
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        attempt = attempt - 1 >= 0 ? attempt - 1 : 0;
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_1 = _a.sent();
                        this.txStatus = types_1.TxStatus.REJECTED;
                        this.emitConfirm(this.txStatus);
                        throw err_1;
                    case 9:
                        if (!(attempt + 1 < maxAttempts)) return [3 /*break*/, 11];
                        // await sleep(interval * attempt);
                        return [4 /*yield*/, (0, utils_2.sleep)(interval)];
                    case 10:
                        // await sleep(interval * attempt);
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        attempt += 1;
                        return [3 /*break*/, 2];
                    case 12:
                        this.txStatus = types_1.TxStatus.REJECTED;
                        this.emitConfirm(this.txStatus);
                        throw new Error("The transaction is still not confirmed after ".concat(maxAttempts, " attempts."));
                    case 13:
                        _a.trys.push([13, 18, , 19]);
                        return [4 /*yield*/, this.trackTx(txHash, shardID)];
                    case 14:
                        if (!_a.sent()) return [3 /*break*/, 15];
                        this.emitConfirm(this.txStatus);
                        return [2 /*return*/, this];
                    case 15: return [4 /*yield*/, this.socketConfirm(txHash, maxAttempts, shardID)];
                    case 16:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 17: return [3 /*break*/, 19];
                    case 18:
                        error_1 = _a.sent();
                        this.txStatus = types_1.TxStatus.REJECTED;
                        this.emitConfirm(this.txStatus);
                        throw new Error("The transaction is still not confirmed after ".concat(maxAttempts * interval, " mil seconds."));
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    TransactionBase.prototype.socketConfirm = function (txHash, maxAttempts, shardID) {
        var _this = this;
        if (maxAttempts === void 0) { maxAttempts = 20; }
        return new Promise(function (resolve, reject) {
            var newHeads = Promise.resolve(new network_1.NewHeaders(_this.messenger, typeof shardID === 'string' ? Number.parseInt(shardID, 10) : shardID));
            newHeads.then(function (p) {
                p.onData(function (data) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var blockNumber;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                blockNumber = this.messenger.chainPrefix === 'stk'
                                    ? data.params.result.Header.number
                                    : data.params.result.number;
                                this.emitTrack({
                                    txHash: txHash,
                                    attempt: this.confirmationCheck,
                                    currentBlock: (0, utils_1.hexToNumber)(blockNumber),
                                    shardID: shardID,
                                });
                                if (!!this.blockNumbers.includes(blockNumber)) return [3 /*break*/, 5];
                                return [4 /*yield*/, this.trackTx(txHash, shardID)];
                            case 1:
                                if (!_a.sent()) return [3 /*break*/, 3];
                                this.emitConfirm(this.txStatus);
                                return [4 /*yield*/, p.unsubscribe()];
                            case 2:
                                _a.sent();
                                resolve(this);
                                return [3 /*break*/, 5];
                            case 3:
                                if (!(this.confirmationCheck === maxAttempts)) return [3 /*break*/, 5];
                                this.txStatus = types_1.TxStatus.REJECTED;
                                this.emitConfirm(this.txStatus);
                                return [4 /*yield*/, p.unsubscribe()];
                            case 4:
                                _a.sent();
                                resolve(this);
                                _a.label = 5;
                            case 5: return [2 /*return*/];
                        }
                    });
                }); }).onError(function (error) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.txStatus = types_1.TxStatus.REJECTED;
                                this.emitConfirm(this.txStatus);
                                this.emitError(error);
                                return [4 /*yield*/, p.unsubscribe()];
                            case 1:
                                _a.sent();
                                reject(error);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    };
    TransactionBase.prototype.emitTransactionHash = function (transactionHash) {
        this.emitter.emit(utils_2.TransactionEvents.transactionHash, transactionHash);
    };
    TransactionBase.prototype.emitReceipt = function (receipt) {
        this.emitter.emit(utils_2.TransactionEvents.receipt, receipt);
    };
    TransactionBase.prototype.emitError = function (error) {
        this.emitter.emit(utils_2.TransactionEvents.error, error);
    };
    TransactionBase.prototype.emitConfirm = function (data) {
        this.emitter.emit(utils_2.TransactionEvents.confirmation, data);
    };
    TransactionBase.prototype.emitTrack = function (data) {
        this.emitter.emit(utils_2.TransactionEvents.track, data);
    };
    TransactionBase.prototype.emitCxReceipt = function (receipt) {
        this.emitter.emit(utils_2.TransactionEvents.cxReceipt, receipt);
    };
    TransactionBase.prototype.emitCxConfirm = function (data) {
        this.emitter.emit(utils_2.TransactionEvents.cxConfirmation, data);
    };
    TransactionBase.prototype.emitCxTrack = function (data) {
        this.emitter.emit(utils_2.TransactionEvents.cxTrack, data);
    };
    TransactionBase.prototype.getBlockNumber = function (shardID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var currentBlock, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.BlockNumber, [], this.messenger.chainPrefix, typeof shardID === 'string' ? Number.parseInt(shardID, 10) : shardID)];
                    case 1:
                        currentBlock = _a.sent();
                        if (currentBlock.isError()) {
                            throw currentBlock.message;
                        }
                        return [2 /*return*/, new crypto_1.BN(currentBlock.result.replace('0x', ''), 'hex')];
                    case 2:
                        error_2 = _a.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TransactionBase.prototype.getBlockByNumber = function (blockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var block, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetBlockByNumber, [blockNumber, true], this.messenger.chainPrefix, typeof this.shardID === 'string' ? Number.parseInt(this.shardID, 10) : this.shardID)];
                    case 1:
                        block = _a.sent();
                        if (block.isError()) {
                            throw block.message;
                        }
                        return [2 /*return*/, block.result];
                    case 2:
                        error_3 = _a.sent();
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TransactionBase.prototype.cxConfirm = function (txHash_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (txHash, maxAttempts, interval, toShardID) {
            var oldBlock, checkBlock, attempt, newBlock, nextBlock, err_2, result, error_4;
            if (maxAttempts === void 0) { maxAttempts = 20; }
            if (interval === void 0) { interval = 1000; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.messenger.provider instanceof network_1.HttpProvider)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.getBlockNumber(toShardID)];
                    case 1:
                        oldBlock = _a.sent();
                        checkBlock = oldBlock;
                        attempt = 0;
                        _a.label = 2;
                    case 2:
                        if (!(attempt < maxAttempts)) return [3 /*break*/, 12];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 8, , 9]);
                        return [4 /*yield*/, this.getBlockNumber(toShardID)];
                    case 4:
                        newBlock = _a.sent();
                        nextBlock = checkBlock.add(new crypto_1.BN(attempt === 0 ? attempt : 1));
                        if (!newBlock.gte(nextBlock)) return [3 /*break*/, 6];
                        checkBlock = newBlock;
                        this.emitCxTrack({
                            txHash: txHash,
                            attempt: attempt,
                            currentBlock: checkBlock.toString(),
                            toShardID: toShardID,
                        });
                        return [4 /*yield*/, this.trackCx(txHash, toShardID)];
                    case 5:
                        if (_a.sent()) {
                            this.emitCxConfirm(this.cxStatus);
                            return [2 /*return*/, this];
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        attempt = attempt - 1 >= 0 ? attempt - 1 : 0;
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_2 = _a.sent();
                        this.cxStatus = types_1.TxStatus.REJECTED;
                        this.emitCxConfirm(this.cxStatus);
                        throw err_2;
                    case 9:
                        if (!(attempt + 1 < maxAttempts)) return [3 /*break*/, 11];
                        return [4 /*yield*/, (0, utils_2.sleep)(interval)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        attempt += 1;
                        return [3 /*break*/, 2];
                    case 12:
                        this.cxStatus = types_1.TxStatus.REJECTED;
                        this.emitCxConfirm(this.cxStatus);
                        throw new Error("The transaction is still not confirmed after ".concat(maxAttempts, " attempts."));
                    case 13:
                        _a.trys.push([13, 18, , 19]);
                        return [4 /*yield*/, this.trackCx(txHash, toShardID)];
                    case 14:
                        if (!_a.sent()) return [3 /*break*/, 15];
                        this.emitCxConfirm(this.cxStatus);
                        return [2 /*return*/, this];
                    case 15: return [4 /*yield*/, this.socketCxConfirm(txHash, maxAttempts, toShardID)];
                    case 16:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 17: return [3 /*break*/, 19];
                    case 18:
                        error_4 = _a.sent();
                        this.cxStatus = types_1.TxStatus.REJECTED;
                        this.emitCxConfirm(this.cxStatus);
                        throw new Error("The transaction is still not confirmed after ".concat(maxAttempts * interval, " mil seconds."));
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    TransactionBase.prototype.trackCx = function (txHash, toShardID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, currentBlock;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.messenger) {
                            throw new Error('Messenger not found');
                        }
                        return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetCXReceiptByHash, txHash, this.messenger.chainPrefix, typeof toShardID === 'string' ? Number.parseInt(toShardID, 10) : toShardID)];
                    case 1:
                        res = _a.sent();
                        if (!(res.isResult() && res.result !== null)) return [3 /*break*/, 2];
                        this.emitCxReceipt(res.result);
                        this.cxStatus = types_1.TxStatus.CONFIRMED;
                        return [2 /*return*/, true];
                    case 2: return [4 /*yield*/, this.getBlockNumber(toShardID)];
                    case 3:
                        currentBlock = _a.sent();
                        this.cxBlockNumbers.push('0x' + currentBlock.toString('hex'));
                        this.cxConfirmationCheck += 1;
                        this.cxStatus = types_1.TxStatus.PENDING;
                        return [2 /*return*/, false];
                }
            });
        });
    };
    TransactionBase.prototype.socketCxConfirm = function (txHash, maxAttempts, toShardID) {
        var _this = this;
        if (maxAttempts === void 0) { maxAttempts = 20; }
        return new Promise(function (resolve, reject) {
            var newHeads = Promise.resolve(new network_1.NewHeaders(_this.messenger, typeof toShardID === 'string' ? Number.parseInt(toShardID, 10) : toShardID));
            newHeads.then(function (p) {
                p.onData(function (data) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var blockNumber;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                blockNumber = this.messenger.chainPrefix === 'stk'
                                    ? data.params.result.Header.number
                                    : data.params.result.number;
                                this.emitCxTrack({
                                    txHash: txHash,
                                    attempt: this.cxConfirmationCheck,
                                    currentBlock: (0, utils_1.hexToNumber)(blockNumber),
                                    toShardID: toShardID,
                                });
                                if (!!this.blockNumbers.includes(blockNumber)) return [3 /*break*/, 5];
                                return [4 /*yield*/, this.trackCx(txHash, toShardID)];
                            case 1:
                                if (!_a.sent()) return [3 /*break*/, 3];
                                this.emitCxConfirm(this.cxStatus);
                                return [4 /*yield*/, p.unsubscribe()];
                            case 2:
                                _a.sent();
                                resolve(this);
                                return [3 /*break*/, 5];
                            case 3:
                                if (!(this.cxConfirmationCheck === maxAttempts)) return [3 /*break*/, 5];
                                this.cxStatus = types_1.TxStatus.REJECTED;
                                this.emitCxConfirm(this.cxStatus);
                                return [4 /*yield*/, p.unsubscribe()];
                            case 4:
                                _a.sent();
                                resolve(this);
                                _a.label = 5;
                            case 5: return [2 /*return*/];
                        }
                    });
                }); }).onError(function (error) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.cxStatus = types_1.TxStatus.REJECTED;
                                this.emitCxConfirm(this.cxStatus);
                                this.emitError(error);
                                return [4 /*yield*/, p.unsubscribe()];
                            case 1:
                                _a.sent();
                                reject(error);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    };
    return TransactionBase;
}());
exports.TransactionBase = TransactionBase;
//# sourceMappingURL=transactionBase.js.map