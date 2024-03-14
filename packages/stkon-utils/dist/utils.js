"use strict";
/**
 * @packageDocumentation
 * @module stkon-utils
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertObject = exports.generateValidateObjects = exports.validateArgs = exports.validatorArray = exports.AssertType = void 0;
var validators_1 = require("./validators");
/** @hidden */
var AssertType;
(function (AssertType) {
    AssertType["required"] = "required";
    AssertType["optional"] = "optional";
})(AssertType || (exports.AssertType = AssertType = {}));
/** @hidden */
exports.validatorArray = {
    isNumber: [validators_1.isNumber],
    isString: [validators_1.isString],
    isBoolean: [validators_1.isBoolean],
    isArray: [validators_1.isArray],
    isJsonString: [validators_1.isJsonString],
    isObject: [validators_1.isObject],
    isFunction: [validators_1.isFunction],
    isHex: [validators_1.isHex],
    isPublicKey: [validators_1.isPublicKey],
    isPrivateKey: [validators_1.isPrivateKey],
    isAddress: [validators_1.isAddress],
    isHash: [validators_1.isHash],
    isBlockNumber: [validators_1.isBlockNumber],
    isBech32Address: [validators_1.isBech32Address],
    isBech32TestNetAddress: [validators_1.isBech32TestNetAddress],
    isValidAddress: [validators_1.isValidAddress],
};
function validateArgs(args, requiredArgs, optionalArgs) {
    for (var key in requiredArgs) {
        if (args[key] !== undefined) {
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < requiredArgs[key].length; i += 1) {
                if (typeof requiredArgs[key][i] !== 'function') {
                    throw new Error('Validator is not a function');
                }
                if (!requiredArgs[key][i](args[key])) {
                    throw new Error("Validation failed for ".concat(key, ",should be validated by ").concat(requiredArgs[key][i].validator));
                }
            }
        }
        else {
            throw new Error("Key not found: ".concat(key));
        }
    }
    for (var key in optionalArgs) {
        if (args[key]) {
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < optionalArgs[key].length; i += 1) {
                if (typeof optionalArgs[key][i] !== 'function') {
                    throw new Error('Validator is not a function');
                }
                if (!optionalArgs[key][i](args[key])) {
                    throw new Error("Validation failed for ".concat(key, ",should be validated by ").concat(optionalArgs[key][i].validator));
                }
            }
        }
    }
    return true;
}
exports.validateArgs = validateArgs;
function generateValidateObjects(validatorObject) {
    var requiredArgs = {};
    var optionalArgs = {};
    for (var index in validatorObject) {
        if (index !== undefined) {
            var newObjectKey = index;
            var newObjectValid = validatorObject[index][0];
            var isRequired = validatorObject[index][1];
            if (isRequired === AssertType.required) {
                requiredArgs[newObjectKey] = exports.validatorArray[newObjectValid];
            }
            else {
                optionalArgs[newObjectKey] = exports.validatorArray[newObjectValid];
            }
        }
    }
    return { requiredArgs: requiredArgs, optionalArgs: optionalArgs };
}
exports.generateValidateObjects = generateValidateObjects;
var assertObject = function (input) { return function (target, key, descriptor) {
    var _a = generateValidateObjects(input), requiredArgs = _a.requiredArgs, optionalArgs = _a.optionalArgs;
    var original = descriptor.value;
    function interceptor() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        validateArgs(args[0], requiredArgs, optionalArgs);
        return original.apply(this, args);
    }
    descriptor.value = interceptor;
    return descriptor;
}; };
exports.assertObject = assertObject;
//# sourceMappingURL=utils.js.map