"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodFactory = void 0;
var method_1 = require("./method");
var MethodFactory = /** @class */ (function () {
    // constructor
    function MethodFactory(contract) {
        this.contract = contract;
        this.abiModel = this.contract.abiModel;
        this.abiCoder = this.contract.abiCoder;
        this.methodKeys = this.mapMethodKeys();
    }
    MethodFactory.prototype.addMethodsToContract = function () {
        var _this = this;
        this.methodKeys.forEach(function (key) {
            var newObject = {};
            newObject[key] = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return new method_1.ContractMethod(key, params, _this.abiModel.getMethod(key), _this.contract);
            };
            Object.assign(_this.contract.methods, newObject);
        });
        if (this.abiModel.hasFallback()) {
            this.contract.fallback = function (calldata) {
                return new method_1.ContractMethod('fallback', [calldata], _this.abiModel.getFallback(), _this.contract);
            };
        }
        if (this.abiModel.hasReceive()) {
            this.contract.receive = function () {
                return new method_1.ContractMethod('receive', [], _this.abiModel.getReceive(), _this.contract);
            };
        }
        return this.contract;
    };
    /**
     * @function mapMethodKeys
     * @return {string[]} {description}
     */
    MethodFactory.prototype.mapMethodKeys = function () {
        return Object.keys(this.abiModel.abi.methods);
    };
    return MethodFactory;
}());
exports.MethodFactory = MethodFactory;
//# sourceMappingURL=methodFactory.js.map