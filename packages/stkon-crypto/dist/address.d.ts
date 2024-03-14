/**
 * @packageDocumentation
 * @module stkon-crypto
 */
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
export declare class StkonAddress {
    /**
     * @example
     * ```
     * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
     * const res = StkonAddress.isValidBech32(addr);
     * console.log(res);
     * ```
     */
    static isValidBasic(str: string): boolean;
    /**
     * @example
     * ```
     * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
     * const res = StkonAddress.isValidChecksum(addr);
     * console.log(res);
     * ```
     */
    static isValidChecksum(str: string): boolean;
    /**
     * @example
     * ```
     * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
     * const res = StkonAddress.isValidBech32(addr);
     * console.log(res);
     * ```
     */
    static isValidBech32(str: string): boolean;
    /**
     * @example
     * ```
     * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
     * const res = StkonAddress.isValidBech32TestNet(addr);
     * console.log(res);
     * ```
     */
    static isValidBech32TestNet(str: string): boolean;
    raw: string;
    basic: string;
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
    get basicHex(): string;
    /**
     * @example
     * ```
     * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
     * const instance = new StkonAddress(addr);
     * console.log(instance.checksum);
     * ```
     */
    get checksum(): string;
    /**
     * @example
     * ```
     * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
     * const instance = new StkonAddress(addr);
     * console.log(instance.bech32);
     * ```
     */
    get bech32(): string;
    /**
     * @example
     * ```
     * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
     * const instance = new StkonAddress(addr);
     * console.log(instance.bech32TestNet);
     * ```
     */
    get bech32TestNet(): string;
    constructor(raw: string);
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
    private getBasic;
}
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
export declare function getAddress(address: string): StkonAddress;
//# sourceMappingURL=address.d.ts.map