"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbiCoder = void 0;
var api_1 = require("./api");
var abiCoder_1 = require("./abiCoder");
function AbiCoder() {
    return new api_1.AbiCoderClass(new abiCoder_1.AbiCoder());
}
exports.AbiCoder = AbiCoder;
//# sourceMappingURL=index.js.map