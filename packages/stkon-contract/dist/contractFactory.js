"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractFactory = void 0;
var contract_1 = require("./contract");
var ContractFactory = /** @class */ (function () {
    function ContractFactory(wallet) {
        this.wallet = wallet;
    }
    ContractFactory.prototype.createContract = function (abi, address, options) {
        return new contract_1.Contract(abi, address, options, this.wallet);
    };
    return ContractFactory;
}());
exports.ContractFactory = ContractFactory;
//# sourceMappingURL=contractFactory.js.map