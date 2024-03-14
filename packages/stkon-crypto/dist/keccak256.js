"use strict";
/**
 * @packageDocumentation
 * @module stkon-crypto
 * @ignore
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.keccak256 = void 0;
var tslib_1 = require("tslib");
// this file is ported from 'ether.js' and done some fixes
var sha3 = tslib_1.__importStar(require("js-sha3"));
var bytes_1 = require("./bytes");
function keccak256(data) {
    var arrayified = (0, bytes_1.arrayify)(data);
    if (arrayified) {
        return '0x' + sha3.keccak_256(arrayified);
    }
    throw new Error('arrayify failed');
}
exports.keccak256 = keccak256;
// export function sha3_256(data: Arrayish): string {
//   const arrayified = arrayify(data);
//   if (arrayified) {
//     return '0x' + sha3.sha3_256(arrayified);
//   }
//   throw new Error('arrayify failed');
// }
//# sourceMappingURL=keccak256.js.map