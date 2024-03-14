"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbiCoderClass = void 0;
var abiCoder_1 = require("./abiCoder");
var utils_1 = require("@stkon-js/utils");
var crypto_1 = require("@stkon-js/crypto");
var utils_2 = require("./utils");
var AbiCoderClass = /** @class */ (function () {
    function AbiCoderClass(coder) {
        this.coder = coder;
    }
    AbiCoderClass.prototype.encodeFunctionSignature = function (functionName) {
        if ((0, utils_1.isObject)(functionName)) {
            functionName = (0, utils_2.jsonInterfaceMethodToString)(functionName);
        }
        var result = (0, crypto_1.keccak256)((0, abiCoder_1.toUtf8Bytes)(functionName));
        return result.slice(0, 10);
    };
    AbiCoderClass.prototype.encodeEventSignature = function (functionName) {
        if ((0, utils_1.isObject)(functionName)) {
            functionName = (0, utils_2.jsonInterfaceMethodToString)(functionName);
        }
        var result = (0, crypto_1.keccak256)((0, abiCoder_1.toUtf8Bytes)(functionName));
        return result;
    };
    AbiCoderClass.prototype.encodeParameter = function (types, param) {
        return this.encodeParameters([types], [param]);
    };
    AbiCoderClass.prototype.encodeParameters = function (types, params) {
        return this.coder.encode(types, params);
    };
    AbiCoderClass.prototype.encodeFunctionCall = function (jsonInterface, params) {
        return (this.encodeFunctionSignature(jsonInterface) +
            this.encodeParameters(jsonInterface.inputs, params).replace('0x', ''));
    };
    AbiCoderClass.prototype.decodeParameter = function (type, bytes) {
        return this.decodeParameters([type], bytes)[0];
    };
    AbiCoderClass.prototype.decodeParameters = function (outputs, bytes) {
        if ((0, utils_1.isArray)(outputs) && outputs.length === 0) {
            throw new Error('Empty outputs array given!');
        }
        if (!bytes || bytes === '0x' || bytes === '0X') {
            throw new Error("Invalid bytes string given: ".concat(bytes));
        }
        var result = this.coder.decode(outputs, bytes);
        var returnValues = {};
        var decodedValue;
        if ((0, utils_1.isArray)(result)) {
            if (outputs.length > 1) {
                outputs.forEach(function (output, i) {
                    decodedValue = result[i];
                    if (decodedValue === '0x') {
                        decodedValue = null;
                    }
                    returnValues[i] = (0, utils_2.bnToString)(decodedValue);
                    if ((0, utils_1.isObject)(output) && output.name) {
                        returnValues[output.name] = (0, utils_2.bnToString)(decodedValue);
                    }
                });
                return returnValues;
            }
            return (0, utils_2.bnToString)(result);
        }
        if ((0, utils_1.isObject)(outputs[0]) && outputs[0].name) {
            returnValues[outputs[0].name] = (0, utils_2.bnToString)(result);
        }
        returnValues[0] = (0, utils_2.bnToString)(result);
        return returnValues;
    };
    AbiCoderClass.prototype.decodeLog = function (inputs, data, topics) {
        var _this = this;
        if (data === void 0) { data = ''; }
        var returnValues = {};
        var topicCount = 0;
        var value;
        var nonIndexedInputKeys = [];
        var nonIndexedInputItems = [];
        if (!(0, utils_1.isArray)(topics)) {
            topics = [topics];
        }
        inputs.forEach(function (input, i) {
            if (input.indexed) {
                if (input.type === 'string') {
                    return;
                }
                value = topics[topicCount];
                if (_this.isStaticType(input.type)) {
                    value = _this.decodeParameter(input.type, topics[topicCount]);
                }
                returnValues[i] = (0, utils_2.bnToString)(value);
                returnValues[input.name] = (0, utils_2.bnToString)(value);
                topicCount++;
                return;
            }
            nonIndexedInputKeys.push(i);
            nonIndexedInputItems.push(input);
        });
        if (data) {
            var values_1 = this.decodeParameters(nonIndexedInputItems, data);
            var decodedValue_1;
            nonIndexedInputKeys.forEach(function (itemKey, index) {
                decodedValue_1 = values_1[index];
                returnValues[itemKey] = (0, utils_2.bnToString)(decodedValue_1);
                returnValues[nonIndexedInputItems[index].name] = (0, utils_2.bnToString)(decodedValue_1);
            });
        }
        return returnValues;
    };
    AbiCoderClass.prototype.isStaticType = function (type) {
        if (type === 'bytes') {
            return false;
        }
        if (type === 'string') {
            return false;
        }
        if (type.indexOf('[') && type.slice(type.indexOf('[')).length === 2) {
            return false;
        }
        return true;
    };
    return AbiCoderClass;
}());
exports.AbiCoderClass = AbiCoderClass;
//# sourceMappingURL=api.js.map