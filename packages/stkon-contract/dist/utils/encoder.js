"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventFilterEncoder = exports.methodEncoder = void 0;
var utils_1 = require("@stkon-js/utils");
var methodEncoder = function (abiCoder, abiItemModel, deployData) {
    if (abiItemModel.isOfType('receive')) {
        return undefined;
    }
    if (abiItemModel.isOfType('fallback')) {
        return abiItemModel.contractMethodParameters.length
            ? abiItemModel.contractMethodParameters[0]
            : undefined;
    }
    var encodedParameters = abiCoder.encodeParameters(abiItemModel.getInputs(), abiItemModel.contractMethodParameters);
    if (encodedParameters.startsWith('0x')) {
        encodedParameters = encodedParameters.slice(2);
    }
    if (abiItemModel.isOfType('constructor')) {
        if (!deployData) {
            throw new Error('The contract has no contract data option set. This is necessary to append the constructor parameters.');
        }
        return deployData + encodedParameters;
    }
    if (abiItemModel.isOfType('function')) {
        return abiItemModel.signature + encodedParameters;
    }
    return encodedParameters;
};
exports.methodEncoder = methodEncoder;
var eventFilterEncoder = function (abiCoder, abiItemModel, filter) {
    var topics = [];
    abiItemModel.getIndexedInputs().forEach(function (input) {
        if (filter[input.name]) {
            var filterItem = filter[input.name];
            if ((0, utils_1.isArray)(filterItem)) {
                filterItem = filterItem.map(function (item) {
                    return abiCoder.encodeParameter(input.type, item);
                });
                topics.push(filterItem);
                return;
            }
            topics.push(abiCoder.encodeParameter(input.type, filterItem));
            return;
        }
        topics.push(null);
    });
    return topics;
};
exports.eventFilterEncoder = eventFilterEncoder;
//# sourceMappingURL=encoder.js.map