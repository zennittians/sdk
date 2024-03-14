"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbiItem = void 0;
var utils_1 = require("@stkon-js/utils");
var AbiItem = /** @class */ (function () {
    // constructor
    function AbiItem(abiItem) {
        this.abiItem = abiItem;
        this.signature = this.abiItem.signature;
        this.name = this.abiItem.name;
        this.payable = this.abiItem.payable;
        this.anonymous = this.abiItem.anonymous;
        this.type = this.abiItem.type;
        this.inputs = this.abiItem.inputs;
        this.outputs = this.abiItem.outputs;
        this.contractMethodParameters = [];
    }
    AbiItem.prototype.getInputLength = function () {
        if ((0, utils_1.isArray)(this.abiItem.inputs)) {
            return this.abiItem.inputs.length;
        }
        return 0;
    };
    AbiItem.prototype.getInputs = function () {
        if ((0, utils_1.isArray)(this.abiItem.inputs)) {
            return this.abiItem.inputs;
        }
        return [];
    };
    AbiItem.prototype.getOutputs = function () {
        if ((0, utils_1.isArray)(this.abiItem.outputs)) {
            return this.abiItem.outputs;
        }
        return [];
    };
    AbiItem.prototype.getIndexedInputs = function () {
        return this.getInputs().filter(function (input) {
            return input.indexed === true;
        });
    };
    AbiItem.prototype.isOfType = function (type) {
        return this.abiItem.type === type;
    };
    return AbiItem;
}());
exports.AbiItem = AbiItem;
//# sourceMappingURL=AbiItemModel.js.map