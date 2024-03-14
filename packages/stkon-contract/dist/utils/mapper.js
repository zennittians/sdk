"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPayable = exports.isConstant = exports.abiMapper = void 0;
var utils_1 = require("@stkon-js/utils");
var AbiItemModel_1 = require("../models/AbiItemModel");
var AbiModel_1 = require("../models/AbiModel");
var utils_2 = require("../abi/utils");
var abiMapper = function (abi, abiCoder) {
    var mappedAbiItems = {
        methods: {},
        events: {},
        fallback: undefined,
        receive: undefined,
    };
    var hasConstructor = false;
    abi.forEach(function (abiItem) {
        abiItem.constant = (0, exports.isConstant)(abiItem);
        abiItem.payable = (0, exports.isPayable)(abiItem);
        if (abiItem.name) {
            abiItem.funcName = (0, utils_2.jsonInterfaceMethodToString)(abiItem);
        }
        var abiItemModel;
        if (abiItem.type === 'function') {
            abiItem.signature = abiCoder.encodeFunctionSignature(abiItem.funcName);
            abiItemModel = new AbiItemModel_1.AbiItem(abiItem);
            // Check if an method already exists with this name and if it exists than create an array and push this abiItem
            // into it. This will be used if there are methods with the same name but with different arguments.
            if (!mappedAbiItems.methods[abiItem.name]) {
                mappedAbiItems.methods[abiItem.name] = abiItemModel;
            }
            else {
                if ((0, utils_1.isArray)(mappedAbiItems.methods[abiItem.name])) {
                    mappedAbiItems.methods[abiItem.name].push(abiItemModel);
                }
                else {
                    mappedAbiItems.methods[abiItem.name] = [
                        mappedAbiItems.methods[abiItem.name],
                        abiItemModel,
                    ];
                }
            }
            mappedAbiItems.methods[abiItem.signature] = abiItemModel;
            mappedAbiItems.methods[abiItem.funcName] = abiItemModel;
            return;
        }
        if (abiItem.type === 'event') {
            abiItem.signature = abiCoder.encodeEventSignature(abiItem.funcName);
            abiItemModel = new AbiItemModel_1.AbiItem(abiItem);
            if (!mappedAbiItems.events[abiItem.name] ||
                mappedAbiItems.events[abiItem.name].name === 'bound ') {
                mappedAbiItems.events[abiItem.name] = abiItemModel;
            }
            mappedAbiItems.events[abiItem.signature] = abiItemModel;
            mappedAbiItems.events[abiItem.funcName] = abiItemModel;
        }
        if (abiItem.type === 'fallback' || abiItem.type === 'receive') {
            abiItem.signature = abiItem.type;
            mappedAbiItems[abiItem.type] = new AbiItemModel_1.AbiItem(abiItem);
        }
        if (abiItem.type === 'constructor') {
            abiItem.signature = abiItem.type;
            // tslint:disable-next-line: no-string-literal
            mappedAbiItems.methods['contractConstructor'] = new AbiItemModel_1.AbiItem(abiItem);
            hasConstructor = true;
        }
    });
    if (!hasConstructor) {
        // tslint:disable-next-line: no-string-literal
        mappedAbiItems.methods['contractConstructor'] = new AbiItemModel_1.AbiItem({
            inputs: [],
            payable: false,
            constant: false,
            type: 'constructor',
        });
    }
    return new AbiModel_1.AbiModel(mappedAbiItems);
};
exports.abiMapper = abiMapper;
var isConstant = function (abiItem) {
    return (abiItem.stateMutability === 'view' || abiItem.stateMutability === 'pure' || abiItem.constant);
};
exports.isConstant = isConstant;
var isPayable = function (abiItem) {
    return abiItem.stateMutability === 'payable' || abiItem.payable;
};
exports.isPayable = isPayable;
//# sourceMappingURL=mapper.js.map