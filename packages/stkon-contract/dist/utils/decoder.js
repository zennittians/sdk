"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = void 0;
var decode = function (abiCoder, abiItemModel, response) {
    var argumentTopics = response.topics;
    if (!abiItemModel.anonymous) {
        argumentTopics = response.topics.slice(1);
    }
    if (response.data === '0x') {
        response.data = null;
    }
    response.returnValues = abiCoder.decodeLog(abiItemModel.getInputs(), response.data, argumentTopics);
    response.event = abiItemModel.name;
    response.signature = abiItemModel.signature;
    response.raw = {
        data: response.data,
        topics: response.topics,
    };
    if (abiItemModel.anonymous || !response.topics[0]) {
        response.signature = null;
    }
    delete response.data;
    delete response.topics;
    return response;
};
exports.decode = decode;
//# sourceMappingURL=decoder.js.map