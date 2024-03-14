/**
 * @packageDocumentation
 * @module stkon-crypto
 */

import { isAddress, isBech32Address, isBech32TestNetAddress } from '@stkon-js/utils';

import { toChecksumAddress } from './keyTool';
import { fromBech32, toBech32, HRP, tHRP } from './bech32';

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
export class StkonAddress {
  /**
   * @example
   * ```
   * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
   * const res = StkonAddress.isValidBech32(addr);
   * console.log(res);
   * ```
   */
  static isValidBasic(str: string) {
    const toTest = new StkonAddress(str);
    return toTest.raw === toTest.basic;
  }

  /**
   * @example
   * ```
   * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
   * const res = StkonAddress.isValidChecksum(addr);
   * console.log(res);
   * ```
   */
  static isValidChecksum(str: string) {
    const toTest = new StkonAddress(str);
    return toTest.raw === toTest.checksum;
  }

  /**
   * @example
   * ```
   * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
   * const res = StkonAddress.isValidBech32(addr);
   * console.log(res);
   * ```
   */
  static isValidBech32(str: string) {
    const toTest = new StkonAddress(str);
    return toTest.raw === toTest.bech32;
  }

  /**
   * @example
   * ```
   * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
   * const res = StkonAddress.isValidBech32TestNet(addr);
   * console.log(res);
   * ```
   */
  static isValidBech32TestNet(str: string) {
    const toTest = new StkonAddress(str);
    return toTest.raw === toTest.bech32TestNet;
  }

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
  get basicHex() {
    return `0x${this.basic}`;
  }

  /**
   * @example
   * ```
   * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
   * const instance = new StkonAddress(addr);
   * console.log(instance.checksum);
   * ```
   */
  get checksum() {
    return toChecksumAddress(`0x${this.basic}`);
  }

  /**
   * @example
   * ```
   * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
   * const instance = new StkonAddress(addr);
   * console.log(instance.bech32);
   * ```
   */
  get bech32() {
    return toBech32(this.basic, HRP);
  }

  /**
   * @example
   * ```
   * const addr = 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
   * const instance = new StkonAddress(addr);
   * console.log(instance.bech32TestNet);
   * ```
   */
  get bech32TestNet() {
    return toBech32(this.basic, tHRP);
  }

  constructor(raw: string) {
    this.raw = raw;
    this.basic = this.getBasic(this.raw);
  }

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
  private getBasic(addr: string) {
    const basicBool = isAddress(addr);
    const bech32Bool = isBech32Address(addr);
    const bech32TestNetBool = isBech32TestNetAddress(addr);

    if (basicBool) {
      return addr.replace('0x', '').toLowerCase();
    }

    if (bech32Bool) {
      const fromB32 = fromBech32(addr, HRP);
      return fromB32.replace('0x', '').toLowerCase();
    }

    if (bech32TestNetBool) {
      const fromB32TestNet = fromBech32(addr, tHRP);
      return fromB32TestNet.replace('0x', '').toLowerCase();
    }

    throw new Error(`"${addr}" is an invalid address format`);
  }
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
export function getAddress(address: string) {
  try {
    return new StkonAddress(address);
  } catch (error) {
    throw error;
  }
}
