"use strict";
/**
 * @packageDocumentation
 * @module stkon-crypto
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHex = exports.hexToIntArray = exports.hexToByteArray = exports.joinSignature = exports.splitSignature = exports.isSignature = exports.bytesPadRight = exports.bytesPadLeft = exports.hexZeroPad = exports.hexStripZeros = exports.hexDataSlice = exports.hexDataLength = exports.hexlify = exports.isHexString = exports.padZeros = exports.stripZeros = exports.concat = exports.arrayify = exports.isArrayish = exports.isHexable = void 0;
var tslib_1 = require("tslib");
// This file is ported from ether.js/src.ts/utils/bytes.ts
// and done some fixes
var errors = tslib_1.__importStar(require("./errors"));
///////////////////////////////
function isHexable(value) {
    return !!value.toHexString;
}
exports.isHexable = isHexable;
function addSlice(array) {
    if (typeof array === 'object' && typeof array.slice === 'function') {
        return array;
    }
    // tslint:disable-next-line: only-arrow-functions
    array.slice = function () {
        var args = Array.prototype.slice.call(arguments);
        return addSlice(new Uint8Array(Array.prototype.slice.apply(array, [args[0], args[1]])));
    };
    return array;
}
function isArrayish(value) {
    if (!value ||
        // tslint:disable-next-line: radix
        parseInt(String(value.length)) !== value.length ||
        typeof value === 'string') {
        return false;
    }
    // tslint:disable-next-line: prefer-for-of
    for (var i = 0; i < value.length; i++) {
        var v = value[i];
        // tslint:disable-next-line: radix
        if (v < 0 || v >= 256 || parseInt(String(v)) !== v) {
            return false;
        }
    }
    return true;
}
exports.isArrayish = isArrayish;
function arrayify(value) {
    if (value == null) {
        errors.throwError('cannot convert null value to array', errors.INVALID_ARGUMENT, {
            arg: 'value',
            value: value,
        });
    }
    if (isHexable(value)) {
        value = value.toHexString();
    }
    if (typeof value === 'string') {
        var match = value.match(/^(0x)?[0-9a-fA-F]*$/);
        if (!match) {
            errors.throwError('invalid hexidecimal string', errors.INVALID_ARGUMENT, {
                arg: 'value',
                value: value,
            });
        }
        if (match !== null && match[1] !== '0x') {
            errors.throwError('hex string must have 0x prefix', errors.INVALID_ARGUMENT, {
                arg: 'value',
                value: value,
            });
        }
        value = value.substring(2);
        if (value.length % 2) {
            value = '0' + value;
        }
        var result = [];
        for (var i = 0; i < value.length; i += 2) {
            result.push(parseInt(value.substr(i, 2), 16));
        }
        return addSlice(new Uint8Array(result));
    }
    if (isArrayish(value)) {
        return addSlice(new Uint8Array(value));
    }
    errors.throwError('invalid arrayify value', null, {
        arg: 'value',
        value: value,
        type: typeof value,
    });
    return null;
}
exports.arrayify = arrayify;
function concat(objects) {
    if (objects === null) {
        throw new Error("concat objects is null");
    }
    var arrays = [];
    var length = 0;
    // tslint:disable-next-line: prefer-for-of
    for (var i = 0; i < objects.length; i++) {
        var object = arrayify(objects[i]);
        if (object == null) {
            throw new Error('arrayify failed');
        }
        arrays.push(object);
        length += object.length;
    }
    var result = new Uint8Array(length);
    var offset = 0;
    // tslint:disable-next-line: prefer-for-of
    for (var i = 0; i < arrays.length; i++) {
        result.set(arrays[i], offset);
        offset += arrays[i].length;
    }
    return addSlice(result);
}
exports.concat = concat;
function stripZeros(value) {
    var result = arrayify(value);
    if (result === null) {
        throw new Error('arrayify failed');
    }
    if (result.length === 0) {
        return result;
    }
    // Find the first non-zero entry
    var start = 0;
    while (result[start] === 0) {
        start++;
    }
    // If we started with zeros, strip them
    if (start) {
        result = result.slice(start);
    }
    return result;
}
exports.stripZeros = stripZeros;
function padZeros(value, length) {
    var arrayifyValue = arrayify(value);
    if (arrayifyValue === null) {
        throw new Error('arrayify failed');
    }
    if (length < arrayifyValue.length) {
        throw new Error('cannot pad');
    }
    var result = new Uint8Array(length);
    result.set(arrayifyValue, length - arrayifyValue.length);
    return addSlice(result);
}
exports.padZeros = padZeros;
function isHexString(value, length) {
    if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false;
    }
    if (length && value.length !== 2 + 2 * length) {
        return false;
    }
    return true;
}
exports.isHexString = isHexString;
var HexCharacters = '0123456789abcdef';
function hexlify(value) {
    if (isHexable(value)) {
        return value.toHexString();
    }
    if (typeof value === 'number') {
        if (value < 0) {
            errors.throwError('cannot hexlify negative value', errors.INVALID_ARGUMENT, {
                arg: 'value',
                value: value,
            });
        }
        // @TODO: Roll this into the above error as a numeric fault (overflow); next version, not backward compatible
        // We can about (value == MAX_INT) to as well, since that may indicate we underflowed already
        if (value >= 9007199254740991) {
            errors.throwError('out-of-range', errors.NUMERIC_FAULT, {
                operartion: 'hexlify',
                fault: 'out-of-safe-range',
            });
        }
        var hex = '';
        while (value) {
            hex = HexCharacters[value & 0x0f] + hex;
            value = Math.floor(value / 16);
        }
        if (hex.length) {
            if (hex.length % 2) {
                hex = '0' + hex;
            }
            return '0x' + hex;
        }
        return '0x00';
    }
    if (typeof value === 'string') {
        var match = value.match(/^(0x)?[0-9a-fA-F]*$/);
        if (!match) {
            errors.throwError('invalid hexidecimal string', errors.INVALID_ARGUMENT, {
                arg: 'value',
                value: value,
            });
        }
        if (match !== null && match[1] !== '0x') {
            errors.throwError('hex string must have 0x prefix', errors.INVALID_ARGUMENT, {
                arg: 'value',
                value: value,
            });
        }
        if (value.length % 2) {
            value = '0x0' + value.substring(2);
        }
        return value;
    }
    if (isArrayish(value)) {
        var result = [];
        // tslint:disable-next-line: prefer-for-of
        for (var i = 0; i < value.length; i++) {
            var v = value[i];
            result.push(HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f]);
        }
        return '0x' + result.join('');
    }
    errors.throwError('invalid hexlify value', null, {
        arg: 'value',
        value: value,
    });
    return 'never';
}
exports.hexlify = hexlify;
function hexDataLength(data) {
    if (!isHexString(data) || data.length % 2 !== 0) {
        return null;
    }
    return (data.length - 2) / 2;
}
exports.hexDataLength = hexDataLength;
function hexDataSlice(data, offset, endOffset) {
    if (!isHexString(data)) {
        errors.throwError('invalid hex data', errors.INVALID_ARGUMENT, {
            arg: 'value',
            value: data,
        });
    }
    if (data.length % 2 !== 0) {
        errors.throwError('hex data length must be even', errors.INVALID_ARGUMENT, {
            arg: 'value',
            value: data,
        });
    }
    offset = 2 + 2 * offset;
    if (endOffset != null) {
        return '0x' + data.substring(offset, 2 + 2 * endOffset);
    }
    return '0x' + data.substring(offset);
}
exports.hexDataSlice = hexDataSlice;
function hexStripZeros(value) {
    if (!isHexString(value)) {
        errors.throwError('invalid hex string', errors.INVALID_ARGUMENT, {
            arg: 'value',
            value: value,
        });
    }
    while (value.length > 3 && value.substring(0, 3) === '0x0') {
        value = '0x' + value.substring(3);
    }
    return value;
}
exports.hexStripZeros = hexStripZeros;
function hexZeroPad(value, length) {
    if (!isHexString(value)) {
        errors.throwError('invalid hex string', errors.INVALID_ARGUMENT, {
            arg: 'value',
            value: value,
        });
    }
    while (value.length < 2 * length + 2) {
        value = '0x0' + value.substring(2);
    }
    return value;
}
exports.hexZeroPad = hexZeroPad;
function bytesPadLeft(value, byteLength) {
    if (!isHexString(value)) {
        errors.throwError('invalid hex string', errors.INVALID_ARGUMENT, {
            arg: 'value',
            value: value,
        });
    }
    var striped = value.substring(2);
    if (striped.length > byteLength * 2) {
        throw new Error("hex string length = ".concat(striped.length, " beyond byteLength=").concat(byteLength));
    }
    var padLength = byteLength * 2 - striped.length;
    var returnValue = '0x' + '0'.repeat(padLength) + striped;
    return returnValue;
}
exports.bytesPadLeft = bytesPadLeft;
function bytesPadRight(value, byteLength) {
    if (!isHexString(value)) {
        errors.throwError('invalid hex string', errors.INVALID_ARGUMENT, {
            arg: 'value',
            value: value,
        });
    }
    var striped = value.substring(2);
    if (striped.length > byteLength * 2) {
        throw new Error("hex string length = ".concat(striped.length, " beyond byteLength=").concat(byteLength));
    }
    var padLength = byteLength * 2 - striped.length;
    var returnValue = '0x' + striped + '0'.repeat(padLength);
    return returnValue;
}
exports.bytesPadRight = bytesPadRight;
function isSignature(value) {
    return value && value.r != null && value.s != null;
}
exports.isSignature = isSignature;
function splitSignature(signature) {
    if (signature !== undefined) {
        var v = 0;
        var r = '0x';
        var s = '0x';
        if (isSignature(signature)) {
            if (signature.v == null && signature.recoveryParam == null) {
                errors.throwError('at least on of recoveryParam or v must be specified', errors.INVALID_ARGUMENT, { argument: 'signature', value: signature });
            }
            r = hexZeroPad(signature.r, 32);
            s = hexZeroPad(signature.s, 32);
            v = signature.v || 0;
            if (typeof v === 'string') {
                v = parseInt(v, 16);
            }
            var recoveryParam = signature.recoveryParam || 0;
            if (recoveryParam == null && signature.v != null) {
                recoveryParam = 1 - (v % 2);
            }
            v = 27 + recoveryParam;
        }
        else {
            var bytes = arrayify(signature) || new Uint8Array();
            if (bytes.length !== 65) {
                throw new Error('invalid signature');
            }
            r = hexlify(bytes.slice(0, 32));
            s = hexlify(bytes.slice(32, 64));
            v = bytes[64];
            if (v !== 27 && v !== 28) {
                v = 27 + (v % 2);
            }
        }
        return {
            r: r,
            s: s,
            recoveryParam: v - 27,
            v: v,
        };
    }
    else {
        throw new Error('signature is not found');
    }
}
exports.splitSignature = splitSignature;
function joinSignature(signature) {
    signature = splitSignature(signature);
    return hexlify(concat([signature.r, signature.s, signature.recoveryParam ? '0x1c' : '0x1b']));
}
exports.joinSignature = joinSignature;
/**
 * hexToByteArray
 *
 * Convers a hex string to a Uint8Array
 *
 * @param {string} hex
 * @returns {Uint8Array}
 */
var hexToByteArray = function (hex) {
    var res = new Uint8Array(hex.length / 2);
    for (var i = 0; i < hex.length; i += 2) {
        res[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return res;
};
exports.hexToByteArray = hexToByteArray;
/**
 * hexToIntArray
 *
 * @param {string} hex
 * @returns {number[]}
 */
var hexToIntArray = function (hex) {
    if (!hex || !(0, exports.isHex)(hex)) {
        return [];
    }
    var res = [];
    for (var i = 0; i < hex.length; i++) {
        var c = hex.charCodeAt(i);
        var hi = c >> 8;
        var lo = c & 0xff;
        hi ? res.push(hi, lo) : res.push(lo);
    }
    return res;
};
exports.hexToIntArray = hexToIntArray;
/**
 * isHex
 *
 * @param {string} str - string to be tested
 * @returns {boolean}
 */
var isHex = function (str) {
    var plain = str.replace('0x', '');
    return /[0-9a-f]*$/i.test(plain);
};
exports.isHex = isHex;
//# sourceMappingURL=bytes.js.map