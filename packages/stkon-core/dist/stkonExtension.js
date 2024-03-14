"use strict";
/**
 * @packageDocumentation
 * @module stkon-core
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StkonExtension = exports.ExtensionType = void 0;
var tslib_1 = require("tslib");
var network_1 = require("@stkon-js/network");
var crypto = tslib_1.__importStar(require("@stkon-js/crypto"));
var utils = tslib_1.__importStar(require("@stkon-js/utils"));
var transaction_1 = require("@stkon-js/transaction");
var blockchain_1 = require("./blockchain");
var contract_1 = require("@stkon-js/contract");
/** @hidden */
var ExtensionType;
(function (ExtensionType) {
    ExtensionType["MathWallet"] = "MathWallet";
    ExtensionType["StkWallet"] = "StkWallet";
})(ExtensionType || (exports.ExtensionType = ExtensionType = {}));
var StkonExtension = /** @class */ (function () {
    /**
     * Create an blockchain instance support wallet injection
     *
     * @param wallet could be MathWallet or StkWallet instance
     * @param config (optional), using default `Chain_Id` and `Chain_Type`
     *
     * @example
     * ```javascript
     * // Using Mathwallet instance
     * export const initEx = async() => {
     *   stkEx = new StkonExtension(window.stkon);
     * }
     * // Using StkWallet instance
     * export const initEx = async() => {
     *   stkEx = new StkonExtension(window.stkwallet);
     * }
     * ```
     */
    function StkonExtension(wallet, config) {
        if (config === void 0) { config = {
            chainId: utils.defaultConfig.Default.Chain_ID,
            chainType: utils.defaultConfig.Default.Chain_Type,
        }; }
        this.extensionType = null;
        this.wallet = wallet;
        // check if it is mathwallet or stkwallet
        this.isExtension(this.wallet);
        if (wallet.messenger) {
            this.provider = wallet.messenger.provider;
            this.messenger = wallet.messenger;
        }
        else {
            this.provider = new network_1.Provider(config.chainUrl || wallet.network.chain_url).provider;
            this.messenger = new network_1.Messenger(this.provider, config.chainType, config.chainId);
        }
        this.wallet.messenger = this.messenger;
        this.blockchain = new blockchain_1.Blockchain(this.messenger);
        this.transactions = new transaction_1.TransactionFactory(this.messenger);
        this.contracts = new contract_1.ContractFactory(this.wallet);
        this.crypto = crypto;
        this.utils = utils;
    }
    /**
     * Will change the provider for its module.
     *
     * @param provider a valid provider, you can replace it with your own working node
     *
     * @example
     * ```javascript
     * const tmp = stkEx.setProvider('http://localhost:9500');
     * ```
     */
    StkonExtension.prototype.setProvider = function (provider) {
        this.provider = new network_1.Provider(provider).provider;
        this.messenger.setProvider(this.provider);
        this.setMessenger(this.messenger);
    };
    /**
     * Change the Shard ID
     *
     * @example
     * ```
     * stkEx.setShardID(2);
     * ```
     */
    StkonExtension.prototype.setShardID = function (shardID) {
        this.defaultShardID = shardID;
        this.messenger.setDefaultShardID(this.defaultShardID);
        this.setMessenger(this.messenger);
    };
    StkonExtension.prototype.isExtension = function (wallet) {
        var _this = this;
        var isExtension = false;
        this.extensionType = null;
        if (wallet.isMathWallet || wallet.isStkWallet) {
            isExtension = true;
            if (wallet.isMathWallet)
                this.extensionType = ExtensionType.MathWallet;
            else
                this.extensionType = ExtensionType.StkWallet;
            // remake signTransaction of MathWallet or StkWallet
            var signTransaction_1 = this.wallet.signTransaction;
            this.wallet.signTransaction = function (transaction_2) {
                var args_1 = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args_1[_i - 1] = arguments[_i];
                }
                return tslib_1.__awaiter(_this, tslib_1.__spreadArray([transaction_2], tslib_1.__read(args_1), false), void 0, function (transaction, updateNonce, encodeMode, blockNumber) {
                    var extensionAccount, nonce;
                    if (updateNonce === void 0) { updateNonce = true; }
                    if (encodeMode === void 0) { encodeMode = 'rlp'; }
                    if (blockNumber === void 0) { blockNumber = 'latest'; }
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.wallet.getAccount()];
                            case 1:
                                extensionAccount = _a.sent();
                                if (!updateNonce) return [3 /*break*/, 3];
                                return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetAccountNonce, [crypto.getAddress(extensionAccount.address).checksum, blockNumber], this.messenger.chainPrefix, typeof transaction.txParams.shardID === 'string'
                                        ? Number.parseInt(transaction.txParams.shardID, 10)
                                        : transaction.txParams.shardID)];
                            case 2:
                                nonce = _a.sent();
                                transaction.setParams(tslib_1.__assign(tslib_1.__assign({}, transaction.txParams), { from: crypto.getAddress(extensionAccount.address).bech32, nonce: Number.parseInt(utils.isHex(nonce.result.toString()) ? utils.hexToNumber(nonce.result.toString()) : nonce.result.toString(), 10) }));
                                return [3 /*break*/, 4];
                            case 3:
                                transaction.setParams(tslib_1.__assign(tslib_1.__assign({}, transaction.txParams), { from: crypto.getAddress(extensionAccount.address).bech32 }));
                                _a.label = 4;
                            case 4: return [2 /*return*/, signTransaction_1(transaction, false, encodeMode, blockNumber)];
                        }
                    });
                });
            };
        }
        if (!isExtension) {
            throw new Error('Extension is not found');
        }
        return;
    };
    /**
     * Get the wallet account
     *
     * @example
     * ```javascript
     * const account = stkEx.login();
     * console.log(account);
     * ```
     */
    StkonExtension.prototype.login = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var account;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.wallet.getAccount()];
                    case 1:
                        account = _a.sent();
                        // Use address
                        return [2 /*return*/, account];
                }
            });
        });
    };
    /**
     * Log out the wallet account
     *
     * @example
     * ```javascript
     * stkEx.logout();
     * ```
     */
    StkonExtension.prototype.logout = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.wallet.forgetIdentity()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set the sharding Structure
     *
     * @param shardingStructures The array of information of sharding structures
     *
     * @example
     * ```javascript
     * stkEx.shardingStructures([
     *   {"current":true,"http":"http://127.0.0.1:9500",
     *    "shardID":0,"ws":"ws://127.0.0.1:9800"},
     *   {"current":false,"http":"http://127.0.0.1:9501",
     *    "shardID":1,"ws":"ws://127.0.0.1:9801"}
     * ]);
     * ```
     */
    StkonExtension.prototype.shardingStructures = function (shardingStructures) {
        var e_1, _a;
        try {
            for (var shardingStructures_1 = tslib_1.__values(shardingStructures), shardingStructures_1_1 = shardingStructures_1.next(); !shardingStructures_1_1.done; shardingStructures_1_1 = shardingStructures_1.next()) {
                var shard = shardingStructures_1_1.value;
                var shardID = typeof shard.shardID === 'string' ? Number.parseInt(shard.shardID, 10) : shard.shardID;
                this.messenger.shardProviders.set(shardID, {
                    current: shard.current !== undefined ? shard.current : false,
                    shardID: shardID,
                    http: shard.http,
                    ws: shard.ws,
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (shardingStructures_1_1 && !shardingStructures_1_1.done && (_a = shardingStructures_1.return)) _a.call(shardingStructures_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.setMessenger(this.messenger);
    };
    /**@ignore*/
    StkonExtension.prototype.setMessenger = function (messenger) {
        this.blockchain.setMessenger(messenger);
        this.wallet.messenger = messenger;
        this.transactions.setMessenger(messenger);
    };
    return StkonExtension;
}());
exports.StkonExtension = StkonExtension;
//# sourceMappingURL=stkonExtension.js.map