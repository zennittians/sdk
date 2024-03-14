"use strict";
/**
 * @packageDocumentation
 * @module stkon-utils
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAddress = exports.isBech32TestNetAddress = exports.isBech32Address = exports.isBlockNumber = exports.DefaultBlockParams = exports.isWs = exports.isHttp = exports.isHex = exports.isFunction = exports.isObject = exports.isJsonString = exports.isArray = exports.isBoolean = exports.isString = exports.isInt = exports.isNumber = exports.isHash = exports.isPublicKey = exports.isPrivateKey = exports.isAddress = exports.isKeyString = void 0;
var isKeyString = function (keyString, lengh) {
    return !!keyString.replace('0x', '').match("^[0-9a-fA-F]{".concat(lengh, "}$"));
};
exports.isKeyString = isKeyString;
exports.isKeyString.validator = 'isKeyString';
var isAddress = function (address) {
    return (0, exports.isKeyString)(address, 40);
};
exports.isAddress = isAddress;
exports.isAddress.validator = 'isAddress';
var isPrivateKey = function (privateKey) {
    return (0, exports.isKeyString)(privateKey, 64);
};
exports.isPrivateKey = isPrivateKey;
exports.isPrivateKey.validator = 'isPrivateKey';
var isPublicKey = function (publicKey) {
    return (0, exports.isKeyString)(publicKey, 66);
};
exports.isPublicKey = isPublicKey;
exports.isPublicKey.validator = 'isPublicKey';
var isHash = function (hash) {
    return (0, exports.isKeyString)(hash, 64);
};
exports.isHash = isHash;
exports.isHash.validator = 'isHash';
/**
 * [isNumber verify param is a Number]
 * @param  {any}  obj [value]
 * @return {Boolean}     [boolean]
 */
var isNumber = function (obj) {
    return obj === +obj;
};
exports.isNumber = isNumber;
exports.isNumber.validator = 'isNumber';
/**
 * [isNumber verify param is a Number]
 * @param  {any}  obj [value]
 * @return {boolean}     [boolean]
 */
var isInt = function (obj) {
    return (0, exports.isNumber)(obj) && Number.isInteger(obj);
};
exports.isInt = isInt;
exports.isInt.validator = 'isInt';
/**
 * [isString verify param is a String]
 * @param  {any}  obj [value]
 * @return {Boolean}     [boolean]
 */
var isString = function (obj) {
    return obj === "".concat(obj);
};
exports.isString = isString;
exports.isString.validator = 'isString';
/**
 * [isBoolean verify param is a Boolean]
 * @param  {any}  obj [value]
 * @return {Boolean}     [boolean]
 */
var isBoolean = function (obj) {
    return obj === !!obj;
};
exports.isBoolean = isBoolean;
exports.isBoolean.validator = 'isBoolean';
/**
 * [isArray verify param input is an Array]
 * @param  {any}  obj [value]
 * @return {Boolean}     [boolean]
 */
var isArray = function (obj) {
    return Array.isArray(obj);
};
exports.isArray = isArray;
exports.isArray.validator = 'isArray';
/**
 * [isJson verify param input is a Json]
 * @param  {any}  obj [value]
 * @return {Boolean}     [boolean]
 */
var isJsonString = function (obj) {
    try {
        return !!JSON.parse(obj) && (0, exports.isObject)(JSON.parse(obj));
    }
    catch (e) {
        return false;
    }
};
exports.isJsonString = isJsonString;
exports.isJsonString.validator = 'isJsonString';
/**
 * [isObject verify param is an Object]
 * @param  {any}  obj [value]
 * @return {Boolean}     [boolean]
 */
var isObject = function (obj) {
    return obj !== null && !Array.isArray(obj) && typeof obj === 'object';
};
exports.isObject = isObject;
exports.isObject.validator = 'isObject';
/**
 * [isFunction verify param is a Function]
 * @param  {any}  obj [value]
 * @return {Boolean}     [description]
 */
var isFunction = function (obj) {
    return typeof obj === 'function';
};
exports.isFunction = isFunction;
exports.isFunction.validator = 'isFunction';
var isHex = function (obj) {
    if (!(0, exports.isString)(obj)) {
        throw new Error("".concat(obj, " is not string"));
    }
    return ((obj.startsWith('0x') || obj.startsWith('-0x')) &&
        (0, exports.isNumber)(Number.parseInt("".concat(obj).toLowerCase().replace('0x', ''), 16)));
};
exports.isHex = isHex;
exports.isHex.validator = 'isHex';
var isHttp = function (obj) {
    if (!(0, exports.isString)(obj)) {
        throw new Error("".concat(obj, " is not valid url"));
    }
    else {
        return obj.startsWith('http://') || obj.startsWith('https://');
    }
};
exports.isHttp = isHttp;
exports.isHttp.validator = 'isHttp';
var isWs = function (obj) {
    if (!(0, exports.isString)(obj)) {
        throw new Error("".concat(obj, " is not valid url"));
    }
    else {
        return obj.startsWith('ws://') || obj.startsWith('wss://');
    }
};
exports.isWs = isWs;
exports.isWs.validator = 'isWs';
var DefaultBlockParams;
(function (DefaultBlockParams) {
    DefaultBlockParams["earliest"] = "earliest";
    DefaultBlockParams["pending"] = "pending";
    DefaultBlockParams["latest"] = "latest";
})(DefaultBlockParams || (exports.DefaultBlockParams = DefaultBlockParams = {}));
var isBlockNumber = function (obj) {
    var blockParams = [
        DefaultBlockParams.earliest,
        DefaultBlockParams.pending,
        DefaultBlockParams.latest,
    ];
    if (!(0, exports.isString)(obj)) {
        throw new Error("".concat(obj, " is not valid blockNumber"));
    }
    return (0, exports.isHex)(obj) || blockParams.some(function (val) { return val === obj; });
};
exports.isBlockNumber = isBlockNumber;
exports.isBlockNumber.validator = 'isBlockNumber';
var isBech32Address = function (raw) {
    return !!raw.match(/^one1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{38}/);
};
exports.isBech32Address = isBech32Address;
exports.isBech32Address.validator = 'isBech32Address';
var isBech32TestNetAddress = function (raw) {
    return !!raw.match(/^tone1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{38}/);
};
exports.isBech32TestNetAddress = isBech32TestNetAddress;
exports.isBech32TestNetAddress.validator = 'isBech32TestNetAddress';
var isValidAddress = function (address) {
    if (!(0, exports.isString)(address)) {
        throw new Error("".concat(address, " is not string"));
    }
    if ((0, exports.isAddress)(address) || (0, exports.isBech32Address)(address) || (0, exports.isBech32TestNetAddress)(address)) {
        return true;
    }
    else {
        return false;
    }
};
exports.isValidAddress = isValidAddress;
exports.isValidAddress.validator = 'isValidAddress';
//# sourceMappingURL=validators.js.map