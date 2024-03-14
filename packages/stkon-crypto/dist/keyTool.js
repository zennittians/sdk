"use strict";
/**
 * @packageDocumentation
 * @module stkon-crypto
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePrivateKey = exports.isValidChecksumAddress = exports.recoverAddress = exports.recoverPublicKey = exports.verifySignature = exports.getContractAddress = exports.sign = exports.toChecksumAddress = exports.getAddressFromPublicKey = exports.getPublic = exports.getAddressFromPrivateKey = exports.getPubkeyFromPrivateKey = exports.generatePrivateKey = void 0;
var tslib_1 = require("tslib");
var elliptic_1 = tslib_1.__importDefault(require("elliptic"));
var bytes = tslib_1.__importStar(require("./bytes"));
var errors = tslib_1.__importStar(require("./errors"));
var keccak256_1 = require("./keccak256");
var random_1 = require("./random");
var utils_1 = require("@stkon-js/utils");
var bech32_1 = require("./bech32");
var rlp_1 = require("./rlp");
var secp256k1 = elliptic_1.default.ec('secp256k1');
/**
 * @function generatePrivateKey
 * @description generatePrivate key using `eth-lib` settings
 * @return {string}
 */
var generatePrivateKey = function () {
    var entropy = '0x' + (0, random_1.randomBytes)(16);
    var innerHex = (0, keccak256_1.keccak256)(bytes.concat(['0x' + (0, random_1.randomBytes)(32), entropy || '0x' + (0, random_1.randomBytes)(32)]));
    var middleHex = bytes.concat([
        bytes.concat(['0x' + (0, random_1.randomBytes)(32), innerHex]),
        '0x' + (0, random_1.randomBytes)(32),
    ]);
    var outerHex = (0, keccak256_1.keccak256)(middleHex);
    return outerHex;
};
exports.generatePrivateKey = generatePrivateKey;
/**
 * @function getPubkeyFromPrivateKey
 * @param  {string} privateKey - private key String
 * @return {string}
 */
var getPubkeyFromPrivateKey = function (privateKey) {
    return '0x' + (0, exports.getPublic)(privateKey, true);
};
exports.getPubkeyFromPrivateKey = getPubkeyFromPrivateKey;
/**
 * @function getAddressFromPrivateKey
 * @param  {string} privateKey - private key string
 * @return {string} address with `length = 40`
 */
var getAddressFromPrivateKey = function (privateKey) {
    var publicHash = '0x' + (0, exports.getPublic)(privateKey).slice(2);
    var publicKey = (0, keccak256_1.keccak256)(publicHash);
    var address = '0x' + publicKey.slice(-40);
    return address;
};
exports.getAddressFromPrivateKey = getAddressFromPrivateKey;
var getPublic = function (privateKey, compress) {
    if (!(0, utils_1.isPrivateKey)(privateKey) || !(0, exports.validatePrivateKey)(privateKey)) {
        throw new Error("".concat(privateKey, " is not PrivateKey"));
    }
    var ecKey = secp256k1.keyFromPrivate((0, utils_1.strip0x)(privateKey), 'hex');
    return ecKey.getPublic(compress || false, 'hex');
};
exports.getPublic = getPublic;
/**
 * @function getAddressFromPublicKey
 * @param  {string} publicKey - public key string
 * @return {string} address with `length = 40`
 */
var getAddressFromPublicKey = function (publicKey) {
    var ecKey = secp256k1.keyFromPublic(publicKey.slice(2), 'hex');
    var publicHash = ecKey.getPublic(false, 'hex');
    var address = '0x' + (0, keccak256_1.keccak256)('0x' + publicHash.slice(2)).slice(-40);
    return address;
};
exports.getAddressFromPublicKey = getAddressFromPublicKey;
/**
 * @function toChecksumAddress
 * @param  {string} address - raw address
 * @return {string} checksumed address
 */
var toChecksumAddress = function (address) {
    if (typeof address === 'string' && (0, utils_1.isBech32Address)(address)) {
        address = (0, bech32_1.fromBech32)(address);
    }
    if (typeof address !== 'string' || !address.match(/^0x[0-9A-Fa-f]{40}$/)) {
        errors.throwError('invalid address', errors.INVALID_ARGUMENT, {
            arg: 'address',
            value: address,
        });
    }
    address = address.toLowerCase();
    var chars = address.substring(2).split('');
    var hashed = new Uint8Array(40);
    for (var i = 0; i < 40; i++) {
        hashed[i] = chars[i].charCodeAt(0);
    }
    hashed = bytes.arrayify((0, keccak256_1.keccak256)(hashed)) || hashed;
    for (var i = 0; i < 40; i += 2) {
        if (hashed[i >> 1] >> 4 >= 8) {
            chars[i] = chars[i].toUpperCase();
        }
        if ((hashed[i >> 1] & 0x0f) >= 8) {
            chars[i + 1] = chars[i + 1].toUpperCase();
        }
    }
    return '0x' + chars.join('');
};
exports.toChecksumAddress = toChecksumAddress;
var sign = function (digest, privateKey) {
    if (!(0, utils_1.isPrivateKey)(privateKey)) {
        throw new Error("".concat(privateKey, " is not PrivateKey"));
    }
    var keyPair = secp256k1.keyFromPrivate((0, utils_1.strip0x)(privateKey), 'hex');
    var signature = keyPair.sign(bytes.arrayify(digest), { canonical: true });
    var publicKey = '0x' + keyPair.getPublic(true, 'hex');
    var result = {
        recoveryParam: signature.recoveryParam,
        r: bytes.hexZeroPad('0x' + signature.r.toString(16), 32),
        s: bytes.hexZeroPad('0x' + signature.s.toString(16), 32),
        v: 27 + signature.recoveryParam,
    };
    if (verifySignature(digest, result, publicKey)) {
        return result;
    }
    else {
        throw new Error('signing process failed');
    }
};
exports.sign = sign;
function getContractAddress(from, nonce) {
    if (!from) {
        throw new Error('missing from address');
    }
    var addr = (0, keccak256_1.keccak256)((0, rlp_1.encode)([from, bytes.stripZeros(bytes.hexlify(nonce))]));
    return '0x' + addr.substring(26);
}
exports.getContractAddress = getContractAddress;
function verifySignature(digest, signature, publicKey) {
    return recoverPublicKey(digest, signature) === publicKey;
}
exports.verifySignature = verifySignature;
function recoverPublicKey(digest, signature) {
    var sig = bytes.splitSignature(signature);
    var rs = { r: bytes.arrayify(sig.r), s: bytes.arrayify(sig.s) };
    ////
    var recovered = secp256k1.recoverPubKey(bytes.arrayify(digest), rs, sig.recoveryParam);
    var key = recovered.encode('hex', false);
    var ecKey = secp256k1.keyFromPublic(key, 'hex');
    var publicKey = '0x' + ecKey.getPublic(true, 'hex');
    ///
    return publicKey;
}
exports.recoverPublicKey = recoverPublicKey;
function recoverAddress(digest, signature) {
    return (0, exports.getAddressFromPublicKey)(recoverPublicKey(bytes.arrayify(digest) || new Uint8Array(), signature));
}
exports.recoverAddress = recoverAddress;
/**
 * isValidChecksumAddress
 *
 * takes hex-encoded string and returns boolean if address is checksumed
 *
 * @param {string} address
 * @returns {boolean}
 */
var isValidChecksumAddress = function (address) {
    return (0, utils_1.isAddress)(address.replace('0x', '')) && (0, exports.toChecksumAddress)(address) === address;
};
exports.isValidChecksumAddress = isValidChecksumAddress;
var validatePrivateKey = function (privateKey) {
    var ecKey = secp256k1.keyFromPrivate((0, utils_1.strip0x)(privateKey), 'hex');
    var result = ecKey.validate().result;
    return result;
};
exports.validatePrivateKey = validatePrivateKey;
//# sourceMappingURL=keyTool.js.map