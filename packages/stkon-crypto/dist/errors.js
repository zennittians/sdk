"use strict";
/**
 # @stkon-js/crypto

This package provides a collection of apis related to address management, kestore, encoding, and encrypt/decrypt.

## Installation

```
npm install @stkon-js/crypto
```

## Usage

```javascript
* const {
*   encode,
*   decode,
*   randomBytes,
*   toBech32,
*   fromBech32,
*   StkonAddress,
*   generatePrivateKey,
*   getPubkeyFromPrivateKey,
*   getAddressFromPublicKey,
*   getAddressFromPrivateKey,
*   encryptPhrase,
*   decryptPhrase
* } = require('@stkon-js/crypto');
* const { isPrivateKey, isAddress, isPublicKey } = require('@stkon-js/utils');
```

Address apis
```javascript
const bytes = randomBytes(20);
const addr = new StkonAddress(bytes);

console.log(addr.checksum);
console.log(addr.bech32);

console.log(StkonAddress.isValidBech32(addr.bech32));
```

RLP apis
```javascript
const encoded = '0x89010101010101010101';
const decoded = '0x010101010101010101';
console.log(encode(decoded));
console.log(decode(encoded));
```

Keystore apis
```javascript
const prv = generatePrivateKey();
const pub = getPubkeyFromPrivateKey(prv);
const addr = getAddressFromPublicKey(pub);
const addrPrv = getAddressFromPrivateKey(prv);
console.log(isPrivateKey(prv));
console.log(isPublicKey(pub));
console.log(isAddress(addr));
console.log(isAddress(addrPrv));
```

Encrypt/decrypt apis
```javascript
* const { Wallet } = require('@stkon-js/account');

* const myPhrase = new Wallet().newMnemonic();
* console.log(myPhrase);
* const pwd = '1234';
* encryptPhrase(myPhrase, pwd).then((value) => {
*   console.log(value);
*   decryptPhrase(JSON.parse(value), pwd).then(value => {
*     console.log(value);
*   });
* });
```
 *
 * @packageDocumentation
 * @module stkon-crypto
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.info = exports.warn = exports.setLogLevel = exports.checkNormalize = exports.setCensorship = exports.checkArgumentCount = exports.checkNew = exports.throwError = exports.UNSUPPORTED_OPERATION = exports.REPLACEMENT_UNDERPRICED = exports.NONCE_EXPIRED = exports.INSUFFICIENT_FUNDS = exports.NUMERIC_FAULT = exports.UNEXPECTED_ARGUMENT = exports.MISSING_ARGUMENT = exports.INVALID_ARGUMENT = exports.CALL_EXCEPTION = exports.MISSING_NEW = exports.NOT_IMPLEMENTED = exports.UNKNOWN_ERROR = void 0;
// This file is ported from ether.js/src.ts/errors.ts
// Unknown Error
/** @hidden */
exports.UNKNOWN_ERROR = 'UNKNOWN_ERROR';
// Not implemented
/** @hidden */
exports.NOT_IMPLEMENTED = 'NOT_IMPLEMENTED';
// Missing new operator to an object
//  - name: The name of the class
/** @hidden */
exports.MISSING_NEW = 'MISSING_NEW';
// Call exception
//  - transaction: the transaction
//  - address?: the contract address
//  - args?: The arguments passed into the function
//  - method?: The Solidity method signature
//  - errorSignature?: The EIP848 error signature
//  - errorArgs?: The EIP848 error parameters
//  - reason: The reason (only for EIP848 "Error(string)")
/** @hidden */
exports.CALL_EXCEPTION = 'CALL_EXCEPTION';
// Invalid argument (e.g. value is incompatible with type) to a function:
//   - argument: The argument name that was invalid
//   - value: The value of the argument
/** @hidden */
exports.INVALID_ARGUMENT = 'INVALID_ARGUMENT';
// Missing argument to a function:
//   - count: The number of arguments received
//   - expectedCount: The number of arguments expected
/** @hidden */
exports.MISSING_ARGUMENT = 'MISSING_ARGUMENT';
// Too many arguments
//   - count: The number of arguments received
//   - expectedCount: The number of arguments expected
/** @hidden */
exports.UNEXPECTED_ARGUMENT = 'UNEXPECTED_ARGUMENT';
// Numeric Fault
//   - operation: the operation being executed
//   - fault: the reason this faulted
/** @hidden */
exports.NUMERIC_FAULT = 'NUMERIC_FAULT';
// Insufficien funds (< value + gasLimit * gasPrice)
//   - transaction: the transaction attempted
/** @hidden */
exports.INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS';
// Nonce has already been used
//   - transaction: the transaction attempted
/** @hidden */
exports.NONCE_EXPIRED = 'NONCE_EXPIRED';
// The replacement fee for the transaction is too low
//   - transaction: the transaction attempted
/** @hidden */
exports.REPLACEMENT_UNDERPRICED = 'REPLACEMENT_UNDERPRICED';
// Unsupported operation
//   - operation
/** @hidden */
exports.UNSUPPORTED_OPERATION = 'UNSUPPORTED_OPERATION';
// tslint:disable-next-line: variable-name
/** @hidden */
var _permanentCensorErrors = false;
// tslint:disable-next-line: variable-name
/** @hidden */
var _censorErrors = false;
// @TODO: Enum
/** @hidden */
function throwError(message, code, params) {
    if (_censorErrors) {
        throw new Error('unknown error');
    }
    if (!code) {
        code = exports.UNKNOWN_ERROR;
    }
    if (!params) {
        params = {};
    }
    var messageDetails = [];
    Object.keys(params).forEach(function (key) {
        try {
            messageDetails.push(key + '=' + JSON.stringify(params[key]));
        }
        catch (error) {
            messageDetails.push(key + '=' + JSON.stringify(params[key].toString()));
        }
    });
    messageDetails.push('version=' + '#version');
    var reason = message;
    if (messageDetails.length) {
        message += ' (' + messageDetails.join(', ') + ')';
    }
    // @TODO: Any??
    var error = new Error(message);
    error.reason = reason;
    error.code = code;
    Object.keys(params).forEach(function (key) {
        error[key] = params[key];
    });
    throw error;
}
exports.throwError = throwError;
/** @hidden */
function checkNew(self, kind) {
    if (!(self instanceof kind)) {
        throwError('missing new', exports.MISSING_NEW, { name: kind.name });
    }
}
exports.checkNew = checkNew;
/** @hidden */
function checkArgumentCount(count, expectedCount, suffix) {
    if (!suffix) {
        suffix = '';
    }
    if (count < expectedCount) {
        throwError('missing argument' + suffix, exports.MISSING_ARGUMENT, {
            count: count,
            expectedCount: expectedCount,
        });
    }
    if (count > expectedCount) {
        throwError('too many arguments' + suffix, exports.UNEXPECTED_ARGUMENT, {
            count: count,
            expectedCount: expectedCount,
        });
    }
}
exports.checkArgumentCount = checkArgumentCount;
/** @hidden */
function setCensorship(censorship, permanent) {
    if (_permanentCensorErrors) {
        throwError('error censorship permanent', exports.UNSUPPORTED_OPERATION, {
            operation: 'setCensorship',
        });
    }
    _censorErrors = !!censorship;
    _permanentCensorErrors = !!permanent;
}
exports.setCensorship = setCensorship;
/** @hidden */
function checkNormalize() {
    try {
        // Make sure all forms of normalization are supported
        ['NFD', 'NFC', 'NFKD', 'NFKC'].forEach(function (form) {
            try {
                'test'.normalize(form);
            }
            catch (error) {
                throw new Error('missing ' + form);
            }
        });
        if (String.fromCharCode(0xe9).normalize('NFD') !== String.fromCharCode(0x65, 0x0301)) {
            throw new Error('broken implementation');
        }
    }
    catch (error) { // Specify the type of error as 'any'
        throwError('platform missing String.prototype.normalize', exports.UNSUPPORTED_OPERATION, {
            operation: 'String.prototype.normalize',
            form: error.message,
        });
    }
}
exports.checkNormalize = checkNormalize;
/** @hidden */
var LogLevels = {
    debug: 1,
    default: 2,
    info: 2,
    warn: 3,
    error: 4,
    off: 5,
};
/** @hidden */
var LogLevel = LogLevels.default;
/** @hidden */
function setLogLevel(logLevel) {
    var level = LogLevels[logLevel];
    if (level == null) {
        warn('invliad log level - ' + logLevel);
        return;
    }
    LogLevel = level;
}
exports.setLogLevel = setLogLevel;
/** @hidden */
function log(logLevel, args) {
    if (LogLevel > LogLevels[logLevel]) {
        return;
    }
    console.log.apply(console, args);
}
/** @hidden */
function warn() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    log('warn', args);
}
exports.warn = warn;
/** @hidden */
function info() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    log('info', args);
}
exports.info = info;
//# sourceMappingURL=errors.js.map