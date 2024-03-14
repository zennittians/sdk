"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractMethod = void 0;
var tslib_1 = require("tslib");
var transaction_1 = require("@stkon-js/transaction");
var network_1 = require("@stkon-js/network");
var utils_1 = require("@stkon-js/utils");
var crypto_1 = require("@stkon-js/crypto");
var encoder_1 = require("../utils/encoder");
var status_1 = require("../utils/status");
var ContractMethod = /** @class */ (function () {
    function ContractMethod(methodKey, params, abiItem, contract) {
        this.methodKey = methodKey;
        this.contract = contract;
        this.wallet = contract.wallet;
        this.params = params;
        this.abiItem = abiItem;
        this.transaction = this.createTransaction();
        this.callPayload = undefined;
        this.callResponse = undefined;
    }
    ContractMethod.prototype.send = function (params) {
        var _this = this;
        if (params && !params.gasLimit) {
            params.gasLimit = params.gas;
        }
        try {
            var gasLimit_1 = params.gasLimit; // change by estimateGas
            var signTxs_1 = function () {
                _this.transaction = _this.transaction.map(function (tx) {
                    return tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, tx), params), { gasLimit: gasLimit_1 });
                });
                var waitConfirm = params && params.waitConfirm === false ? false : true;
                var updateNonce = params && params.nonce !== undefined ? false : true;
                _this.signTransaction(updateNonce)
                    .then(function (signed) {
                    _this.sendTransaction(signed).then(function (sent) {
                        var _a = tslib_1.__read(sent, 2), txn = _a[0], id = _a[1];
                        _this.transaction = txn;
                        _this.contract.transaction = _this.transaction;
                        if (_this.transaction.isRejected()) {
                            _this.transaction.emitter.reject(id); // in this case, id is error message
                        }
                        else if (waitConfirm) {
                            _this.confirm(id).then(function () {
                                _this.transaction.emitter.resolve(_this.contract);
                            });
                        }
                        else {
                            _this.transaction.emitter.resolve(_this.contract);
                        }
                    });
                })
                    .catch(function (error) {
                    _this.transaction.emitter.reject(error);
                });
            };
            if (gasLimit_1 === undefined) {
                this.estimateGas(params).then(function (gas) {
                    gasLimit_1 = (0, utils_1.hexToBN)(gas);
                    signTxs_1();
                });
            }
            else {
                signTxs_1();
            }
            return this.transaction.emitter;
        }
        catch (error) {
            throw error;
        }
    };
    ContractMethod.prototype.call = function (options_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (options, blockNumber) {
            var shardID, keys, txPayload, sendPayload, keys_1, keys_1_1, key, result, error_1;
            var e_1, _a;
            if (blockNumber === void 0) { blockNumber = 'latest'; }
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (options && !options.gasLimit) {
                            options.gasLimit = options.gas;
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        shardID = options !== undefined && options.shardID !== undefined
                            ? options.shardID
                            : this.contract.shardID;
                        this.transaction = this.transaction.map(function (tx) {
                            return tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, tx), options), { nonce: 0 });
                        });
                        keys = Object.keys(this.transaction.txPayload);
                        txPayload = this.transaction.txPayload;
                        sendPayload = {};
                        try {
                            for (keys_1 = tslib_1.__values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                                key = keys_1_1.value;
                                // tslint:disable-next-line: no-unused-expression
                                if (txPayload[key] !== '0x') {
                                    sendPayload[key] = txPayload[key];
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        // tslint:disable-line
                        return [4 /*yield*/, this.wallet.messenger.send(network_1.RPCMethod.Call, [sendPayload, blockNumber], 
                            // tslint:disable-line
                            this.wallet.messenger.chainPrefix, shardID)];
                    case 2:
                        result = 
                        // tslint:disable-line
                        _b.sent();
                        this.callPayload = sendPayload;
                        this.callResponse = result;
                        if (result.isError()) {
                            throw result.message;
                        }
                        else if (result.isResult()) {
                            if (result.result === null) {
                                return [2 /*return*/, this.afterCall(undefined)];
                            }
                            else {
                                return [2 /*return*/, this.afterCall(result.result)];
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ContractMethod.prototype.estimateGas = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var estPayload, txPayload, keys, keys_2, keys_2_1, key, result, _a, error_2;
            var e_2, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        estPayload = {};
                        txPayload = this.transaction.txPayload;
                        keys = ['from', 'to', 'gasPrice', 'value', 'data'];
                        try {
                            for (keys_2 = tslib_1.__values(keys), keys_2_1 = keys_2.next(); !keys_2_1.done; keys_2_1 = keys_2.next()) {
                                key = keys_2_1.value;
                                if (options && options[key]) {
                                    estPayload[key] = options[key];
                                }
                                else if (txPayload[key] !== '0x') {
                                    estPayload[key] = txPayload[key];
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (keys_2_1 && !keys_2_1.done && (_b = keys_2.return)) _b.call(keys_2);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        if (this.abiItem.isOfType('constructor')) {
                            delete estPayload.to;
                        }
                        _a = network_1.getResultForData;
                        // tslint:disable-line
                        return [4 /*yield*/, this.wallet.messenger.send(network_1.RPCMethod.EstimateGas, [estPayload])];
                    case 1:
                        result = _a.apply(void 0, [
                            // tslint:disable-line
                            _c.sent()]);
                        if (result.responseType === 'error') {
                            throw result.message;
                        }
                        else if (result.responseType === 'raw') {
                            throw new Error('Get estimateGas fail');
                        }
                        else {
                            return [2 /*return*/, result];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _c.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContractMethod.prototype.encodeABI = function () {
        return (0, encoder_1.methodEncoder)(this.contract.abiCoder, this.abiItem, this.contract.data);
    };
    ContractMethod.prototype.debug = function () {
        return {
            callResponse: this.callResponse,
            callPayload: this.callPayload,
        };
    };
    ContractMethod.prototype.signTransaction = function (updateNonce) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var signed, _a, error_3;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        signed = void 0;
                        if (!this.wallet.signer) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.wallet.signTransaction(this.transaction, this.wallet.signer, undefined, updateNonce, 'rlp', 'latest')];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.wallet.signTransaction(this.transaction, updateNonce, 'rlp', 'latest')];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        signed = _a;
                        if (this.abiItem.isOfType('constructor')) {
                            this.contract.address = transaction_1.TransactionFactory.getContractAddress(signed);
                        }
                        this.contract.setStatus(status_1.ContractStatus.SIGNED);
                        return [2 /*return*/, signed];
                    case 5:
                        error_3 = _b.sent();
                        throw error_3;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ContractMethod.prototype.sendTransaction = function (signed) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, signed.sendTransaction()];
                    case 1:
                        result = _a.sent();
                        this.contract.setStatus(status_1.ContractStatus.SENT);
                        return [2 /*return*/, result];
                    case 2:
                        error_4 = _a.sent();
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContractMethod.prototype.confirm = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, error_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.transaction.confirm(id, 20, 1000, this.transaction ? this.transaction.txParams.shardID : this.contract.shardID)];
                    case 1:
                        result = _a.sent();
                        if (result.receipt && result.txStatus === transaction_1.TxStatus.CONFIRMED) {
                            if (this.abiItem.isOfType('constructor')) {
                                this.contract.setStatus(status_1.ContractStatus.DEPLOYED);
                            }
                            else {
                                this.contract.setStatus(status_1.ContractStatus.CALLED);
                            }
                        }
                        else {
                            this.contract.setStatus(status_1.ContractStatus.REJECTED);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContractMethod.prototype.createTransaction = function () {
        if (this.wallet.messenger) {
            if (this.abiItem.isOfType('constructor')) {
                // tslint:disable-next-line: no-string-literal
                this.contract.data = this.params[0]['data'] || '0x';
                this.abiItem.contractMethodParameters =
                    // tslint:disable-next-line: no-string-literal
                    this.params[0]['arguments'] || [];
            }
            else {
                this.abiItem.contractMethodParameters = this.params || [];
            }
            var defaultOptions = {
                gasLimit: new utils_1.Unit(21000000).asWei().toWei(),
                gasPrice: new utils_1.Unit(1).asGwei().toWei(),
            };
            var txObject = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, defaultOptions), this.contract.options), this.params[0]), { to: this.abiItem.isOfType('constructor')
                    ? '0x'
                    : (0, crypto_1.getAddress)(this.contract.address).checksum, data: this.encodeABI() });
            // tslint:disable-line
            var result = new transaction_1.TransactionFactory(this.wallet.messenger).newTx(txObject);
            return result;
        }
        else {
            throw new Error('Messenger is not found');
        }
    };
    ContractMethod.prototype.afterCall = function (response) {
        // length of `0x${methodSig}` is 2+4*2=10
        if (response.length % 32 === 10 && response.startsWith(this.contract.errorFuncSig)) {
            var errmsg = this.contract.abiCoder.decodeParameters([{ type: 'string' }], '0x' + response.slice(10));
            throw { revert: errmsg[0] };
        }
        if (this.abiItem.isOfType('constructor') ||
            this.abiItem.isOfType('fallback') ||
            this.abiItem.isOfType('receive')) {
            return response;
        }
        var outputs = this.abiItem.getOutputs();
        if (outputs.length === 0) {
            // if outputs is empty, we can't know the call is revert or not
            return response;
        }
        if (!response || response === '0x') {
            // if outputs isn't empty, treat it as revert
            throw { revert: response };
        }
        if (outputs.length > 1) {
            return this.contract.abiCoder.decodeParameters(outputs, response);
        }
        return this.contract.abiCoder.decodeParameter(outputs[0], response);
        // return outputs;
    };
    return ContractMethod;
}());
exports.ContractMethod = ContractMethod;
//# sourceMappingURL=method.js.map