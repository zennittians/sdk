"use strict";
/**
 * @packageDocumentation
 * @module stkon-crypto
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddress = exports.StkonAddress = void 0;
var utils_1 = require("@stkon-js/utils");
var keyTool_1 = require("./keyTool");
var bech32_1 = require("./bech32");
/**
 * ### How to use it?
 *
 * ```
 * // Step 1: import the class
 * const { StkonAddress } = require('@stkon-js/crypto');
 *
 * // Step 2: call functions
 * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
 * const res = StkonAddress.isValidBech32(addr);
 * console.log(res);
 * ```
 */
var StkonAddress = /** @class */ (function () {
    function StkonAddress(raw) {
        this.raw = raw;
        this.basic = this.getBasic(this.raw);
    }
    /**
     * @example
     * ```
     * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
     * const res = StkonAddress.isValidBech32(addr);
     * console.log(res);
     * ```
     */
    StkonAddress.isValidBasic = function (str) {
        var toTest = new StkonAddress(str);
        return toTest.raw === toTest.basic;
    };
    /**
     * @example
     * ```
     * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
     * const res = StkonAddress.isValidChecksum(addr);
     * console.log(res);
     * ```
     */
    StkonAddress.isValidChecksum = function (str) {
        var toTest = new StkonAddress(str);
        return toTest.raw === toTest.checksum;
    };
    /**
     * @example
     * ```
     * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
     * const res = StkonAddress.isValidBech32(addr);
     * console.log(res);
     * ```
     */
    StkonAddress.isValidBech32 = function (str) {
        var toTest = new StkonAddress(str);
        return toTest.raw === toTest.bech32;
    };
    /**
     * @example
     * ```
     * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
     * const res = StkonAddress.isValidBech32TestNet(addr);
     * console.log(res);
     * ```
     */
    StkonAddress.isValidBech32TestNet = function (str) {
        var toTest = new StkonAddress(str);
        return toTest.raw === toTest.bech32TestNet;
    };
    Object.defineProperty(StkonAddress.prototype, "basicHex", {
        /**
         * get basicHex of the address
         *
         * @example
         * ```
         * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
         * const instance = new StkonAddress(addr);
         * console.log(instance.basicHex);
         * ```
         */
        get: function () {
            return "0x".concat(this.basic);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StkonAddress.prototype, "checksum", {
        /**
         * @example
         * ```
         * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
         * const instance = new StkonAddress(addr);
         * console.log(instance.checksum);
         * ```
         */
        get: function () {
            return (0, keyTool_1.toChecksumAddress)("0x".concat(this.basic));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StkonAddress.prototype, "bech32", {
        /**
         * @example
         * ```
         * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
         * const instance = new StkonAddress(addr);
         * console.log(instance.bech32);
         * ```
         */
        get: function () {
            return (0, bech32_1.toBech32)(this.basic, bech32_1.HRP);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StkonAddress.prototype, "bech32TestNet", {
        /**
         * @example
         * ```
         * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
         * const instance = new StkonAddress(addr);
         * console.log(instance.bech32TestNet);
         * ```
         */
        get: function () {
            return (0, bech32_1.toBech32)(this.basic, bech32_1.tHRP);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Check whether the address has an valid address format
     *
     * @param addr string, the address
     *
     * @example
     * ```
     * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
     * const instance = new StkonAddress(addr);
     * const res = instance.getBasic(addr);
     * console.log(res)
     * ```
     */
    StkonAddress.prototype.getBasic = function (addr) {
        var basicBool = (0, utils_1.isAddress)(addr);
        var bech32Bool = (0, utils_1.isBech32Address)(addr);
        var bech32TestNetBool = (0, utils_1.isBech32TestNetAddress)(addr);
        if (basicBool) {
            return addr.replace('0x', '').toLowerCase();
        }
        if (bech32Bool) {
            var fromB32 = (0, bech32_1.fromBech32)(addr, bech32_1.HRP);
            return fromB32.replace('0x', '').toLowerCase();
        }
        if (bech32TestNetBool) {
            var fromB32TestNet = (0, bech32_1.fromBech32)(addr, bech32_1.tHRP);
            return fromB32TestNet.replace('0x', '').toLowerCase();
        }
        throw new Error("\"".concat(addr, "\" is an invalid address format"));
    };
    return StkonAddress;
}());
exports.StkonAddress = StkonAddress;
/**
 * Using this function to get Stkon format address
 *
 * @param address
 *
 * @example
 * ```javascript
 * const { Stkon } = require('@stkon-js/core');
 * const { ChainID, ChainType } = require('@stkon-js/utils');
 * const { randomBytes } = require('@stkon-js/crypto')
 *
 * const stk = new Stkon(
 *   'http://localhost:9500',
 *   {
 *   chainType: ChainType.Stkon,
 *   chainId: ChainID.StkLocal,
 *   },
 * );
 *
 * const bytes = randomBytes(20);
 * const hAddress = stk.crypto.getAddress(bytes);
 * console.log(hAddress)
 * ```
 */
function getAddress(address) {
    try {
        return new StkonAddress(address);
    }
    catch (error) {
        throw error;
    }
}
exports.getAddress = getAddress;
//# sourceMappingURL=address.js.map