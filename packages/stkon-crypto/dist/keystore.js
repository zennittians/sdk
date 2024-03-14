"use strict";
/**
 * @packageDocumentation
 * @module stkon-crypto
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptPhrase = exports.encryptPhrase = exports.decrypt = exports.encrypt = void 0;
var tslib_1 = require("tslib");
var aes_js_1 = tslib_1.__importDefault(require("aes-js"));
var scrypt_js_1 = tslib_1.__importDefault(require("scrypt.js"));
var pbkdf2_1 = require("pbkdf2");
var uuid_1 = tslib_1.__importDefault(require("uuid"));
var utils_1 = require("@stkon-js/utils");
var random_1 = require("./random");
var keyTool_1 = require("./keyTool");
var bytes_1 = require("./bytes");
var keccak256_1 = require("./keccak256");
/** @hidden */
var DEFAULT_ALGORITHM = 'aes-128-ctr';
/**
 * getDerivedKey
 *
 * NOTE: only scrypt and pbkdf2 are supported.
 *
 * @param {Buffer} key - the passphrase
 * @param {KDF} kdf - the key derivation function to be used
 * @param {KDFParams} params - params for the kdf
 *
 * @returns {Promise<Buffer>}
 */
function getDerivedKey(key, kdf, params) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var salt, _a, c, dklen, _b, n, r, p, dklen;
        return tslib_1.__generator(this, function (_c) {
            salt = Buffer.from(params.salt, 'hex');
            if (kdf === 'pbkdf2') {
                _a = params, c = _a.c, dklen = _a.dklen;
                return [2 /*return*/, (0, pbkdf2_1.pbkdf2Sync)(key, salt, c, dklen, 'sha256')];
            }
            if (kdf === 'scrypt') {
                _b = params, n = _b.n, r = _b.r, p = _b.p, dklen = _b.dklen;
                return [2 /*return*/, (0, scrypt_js_1.default)(key, salt, n, r, p, dklen)];
            }
            throw new Error('Only pbkdf2 and scrypt are supported');
        });
    });
}
/**
 * This method will map the current Account object to V3Keystore object.
 *
 * @method encrypt
 *
 * @param {string} privateKey
 * @param {string} password
 * @param {object} options
 *
 * @return {{version, id, address, crypto}}
 */
var encrypt = function (privateKey, password, options) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var address, salt, iv, kdf, level, uuidRandom, n, kdfparams, derivedKey, cipher, ciphertext, mac;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, utils_1.isPrivateKey)(privateKey)) {
                    throw new Error('privateKey is not correct');
                }
                if (typeof password !== 'string') {
                    throw new Error('password is not found');
                }
                address = (0, keyTool_1.getAddressFromPrivateKey)(privateKey);
                salt = (0, random_1.randomBytes)(32);
                iv = Buffer.from((0, random_1.randomBytes)(16), 'hex');
                kdf = options !== undefined ? (options.kdf ? options.kdf : 'scrypt') : 'scrypt';
                level = options !== undefined ? (options.level ? options.level : 8192) : 8192;
                uuidRandom = options !== undefined ? options.uuid : undefined;
                n = kdf === 'pbkdf2' ? 262144 : level;
                kdfparams = {
                    salt: salt,
                    n: n,
                    r: 8,
                    p: 1,
                    dklen: 32,
                };
                return [4 /*yield*/, getDerivedKey(Buffer.from(password), kdf, kdfparams)];
            case 1:
                derivedKey = _a.sent();
                cipher = new aes_js_1.default.ModeOfOperation.ctr(derivedKey.slice(0, 16), new aes_js_1.default.Counter(iv));
                if (!cipher) {
                    throw new Error('Unsupported cipher');
                }
                ciphertext = Buffer.from(cipher.encrypt(Buffer.from(privateKey.replace('0x', ''), 'hex')));
                mac = (0, keccak256_1.keccak256)((0, bytes_1.concat)([derivedKey.slice(16, 32), ciphertext]));
                return [2 /*return*/, JSON.stringify({
                        version: 3,
                        id: uuid_1.default.v4({ random: uuidRandom || (0, bytes_1.hexToIntArray)((0, random_1.randomBytes)(16)) }),
                        address: address.toLowerCase().replace('0x', ''),
                        crypto: {
                            ciphertext: ciphertext.toString('hex'),
                            cipherparams: {
                                iv: iv.toString('hex'),
                            },
                            cipher: DEFAULT_ALGORITHM,
                            kdf: kdf,
                            kdfparams: kdfparams,
                            mac: mac.replace('0x', ''),
                        },
                    })];
        }
    });
}); };
exports.encrypt = encrypt;
/**
 * @function decrypt
 * @param  {Keystore} keystore - Keystore file
 * @param  {string} password - password string
 * @return {string} privateKey
 */
var decrypt = function (keystore, password) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var ciphertext, iv, kdfparams, derivedKey, mac, CTR, cipher, decrypted;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ciphertext = Buffer.from(keystore.crypto.ciphertext, 'hex');
                iv = Buffer.from(keystore.crypto.cipherparams.iv, 'hex');
                kdfparams = keystore.crypto.kdfparams;
                return [4 /*yield*/, getDerivedKey(Buffer.from(password), keystore.crypto.kdf, kdfparams)];
            case 1:
                derivedKey = _a.sent();
                mac = (0, keccak256_1.keccak256)((0, bytes_1.concat)([derivedKey.slice(16, 32), ciphertext])).replace('0x', '');
                if (mac.toUpperCase() !== keystore.crypto.mac.toUpperCase()) {
                    return [2 /*return*/, Promise.reject(new Error('Failed to decrypt.'))];
                }
                CTR = aes_js_1.default.ModeOfOperation.ctr;
                cipher = new CTR(derivedKey.slice(0, 16), new aes_js_1.default.Counter(iv));
                decrypted = '0x' + Buffer.from(cipher.decrypt(ciphertext)).toString('hex');
                return [2 /*return*/, decrypted];
        }
    });
}); };
exports.decrypt = decrypt;
/**
 * encrypt Phrase
 */
var encryptPhrase = function (phrase, password, options) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var salt, iv, kdf, level, uuidRandom, n, kdfparams, derivedKey, cipher, ciphertext, mac;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (typeof password !== 'string') {
                    throw new Error('password is not found');
                }
                salt = (0, random_1.randomBytes)(32);
                iv = Buffer.from((0, random_1.randomBytes)(16), 'hex');
                kdf = options !== undefined ? (options.kdf ? options.kdf : 'scrypt') : 'scrypt';
                level = options !== undefined ? (options.level ? options.level : 8192) : 8192;
                uuidRandom = options !== undefined ? options.uuid : undefined;
                n = kdf === 'pbkdf2' ? 262144 : level;
                kdfparams = {
                    salt: salt,
                    n: n,
                    r: 8,
                    p: 1,
                    dklen: 32,
                };
                return [4 /*yield*/, getDerivedKey(Buffer.from(password), kdf, kdfparams)];
            case 1:
                derivedKey = _a.sent();
                cipher = new aes_js_1.default.ModeOfOperation.ctr(derivedKey.slice(0, 16), new aes_js_1.default.Counter(iv));
                if (!cipher) {
                    throw new Error('Unsupported cipher');
                }
                ciphertext = Buffer.from(cipher.encrypt(Buffer.from(phrase)));
                mac = (0, keccak256_1.keccak256)((0, bytes_1.concat)([derivedKey.slice(16, 32), ciphertext]));
                return [2 /*return*/, JSON.stringify({
                        version: 3,
                        id: uuid_1.default.v4({ random: uuidRandom || (0, bytes_1.hexToIntArray)((0, random_1.randomBytes)(16)) }),
                        crypto: {
                            ciphertext: ciphertext.toString('hex'),
                            cipherparams: {
                                iv: iv.toString('hex'),
                            },
                            cipher: DEFAULT_ALGORITHM,
                            kdf: kdf,
                            kdfparams: kdfparams,
                            mac: mac.replace('0x', ''),
                        },
                    })];
        }
    });
}); };
exports.encryptPhrase = encryptPhrase;
/**
 * decrypt phrase
 */
var decryptPhrase = function (keystore, password) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var result;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.decrypt)(keystore, password)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, Buffer.from(result.replace('0x', ''), 'hex').toString()];
        }
    });
}); };
exports.decryptPhrase = decryptPhrase;
//# sourceMappingURL=keystore.js.map