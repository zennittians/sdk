"use strict";
/**
 * @packageDocumentation
 * @module stkon-account
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
var tslib_1 = require("tslib");
var crypto_1 = require("@stkon-js/crypto");
var utils_1 = require("@stkon-js/utils");
var account_1 = require("./account");
var utils_2 = require("./utils");
var Wallet = /** @class */ (function () {
    /**
     * @example
     * ```
     * const { Wallet } = require('@stkon-js/account');
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
     * const wallet = new Wallet(customMessenger);
     * ```
     */
    function Wallet(messenger) {
        if (messenger === void 0) { messenger = utils_2.defaultMessenger; }
        /**
         * @hidden
         */
        this.accountMap = new Map();
        this.messenger = messenger;
    }
    // static method generate Mnemonic
    Wallet.generateMnemonic = function () {
        return crypto_1.bip39.generateMnemonic();
    };
    Object.defineProperty(Wallet.prototype, "accounts", {
        /**
         * get acounts addresses
         *
         * @return {string[]} accounts addresses
         *
         * @example
         * ```javascript
         * const wallet = new Wallet(customMessenger);
         * const key_1 = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
         * wallet.addByPrivateKey(key_1);
         *
         * console.log(wallet.accounts);
         * ```
         */
        get: function () {
            return tslib_1.__spreadArray([], tslib_1.__read(this.accountMap.keys()), false);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wallet.prototype, "signer", {
        /**
         * get the signer of the account, by default, using the first account
         *
         * @example
         * ```javascript
         * const wallet = new Wallet(customMessenger);
         * const key_1 = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
         * wallet.addByPrivateKey(key_1);
         *
         * console.log(wallet.signer)
         * ```
         */
        get: function () {
            if (this.defaultSigner) {
                return this.getAccount(this.defaultSigner);
            }
            else if (!this.defaultSigner && this.accounts.length > 0) {
                this.setSigner(this.accounts[0]);
                return this.getAccount(this.accounts[0]);
            }
            else {
                return undefined;
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @function newMnemonic
     * @memberof Wallet
     * @return {string} Mnemonics
     */
    Wallet.prototype.newMnemonic = function () {
        return Wallet.generateMnemonic();
    };
    /**
     * Add account using Mnemonic phrases
     * @param  {string} phrase - Mnemonic phrase
     * @param  {index} index - index to hdKey root
     *
     * @example
     * ```javascript
     * const mnemonic_1 = 'urge clog right example dish drill card maximum mix bachelor section select';
     * const wallet = new Wallet(customMessenger);
     * wallet.addByMnemonic(mnemonic_1);
     *
     * console.log(wallet.accounts);
     * ```
     */
    Wallet.prototype.addByMnemonic = function (phrase, index) {
        if (index === void 0) { index = 0; }
        if (!this.isValidMnemonic(phrase)) {
            throw new Error("Invalid mnemonic phrase: ".concat(phrase));
        }
        var seed = crypto_1.bip39.mnemonicToSeed(phrase);
        var hdKey = crypto_1.hdkey.fromMasterSeed(seed);
        // TODO:hdkey should apply to Stkon's settings
        var path = this.messenger.chainType === utils_1.ChainType.Stkon ? '1023' : '60';
        var childKey = hdKey.derive("m/44'/".concat(path, "'/0'/0/").concat(index));
        var privateKey = childKey.privateKey.toString('hex');
        return this.addByPrivateKey(privateKey);
    };
    /**
     * Add an account using privateKey
     *
     * @param  {string} privateKey - privateKey to add
     * @return {Account} return added Account
     *
     * @example
     * ```javascript
     * const wallet = new Wallet(customMessenger);
     * const key_1 = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
     * console.log(wallet.addByPrivateKey(key_1));
     * ```
     */
    Wallet.prototype.addByPrivateKey = function (privateKey) {
        try {
            var newAcc = account_1.Account.add(privateKey);
            newAcc.setMessenger(this.messenger);
            if (newAcc.address) {
                this.accountMap.set(newAcc.address, newAcc);
                if (!this.defaultSigner) {
                    this.setSigner(newAcc.address);
                }
                return newAcc;
            }
            else {
                throw new Error('add account failed');
            }
        }
        catch (error) {
            throw error;
        }
    };
    /**
     * Add an account using privateKey
     * @param  {string} keyStore - keystore jsonString to add
     * @param  {string} password - password to decrypt the file
     * @return {Account} return added Account
     */
    Wallet.prototype.addByKeyStore = function (keyStore, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var newAcc, result, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        newAcc = new account_1.Account(undefined);
                        return [4 /*yield*/, newAcc.fromFile(keyStore, password)];
                    case 1:
                        result = _a.sent();
                        result.setMessenger(this.messenger);
                        if (result.address) {
                            this.accountMap.set(result.address, result);
                            if (!this.defaultSigner) {
                                this.setSigner(result.address);
                            }
                            return [2 /*return*/, result];
                        }
                        else {
                            throw new Error('add account failed');
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
     * create a new account using Mnemonic
     * @return {Account} {description}
     *
     * @example
     * ```javascript
     * console.log(wallet.accounts);
     * wallet.createAccount();
     * wallet.createAccount();
     *
     * console.log(wallet.accounts);
     * ````
     */
    Wallet.prototype.createAccount = function (password, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var prv, acc, encrypted;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prv = (0, crypto_1.generatePrivateKey)();
                        acc = this.addByPrivateKey(prv);
                        if (!(acc.address && password)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.encryptAccount(acc.address, password, options)];
                    case 1:
                        encrypted = _a.sent();
                        return [2 /*return*/, encrypted];
                    case 2:
                        if (acc.address && !password) {
                            return [2 /*return*/, acc];
                        }
                        else {
                            throw new Error('create acount failed');
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * To encrypt an account that lives in the wallet.
     * if encrypted, returns original one, if not found, throw error
     * @param {string} address - address in accounts
     * @param {string} password - string that used to encrypt
     * @param {EncryptOptions} options - encryption options
     * @return {Promise<Account>}
     *
     * @example
     * ```javascript
     * const key_1 = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
     * wallet.addByPrivateKey(key_1);
     * wallet.encryptAccount('one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7', '12345').then((value) => {
     *   console.log(value);
     * })
     * ```
     */
    Wallet.prototype.encryptAccount = function (address, password, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var foundAcc, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        foundAcc = this.getAccount(address);
                        if (!(foundAcc && foundAcc.privateKey && (0, utils_1.isPrivateKey)(foundAcc.privateKey))) return [3 /*break*/, 2];
                        return [4 /*yield*/, foundAcc.toFile(password, options)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, foundAcc];
                    case 2:
                        if (foundAcc && foundAcc.privateKey && !(0, utils_1.isPrivateKey)(foundAcc.privateKey)) {
                            return [2 /*return*/, foundAcc];
                        }
                        else {
                            throw new Error('encrypt account failed');
                        }
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * To decrypt an account that lives in the wallet,if not encrypted, return original,
     * if not found, throw error
     * @param {string} address - address in accounts
     * @param {string} password - string that used to encrypt
     * @return {Promise<Account>}
     *
     * @example
     * ```javascript
     * const key_1 = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
     * wallet.addByPrivateKey(key_1);
     * wallet.encryptAccount('one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7', '12345')
     * .then(() => {
     *   wallet.decryptAccount('one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7', '12345')
     *   .then((value) =>{
     *      console.log(value);
     *   });
     * });
     * ```
     */
    Wallet.prototype.decryptAccount = function (address, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var foundAcc, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        foundAcc = this.getAccount(address);
                        if (!(foundAcc && foundAcc.privateKey && !(0, utils_1.isPrivateKey)(foundAcc.privateKey))) return [3 /*break*/, 2];
                        return [4 /*yield*/, foundAcc.fromFile(foundAcc.privateKey, password)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, foundAcc];
                    case 2:
                        if (foundAcc && foundAcc.privateKey && (0, utils_1.isPrivateKey)(foundAcc.privateKey)) {
                            foundAcc.encrypted = false;
                            return [2 /*return*/, foundAcc];
                        }
                        else {
                            throw new Error('decrypt account failed');
                        }
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get Account instance using address as param
     * @param  {string} address - address hex
     * @return {Account} Account instance which lives in Wallet
     *
     * @example
     * ```
     * const key_1 = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
     * wallet.addByPrivateKey(key_1);
     * console.log(wallet.getAccount('one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'));
     * ```
     */
    Wallet.prototype.getAccount = function (address) {
        return this.accountMap.get((0, crypto_1.getAddress)(address).basicHex);
    };
    /**
     * @function removeAccount
     * @memberof Wallet
     * @description remove Account using address as param
     * @param  {string} address: - address hex
     */
    Wallet.prototype.removeAccount = function (address) {
        this.accountMap.delete((0, crypto_1.getAddress)(address).basicHex);
        if (this.defaultSigner === address) {
            this.defaultSigner = undefined;
        }
    };
    /**
     * Set Customer Messenage
     * @param messenger
     *
     * @example
     * ```javascript
     * const customMessenger = new Messenger(
     *   new HttpProvider('https://api.s0.b.stkon.xyz'),
     *   ChainType.Stkon, // if you are connected to Stkon's blockchain
     *   ChainID.StkLocal, // check if the chainId is correct
     * )
     * const wallet = new Wallet();
     * wallet.setMessenger(customMessenger);
     * console.log(wallet.messenger);
     * ```
     */
    Wallet.prototype.setMessenger = function (messenger) {
        this.messenger = messenger;
    };
    /**
     * Set signer
     *
     * @param address one of the address in the accounts
     */
    Wallet.prototype.setSigner = function (address) {
        if (!(0, utils_1.isAddress)(address) && !this.getAccount(address)) {
            throw new Error('could not set signer');
        }
        this.defaultSigner = address;
    };
    Wallet.prototype.signTransaction = function (transaction_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (transaction, account, 
        // tslint:disable-next-line: no-unnecessary-initializer
        password, updateNonce, encodeMode, blockNumber) {
            var toSignWith, decrypted, signed, error_4, signed, error_5;
            if (account === void 0) { account = this.signer; }
            if (password === void 0) { password = undefined; }
            if (updateNonce === void 0) { updateNonce = true; }
            if (encodeMode === void 0) { encodeMode = 'rlp'; }
            if (blockNumber === void 0) { blockNumber = 'latest'; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        toSignWith = account || this.signer;
                        if (!toSignWith) {
                            throw new Error('no signer found or did not provide correct account');
                        }
                        if (!(toSignWith instanceof account_1.Account && toSignWith.encrypted && toSignWith.address)) return [3 /*break*/, 7];
                        if (!password) {
                            throw new Error('must provide password to further execution');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.decryptAccount(toSignWith.address, password)];
                    case 2:
                        decrypted = _a.sent();
                        return [4 /*yield*/, decrypted.signTransaction(transaction, updateNonce, encodeMode, blockNumber)];
                    case 3:
                        signed = _a.sent();
                        return [4 /*yield*/, this.encryptAccount(toSignWith.address, password)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, signed];
                    case 5:
                        error_4 = _a.sent();
                        throw error_4;
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        if (!(toSignWith instanceof account_1.Account && !toSignWith.encrypted && toSignWith.address)) return [3 /*break*/, 12];
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, toSignWith.signTransaction(transaction, updateNonce, encodeMode, blockNumber)];
                    case 9:
                        signed = _a.sent();
                        return [2 /*return*/, signed];
                    case 10:
                        error_5 = _a.sent();
                        throw error_5;
                    case 11: return [3 /*break*/, 13];
                    case 12: throw new Error('sign transaction failed');
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Wallet.prototype.signStaking = function (staking_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (staking, account, 
        // tslint:disable-next-line: no-unnecessary-initializer
        password, updateNonce, encodeMode, blockNumber, shardID) {
            var toSignWith, decrypted, signed, error_6, signed, error_7;
            if (account === void 0) { account = this.signer; }
            if (password === void 0) { password = undefined; }
            if (updateNonce === void 0) { updateNonce = true; }
            if (encodeMode === void 0) { encodeMode = 'rlp'; }
            if (blockNumber === void 0) { blockNumber = 'latest'; }
            if (shardID === void 0) { shardID = this.messenger.currentShard; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        toSignWith = account || this.signer;
                        if (!toSignWith) {
                            throw new Error('no signer found or did not provide correct account');
                        }
                        if (!(toSignWith instanceof account_1.Account && toSignWith.encrypted && toSignWith.address)) return [3 /*break*/, 7];
                        if (!password) {
                            throw new Error('must provide password to further execution');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.decryptAccount(toSignWith.address, password)];
                    case 2:
                        decrypted = _a.sent();
                        return [4 /*yield*/, decrypted.signStaking(staking, updateNonce, encodeMode, blockNumber, shardID)];
                    case 3:
                        signed = _a.sent();
                        return [4 /*yield*/, this.encryptAccount(toSignWith.address, password)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, signed];
                    case 5:
                        error_6 = _a.sent();
                        throw error_6;
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        if (!(toSignWith instanceof account_1.Account && !toSignWith.encrypted && toSignWith.address)) return [3 /*break*/, 12];
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, toSignWith.signStaking(staking, updateNonce, encodeMode, blockNumber, shardID)];
                    case 9:
                        signed = _a.sent();
                        return [2 /*return*/, signed];
                    case 10:
                        error_7 = _a.sent();
                        throw error_7;
                    case 11: return [3 /*break*/, 13];
                    case 12: throw new Error('sign transaction failed');
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @function isValidMnemonic
     * @memberof Wallet
     * @description check if Mnemonic is valid
     * @param  {string} phrase - Mnemonic phrase
     * @return {boolean}
     * @ignore
     */
    Wallet.prototype.isValidMnemonic = function (phrase) {
        if (phrase.trim().split(/\s+/g).length < 12) {
            return false;
        }
        return crypto_1.bip39.validateMnemonic(phrase);
    };
    return Wallet;
}());
exports.Wallet = Wallet;
//# sourceMappingURL=wallet.js.map