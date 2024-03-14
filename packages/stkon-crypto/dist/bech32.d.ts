/**
 * @packageDocumentation
 * @module stkon-crypto
 * @hidden
 */
/// <reference types="node" />
export declare const bech32Encode: (hrp: string, data: Buffer) => string;
export declare const bech32Decode: (bechString: string) => {
    hrp: string;
    data: Buffer;
} | null;
export declare const HRP = "stk";
export declare const tHRP = "tstk";
/**
 * convertBits
 *
 * groups buffers of a certain width to buffers of the desired width.
 *
 * For example, converts byte buffers to buffers of maximum 5 bit numbers,
 * padding those numbers as necessary. Necessary for encoding Ethereum-style
 * addresses as bech32 ones.
 *
 * @param {Buffer} data
 * @param {number} fromWidth
 * @param {number} toWidth
 * @param {boolean} pad
 * @returns {Buffer|null}
 */
export declare const convertBits: (data: Buffer, fromWidth: number, toWidth: number, pad?: boolean) => Buffer | null;
/**
 * toBech32Address
 *
 * bech32Encodes a canonical 20-byte Ethereum-style address as a bech32 Stkon
 * address.
 *
 * The expected format is one1<address><checksum> where address and checksum
 * are the result of bech32 encoding a Buffer containing the address bytes.
 *
 * @param {string} 20 byte canonical address
 * @returns {string} 38 char bech32 bech32Encoded Stkon address
 */
export declare const toBech32: (address: string, useHRP?: string) => string;
/**
 * fromBech32Address
 *
 * @param {string} address - a valid Stkon bech32 address
 * @returns {string} a canonical 20-byte Ethereum-style address
 */
export declare const fromBech32: (address: string, useHRP?: string) => string;
//# sourceMappingURL=bech32.d.ts.map