"use strict";
/**
 * @packageDocumentation
 * @module stkon-transaction
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RLPSign = exports.defaultMessenger = exports.TransactionEvents = exports.sleep = exports.recoverETH = exports.recover = exports.handleAddress = exports.handleNumber = exports.transactionFieldsETH = exports.transactionFields = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("@stkon-js/utils");
var crypto_1 = require("@stkon-js/crypto");
var network_1 = require("@stkon-js/network");
exports.transactionFields = [
    { name: 'nonce', length: 32, fix: false },
    { name: 'gasPrice', length: 32, fix: false, transform: 'hex' },
    { name: 'gasLimit', length: 32, fix: false, transform: 'hex' },
    { name: 'shardID', length: 16, fix: false },
    // recover it after main repo fix
    { name: 'toShardID', length: 16, fix: false },
    { name: 'to', length: 20, fix: true },
    { name: 'value', length: 32, fix: false, transform: 'hex' },
    { name: 'data', fix: false },
];
exports.transactionFieldsETH = [
    { name: 'nonce', length: 32, fix: false },
    { name: 'gasPrice', length: 32, fix: false, transform: 'hex' },
    { name: 'gasLimit', length: 32, fix: false, transform: 'hex' },
    { name: 'to', length: 20, fix: true },
    { name: 'value', length: 32, fix: false, transform: 'hex' },
    { name: 'data', fix: false },
];
var handleNumber = function (value) {
    if ((0, utils_1.isHex)(value) && value === '0x') {
        return (0, utils_1.hexToNumber)('0x00');
    }
    else if ((0, utils_1.isHex)(value) && value !== '0x') {
        return (0, utils_1.hexToNumber)(value);
    }
    else {
        return value;
    }
};
exports.handleNumber = handleNumber;
var handleAddress = function (value) {
    if (value === '0x') {
        return '0x';
    }
    else if ((0, utils_1.isAddress)(value)) {
        return value;
    }
    else {
        return '0x';
    }
};
exports.handleAddress = handleAddress;
var recover = function (rawTransaction) {
    var transaction = (0, crypto_1.decode)(rawTransaction);
    if (transaction.length !== 11 && transaction.length !== 8) {
        throw new Error('invalid rawTransaction');
    }
    var tx = {
        id: '0x',
        from: '0x',
        rawTransaction: '0x',
        unsignedRawTransaction: '0x',
        nonce: new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(transaction[0]))).toNumber(),
        gasPrice: new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(transaction[1]))),
        gasLimit: new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(transaction[2]))),
        shardID: new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(transaction[3]))).toNumber(),
        toShardID: new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(transaction[4]))).toNumber(),
        to: (0, exports.handleAddress)(transaction[5]) !== '0x'
            ? (0, crypto_1.getAddress)((0, exports.handleAddress)(transaction[5])).checksum
            : '0x',
        value: new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(transaction[6]))),
        data: transaction[7],
        chainId: 0,
        signature: {
            r: '',
            s: '',
            recoveryParam: 0,
            v: 0,
        },
    };
    // Legacy unsigned transaction
    if (transaction.length === 8) {
        tx.unsignedRawTransaction = rawTransaction;
        return tx;
    }
    try {
        tx.signature.v = new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(transaction[8]))).toNumber();
    }
    catch (error) {
        throw error;
    }
    tx.signature.r = (0, crypto_1.hexZeroPad)(transaction[9], 32);
    tx.signature.s = (0, crypto_1.hexZeroPad)(transaction[10], 32);
    if (new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(tx.signature.r))).isZero() &&
        new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(tx.signature.s))).isZero()) {
        // EIP-155 unsigned transaction
        tx.chainId = tx.signature.v;
        tx.signature.v = 0;
    }
    else {
        // Signed Tranasaction
        tx.chainId = Math.floor((tx.signature.v - 35) / 2);
        if (tx.chainId < 0) {
            tx.chainId = 0;
        }
        var recoveryParam = tx.signature.v - 27;
        var raw = transaction.slice(0, 8);
        if (tx.chainId !== 0) {
            raw.push((0, crypto_1.hexlify)(tx.chainId));
            raw.push('0x');
            raw.push('0x');
            recoveryParam -= tx.chainId * 2 + 8;
        }
        var digest = (0, crypto_1.keccak256)((0, crypto_1.encode)(raw));
        try {
            var recoveredFrom = (0, crypto_1.recoverAddress)(digest, {
                r: (0, crypto_1.hexlify)(tx.signature.r),
                s: (0, crypto_1.hexlify)(tx.signature.s),
                recoveryParam: recoveryParam,
            });
            tx.from = recoveredFrom === '0x' ? '0x' : (0, crypto_1.getAddress)(recoveredFrom).checksum;
        }
        catch (error) {
            throw error;
        }
        tx.rawTransaction = rawTransaction;
        tx.id = (0, crypto_1.keccak256)(rawTransaction);
    }
    return tx;
};
exports.recover = recover;
var recoverETH = function (rawTransaction) {
    var transaction = (0, crypto_1.decode)(rawTransaction);
    if (transaction.length !== 9 && transaction.length !== 6) {
        throw new Error('invalid rawTransaction');
    }
    var tx = {
        id: '0x',
        from: '0x',
        rawTransaction: '0x',
        unsignedRawTransaction: '0x',
        nonce: new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(transaction[0]))).toNumber(),
        gasPrice: new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(transaction[1]))),
        gasLimit: new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(transaction[2]))),
        shardID: 0,
        toShardID: 0,
        to: (0, exports.handleAddress)(transaction[3]) !== '0x'
            ? (0, crypto_1.getAddress)((0, exports.handleAddress)(transaction[3])).checksum
            : '0x',
        value: new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(transaction[4]))),
        data: transaction[5],
        chainId: 0,
        signature: {
            r: '',
            s: '',
            recoveryParam: 0,
            v: 0,
        },
    };
    // Legacy unsigned transaction
    if (transaction.length === 6) {
        tx.unsignedRawTransaction = rawTransaction;
        return tx;
    }
    try {
        tx.signature.v = new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(transaction[6]))).toNumber();
    }
    catch (error) {
        throw error;
    }
    tx.signature.r = (0, crypto_1.hexZeroPad)(transaction[7], 32);
    tx.signature.s = (0, crypto_1.hexZeroPad)(transaction[8], 32);
    if (new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(tx.signature.r))).isZero() &&
        new crypto_1.BN((0, utils_1.strip0x)((0, exports.handleNumber)(tx.signature.s))).isZero()) {
        // EIP-155 unsigned transaction
        tx.chainId = tx.signature.v;
        tx.signature.v = 0;
    }
    else {
        // Signed Tranasaction
        tx.chainId = Math.floor((tx.signature.v - 35) / 2);
        if (tx.chainId < 0) {
            tx.chainId = 0;
        }
        var recoveryParam = tx.signature.v - 27;
        var raw = transaction.slice(0, 6);
        if (tx.chainId !== 0) {
            raw.push((0, crypto_1.hexlify)(tx.chainId));
            raw.push('0x');
            raw.push('0x');
            recoveryParam -= tx.chainId * 2 + 8;
        }
        var digest = (0, crypto_1.keccak256)((0, crypto_1.encode)(raw));
        try {
            var recoveredFrom = (0, crypto_1.recoverAddress)(digest, {
                r: (0, crypto_1.hexlify)(tx.signature.r),
                s: (0, crypto_1.hexlify)(tx.signature.s),
                recoveryParam: recoveryParam,
            });
            tx.from = recoveredFrom === '0x' ? '0x' : (0, crypto_1.getAddress)(recoveredFrom).checksum;
        }
        catch (error) {
            throw error;
        }
        tx.rawTransaction = rawTransaction;
        tx.id = (0, crypto_1.keccak256)(rawTransaction);
    }
    return tx;
};
exports.recoverETH = recoverETH;
var sleep = function (ms) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                setTimeout(function () { return resolve(); }, ms);
            })];
    });
}); };
exports.sleep = sleep;
var TransactionEvents;
(function (TransactionEvents) {
    TransactionEvents["transactionHash"] = "transactionHash";
    TransactionEvents["error"] = "error";
    TransactionEvents["confirmation"] = "confirmation";
    TransactionEvents["receipt"] = "receipt";
    TransactionEvents["track"] = "track";
    TransactionEvents["cxConfirmation"] = "cxConfirmation";
    TransactionEvents["cxReceipt"] = "cxReceipt";
    TransactionEvents["cxTrack"] = "cxTrack";
})(TransactionEvents || (exports.TransactionEvents = TransactionEvents = {}));
exports.defaultMessenger = new network_1.Messenger(new network_1.HttpProvider('http://localhost:9500'), utils_1.ChainType.Stkon);
var RLPSign = function (transaction, prv) {
    var _a = tslib_1.__read(transaction.getRLPUnsigned(), 2), unsignedRawTransaction = _a[0], raw = _a[1];
    var regroup = tslib_1.__assign(tslib_1.__assign({}, transaction.txParams), { unsignedRawTransaction: unsignedRawTransaction });
    transaction.setParams(regroup);
    var signature = (0, crypto_1.sign)((0, crypto_1.keccak256)(unsignedRawTransaction), prv);
    var signed = transaction.getRLPSigned(raw, signature);
    return [signature, signed];
};
exports.RLPSign = RLPSign;
//# sourceMappingURL=utils.js.map