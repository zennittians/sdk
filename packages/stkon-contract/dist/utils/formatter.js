"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTopic = exports.inputAddressFormatter = exports.isPredefinedBlockNumber = exports.inputBlockNumberFormatter = exports.outputLogFormatter = exports.inputLogFormatter = void 0;
var crypto_1 = require("@stkon-js/crypto");
var utils_1 = require("@stkon-js/utils");
var abiCoder_1 = require("../abi/abiCoder");
var inputLogFormatter = function (options) {
    if (options.fromBlock) {
        options.fromBlock = (0, exports.inputBlockNumberFormatter)(options.fromBlock);
    }
    if (options.toBlock) {
        options.toBlock = (0, exports.inputBlockNumberFormatter)(options.toBlock);
    }
    // make sure topics, get converted to hex
    options.topics = options.topics || [];
    options.topics = options.topics.map(function (topic) {
        return (0, utils_1.isArray)(topic) ? topic.map(exports.toTopic) : (0, exports.toTopic)(topic);
    });
    if (options.address) {
        if ((0, utils_1.isArray)(options.address)) {
            options.address = options.address.map(function (addr) {
                return (0, exports.inputAddressFormatter)(addr);
            });
        }
        else {
            options.address = (0, exports.inputAddressFormatter)(options.address);
        }
    }
    return options;
};
exports.inputLogFormatter = inputLogFormatter;
/**
 * Formats the output of a log
 *
 * @method outputLogFormatter
 *
 * @param {Object} log object
 *
 * @returns {Object} log
 */
var outputLogFormatter = function (log) {
    // generate a custom log id
    if (typeof log.blockHash === 'string' &&
        typeof log.transactionHash === 'string' &&
        typeof log.logIndex === 'string') {
        var shaId = (0, crypto_1.keccak256)('0x' +
            log.blockHash.replace('0x', '') +
            log.transactionHash.replace('0x', '') +
            log.logIndex.replace('0x', ''));
        shaId.replace('0x', '').substr(0, 8);
        log.id = "log_".concat(shaId);
    }
    else if (!log.id) {
        log.id = null;
    }
    if (log.blockNumber !== null) {
        log.blockNumber = (0, utils_1.hexToBN)(log.blockNumber).toNumber();
    }
    if (log.transactionIndex !== null) {
        log.transactionIndex = (0, utils_1.hexToBN)(log.transactionIndex).toNumber();
    }
    if (log.logIndex !== null) {
        log.logIndex = (0, utils_1.hexToBN)(log.logIndex).toNumber();
    }
    if (log.address) {
        log.address = (0, crypto_1.toChecksumAddress)(log.address);
    }
    return log;
};
exports.outputLogFormatter = outputLogFormatter;
var inputBlockNumberFormatter = function (blockNumber) {
    if (blockNumber === undefined || blockNumber === null || (0, exports.isPredefinedBlockNumber)(blockNumber)) {
        return blockNumber;
    }
    if ((0, crypto_1.isHexString)(blockNumber)) {
        if ((0, utils_1.isString)(blockNumber)) {
            return blockNumber.toLowerCase();
        }
        return blockNumber;
    }
    return (0, utils_1.numberToHex)(blockNumber);
};
exports.inputBlockNumberFormatter = inputBlockNumberFormatter;
var isPredefinedBlockNumber = function (blockNumber) {
    return blockNumber === 'latest' || blockNumber === 'pending' || blockNumber === 'earliest';
};
exports.isPredefinedBlockNumber = isPredefinedBlockNumber;
var inputAddressFormatter = function (address) {
    if ((0, utils_1.isAddress)(address)) {
        return "0x".concat(address.toLowerCase().replace('0x', ''));
    }
    throw new Error("Provided address \"".concat(address, "\" is invalid, the capitalization checksum test failed, or its an indrect IBAN address which can't be converted."));
};
exports.inputAddressFormatter = inputAddressFormatter;
var toTopic = function (value) {
    if (value === null || typeof value === 'undefined') {
        return null;
    }
    value = String(value);
    if (value.indexOf('0x') === 0) {
        return value;
    }
    return (0, crypto_1.hexlify)((0, abiCoder_1.toUtf8Bytes)(value));
};
exports.toTopic = toTopic;
//# sourceMappingURL=formatter.js.map