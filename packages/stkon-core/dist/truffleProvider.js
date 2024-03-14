"use strict";
/**
 * @packageDocumentation
 * @module stkon-core
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TruffleProvider = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("@stkon-js/utils");
var account_1 = require("@stkon-js/account");
var crypto_1 = require("@stkon-js/crypto");
var packageInfo = { version: '1.0.0' };
var TruffleProvider = /** @class */ (function (_super) {
    tslib_1.__extends(TruffleProvider, _super);
    function TruffleProvider(provider, hdOptions, chainOptions, transactionOptions) {
        if (provider === void 0) { provider = 'http://localhost:9500'; }
        if (hdOptions === void 0) { hdOptions = {
            menmonic: undefined,
            index: 0,
            addressCount: 1,
        }; }
        if (chainOptions === void 0) { chainOptions = {
            shardID: 0,
            chainType: utils_1.ChainType.Stkon,
            chainId: utils_1.ChainID.StkLocal,
        }; }
        if (transactionOptions === void 0) { transactionOptions = {
            gasLimit: '10000000',
            gasPrice: '20000000000',
        }; }
        var _this = _super.call(this, provider, hdOptions.menmonic, hdOptions.index, hdOptions.addressCount, chainOptions.shardID, chainOptions.chainType, chainOptions.chainId, transactionOptions.gasLimit, transactionOptions.gasPrice) || this;
        _this.resolveResult = function (response) {
            var final = response.getRaw || response;
            delete final.req;
            delete final.responseType;
            return final;
        };
        _this.resolveCallback = function (err, res, callback) {
            try {
                if (err) {
                    callback(err);
                }
                var response = _this.resolveResult(res);
                callback(null, response);
            }
            catch (error) {
                throw error;
            }
        };
        return _this;
    }
    TruffleProvider.prototype.send = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, newArgs, id, params, newMethod, callback, _b, accounts, txObj, rawTxn, result, result, result, result;
            var _this = this;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.resolveArgs.apply(this, tslib_1.__spreadArray([], tslib_1.__read(args), false)), newArgs = _a.newArgs, id = _a.id, params = _a.params, newMethod = _a.newMethod, callback = _a.callback;
                        _b = newMethod;
                        switch (_b) {
                            case 'stk_accounts': return [3 /*break*/, 1];
                            case 'stk_sendTransaction': return [3 /*break*/, 2];
                            case 'stk_getTransactionReceipt': return [3 /*break*/, 5];
                            case 'net_version': return [3 /*break*/, 7];
                            case 'web3_clientVersion': return [3 /*break*/, 8];
                            case 'stk_getBlockByNumber': return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 11];
                    case 1:
                        {
                            accounts = this.getAccounts();
                            callback(null, {
                                result: accounts,
                                id: id,
                                jsonrpc: '2.0',
                            });
                            return [2 /*return*/, {
                                    result: accounts,
                                    id: id,
                                    jsonrpc: '2.0',
                                }];
                            // break;
                        }
                        _c.label = 2;
                    case 2:
                        txObj = params[0];
                        return [4 /*yield*/, this.signTransaction(txObj)];
                    case 3:
                        rawTxn = _c.sent();
                        return [4 /*yield*/, this.provider.send({
                                id: id,
                                method: 'stk_sendRawTransaction',
                                params: [rawTxn],
                                jsonrpc: '2.0',
                            }, function (err, res) { return _this.resolveCallback(err, res, callback); })];
                    case 4:
                        result = _c.sent();
                        return [2 /*return*/, this.resolveResult(result)];
                    case 5: return [4 /*yield*/, this.provider.send({
                            id: id,
                            method: 'stk_getTransactionReceipt',
                            params: [params[0]],
                            jsonrpc: '2.0',
                        }, function (err, res) {
                            try {
                                if (err) {
                                    callback(err);
                                }
                                var response = _this.resolveResult(res);
                                if (response.result !== null) {
                                    response.result.status = '0x1';
                                }
                                callback(null, response);
                            }
                            catch (error) {
                                throw error;
                            }
                        })];
                    case 6:
                        result = _c.sent();
                        return [2 /*return*/, this.resolveResult(result)];
                    case 7:
                        {
                            callback(null, {
                                result: String(this.messenger.chainId),
                                id: id,
                                jsonrpc: '2.0',
                            });
                            return [2 /*return*/, {
                                    result: String(this.messenger.chainId),
                                    id: id,
                                    jsonrpc: '2.0',
                                }];
                        }
                        _c.label = 8;
                    case 8:
                        {
                            callback(null, {
                                result: "Stkon/".concat(packageInfo.version, "/@stkon-js"),
                                id: id,
                                jsonrpc: '2.0',
                            });
                            return [2 /*return*/, {
                                    result: "Stkon/".concat(packageInfo.version, "/@stkon-js"),
                                    id: id,
                                    jsonrpc: '2.0',
                                }];
                        }
                        _c.label = 9;
                    case 9: return [4 /*yield*/, this.provider.send(newArgs, function (err, res) {
                            try {
                                if (err) {
                                    callback(err);
                                }
                                var response = _this.resolveResult(res);
                                if (response.error) {
                                    callback(response.error);
                                    return;
                                }
                                if (new utils_1.Unit(response.result.gasLimit)
                                    .asWei()
                                    .toWei()
                                    .gt(new utils_1.Unit(_this.gasLimit).asWei().toWei())) {
                                    response.result.gasLimit = "0x".concat(new utils_1.Unit(_this.gasLimit)
                                        .asWei()
                                        .toWei()
                                        .toString('hex'));
                                }
                                if ((0, utils_1.isBech32Address)(response.result.miner)) {
                                    response.result.miner = (0, crypto_1.fromBech32)(response.result.miner, crypto_1.HRP);
                                }
                                callback(null, response);
                            }
                            catch (error) {
                                throw error;
                            }
                        })];
                    case 10:
                        result = _c.sent();
                        return [2 /*return*/, this.resolveResult(result)];
                    case 11: return [4 /*yield*/, this.provider.send(newArgs, function (err, res) { return _this.resolveCallback(err, res, callback); })];
                    case 12:
                        result = _c.sent();
                        return [2 /*return*/, this.resolveResult(result)];
                }
            });
        });
    };
    TruffleProvider.prototype.sendAsync = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.send.apply(this, tslib_1.__spreadArray([], tslib_1.__read(args), false));
    };
    TruffleProvider.prototype.resolveArgs = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var method = args[0].method;
        var params = args[0].params;
        var newMethod = method;
        if (method.startsWith('eth')) {
            newMethod = method.replace('eth', 'stk');
        }
        args[0].method = newMethod;
        var id = args[0].id;
        return {
            newArgs: args[0],
            id: id,
            params: params,
            newMethod: newMethod,
            callback: args[1],
        };
    };
    return TruffleProvider;
}(account_1.HDNode));
exports.TruffleProvider = TruffleProvider;
//# sourceMappingURL=truffleProvider.js.map