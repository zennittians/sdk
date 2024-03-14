"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bnToString = exports.flattenTypes = exports.jsonInterfaceMethodToString = void 0;
var utils_1 = require("@stkon-js/utils");
var crypto_1 = require("@stkon-js/crypto");
var jsonInterfaceMethodToString = function (json) {
    if ((0, utils_1.isObject)(json) && json.name && json.name.includes('(')) {
        return json.name;
    }
    return "".concat(json.name, "(").concat((0, exports.flattenTypes)(false, json.inputs).join(','), ")");
};
exports.jsonInterfaceMethodToString = jsonInterfaceMethodToString;
var flattenTypes = function (includeTuple, puts) {
    // console.log("entered _flattenTypes. inputs/outputs: " + puts)
    var types = [];
    puts.forEach(function (param) {
        if (typeof param.components === 'object') {
            if (param.type.substring(0, 5) !== 'tuple') {
                throw new Error('components found but type is not tuple; report on GitHub');
            }
            var suffix = '';
            var arrayBracket = param.type.indexOf('[');
            if (arrayBracket >= 0) {
                suffix = param.type.substring(arrayBracket);
            }
            var result = (0, exports.flattenTypes)(includeTuple, param.components);
            // console.log("result should have things: " + result)
            if ((0, utils_1.isArray)(result) && includeTuple) {
                // console.log("include tuple word, and its an array. joining...: " + result.types)
                types.push("tuple(".concat(result.join(','), ")").concat(suffix));
            }
            else if (!includeTuple) {
                // console.log("don't include tuple, but its an array. joining...: " + result)
                types.push("(".concat(result.join(','), ")").concat(suffix));
            }
            else {
                // console.log("its a single type within a tuple: " + result.types)
                types.push("(".concat(result, ")"));
            }
        }
        else {
            // console.log("its a type and not directly in a tuple: " + param.type)
            types.push(param.type);
        }
    });
    return types;
};
exports.flattenTypes = flattenTypes;
function bnToString(result) {
    if (crypto_1.BN.isBN(result)) {
        return result.toString();
    }
    else {
        return result;
    }
}
exports.bnToString = bnToString;
//# sourceMappingURL=utils.js.map