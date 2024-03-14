"use strict";
/**
 # @stkon-js/contract

This package provides a collection of apis to create, deploy, and interact with smart contracts. In stkon, smart contracts all fully EVM compatible and the formats and terminologies match 1-to-1 with EVM smart contracts.

## Installation

```
npm install @stkon-js/contract
```

## Usage

Deploying a contract using `contractConstructor`
```javascript
const { ContractFactory } = require('@stkon-js/contract');
const { Wallet } = require('@stkon-js/account');
const { Messenger, HttpProvider } = require('@stkon-js/network');
const { ChainID, ChainType, hexToNumber } = require('@stkon-js/utils');

* const wallet = new Wallet(
*   new Messenger(
*     new HttpProvider('https://api.s0.b.stkon.xyz'),
*     ChainType.Stkon,
*     ChainID.StkTestnet,
*   ),
* );
* const factory = new ContractFactory(wallet);

* const contractJson = require("./Counter.json");
* const contract = factory.createContract(contractJson.abi);

* const options1 = { gasPrice: '0x3B9ACA00' }; // gas price in hex corresponds to 1 Gwei or 1000000000
* let options2 = { gasPrice: 1000000000, gasLimit: 21000 }; // setting the default gas limit, but changing later based on estimate gas

* const options3 = { data: contractJson.bytecode }; // contractConstructor needs contract bytecode to deploy

* contract.wallet.addByPrivateKey('1f054c21a0f57ebc402c00e14bd1707ddf45542d4ed9989933dbefc4ea96ca68');

* contract.methods.contractConstructor(options3).estimateGas(options1).then(gas => {
*   options2 = {...options2, gasLimit: hexToNumber(gas)};
*   contract.methods.contractConstructor(options3).send(options2).then(response => {
*     console.log('contract deployed at ' + response.transaction.receipt.contractAddress);
*   });
* });
```
Instead of `contract.methods.contractConstructor`, `contract.deploy` could be used and it will work.

Loading a contract object using the contract json and contract address for interacting with it
```javascript
* const { Stkon } = require("@stkon-js/core");
* const { ChainID, ChainType } = require("@stkon-js/utils");
* const stk = new Stkon("https://api.s0.b.stkon.xyz", {
*   chainType: ChainType.Stkon,
*   chainId: ChainID.StkTestnet,
* });

const contractJson = require("./Counter.json");
const contractAddr = "0x19f64050e6b2d376e52AC426E366c49EEb0724B1";

const contract = stk.contracts.createContract(contractJson.abi, contractAddr);
console.log(contract.methods);
```

Directly loading contract using `ContractFactory`
```javascript
const { ContractFactory } = require('@stkon-js/contract');
const { Wallet } = require('@stkon-js/account');
const { Messenger, HttpProvider } = require('@stkon-js/network');
const { ChainID, ChainType, hexToNumber } = require('@stkon-js/utils');

* const wallet = new Wallet(new Messenger(
*   new HttpProvider('https://api.s0.b.stkon.xyz'),
*   ChainType.Stkon,
*   ChainID.StkTestnet,
* ));
const factory = new ContractFactory(wallet);
const contract = factory.createContract(contractJson.abi, contractAddr);
```

Estimate gas for contract methods
```javascript
* const options1 = { gasPrice: '0x3B9ACA00' }; // gas price in hex corresponds to 1 Gwei or 1000000000

* contract.methods.getCount().estimateGas(options1).then(gas => {
*   console.log('gas required for getCount is ' + hexToNumber(gas));
* });
```

Call contract read-only methods. Stkon uses 1 Gwei gas price and gas limit of 21000 by default. Use the estimate gas api to correctly set the gas limit.
```javascript
* const options1 = { gasPrice: '0x3B9ACA00' }; // gas price in hex corresponds to 1 Gwei or 1000000000
* let options2 = { gasPrice: 1000000000, gasLimit: 21000 }; // setting the default gas limit, but changing later based on estimate gas

* contract.methods.getCount().estimateGas(options1).then(gas => {
*   options2 = {...options2, gasLimit: hexToNumber(gas)};
*   contract.methods.getCount().call(options2).then(count => {
*     console.log('counter value: ' + count);
*   });
* });
```

Invoking contract modification methods using `send` api. Need to add a signing account to the contract wallet, otherwise `send` api will not work.
```javascript
* const options1 = { gasPrice: '0x3B9ACA00' }; // gas price in hex corresponds to 1 Gwei or 1000000000
* let options2 = { gasPrice: 1000000000, gasLimit: 21000 }; // setting the default gas limit, but changing later based on estimate gas

* contract.wallet.addByPrivateKey('1f054c21a0f57ebc402c00e14bd1707ddf45542d4ed9989933dbefc4ea96ca68');

* contract.methods.incrementCounter().estimateGas(options1).then(gas => {
*   options2 = {...options2, gasLimit: hexToNumber(gas)};
*   contract.methods.incrementCounter().send(options2).then(response => {
*     console.log(response.transaction.receipt);
*   });
* });
```

All the above apis can also be asynchronously executed using `async` and `await`.

Subscribing to the contract events requires web socket based messenger.
```javascript
* const { ContractFactory } = require('@stkon-js/contract');
* const { Wallet } = require('@stkon-js/account');
* const { Messenger, WSProvider } = require('@stkon-js/network');
* const { ChainID, ChainType, hexToNumber } = require('@stkon-js/utils');
* const ws = new WSProvider('wss://ws.s0.b.stkon.xyz');

* const wallet = new Wallet(
*   new Messenger(
*     ws,
*     ChainType.Stkon,
*     ChainID.StkTestnet,
*   ),
* );
* const factory = new ContractFactory(wallet);

* const contractJson = require("./Counter.json");
* const contractAddr = '0x8ada52172abda19b9838eb00498a40952be6a019';

* const contract = factory.createContract(contractJson.abi, contractAddr);

* contract.events
*   .IncrementedBy()
*   .on('data', (event) => {
*     console.log(event);
*   })
*   .on('error', console.error);
```
 *
 * @packageDocumentation
 * @module stkon-contract
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultAbiCoder = exports.AbiCoder = exports.deepCopy = exports.shallowCopy = exports.isType = exports.parseBytes32String = exports.formatBytes32String = exports.toUtf8String = exports.toUtf8Bytes = exports.UnicodeNormalizationForm = exports.parseSignature = exports.formatSignature = exports.formatParamType = exports.parseParamType = exports.defaultCoerceFunc = void 0;
var tslib_1 = require("tslib");
// this file is mainly ported from `ethers.js`, but done some fixes
// 1. added bytesPadRight support
// 2. ts-lint
// 3. use BN as default Bignumber instance
var crypto_1 = require("@stkon-js/crypto");
var utils_1 = require("@stkon-js/utils");
/** @hidden */
var NegativeOne = new crypto_1.BN(-1);
/** @hidden */
var One = new crypto_1.BN(1);
/** @hidden */
var Zero = new crypto_1.BN(0);
/** @hidden */
var HashZero = '0x0000000000000000000000000000000000000000000000000000000000000000';
/** @hidden */
var MaxUint256 = (0, utils_1.hexToBN)('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
///////////////////////////////
/** @hidden */
var paramTypeBytes = new RegExp(/^bytes([0-9]*)$/);
/** @hidden */
var paramTypeNumber = new RegExp(/^(u?int)([0-9]*)$/);
/** @hidden */
var paramTypeArray = new RegExp(/^(.*)\[([0-9]*)\]$/);
/** @hidden */
var defaultCoerceFunc = function (type, value) {
    var match = type.match(paramTypeNumber);
    if (match && parseInt(match[2], 10) <= 48) {
        // return value.toNumber();
        return value.toString('hex');
    }
    return value;
};
exports.defaultCoerceFunc = defaultCoerceFunc;
///////////////////////////////////
// Parsing for Solidity Signatures
///////////////////////////////////
// Parsing for Solidity Signatures
/** @hidden */
var regexParen = new RegExp('^([^)(]*)\\((.*)\\)([^)(]*)$');
/** @hidden */
var regexIdentifier = new RegExp('^[A-Za-z_][A-Za-z0-9_]*$');
/** @hidden */
function verifyType(type) {
    // These need to be transformed to their full description
    if (type.match(/^uint($|[^1-9])/)) {
        type = 'uint256' + type.substring(4);
    }
    else if (type.match(/^int($|[^1-9])/)) {
        type = 'int256' + type.substring(3);
    }
    return type;
}
/** @hidden */
function parseParam(param, allowIndexed) {
    var originalParam = param;
    // tslint:disable-next-line: no-shadowed-variable
    function throwError(i) {
        throw new Error('unexpected character "' +
            originalParam[i] +
            '" at position ' +
            i +
            ' in "' +
            originalParam +
            '"');
    }
    param = param.replace(/\s/g, ' ');
    var parent = { type: '', name: '', state: { allowType: true } };
    var node = parent;
    for (var i = 0; i < param.length; i++) {
        var c = param[i];
        switch (c) {
            case '(':
                if (!node.state || !node.state.allowParams) {
                    throwError(i);
                }
                if (node.state) {
                    node.state.allowType = false;
                }
                if (node.type) {
                    node.type = verifyType(node.type);
                }
                node.components = [{ type: '', name: '', parent: node, state: { allowType: true } }];
                node = node.components[0];
                break;
            case ')':
                delete node.state;
                if (allowIndexed && node.name === 'indexed') {
                    node.indexed = true;
                    node.name = '';
                }
                if (node.type) {
                    node.type = verifyType(node.type);
                }
                var child = node;
                node = node.parent;
                if (!node) {
                    throwError(i);
                }
                delete child.parent;
                if (node.state) {
                    node.state.allowParams = false;
                    node.state.allowName = true;
                    node.state.allowArray = true;
                }
                break;
            case ',':
                delete node.state;
                if (allowIndexed && node.name === 'indexed') {
                    node.indexed = true;
                    node.name = '';
                }
                if (node.type) {
                    node.type = verifyType(node.type);
                }
                var sibling = {
                    type: '',
                    name: '',
                    parent: node.parent,
                    state: { allowType: true },
                };
                node.parent.components.push(sibling);
                delete node.parent;
                node = sibling;
                break;
            // Hit a space...
            case ' ':
                // If reading type, the type is done and may read a param or name
                if (node.state) {
                    if (node.state.allowType) {
                        if (node.type !== '' && node.type) {
                            node.type = verifyType(node.type);
                            delete node.state.allowType;
                            node.state.allowName = true;
                            node.state.allowParams = true;
                        }
                    }
                    // If reading name, the name is done
                    if (node.state.allowName) {
                        if (node.name !== '') {
                            if (allowIndexed && node.name === 'indexed') {
                                node.indexed = true;
                                node.name = '';
                            }
                            else {
                                node.state.allowName = false;
                            }
                        }
                    }
                }
                break;
            case '[':
                if (!node.state || !node.state.allowArray) {
                    throwError(i);
                }
                if (node.state) {
                    node.type += c;
                    node.state.allowArray = false;
                    node.state.allowName = false;
                    node.state.readArray = true;
                }
                break;
            case ']':
                if (!node.state || !node.state.readArray) {
                    throwError(i);
                }
                if (node.state) {
                    node.type += c;
                    node.state.readArray = false;
                    node.state.allowArray = true;
                    node.state.allowName = true;
                }
                break;
            default:
                if (node.state) {
                    if (node.state.allowType) {
                        node.type += c;
                        node.state.allowParams = true;
                        node.state.allowArray = true;
                    }
                    else if (node.state.allowName) {
                        node.name += c;
                        delete node.state.allowArray;
                    }
                    else if (node.state.readArray) {
                        node.type += c;
                    }
                    else {
                        throwError(i);
                    }
                }
        }
    }
    if (node.parent) {
        throw new Error('unexpected eof');
    }
    delete parent.state;
    if (allowIndexed && node.name === 'indexed') {
        node.indexed = true;
        node.name = '';
    }
    if (parent.type) {
        parent.type = verifyType(parent.type);
    }
    return parent;
}
// @TODO: Better return type
/** @hidden */
function parseSignatureEvent(fragment) {
    var abi = {
        anonymous: false,
        inputs: [],
        name: '',
        type: 'event',
    };
    var match = fragment.match(regexParen);
    if (!match) {
        throw new Error('invalid event: ' + fragment);
    }
    abi.name = match[1].trim();
    splitNesting(match[2]).forEach(function (param) {
        param = parseParam(param, true);
        param.indexed = !!param.indexed;
        abi.inputs.push(param);
    });
    match[3].split(' ').forEach(function (modifier) {
        switch (modifier) {
            case 'anonymous':
                abi.anonymous = true;
                break;
            case '':
                break;
            default:
                (0, crypto_1.info)('unknown modifier: ' + modifier);
        }
    });
    if (abi.name && !abi.name.match(regexIdentifier)) {
        throw new Error('invalid identifier: "' + abi.name + '"');
    }
    return abi;
}
/** @hidden */
function parseParamType(type) {
    return parseParam(type, true);
}
exports.parseParamType = parseParamType;
// @TODO: Allow a second boolean to expose names
/** @hidden */
function formatParamType(paramType) {
    return getParamCoder(exports.defaultCoerceFunc, paramType).type;
}
exports.formatParamType = formatParamType;
/** @hidden */
function parseSignatureFunction(fragment) {
    var abi = {
        constant: false,
        gas: null,
        inputs: [],
        name: '',
        outputs: [],
        payable: false,
        stateMutability: null, // @TODO: Should this be initialized to 'nonpayable'?
        type: 'function',
    };
    var comps = fragment.split('@');
    if (comps.length !== 1) {
        if (comps.length > 2) {
            throw new Error('invalid signature');
        }
        if (!comps[1].match(/^[0-9]+$/)) {
            throw new Error('invalid signature gas');
        }
        abi.gas = new crypto_1.BN(comps[1]);
        fragment = comps[0];
    }
    comps = fragment.split(' returns ');
    var left = comps[0].match(regexParen);
    if (!left) {
        throw new Error('invalid signature');
    }
    abi.name = left[1].trim();
    if (!abi.name.match(regexIdentifier)) {
        throw new Error('invalid identifier: "' + left[1] + '"');
    }
    splitNesting(left[2]).forEach(function (param) {
        abi.inputs.push(parseParam(param));
    });
    left[3].split(' ').forEach(function (modifier) {
        switch (modifier) {
            case 'constant':
                abi.constant = true;
                break;
            case 'payable':
                abi.payable = true;
                abi.stateMutability = 'payable';
                break;
            case 'pure':
                abi.constant = true;
                abi.stateMutability = 'pure';
                break;
            case 'view':
                abi.constant = true;
                abi.stateMutability = 'view';
                break;
            case 'external':
            case 'public':
            case '':
                break;
            default:
                (0, crypto_1.info)('unknown modifier: ' + modifier);
        }
    });
    // We have outputs
    if (comps.length > 1) {
        var right = comps[1].match(regexParen);
        if (right === null || right[1].trim() !== '' || right[3].trim() !== '') {
            throw new Error('unexpected tokens');
        }
        splitNesting(right[2]).forEach(function (param) {
            abi.outputs.push(parseParam(param));
        });
    }
    if (abi.name === 'constructor') {
        abi.type = 'constructor';
        if (abi.outputs.length) {
            delete abi.name;
            delete abi.outputs;
        }
    }
    return abi;
}
// @TODO: Allow a second boolean to expose names and modifiers
/** @hidden */
function formatSignature(fragment) {
    return fragment.name + '(' + fragment.inputs.map(function (i) { return formatParamType(i); }).join(',') + ')';
}
exports.formatSignature = formatSignature;
/** @hidden */
function parseSignature(fragment) {
    if (typeof fragment === 'string') {
        // Make sure the "returns" is surrounded by a space and all whitespace is exactly one space
        fragment = fragment.replace(/\s/g, ' ');
        fragment = fragment
            .replace(/\(/g, ' (')
            .replace(/\)/g, ') ')
            .replace(/\s+/g, ' ');
        fragment = fragment.trim();
        if (fragment.substring(0, 6) === 'event ') {
            return parseSignatureEvent(fragment.substring(6).trim());
        }
        else {
            if (fragment.substring(0, 9) === 'function ') {
                fragment = fragment.substring(9);
            }
            return parseSignatureFunction(fragment.trim());
        }
    }
    throw new Error('unknown signature');
}
exports.parseSignature = parseSignature;
/** @hidden */
var Coder = /** @class */ (function () {
    function Coder(coerceFunc, name, type, localName, dynamic) {
        this.coerceFunc = coerceFunc;
        this.name = name;
        this.type = type;
        this.localName = localName;
        this.dynamic = dynamic;
    }
    return Coder;
}());
// Clones the functionality of an existing Coder, but without a localName
// tslint:disable-next-line: max-classes-per-file
/** @hidden */
var CoderAnonymous = /** @class */ (function (_super) {
    tslib_1.__extends(CoderAnonymous, _super);
    function CoderAnonymous(coder) {
        var _this = _super.call(this, coder.coerceFunc, coder.name, coder.type, undefined, coder.dynamic) || this;
        _this.coder = coder;
        return _this;
    }
    CoderAnonymous.prototype.encode = function (value) {
        return this.coder.encode(value);
    };
    CoderAnonymous.prototype.decode = function (data, offset) {
        return this.coder.decode(data, offset);
    };
    return CoderAnonymous;
}(Coder));
// tslint:disable-next-line: max-classes-per-file
/** @hidden */
var CoderNull = /** @class */ (function (_super) {
    tslib_1.__extends(CoderNull, _super);
    function CoderNull(coerceFunc, localName) {
        return _super.call(this, coerceFunc, 'null', '', localName, false) || this;
    }
    CoderNull.prototype.encode = function (value) {
        var result = (0, crypto_1.arrayify)([]) || new Uint8Array();
        return result;
    };
    CoderNull.prototype.decode = function (data, offset) {
        if (offset > data.length) {
            throw new Error('invalid null');
        }
        return {
            consumed: 0,
            value: this.coerceFunc('null', undefined),
        };
    };
    return CoderNull;
}(Coder));
// tslint:disable-next-line: max-classes-per-file
/** @hidden */
var CoderNumber = /** @class */ (function (_super) {
    tslib_1.__extends(CoderNumber, _super);
    function CoderNumber(coerceFunc, size, signed, localName) {
        var _this = this;
        var name = (signed ? 'int' : 'uint') + size * 8;
        _this = _super.call(this, coerceFunc, name, name, localName, false) || this;
        _this.size = size;
        _this.signed = signed;
        return _this;
    }
    CoderNumber.prototype.encode = function (value) {
        var result;
        try {
            var v = void 0;
            if (typeof value == 'string' && value.startsWith('0x')) {
                v = new crypto_1.BN(value.slice(2), 'hex');
            }
            else {
                v = new crypto_1.BN(value);
            }
            if (this.signed) {
                var bounds = MaxUint256.maskn(this.size * 8 - 1);
                if (v.gt(bounds)) {
                    throw new Error('out-of-bounds');
                }
                bounds = bounds.add(One).mul(NegativeOne);
                if (v.lt(bounds)) {
                    throw new Error('out-of-bounds');
                }
            }
            else if (v.lt(Zero) || v.gt(MaxUint256.maskn(this.size * 8))) {
                throw new Error('out-of-bounds');
            }
            v = v.toTwos(this.size * 8).maskn(this.size * 8);
            if (this.signed) {
                v = v.fromTwos(this.size * 8).toTwos(256);
            }
            var vString = v.toString('hex');
            result = (0, crypto_1.padZeros)((0, crypto_1.arrayify)("0x".concat(vString)) || new Uint8Array(), 32);
        }
        catch (error) {
            (0, crypto_1.throwError)('invalid number value', crypto_1.INVALID_ARGUMENT, {
                arg: this.localName,
                coderType: this.name,
                value: value,
            });
        }
        return result || (0, crypto_1.padZeros)(new Uint8Array(), 32);
    };
    CoderNumber.prototype.decode = function (data, offset) {
        if (data.length < offset + 32) {
            (0, crypto_1.throwError)('insufficient data for ' + this.name + ' type', crypto_1.INVALID_ARGUMENT, {
                arg: this.localName,
                coderType: this.name,
                value: (0, crypto_1.hexlify)(data.slice(offset, offset + 32)),
            });
        }
        var junkLength = 32 - this.size;
        var dataValue = (0, crypto_1.hexlify)(data.slice(offset + junkLength, offset + 32));
        var value = (0, utils_1.hexToBN)(dataValue);
        // tslint:disable-next-line: prefer-conditional-expression
        if (this.signed) {
            value = value.fromTwos(this.size * 8);
        }
        else {
            value = value.maskn(this.size * 8);
        }
        return {
            consumed: 32,
            value: this.coerceFunc(this.name, value),
        };
    };
    return CoderNumber;
}(Coder));
/** @hidden */
var uint256Coder = new CoderNumber(function (type, value) {
    return value;
}, 32, false, 'none');
// tslint:disable-next-line: max-classes-per-file
/** @hidden */
var CoderBoolean = /** @class */ (function (_super) {
    tslib_1.__extends(CoderBoolean, _super);
    function CoderBoolean(coerceFunc, localName) {
        return _super.call(this, coerceFunc, 'bool', 'bool', localName, false) || this;
    }
    CoderBoolean.prototype.encode = function (value) {
        return uint256Coder.encode(!!value ? new crypto_1.BN(1) : new crypto_1.BN(0));
    };
    CoderBoolean.prototype.decode = function (data, offset) {
        var result;
        try {
            result = uint256Coder.decode(data, offset);
        }
        catch (error) {
            if (error.reason === 'insufficient data for uint256 type') {
                (0, crypto_1.throwError)('insufficient data for boolean type', crypto_1.INVALID_ARGUMENT, {
                    arg: this.localName,
                    coderType: 'boolean',
                    value: error.value,
                });
            }
            throw error;
        }
        return {
            consumed: result.consumed,
            value: this.coerceFunc('bool', !result.value.isZero()),
        };
    };
    return CoderBoolean;
}(Coder));
// tslint:disable-next-line: max-classes-per-file
/** @hidden */
var CoderFixedBytes = /** @class */ (function (_super) {
    tslib_1.__extends(CoderFixedBytes, _super);
    function CoderFixedBytes(coerceFunc, length, localName) {
        var _this = this;
        var name = 'bytes' + length;
        _this = _super.call(this, coerceFunc, name, name, localName, false) || this;
        _this.length = length;
        return _this;
    }
    CoderFixedBytes.prototype.encode = function (value) {
        var result = new Uint8Array(this.length);
        try {
            var arrayied = (0, crypto_1.arrayify)(value);
            var data = null;
            if (arrayied !== null) {
                var valueToByte = (0, crypto_1.hexlify)(arrayied);
                data = (0, crypto_1.arrayify)((0, crypto_1.bytesPadRight)(valueToByte, this.length));
            }
            else {
                throw new Error('cannot arraify data');
            }
            if (data === null || data.length !== this.length) {
                throw new Error('incorrect data length');
            }
            result.set(data);
        }
        catch (error) {
            (0, crypto_1.throwError)('invalid ' + this.name + ' value', crypto_1.INVALID_ARGUMENT, {
                arg: this.localName,
                coderType: this.name,
                value: error.value || value,
            });
        }
        return result;
    };
    CoderFixedBytes.prototype.decode = function (data, offset) {
        if (data.length < offset + 32) {
            (0, crypto_1.throwError)('insufficient data for ' + name + ' type', crypto_1.INVALID_ARGUMENT, {
                arg: this.localName,
                coderType: this.name,
                value: (0, crypto_1.hexlify)(data.slice(offset, offset + 32)),
            });
        }
        return {
            consumed: 32,
            value: this.coerceFunc(this.name, (0, crypto_1.hexlify)(data.slice(offset, offset + this.length))),
        };
    };
    return CoderFixedBytes;
}(Coder));
// tslint:disable-next-line: max-classes-per-file
/** @hidden */
var CoderAddress = /** @class */ (function (_super) {
    tslib_1.__extends(CoderAddress, _super);
    function CoderAddress(coerceFunc, localName) {
        return _super.call(this, coerceFunc, 'address', 'address', localName, false) || this;
    }
    CoderAddress.prototype.encode = function (value) {
        var result = new Uint8Array(32);
        try {
            var addr = (0, crypto_1.arrayify)((0, crypto_1.toChecksumAddress)(value)) || new Uint8Array();
            result.set(addr, 12);
        }
        catch (error) {
            (0, crypto_1.throwError)('invalid address', crypto_1.INVALID_ARGUMENT, {
                arg: this.localName,
                coderType: 'address',
                value: value,
            });
        }
        return result;
    };
    CoderAddress.prototype.decode = function (data, offset) {
        if (data.length < offset + 32) {
            (0, crypto_1.throwError)('insufficuent data for address type', crypto_1.INVALID_ARGUMENT, {
                arg: this.localName,
                coderType: 'address',
                value: (0, crypto_1.hexlify)(data.slice(offset, offset + 32)),
            });
        }
        return {
            consumed: 32,
            value: this.coerceFunc('address', (0, crypto_1.toChecksumAddress)((0, crypto_1.hexlify)(data.slice(offset + 12, offset + 32)))),
        };
    };
    return CoderAddress;
}(Coder));
/** @hidden */
function _encodeDynamicBytes(value) {
    var dataLength = 32 * Math.ceil(value.length / 32);
    var padding = new Uint8Array(dataLength - value.length);
    return (0, crypto_1.concat)([uint256Coder.encode(new crypto_1.BN(value.length)), value, padding]);
}
/** @hidden */
function _decodeDynamicBytes(data, offset, localName) {
    if (data.length < offset + 32) {
        (0, crypto_1.throwError)('insufficient data for dynamicBytes length', crypto_1.INVALID_ARGUMENT, {
            arg: localName,
            coderType: 'dynamicBytes',
            value: (0, crypto_1.hexlify)(data.slice(offset, offset + 32)),
        });
    }
    var length = uint256Coder.decode(data, offset).value;
    try {
        length = length.toNumber();
    }
    catch (error) {
        (0, crypto_1.throwError)('dynamic bytes count too large', crypto_1.INVALID_ARGUMENT, {
            arg: localName,
            coderType: 'dynamicBytes',
            value: length.toString(),
        });
    }
    if (data.length < offset + 32 + length) {
        (0, crypto_1.throwError)('insufficient data for dynamicBytes type', crypto_1.INVALID_ARGUMENT, {
            arg: localName,
            coderType: 'dynamicBytes',
            value: (0, crypto_1.hexlify)(data.slice(offset, offset + 32 + length)),
        });
    }
    return {
        consumed: 32 + 32 * Math.ceil(length / 32),
        value: data.slice(offset + 32, offset + 32 + length),
    };
}
// tslint:disable-next-line: max-classes-per-file
/** @hidden */
var CoderDynamicBytes = /** @class */ (function (_super) {
    tslib_1.__extends(CoderDynamicBytes, _super);
    function CoderDynamicBytes(coerceFunc, localName) {
        return _super.call(this, coerceFunc, 'bytes', 'bytes', localName, true) || this;
    }
    CoderDynamicBytes.prototype.encode = function (value) {
        var result = new Uint8Array();
        try {
            result = _encodeDynamicBytes((0, crypto_1.arrayify)(value) || new Uint8Array());
        }
        catch (error) {
            (0, crypto_1.throwError)('invalid bytes value', crypto_1.INVALID_ARGUMENT, {
                arg: this.localName,
                coderType: 'bytes',
                value: error.value || value,
            });
        }
        return result;
    };
    CoderDynamicBytes.prototype.decode = function (data, offset) {
        var result = _decodeDynamicBytes(data, offset, this.localName || '');
        result.value = this.coerceFunc('bytes', (0, crypto_1.hexlify)(result.value));
        return result;
    };
    return CoderDynamicBytes;
}(Coder));
// tslint:disable-next-line: max-classes-per-file
/** @hidden */
var CoderString = /** @class */ (function (_super) {
    tslib_1.__extends(CoderString, _super);
    function CoderString(coerceFunc, localName) {
        return _super.call(this, coerceFunc, 'string', 'string', localName, true) || this;
    }
    CoderString.prototype.encode = function (value) {
        if (typeof value !== 'string') {
            (0, crypto_1.throwError)('invalid string value', crypto_1.INVALID_ARGUMENT, {
                arg: this.localName,
                coderType: 'string',
                value: value,
            });
        }
        return _encodeDynamicBytes(toUtf8Bytes(value));
    };
    CoderString.prototype.decode = function (data, offset) {
        var result = _decodeDynamicBytes(data, offset, this.localName || '');
        result.value = this.coerceFunc('string', toUtf8String(result.value));
        return result;
    };
    return CoderString;
}(Coder));
/** @hidden */
function alignSize(size) {
    return 32 * Math.ceil(size / 32);
}
/** @hidden */
function pack(coders, values) {
    if (Array.isArray(values)) {
        // do nothing
    }
    else if (values && typeof values === 'object') {
        var arrayValues_1 = [];
        coders.forEach(function (coder) {
            arrayValues_1.push(values[coder.localName || '']);
        });
        values = arrayValues_1;
    }
    else {
        (0, crypto_1.throwError)('invalid tuple value', crypto_1.INVALID_ARGUMENT, {
            coderType: 'tuple',
            value: values,
        });
    }
    if (coders.length !== values.length) {
        (0, crypto_1.throwError)('types/value length mismatch', crypto_1.INVALID_ARGUMENT, {
            coderType: 'tuple',
            value: values,
        });
    }
    var parts = [];
    coders.forEach(function (coder, index) {
        parts.push({ dynamic: coder.dynamic, value: coder.encode(values[index]) });
    });
    var staticSize = 0;
    var dynamicSize = 0;
    parts.forEach(function (part) {
        if (part.dynamic) {
            staticSize += 32;
            dynamicSize += alignSize(part.value.length);
        }
        else {
            staticSize += alignSize(part.value.length);
            // todo : is it to be static size not alignSize?
        }
    });
    var offset = 0;
    var dynamicOffset = staticSize;
    var data = new Uint8Array(staticSize + dynamicSize);
    parts.forEach(function (part) {
        if (part.dynamic) {
            // uint256Coder.encode(dynamicOffset).copy(data, offset);
            data.set(uint256Coder.encode(new crypto_1.BN(dynamicOffset)), offset);
            offset += 32;
            // part.value.copy(data, dynamicOffset);  @TODO
            data.set(part.value, dynamicOffset);
            dynamicOffset += alignSize(part.value.length);
        }
        else {
            // part.value.copy(data, offset);  @TODO
            data.set(part.value, offset);
            offset += alignSize(part.value.length);
        }
    });
    return data;
}
/** @hidden */
function unpack(coders, data, offset) {
    var baseOffset = offset;
    var consumed = 0;
    var value = [];
    coders.forEach(function (coder) {
        var result;
        if (coder.dynamic) {
            var dynamicOffset = uint256Coder.decode(data, offset);
            result = coder.decode(data, baseOffset + dynamicOffset.value.toNumber());
            // The dynamic part is leap-frogged somewhere else; doesn't count towards size
            result.consumed = dynamicOffset.consumed;
        }
        else {
            result = coder.decode(data, offset);
        }
        if (result.value !== undefined) {
            value.push(result.value);
        }
        offset += result.consumed;
        consumed += result.consumed;
    });
    coders.forEach(function (coder, index) {
        var name = coder.localName;
        if (!name) {
            return;
        }
        if (name === 'length') {
            name = '_length';
        }
        if (value[name] != null) {
            return;
        }
        value[name] = value[index];
    });
    return {
        value: value,
        consumed: consumed,
    };
}
// tslint:disable-next-line: max-classes-per-file
/** @hidden */
var CoderArray = /** @class */ (function (_super) {
    tslib_1.__extends(CoderArray, _super);
    function CoderArray(coerceFunc, coder, length, localName) {
        var _this = this;
        var type = coder.type + '[' + (length >= 0 ? length : '') + ']';
        var dynamic = length === -1 || coder.dynamic;
        _this = _super.call(this, coerceFunc, 'array', type, localName, dynamic) || this;
        _this.coder = coder;
        _this.length = length;
        return _this;
    }
    CoderArray.prototype.encode = function (value) {
        if (!Array.isArray(value)) {
            (0, crypto_1.throwError)('expected array value', crypto_1.INVALID_ARGUMENT, {
                arg: this.localName,
                coderType: 'array',
                value: value,
            });
        }
        var count = this.length;
        var result = new Uint8Array(0);
        if (count === -1) {
            count = value.length;
            result = uint256Coder.encode(new crypto_1.BN(count));
        }
        (0, crypto_1.checkArgumentCount)(count, value.length, ' in coder array' + (this.localName ? ' ' + this.localName : ''));
        var coders = [];
        // tslint:disable-next-line: prefer-for-of
        for (var i = 0; i < value.length; i++) {
            coders.push(this.coder);
        }
        return (0, crypto_1.concat)([result, pack(coders, value)]);
    };
    CoderArray.prototype.decode = function (data, offset) {
        // @TODO:
        // if (data.length < offset + length * 32) { throw new Error('invalid array'); }
        var consumed = 0;
        var count = this.length;
        var decodedLength = { consumed: 0, value: undefined };
        if (count === -1) {
            try {
                decodedLength = uint256Coder.decode(data, offset);
            }
            catch (error) {
                (0, crypto_1.throwError)('insufficient data for dynamic array length', crypto_1.INVALID_ARGUMENT, {
                    arg: this.localName,
                    coderType: 'array',
                    value: error.value,
                });
            }
            try {
                count = decodedLength.value.toNumber();
            }
            catch (error) {
                (0, crypto_1.throwError)('array count too large', crypto_1.INVALID_ARGUMENT, {
                    arg: this.localName,
                    coderType: 'array',
                    value: decodedLength.value.toString(),
                });
            }
            consumed += decodedLength.consumed;
            offset += decodedLength.consumed;
        }
        var coders = [];
        for (var i = 0; i < count; i++) {
            coders.push(new CoderAnonymous(this.coder));
        }
        var result = unpack(coders, data, offset);
        result.consumed += consumed;
        result.value = this.coerceFunc(this.type, result.value);
        return result;
    };
    return CoderArray;
}(Coder));
// tslint:disable-next-line: max-classes-per-file
/** @hidden */
var CoderTuple = /** @class */ (function (_super) {
    tslib_1.__extends(CoderTuple, _super);
    function CoderTuple(coerceFunc, coders, localName) {
        var _this = this;
        var dynamic = false;
        var types = [];
        coders.forEach(function (coder) {
            if (coder.dynamic) {
                dynamic = true;
            }
            types.push(coder.type);
        });
        var type = 'tuple(' + types.join(',') + ')';
        _this = _super.call(this, coerceFunc, 'tuple', type, localName, dynamic) || this;
        _this.coders = coders;
        return _this;
    }
    CoderTuple.prototype.encode = function (value) {
        return pack(this.coders, value);
    };
    CoderTuple.prototype.decode = function (data, offset) {
        var result = unpack(this.coders, data, offset);
        result.value = this.coerceFunc(this.type, result.value);
        return result;
    };
    return CoderTuple;
}(Coder));
/** @hidden */
function splitNesting(value) {
    value = value.trim();
    var result = [];
    var accum = '';
    var depth = 0;
    // tslint:disable-next-line: prefer-for-of
    for (var offset = 0; offset < value.length; offset++) {
        var c = value[offset];
        if (c === ',' && depth === 0) {
            result.push(accum);
            accum = '';
        }
        else {
            accum += c;
            if (c === '(') {
                depth++;
            }
            else if (c === ')') {
                depth--;
                if (depth === -1) {
                    throw new Error('unbalanced parenthsis');
                }
            }
        }
    }
    if (accum) {
        result.push(accum);
    }
    return result;
}
// @TODO: Is there a way to return "class"?
/** @hidden */
var paramTypeSimple = {
    address: CoderAddress,
    bool: CoderBoolean,
    string: CoderString,
    bytes: CoderDynamicBytes,
};
/** @hidden */
function getTupleParamCoder(coerceFunc, components, localName) {
    if (!components) {
        components = [];
    }
    var coders = [];
    components.forEach(function (component) {
        coders.push(getParamCoder(coerceFunc, component));
    });
    return new CoderTuple(coerceFunc, coders, localName);
}
/** @hidden */
function getParamCoder(coerceFunc, param) {
    var coder = paramTypeSimple[param.type];
    if (coder) {
        return new coder(coerceFunc, param.name);
    }
    var matcher = param.type.match(paramTypeNumber);
    if (matcher) {
        var size = parseInt(matcher[2] || '256', 10);
        if (size === 0 || size > 256 || size % 8 !== 0) {
            (0, crypto_1.throwError)('invalid ' + matcher[1] + ' bit length', crypto_1.INVALID_ARGUMENT, {
                arg: 'param',
                value: param,
            });
        }
        return new CoderNumber(coerceFunc, size / 8, matcher[1] === 'int', param.name || '');
    }
    var matcher2 = param.type.match(paramTypeBytes);
    if (matcher2) {
        var size = parseInt(matcher2[1], 10);
        if (size === 0 || size > 32) {
            (0, crypto_1.throwError)('invalid bytes length', crypto_1.INVALID_ARGUMENT, {
                arg: 'param',
                value: param,
            });
        }
        return new CoderFixedBytes(coerceFunc, size, param.name || '');
    }
    var matcher3 = param.type.match(paramTypeArray);
    if (matcher3) {
        var size = parseInt(matcher3[2] || '-1', 10);
        param = shallowCopy(param);
        param.type = matcher3[1];
        param = deepCopy(param);
        return new CoderArray(coerceFunc, getParamCoder(coerceFunc, param), size, param.name || '');
    }
    if (param.type.substring(0, 5) === 'tuple') {
        return getTupleParamCoder(coerceFunc, param.components || [], param.name || '');
    }
    if (param.type === '') {
        return new CoderNull(coerceFunc, param.name || '');
    }
    (0, crypto_1.throwError)('invalid type', crypto_1.INVALID_ARGUMENT, {
        arg: 'type',
        value: param.type,
    });
}
/** @hidden */
var UnicodeNormalizationForm;
(function (UnicodeNormalizationForm) {
    UnicodeNormalizationForm["current"] = "";
    UnicodeNormalizationForm["NFC"] = "NFC";
    UnicodeNormalizationForm["NFD"] = "NFD";
    UnicodeNormalizationForm["NFKC"] = "NFKC";
    UnicodeNormalizationForm["NFKD"] = "NFKD";
})(UnicodeNormalizationForm || (exports.UnicodeNormalizationForm = UnicodeNormalizationForm = {}));
/** @hidden */
function toUtf8Bytes(str, form) {
    if (form === void 0) { form = UnicodeNormalizationForm.current; }
    if (form !== UnicodeNormalizationForm.current) {
        (0, crypto_1.checkNormalize)();
        str = str.normalize(form);
    }
    var result = [];
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 0x80) {
            result.push(c);
        }
        else if (c < 0x800) {
            result.push((c >> 6) | 0xc0);
            result.push((c & 0x3f) | 0x80);
        }
        else if ((c & 0xfc00) === 0xd800) {
            i++;
            var c2 = str.charCodeAt(i);
            if (i >= str.length || (c2 & 0xfc00) !== 0xdc00) {
                throw new Error('invalid utf-8 string');
            }
            // Surrogate Pair
            c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
            result.push((c >> 18) | 0xf0);
            result.push(((c >> 12) & 0x3f) | 0x80);
            result.push(((c >> 6) & 0x3f) | 0x80);
            result.push((c & 0x3f) | 0x80);
        }
        else {
            result.push((c >> 12) | 0xe0);
            result.push(((c >> 6) & 0x3f) | 0x80);
            result.push((c & 0x3f) | 0x80);
        }
    }
    return (0, crypto_1.arrayify)(result) || new Uint8Array();
}
exports.toUtf8Bytes = toUtf8Bytes;
// http://stackoverflow.com/questions/13356493/decode-utf-8-with-javascript#13691499
/** @hidden */
function toUtf8String(bytes, ignoreErrors) {
    bytes = (0, crypto_1.arrayify)(bytes) || new Uint8Array();
    var result = '';
    var i = 0;
    // Invalid bytes are ignored
    while (i < bytes.length) {
        var c = bytes[i++];
        // 0xxx xxxx
        if (c >> 7 === 0) {
            result += String.fromCharCode(c);
            continue;
        }
        // Multibyte; how many bytes left for this character?
        var extraLength = null;
        var overlongMask = null;
        // 110x xxxx 10xx xxxx
        if ((c & 0xe0) === 0xc0) {
            extraLength = 1;
            overlongMask = 0x7f;
            // 1110 xxxx 10xx xxxx 10xx xxxx
        }
        else if ((c & 0xf0) === 0xe0) {
            extraLength = 2;
            overlongMask = 0x7ff;
            // 1111 0xxx 10xx xxxx 10xx xxxx 10xx xxxx
        }
        else if ((c & 0xf8) === 0xf0) {
            extraLength = 3;
            overlongMask = 0xffff;
        }
        else {
            if (!ignoreErrors) {
                if ((c & 0xc0) === 0x80) {
                    throw new Error('invalid utf8 byte sequence; unexpected continuation byte');
                }
                throw new Error('invalid utf8 byte sequence; invalid prefix');
            }
            continue;
        }
        // Do we have enough bytes in our data?
        if (i + extraLength > bytes.length) {
            if (!ignoreErrors) {
                throw new Error('invalid utf8 byte sequence; too short');
            }
            // If there is an invalid unprocessed byte, skip continuation bytes
            for (; i < bytes.length; i++) {
                if (bytes[i] >> 6 !== 0x02) {
                    break;
                }
            }
            continue;
        }
        // Remove the length prefix from the char
        var res = c & ((1 << (8 - extraLength - 1)) - 1);
        for (var j = 0; j < extraLength; j++) {
            var nextChar = bytes[i];
            // Invalid continuation byte
            if ((nextChar & 0xc0) !== 0x80) {
                res = null;
                break;
            }
            res = (res << 6) | (nextChar & 0x3f);
            i++;
        }
        if (res === null) {
            if (!ignoreErrors) {
                throw new Error('invalid utf8 byte sequence; invalid continuation byte');
            }
            continue;
        }
        // Check for overlong seuences (more bytes than needed)
        if (res <= overlongMask) {
            if (!ignoreErrors) {
                throw new Error('invalid utf8 byte sequence; overlong');
            }
            continue;
        }
        // Maximum code point
        if (res > 0x10ffff) {
            if (!ignoreErrors) {
                throw new Error('invalid utf8 byte sequence; out-of-range');
            }
            continue;
        }
        // Reserved for UTF-16 surrogate halves
        if (res >= 0xd800 && res <= 0xdfff) {
            if (!ignoreErrors) {
                throw new Error('invalid utf8 byte sequence; utf-16 surrogate');
            }
            continue;
        }
        if (res <= 0xffff) {
            result += String.fromCharCode(res);
            continue;
        }
        res -= 0x10000;
        result += String.fromCharCode(((res >> 10) & 0x3ff) + 0xd800, (res & 0x3ff) + 0xdc00);
    }
    return result;
}
exports.toUtf8String = toUtf8String;
/** @hidden */
function formatBytes32String(text) {
    // Get the bytes
    var bytes = toUtf8Bytes(text);
    // Check we have room for null-termination
    if (bytes.length > 31) {
        throw new Error('bytes32 string must be less than 32 bytes');
    }
    // Zero-pad (implicitly null-terminates)
    return (0, crypto_1.hexlify)((0, crypto_1.concat)([bytes, HashZero]).slice(0, 32));
}
exports.formatBytes32String = formatBytes32String;
/** @hidden */
function parseBytes32String(bytes) {
    var data = (0, crypto_1.arrayify)(bytes) || new Uint8Array();
    // Must be 32 bytes with a null-termination
    if (data.length !== 32) {
        throw new Error('invalid bytes32 - not 32 bytes long');
    }
    if (data[31] !== 0) {
        throw new Error('invalid bytes32 sdtring - no null terminator');
    }
    // Find the null termination
    var length = 31;
    while (data[length - 1] === 0) {
        length--;
    }
    // Determine the string value
    return toUtf8String(data.slice(0, length));
}
exports.parseBytes32String = parseBytes32String;
/** @hidden */
function isType(object, type) {
    return object && object._ethersType === type;
}
exports.isType = isType;
/** @hidden */
function shallowCopy(object) {
    var result = {};
    // tslint:disable-next-line: forin
    for (var key in object) {
        result[key] = object[key];
    }
    return result;
}
exports.shallowCopy = shallowCopy;
/** @hidden */
var opaque = {
    boolean: true,
    number: true,
    string: true,
};
/** @hidden */
function deepCopy(object, frozen) {
    // Opaque objects are not mutable, so safe to copy by assignment
    if (object === undefined || object === null || opaque[typeof object]) {
        return object;
    }
    // Arrays are mutable, so we need to create a copy
    if (Array.isArray(object)) {
        var result = object.map(function (item) { return deepCopy(item, frozen); });
        if (frozen) {
            Object.freeze(result);
        }
        return result;
    }
    if (typeof object === 'object') {
        // Some internal objects, which are already immutable
        if (isType(object, 'BigNumber')) {
            return object;
        }
        if (isType(object, 'Description')) {
            return object;
        }
        if (isType(object, 'Indexed')) {
            return object;
        }
        var result = {};
        // tslint:disable-next-line: forin
        for (var key in object) {
            var value = object[key];
            if (value === undefined) {
                continue;
            }
            (0, utils_1.defineReadOnly)(result, key, deepCopy(value, frozen));
        }
        if (frozen) {
            Object.freeze(result);
        }
        return result;
    }
    // The function type is also immutable, so safe to copy by assignment
    if (typeof object === 'function') {
        return object;
    }
    throw new Error('Cannot deepCopy ' + typeof object);
}
exports.deepCopy = deepCopy;
// tslint:disable-next-line: max-classes-per-file
/** @hidden */
var AbiCoder = /** @class */ (function () {
    function AbiCoder(coerceFunc) {
        (0, crypto_1.checkNew)(this, AbiCoder);
        if (!coerceFunc) {
            coerceFunc = exports.defaultCoerceFunc;
        }
        this.coerceFunc = coerceFunc;
    }
    AbiCoder.prototype.encode = function (types, values) {
        var _this = this;
        if (types.length !== values.length) {
            (0, crypto_1.throwError)('types/values length mismatch', crypto_1.INVALID_ARGUMENT, {
                count: { types: types.length, values: values.length },
                value: { types: types, values: values },
            });
        }
        var coders = [];
        types.forEach(function (type) {
            // Convert types to type objects
            //   - "uint foo" => { type: "uint", name: "foo" }
            //   - "tuple(uint, uint)" => { type: "tuple", components: [ { type: "uint" }, { type: "uint" }, ] }
            var typeObject = null;
            // tslint:disable-next-line: prefer-conditional-expression
            if (typeof type === 'string') {
                typeObject = parseParam(type);
            }
            else {
                typeObject = type;
            }
            coders.push(getParamCoder(_this.coerceFunc, typeObject));
        }, this);
        var encodedArray = new CoderTuple(this.coerceFunc, coders, '_').encode(values);
        return (0, crypto_1.hexlify)(encodedArray);
    };
    AbiCoder.prototype.decode = function (types, data) {
        var _this = this;
        var coders = [];
        types.forEach(function (type) {
            // See encode for details
            var typeObject = null;
            // tslint:disable-next-line: prefer-conditional-expression
            if (typeof type === 'string') {
                typeObject = parseParam(type);
            }
            else {
                typeObject = deepCopy(type);
            }
            coders.push(getParamCoder(_this.coerceFunc, typeObject));
        }, this);
        var result = new CoderTuple(this.coerceFunc, coders, '_').decode((0, crypto_1.arrayify)(data) || new Uint8Array(), 0).value;
        return result;
    };
    return AbiCoder;
}());
exports.AbiCoder = AbiCoder;
/** @hidden */
exports.defaultAbiCoder = new AbiCoder();
//# sourceMappingURL=abiCoder.js.map