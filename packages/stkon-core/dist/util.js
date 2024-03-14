"use strict";
/**
 * @packageDocumentation
 * @module stkon-core
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWeb3 = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("@stkon-js/utils");
var stkon_1 = require("./stkon");
// tslint:disable-next-line: variable-name
function createWeb3(_web3) {
    var _this = this;
    var url = _web3.currentProvider.url;
    var stkon = new stkon_1.Stkon(url, {
        chainId: utils_1.defaultConfig.Default.Chain_ID,
        chainType: utils_1.defaultConfig.Default.Chain_Type,
        chainUrl: utils_1.defaultConfig.Default.Chain_URL,
    });
    _web3.setProvider(stkon.messenger.provider);
    _web3.messenger = stkon.messenger;
    _web3.eth.getRpcResult = stkon.blockchain.getRpcResult;
    // map blockchain to eth
    var blockchain = stkon.blockchain;
    _web3.eth.getBlockNumber = function () { return blockchain.getBlockByNumber; };
    _web3.eth.getBalance = function (address, blockNumber) {
        return blockchain.getBalance({ address: address, blockNumber: blockNumber });
    };
    _web3.eth.getBlockByHash = function (blockHash, returnObject) {
        return blockchain.getBlockByHash({ blockHash: blockHash, returnObject: returnObject });
    };
    _web3.eth.getBlockByNumber = function (blockNumber, returnObject) {
        return blockchain.getBlockByNumber({ blockNumber: blockNumber, returnObject: returnObject });
    };
    _web3.eth.getBlockTransactionCountByHash = function (blockHash) {
        return blockchain.getBlockTransactionCountByHash({ blockHash: blockHash });
    };
    _web3.eth.getBlockTransactionCountByNumber = function (blockNumber) {
        return blockchain.getBlockTransactionCountByNumber({ blockNumber: blockNumber });
    };
    _web3.eth.getTransactionByBlockHashAndIndex = function (blockHash, index) {
        return blockchain.getTransactionByBlockHashAndIndex({ blockHash: blockHash, index: index });
    };
    _web3.eth.getTransactionByBlockNumberAndIndex = function (blockNumber, index) {
        return blockchain.getTransactionByBlockNumberAndIndex({ blockNumber: blockNumber, index: index });
    };
    _web3.eth.getTransactionByHash = function (txnHash) {
        return blockchain.getTransactionByHash({ txnHash: txnHash });
    };
    _web3.eth.getTransactionReceipt = function (txnHash) {
        return blockchain.getTransactionReceipt({ txnHash: txnHash });
    };
    _web3.eth.getCode = function (address, blockNumber) {
        return blockchain.getCode({ address: address, blockNumber: blockNumber });
    };
    _web3.eth.net_peerCount = function () { return blockchain.net_peerCount(); };
    _web3.eth.net_version = function () { return blockchain.net_version(); };
    _web3.eth.getProtocolVersion = function () { return blockchain.getProtocolVersion(); };
    _web3.eth.getStorageAt = function (address, position, blockNumber) {
        return blockchain.getStorageAt({ address: address, position: position, blockNumber: blockNumber });
    };
    _web3.eth.getTransactionCount = function (address, blockNumber) {
        return blockchain.getTransactionCount({ address: address, blockNumber: blockNumber });
    };
    _web3.eth.estimateGas = function (to, data) { return blockchain.estimateGas({ to: to, data: data }); };
    _web3.eth.gasPrice = function () { return blockchain.gasPrice(); };
    _web3.eth.call = function (payload, blockNumber) {
        return blockchain.call({ payload: payload, blockNumber: blockNumber });
    };
    _web3.eth.newPendingTransactions = function () { return blockchain.newPendingTransactions(); };
    _web3.eth.newBlockHeaders = function () { return blockchain.newBlockHeaders(); };
    _web3.eth.syncing = function () { return blockchain.syncing(); };
    _web3.eth.logs = function (options) { return blockchain.logs(options); };
    // map subscribe to _web3
    _web3.eth.subscribe = stkon.messenger.subscribe;
    // map accounts to _web3
    _web3.accounts = stkon.wallet.accounts;
    _web3.eth.accounts.create = stkon.wallet.createAccount;
    _web3.eth.accounts.privateKeyToAccount = stkon.wallet.addByPrivateKey;
    _web3.eth.accounts.encrypt = function (privateKey, password) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var newAcc, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newAcc = new stkon.Modules.Account(privateKey, stkon.messenger);
                    return [4 /*yield*/, newAcc.toFile(password)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    }); };
    _web3.eth.accounts.decrypt = function (keystoreJsonV3, password) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var newAcc, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newAcc = new stkon.Modules.Account();
                    return [4 /*yield*/, newAcc.fromFile(JSON.stringify(keystoreJsonV3), password)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    }); };
    _web3.eth.accounts.signTransaction = stkon.wallet.signTransaction;
    // map transaction to web3
    _web3.eth.recoverTransaction = stkon.transactions.recover;
    // map contract to web3
    _web3.eth.Contract = stkon.contracts.createContract;
    _web3.utils = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, _web3.utils), stkon.utils), stkon.crypto);
}
exports.createWeb3 = createWeb3;
//# sourceMappingURL=util.js.map