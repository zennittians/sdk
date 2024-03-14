"use strict";
/**
 * @packageDocumentation
 * @module stkon-account
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
var tslib_1 = require("tslib");
var crypto_1 = require("@stkon-js/crypto");
var utils_1 = require("@stkon-js/utils");
var transaction_1 = require("@stkon-js/transaction");
var network_1 = require("@stkon-js/network");
var utils_2 = require("./utils");
var Account = /** @class */ (function () {
    /**
     * Generate an account object
     *
     * @param key import an existing privateKey, or create a random one
     * @param messenger you can setMessage later, or set message on `new`
     *
     * @example
     * ```javascript
     * // import the Account class
     * const { Account } = require('@stkon-js/account');
     *
     * // Messenger is optional, by default, we have a defaultMessenger
     * // If you like to change, you will import related package here.
     * const { HttpProvider, Messenger } = require('@stkon-js/network');
     * const { ChainType, ChainID } = require('@stkon-js/utils');
     *
     * // create a custom messenger
     * const customMessenger = new Messenger(
     *   new HttpProvider('http://localhost:9500'),
     *   ChainType.Stkon, // if you are connected to Stkon's blockchain
     *   ChainID.StkLocal, // check if the chainId is correct
     * )
     *
     * // setMessenger later
     * const randomAccount = new Account()
     * randomAccount.setMessenger(customMessenger)
     *
     * // or you can set messenger on `new`
     * const randomAccountWithCustomMessenger = new Account(undefined, customMessenger)
     *
     * // NOTED: Key with or without `0x` are accepted, makes no different
     * // NOTED: DO NOT import `mnemonic phrase` using `Account` class, use `Wallet` instead
     * const myPrivateKey = '0xe19d05c5452598e24caad4a0d85a49146f7be089515c905ae6a19e8a578a6930'
     * const myAccountWitStkPrivateKey = new Account(myPrivateKey)
     * ```
     */
    function Account(key, messenger) {
        if (messenger === void 0) { messenger = utils_2.defaultMessenger; }
        /**@hidden */
        this.balance = '0';
        /**@hidden */
        this.nonce = 0;
        /**@hidden */
        this.encrypted = false;
        this.messenger = messenger;
        if (!key) {
            this._new();
        }
        else {
            this._import(key);
        }
        this.shardID = this.messenger.currentShard || 0;
        this.shards = new Map();
        this.shards.set(this.shardID, {
            address: "".concat(this.bech32Address).concat(utils_1.AddressSuffix, "0"),
            balance: this.balance || '0',
            nonce: this.nonce || 0,
        });
    }
    /**
     * static method create account
     *
     * @example
     * ```javascript
     * const account = new Account();
     * console.log(account);
     * ```
     */
    Account.new = function () {
        var newAcc = new Account()._new();
        return newAcc;
    };
    /**
     * Static Method: add a private key to Account
     * @param  {string} key - private Key
     *
     * @example
     * ```javascript
     * const account = new Account.add(key_1);
     * console.log(account);
     * ```
     */
    Account.add = function (key) {
        var newAcc = new Account()._import(key);
        return newAcc;
    };
    Object.defineProperty(Account.prototype, "checksumAddress", {
        /**
         * check sum address
         *
         * @example
         * ```javascript
         * console.log(account.checksumAddress);
         * ```
         */
        get: function () {
            return this.address ? (0, crypto_1.getAddress)(this.address).checksum : '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "bech32Address", {
        /**
         * Get bech32 Address
         *
         * @example
         * ```javascript
         * console.log(account.bech32Address);
         * ```
         */
        get: function () {
            return this.address ? (0, crypto_1.getAddress)(this.address).bech32 : '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "bech32TestNetAddress", {
        /**
         * get Bech32 TestNet Address
         *
         * @example
         * ```javascript
         * console.log(account.bech32TestNetAddress);
         * ```
         */
        get: function () {
            return this.address ? (0, crypto_1.getAddress)(this.address).bech32TestNet : '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "getShardsCount", {
        /**
         * get Shards number with this Account
         *
         * @example
         * ```javascript
         * console.log(account.getShardsCount);
         * ```
         */
        get: function () {
            return this.shards.size;
        },
        enumerable: false,
        configurable: true
    });
    Account.prototype.toFile = function (password, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var file;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.privateKey && (0, utils_1.isPrivateKey)(this.privateKey))) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, crypto_1.encrypt)(this.privateKey, password, options)];
                    case 1:
                        file = _a.sent();
                        this.privateKey = file;
                        this.encrypted = true;
                        return [2 /*return*/, file];
                    case 2: throw new Error('Encryption failed because PrivateKey is not correct');
                }
            });
        });
    };
    Account.prototype.fromFile = function (keyStore, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var file, decyptedPrivateKey, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (typeof password !== 'string') {
                            throw new Error('you must provide password');
                        }
                        file = JSON.parse(keyStore.toLowerCase());
                        return [4 /*yield*/, (0, crypto_1.decrypt)(file, password)];
                    case 1:
                        decyptedPrivateKey = _a.sent();
                        if ((0, utils_1.isPrivateKey)(decyptedPrivateKey)) {
                            return [2 /*return*/, this._import(decyptedPrivateKey)];
                        }
                        else {
                            throw new Error('decrypted failed');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the account balance
     *
     * @param blockNumber by default, it's `latest`
     *
     * @example
     * ```javascript
     * account.getBalance().then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Account.prototype.getBalance = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (blockNumber) {
            var balance, nonce, error_2;
            if (blockNumber === void 0) { blockNumber = 'latest'; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!this.messenger) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetBalance, [this.address, blockNumber], this.messenger.chainPrefix, this.messenger.currentShard || 0)];
                    case 1:
                        balance = _a.sent();
                        return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetTransactionCount, [this.address, blockNumber], this.messenger.chainPrefix, this.messenger.currentShard || 0)];
                    case 2:
                        nonce = _a.sent();
                        if (balance.isError()) {
                            throw balance.error.message;
                        }
                        if (nonce.isError()) {
                            throw nonce.error.message;
                        }
                        this.balance = (0, utils_1.hexToNumber)(balance.result);
                        this.nonce = Number.parseInt((0, utils_1.hexToNumber)(nonce.result), 10);
                        this.shardID = this.messenger.currentShard || 0;
                        return [3 /*break*/, 4];
                    case 3: throw new Error('No Messenger found');
                    case 4: return [2 /*return*/, {
                            balance: this.balance,
                            nonce: this.nonce,
                            shardID: this.shardID,
                        }];
                    case 5:
                        error_2 = _a.sent();
                        throw error_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @function updateShards
     */
    Account.prototype.updateBalances = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (blockNumber) {
            var shardProviders, shardProviders_1, shardProviders_1_1, _a, name_1, val, balanceObject, e_1_1, currentShard;
            var e_1, _b;
            if (blockNumber === void 0) { blockNumber = 'latest'; }
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        shardProviders = this.messenger.shardProviders;
                        if (!(shardProviders.size > 1)) return [3 /*break*/, 10];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 7, 8, 9]);
                        shardProviders_1 = tslib_1.__values(shardProviders), shardProviders_1_1 = shardProviders_1.next();
                        _c.label = 2;
                    case 2:
                        if (!!shardProviders_1_1.done) return [3 /*break*/, 6];
                        _a = tslib_1.__read(shardProviders_1_1.value, 2), name_1 = _a[0], val = _a[1];
                        return [4 /*yield*/, this.getShardBalance(val.shardID, blockNumber)];
                    case 3:
                        balanceObject = _c.sent();
                        return [4 /*yield*/, this.shards.set(name_1 === val.shardID ? name_1 : val.shardID, balanceObject)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        shardProviders_1_1 = shardProviders_1.next();
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_1_1 = _c.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (shardProviders_1_1 && !shardProviders_1_1.done && (_b = shardProviders_1.return)) _b.call(shardProviders_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 9: return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.getShardBalance(this.messenger.currentShard || 0, blockNumber)];
                    case 11:
                        currentShard = _c.sent();
                        this.shards.set(this.messenger.currentShard || 0, currentShard);
                        _c.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @function signTransaction
     */
    Account.prototype.signTransaction = function (transaction_2) {
        return tslib_1.__awaiter(this, arguments, void 0, function (transaction, updateNonce, encodeMode, blockNumber) {
            var txShardID, shardNonce, _a, signature_1, rawTransaction_1;
            var _this = this;
            if (updateNonce === void 0) { updateNonce = true; }
            if (encodeMode === void 0) { encodeMode = 'rlp'; }
            if (blockNumber === void 0) { blockNumber = 'latest'; }
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.privateKey || !(0, utils_1.isPrivateKey)(this.privateKey)) {
                            throw new Error("".concat(this.privateKey, " is not found or not correct"));
                        }
                        if (!updateNonce) return [3 /*break*/, 2];
                        txShardID = transaction.txParams.shardID;
                        return [4 /*yield*/, this.getShardNonce(typeof txShardID === 'string' ? Number.parseInt(txShardID, 10) : txShardID, blockNumber)];
                    case 1:
                        shardNonce = _b.sent();
                        transaction.setParams(tslib_1.__assign(tslib_1.__assign({}, transaction.txParams), { from: this.messenger.chainPrefix === utils_1.ChainType.Stkon
                                ? this.bech32Address
                                : this.checksumAddress || '0x', nonce: shardNonce }));
                        _b.label = 2;
                    case 2:
                        if (encodeMode === 'rlp') {
                            _a = tslib_1.__read((0, transaction_1.RLPSign)(transaction, this.privateKey), 2), signature_1 = _a[0], rawTransaction_1 = _a[1];
                            return [2 /*return*/, transaction.map(function (obj) {
                                    return tslib_1.__assign(tslib_1.__assign({}, obj), { signature: signature_1, rawTransaction: rawTransaction_1, from: _this.messenger.chainPrefix === utils_1.ChainType.Stkon
                                            ? _this.bech32Address
                                            : _this.checksumAddress || '0x' });
                                })];
                        }
                        else {
                            // TODO: if we use other encode method, eg. protobuf, we should implement this
                            return [2 /*return*/, transaction];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This function is still in development, coming soon!
     *
     * @param staking
     * @param updateNonce
     * @param encodeMode
     * @param blockNumber
     * @param shardID
     */
    Account.prototype.signStaking = function (staking_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (staking, updateNonce, encodeMode, blockNumber, shardID) {
            var txShardID, shardNonce, _a, signature, rawTransaction;
            if (updateNonce === void 0) { updateNonce = true; }
            if (encodeMode === void 0) { encodeMode = 'rlp'; }
            if (blockNumber === void 0) { blockNumber = 'latest'; }
            if (shardID === void 0) { shardID = this.messenger.currentShard; }
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.privateKey || !(0, utils_1.isPrivateKey)(this.privateKey)) {
                            throw new Error("".concat(this.privateKey, " is not found or not correct"));
                        }
                        if (!updateNonce) return [3 /*break*/, 2];
                        txShardID = shardID;
                        return [4 /*yield*/, this.getShardNonce(typeof txShardID === 'string' ? Number.parseInt(txShardID, 10) : txShardID, blockNumber)];
                    case 1:
                        shardNonce = _b.sent();
                        staking.setFromAddress(this.messenger.chainPrefix === utils_1.ChainType.Stkon
                            ? this.bech32Address
                            : this.checksumAddress || '0x');
                        staking.setNonce(shardNonce);
                        _b.label = 2;
                    case 2:
                        if (encodeMode === 'rlp') {
                            _a = tslib_1.__read(staking.rlpSign(this.privateKey), 2), signature = _a[0], rawTransaction = _a[1];
                            staking.setRawTransaction(rawTransaction);
                            staking.setSignature(signature);
                            staking.setFromAddress(this.messenger.chainPrefix === utils_1.ChainType.Stkon
                                ? this.bech32Address
                                : this.checksumAddress || '0x');
                            return [2 /*return*/, staking];
                        }
                        else {
                            // TODO: if we use other encode method, eg. protobuf, we should implement this
                            return [2 /*return*/, staking];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param messenger
     *
     * @example
     * ```javascript
     * // create a custom messenger
     * const customMessenger = new Messenger(
     *   new HttpProvider('http://localhost:9500'),
     *   ChainType.Stkon, // if you are connected to Stkon's blockchain
     *   ChainID.StkLocal, // check if the chainId is correct
     * )
     *
     * // to create an Account with random privateKey
     * // and you can setMessenger later
     * const randomAccount = new Account()
     * randomAccount.setMessenger(customMessenger)
     * ```
     */
    Account.prototype.setMessenger = function (messenger) {
        this.messenger = messenger;
    };
    /**
     * Get account address from shard ID
     * @param shardID
     *
     * @example
     * ```javascript
     * console.log(account.getAddressFromShardID(0));
     *
     * > one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7-0
     * ```
     */
    Account.prototype.getAddressFromShardID = function (shardID) {
        var shardObject = this.shards.get(shardID);
        if (shardObject) {
            return shardObject.address;
        }
        else {
            return undefined;
        }
    };
    /**
     * Get all shards' addresses from the account
     *
     * @example
     * ```javascript
     * console.log(account.getAddresses());
     * ```
     */
    Account.prototype.getAddresses = function () {
        var e_2, _a;
        var addressArray = [];
        try {
            for (var _b = tslib_1.__values(this.shards), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = tslib_1.__read(_c.value, 2), name_2 = _d[0], val = _d[1];
                var index = typeof name_2 === 'string' ? Number.parseInt(name_2, 10) : name_2;
                addressArray[index] = val.address;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return addressArray;
    };
    /**
     * Get the specific shard's balance
     *
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @param blockNumber by default, it's `latest`
     *
     * @example
     * ```
     * account.getShardBalance().then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Account.prototype.getShardBalance = function (shardID_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (shardID, blockNumber) {
            var balance, nonce;
            if (blockNumber === void 0) { blockNumber = 'latest'; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetBalance, [this.address, blockNumber], this.messenger.chainPrefix, shardID)];
                    case 1:
                        balance = _a.sent();
                        return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetTransactionCount, [this.address, blockNumber], this.messenger.chainPrefix, shardID)];
                    case 2:
                        nonce = _a.sent();
                        if (balance.isError()) {
                            throw balance.error.message;
                        }
                        if (nonce.isError()) {
                            throw nonce.error.message;
                        }
                        return [2 /*return*/, {
                                address: "".concat(this.bech32Address).concat(utils_1.AddressSuffix).concat(shardID),
                                balance: (0, utils_1.hexToNumber)(balance.result),
                                nonce: Number.parseInt((0, utils_1.hexToNumber)(nonce.result), 10),
                            }];
                }
            });
        });
    };
    /**
     * Get the specific shard's nonce
     *
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @param blockNumber by default, it's `latest`
     *
     * @example
     * ```
     * account.getShardNonce().then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Account.prototype.getShardNonce = function (shardID_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (shardID, blockNumber) {
            var nonce;
            if (blockNumber === void 0) { blockNumber = 'latest'; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetAccountNonce, [this.address, blockNumber], this.messenger.chainPrefix, shardID)];
                    case 1:
                        nonce = _a.sent();
                        if (nonce.isError()) {
                            throw nonce.error.message;
                        }
                        return [2 /*return*/, nonce.result];
                }
            });
        });
    };
    /**
     * @function _new private method create Account
     * @return {Account} Account instance
     * @ignore
     */
    Account.prototype._new = function () {
        var prv = (0, crypto_1.generatePrivateKey)();
        if (!(0, utils_1.isPrivateKey)(prv)) {
            throw new Error('key gen failed');
        }
        return this._import(prv);
    };
    /**
     * @function _import private method import a private Key
     * @param  {string} key - private key
     * @return {Account} Account instance
     * @ignore
     */
    Account.prototype._import = function (key) {
        if (!(0, utils_1.isPrivateKey)(key)) {
            throw new Error("".concat(key, " is not PrivateKey"));
        }
        this.privateKey = (0, utils_1.add0xToString)(key);
        this.publicKey = (0, crypto_1.getPubkeyFromPrivateKey)(this.privateKey);
        this.address = (0, crypto_1.getAddressFromPrivateKey)(this.privateKey);
        this.shardID = this.messenger.currentShard || 0;
        this.shards = new Map();
        this.shards.set(this.shardID, {
            address: "".concat(this.bech32Address).concat(utils_1.AddressSuffix, "0"),
            balance: this.balance || '0',
            nonce: this.nonce || 0,
        });
        this.encrypted = false;
        return this;
    };
    return Account;
}());
exports.Account = Account;
//# sourceMappingURL=account.js.map