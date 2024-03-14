"use strict";
/**
 * @packageDocumentation
 * @module stkon-crypto
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBytes = void 0;
/**
 * Uses JS-native CSPRNG to generate a specified number of bytes.
 * @NOTE
 * this method throws if no PRNG is available.
 * @param {Number} bytes bytes number to generate
 * @return {String} ramdom hex string
 */
var randomBytes = function (bytes) {
    var randBz;
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        randBz = window.crypto.getRandomValues(new Uint8Array(bytes));
    }
    else if (typeof require !== 'undefined') {
        randBz = require('crypto').randomBytes(bytes);
    }
    else {
        throw new Error('Unable to generate safe random numbers.');
    }
    var randStr = '';
    for (var i = 0; i < bytes; i += 1) {
        randStr += "00".concat(randBz[i].toString(16)).slice(-2);
    }
    return randStr;
};
exports.randomBytes = randomBytes;
//# sourceMappingURL=random.js.map