"use strict";
/**
 * @packageDocumentation
 * @module stkon-account
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMessenger = void 0;
var network_1 = require("@stkon-js/network");
var utils_1 = require("@stkon-js/utils");
exports.defaultMessenger = new network_1.Messenger(new network_1.HttpProvider('http://localhost:9500'), utils_1.ChainType.Stkon, utils_1.ChainID.StkLocal);
//# sourceMappingURL=utils.js.map