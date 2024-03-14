"use strict";
/**
 * # @stkon-js/staking

This package provides a collection of apis to create, sign/send staking transaction, and receive confirm/receipt.

## Installation

```
npm install @stkon-js/staking
```

## Usage

Create a stkon instance connecting to testnet

```javascript
* const { Stkon } = require('@stkon-js/core');
* const {
*   ChainID,
*   ChainType,
*   hexToNumber,
*   numberToHex,
*   fromWei,
*   Units,
*   Unit,
* } = require('@stkon-js/utils');

* const stk = new Stkon(
*     'https://api.s0.b.stkon.xyz/',
*     {
*         chainType: ChainType.Stkon,
*         chainId: ChainID.StkTestnet,
*     },
* );
```
Below, examples show how to send delegate, undelegate, and collect rewards staking transactions. First, set the chainId, gasLimit, gasPrice for all subsequent staking transactions
```javascript
* stk.stakings.setTxParams({
*   gasLimit: 25000,
*   gasPrice: numberToHex(new stk.utils.Unit('1').asGwei().toWei()),
*   chainId: 2
* });
```
<span style="color:red">Note: create and edit validator transactions are not fully supported in the sdk</span>

Create delegate staking transaction
```javascript
* const delegate = stk.stakings.delegate({
*   delegatorAddress: 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7',
*   validatorAddress: 'one1vfqqagdzz352mtvdl69v0hw953hm993n6v26yl',
*   amount: numberToHex(new Unit(1000).asOne().toWei())
* });
* const delegateStakingTx = delegate.build();
```

Sign and send the delegate transaction and receive confirmation
```javascript
* // key corresponds to one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7, only has testnet balance
* stk.wallet.addByPrivateKey('45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e');

* stk.wallet.signStaking(delegateStakingTx).then(signedTxn => {
*   signedTxn.sendTransaction().then(([tx, hash]) => {
*     console.log(hash);
*     signedTxn.confirm(hash).then(response => {
*       console.log(response.receipt);
*     });
*   });
* });
```

Similarily, undelegate and collect reward transactions can be composed, signed and sent
Create undelegate staking transaction
```javascript
* const undelegate = stk.stakings.undelegate({
*   delegatorAddress: 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7',
*   validatorAddress: 'one1vfqqagdzz352mtvdl69v0hw953hm993n6v26yl',
*   amount: numberToHex(new Unit(1000).asOne().toWei())
* });
* const undelegateStakingTx = undelegate.build();
```

Create collect rewards staking transaction
```javascript
* const collectRewards = stk.stakings.collectRewards({
*   delegatorAddress: 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
* });
* const collectRewardsStakingTx = collectRewards.build();
```

Also, similar to normal transaction, signing and sending can be performed asynchronously.
 * @packageDocumentation
 * @module stkon-staking
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectRewards = exports.Undelegate = exports.Delegate = exports.EditValidator = exports.CreateValidator = exports.CommissionRate = exports.Decimal = exports.Description = exports.StakingTransaction = exports.Directive = exports.StakingSettings = void 0;
var tslib_1 = require("tslib");
// tslint:disable: max-classes-per-file
var crypto_1 = require("@stkon-js/crypto");
var network_1 = require("@stkon-js/network");
var transaction_1 = require("@stkon-js/transaction");
var utils_1 = require("@stkon-js/utils");
var text_encoding_1 = require("text-encoding");
/** @hidden */
var StakingSettings = /** @class */ (function () {
    function StakingSettings() {
    }
    StakingSettings.PRECISION = 18;
    StakingSettings.MAX_DECIMAL = 1000000000000000000;
    return StakingSettings;
}());
exports.StakingSettings = StakingSettings;
/** @hidden */
var Directive;
(function (Directive) {
    Directive[Directive["DirectiveCreateValidator"] = 0] = "DirectiveCreateValidator";
    Directive[Directive["DirectiveEditValidator"] = 1] = "DirectiveEditValidator";
    Directive[Directive["DirectiveDelegate"] = 2] = "DirectiveDelegate";
    Directive[Directive["DirectiveUndelegate"] = 3] = "DirectiveUndelegate";
    Directive[Directive["DirectiveCollectRewards"] = 4] = "DirectiveCollectRewards";
})(Directive || (exports.Directive = Directive = {}));
var StakingTransaction = /** @class */ (function (_super) {
    tslib_1.__extends(StakingTransaction, _super);
    function StakingTransaction(directive, stakeMsg, nonce, gasPrice, gasLimit, chainID, messenger, txStatus) {
        if (messenger === void 0) { messenger = transaction_1.defaultMessenger; }
        if (txStatus === void 0) { txStatus = transaction_1.TxStatus.INTIALIZED; }
        var _this = _super.call(this, messenger, txStatus) || this;
        _this.directive = directive;
        _this.stakeMsg = stakeMsg;
        _this.nonce = nonce;
        _this.gasLimit = gasLimit;
        _this.gasPrice = gasPrice;
        _this.rawTransaction = '0x';
        _this.unsignedRawTransaction = '0x';
        _this.signature = {
            r: '',
            s: '',
            recoveryParam: 0,
            v: 0,
        };
        _this.chainId = chainID;
        _this.from = '0x';
        return _this;
    }
    StakingTransaction.prototype.encode = function () {
        var raw = [];
        // TODO: temporary hack for converting 0x00 to 0x
        if (!this.directive) {
            raw.push('0x');
        }
        else {
            raw.push((0, crypto_1.hexlify)(this.directive));
        }
        raw.push(this.stakeMsg.encode());
        if (!this.nonce) {
            raw.push('0x');
        }
        else {
            raw.push((0, crypto_1.hexlify)(this.nonce));
        }
        raw.push((0, crypto_1.hexlify)(this.gasPrice));
        raw.push((0, crypto_1.hexlify)(this.gasLimit));
        if (this.chainId != null && this.chainId !== 0) {
            raw.push((0, crypto_1.hexlify)(this.chainId));
            raw.push('0x');
            raw.push('0x');
        }
        return [(0, crypto_1.encode)(raw), raw];
    };
    StakingTransaction.prototype.rlpSign = function (prv) {
        var _a = tslib_1.__read(this.encode(), 2), unsignedRawTransaction = _a[0], raw = _a[1];
        this.setUnsigned(unsignedRawTransaction);
        var signature = (0, crypto_1.sign)((0, crypto_1.keccak256)(unsignedRawTransaction), prv);
        var signed = this.getRLPSigned(raw, signature);
        return [signature, signed];
    };
    StakingTransaction.prototype.getRLPSigned = function (raw, signature) {
        var sig = (0, crypto_1.splitSignature)(signature);
        var v = 27 + (sig.recoveryParam || 0);
        raw.pop();
        raw.pop();
        raw.pop();
        v += this.chainId * 2 + 8;
        raw.push((0, crypto_1.hexlify)(v));
        raw.push((0, crypto_1.stripZeros)((0, crypto_1.arrayify)(sig.r) || []));
        raw.push((0, crypto_1.stripZeros)((0, crypto_1.arrayify)(sig.s) || []));
        return (0, crypto_1.encode)(raw);
    };
    StakingTransaction.prototype.sendTransaction = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.rawTransaction === 'tx' || this.rawTransaction === undefined) {
                            throw new Error('Transaction not signed');
                        }
                        if (!this.messenger) {
                            throw new Error('Messenger not found');
                        }
                        return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.SendRawStakingTransaction, this.rawTransaction, this.messenger.chainType, this.messenger.currentShard)];
                    case 1:
                        res = _a.sent();
                        if (res.isResult()) {
                            this.id = res.result;
                            this.emitTransactionHash(this.id);
                            this.setTxStatus(transaction_1.TxStatus.PENDING);
                            return [2 /*return*/, [this, res.result]];
                        }
                        else if (res.isError()) {
                            this.emitConfirm("transaction failed:".concat(res.error.message));
                            this.setTxStatus(transaction_1.TxStatus.REJECTED);
                            return [2 /*return*/, [this, "transaction failed:".concat(res.error.message)]];
                        }
                        else {
                            this.emitError('transaction failed');
                            throw new Error('transaction failed');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    StakingTransaction.prototype.setUnsigned = function (unSigned) {
        this.unsignedRawTransaction = unSigned;
    };
    StakingTransaction.prototype.setRawTransaction = function (rawTransaction) {
        this.rawTransaction = rawTransaction;
    };
    StakingTransaction.prototype.setSignature = function (signature) {
        this.signature = {
            r: signature.r,
            s: signature.s,
            v: signature.v,
            recoveryParam: signature.recoveryParam,
        };
    };
    StakingTransaction.prototype.setNonce = function (nonce) {
        this.nonce = nonce;
    };
    StakingTransaction.prototype.setFromAddress = function (address) {
        this.from = address;
    };
    StakingTransaction.prototype.getUnsignedRawTransaction = function () {
        return this.unsignedRawTransaction;
    };
    StakingTransaction.prototype.getRawTransaction = function () {
        return this.rawTransaction;
    };
    StakingTransaction.prototype.getSignature = function () {
        return this.signature;
    };
    StakingTransaction.prototype.getFromAddress = function () {
        return this.from;
    };
    StakingTransaction.prototype.confirm = function (txHash_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (txHash, maxAttempts, interval, shardID, toShardID) {
            var txConfirmed, cxConfirmed;
            if (maxAttempts === void 0) { maxAttempts = 20; }
            if (interval === void 0) { interval = 1000; }
            if (shardID === void 0) { shardID = this.messenger.currentShard; }
            if (toShardID === void 0) { toShardID = 0; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.txConfirm(txHash, maxAttempts, interval, shardID)];
                    case 1:
                        txConfirmed = _a.sent();
                        if (shardID === toShardID) {
                            return [2 /*return*/, txConfirmed];
                        }
                        if (!txConfirmed.isConfirmed()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.cxConfirm(txHash, maxAttempts, interval, toShardID)];
                    case 2:
                        cxConfirmed = _a.sent();
                        return [2 /*return*/, cxConfirmed];
                    case 3: return [2 /*return*/, txConfirmed];
                }
            });
        });
    };
    return StakingTransaction;
}(transaction_1.TransactionBase));
exports.StakingTransaction = StakingTransaction;
/** @hidden */
var Description = /** @class */ (function () {
    function Description(name, identity, website, securityContact, details) {
        this.name = name;
        this.identity = identity;
        this.website = website;
        this.securityContact = securityContact;
        this.details = details;
    }
    Description.prototype.encode = function () {
        var raw = [];
        var enc = new text_encoding_1.TextEncoder();
        raw.push(enc.encode(this.name));
        raw.push(enc.encode(this.identity));
        raw.push(enc.encode(this.website));
        raw.push(enc.encode(this.securityContact));
        raw.push(enc.encode(this.details));
        return raw;
    };
    return Description;
}());
exports.Description = Description;
/** @hidden */
var Decimal = /** @class */ (function () {
    function Decimal(value) {
        if (value.length === 0) {
            throw new Error("decimal string is empty");
        }
        var value1 = value;
        if (value[0] === '-') {
            throw new Error("decimal fraction should be be between [0, 1]");
        }
        if (value[0] === '+') {
            value1 = value.substr(1);
        }
        if (value1.length === 0) {
            throw new Error("decimal string is empty");
        }
        var spaced = value1.split(' ');
        if (spaced.length > 1) {
            throw new Error("bad decimal string");
        }
        var splitted = value1.split('.');
        var len = 0;
        var combinedStr = splitted[0];
        if (splitted.length === 2) {
            len = splitted[1].length;
            if (len === 0 || combinedStr.length === 0) {
                throw new Error("bad decimal length");
            }
            if (splitted[1][0] === '-') {
                throw new Error("bad decimal string");
            }
            combinedStr += splitted[1];
        }
        else if (splitted.length > 2) {
            throw new Error("too many periods to be a decimal string");
        }
        if (len > StakingSettings.PRECISION) {
            throw new Error("too much precision: precision should be less than ".concat(StakingSettings.PRECISION));
        }
        var zerosToAdd = StakingSettings.PRECISION - len;
        combinedStr += '0'.repeat(zerosToAdd);
        combinedStr = combinedStr.replace(/^0+/, '');
        var val = new utils_1.Unit(combinedStr).asWei().toWei();
        if (val.gt(new utils_1.Unit(StakingSettings.MAX_DECIMAL.toString()).asWei().toWei())) {
            throw new Error("too large decimal fraction");
        }
        this.value = val;
    }
    Decimal.prototype.encode = function () {
        var raw = [];
        raw.push((0, utils_1.numberToHex)(this.value));
        return raw;
    };
    return Decimal;
}());
exports.Decimal = Decimal;
/** @hidden */
var CommissionRate = /** @class */ (function () {
    function CommissionRate(rate, maxRate, maxChangeRate) {
        this.rate = rate;
        this.maxRate = maxRate;
        this.maxChangeRate = maxChangeRate;
    }
    CommissionRate.prototype.encode = function () {
        var raw = [];
        raw.push(this.rate.encode());
        raw.push(this.maxRate.encode());
        raw.push(this.maxChangeRate.encode());
        return raw;
    };
    return CommissionRate;
}());
exports.CommissionRate = CommissionRate;
var CreateValidator = /** @class */ (function () {
    function CreateValidator(validatorAddress, description, commissionRates, minSelfDelegation, maxTotalDelegation, slotPubKeys, amount) {
        this.validatorAddress = validatorAddress;
        this.description = description;
        this.commissionRates = commissionRates;
        this.minSelfDelegation = minSelfDelegation;
        this.maxTotalDelegation = maxTotalDelegation;
        this.slotPubKeys = slotPubKeys;
        this.amount = amount;
    }
    CreateValidator.prototype.encode = function () {
        var raw = [];
        raw.push((0, crypto_1.hexlify)(transaction_1.TransactionBase.normalizeAddress(this.validatorAddress)));
        raw.push(this.description.encode());
        raw.push(this.commissionRates.encode());
        raw.push((0, crypto_1.hexlify)(this.minSelfDelegation));
        raw.push((0, crypto_1.hexlify)(this.maxTotalDelegation));
        raw.push(this.encodeArr());
        raw.push((0, crypto_1.hexlify)(this.amount));
        return raw;
    };
    CreateValidator.prototype.encodeArr = function () {
        var raw = [];
        this.slotPubKeys.forEach(function (pubKey) {
            raw.push(pubKey);
        });
        return raw;
    };
    return CreateValidator;
}());
exports.CreateValidator = CreateValidator;
var EditValidator = /** @class */ (function () {
    function EditValidator(validatorAddress, description, commissionRate, minSelfDelegation, maxTotalDelegation, slotKeyToRemove, slotKeyToAdd) {
        this.validatorAddress = validatorAddress;
        this.description = description;
        this.commissionRate = commissionRate;
        this.minSelfDelegation = minSelfDelegation;
        this.maxTotalDelegation = maxTotalDelegation;
        this.slotKeyToRemove = slotKeyToRemove;
        this.slotKeyToAdd = slotKeyToAdd;
    }
    EditValidator.prototype.encode = function () {
        var raw = [];
        raw.push((0, crypto_1.hexlify)(transaction_1.TransactionBase.normalizeAddress(this.validatorAddress)));
        raw.push(this.description.encode());
        raw.push(this.commissionRate.encode());
        raw.push((0, crypto_1.hexlify)(this.minSelfDelegation));
        raw.push((0, crypto_1.hexlify)(this.maxTotalDelegation));
        raw.push(this.slotKeyToRemove);
        raw.push(this.slotKeyToAdd);
        return raw;
    };
    return EditValidator;
}());
exports.EditValidator = EditValidator;
var Delegate = /** @class */ (function () {
    function Delegate(delegatorAddress, validatorAddress, amount) {
        this.delegatorAddress = delegatorAddress;
        this.validatorAddress = validatorAddress;
        this.amount = amount;
    }
    Delegate.prototype.encode = function () {
        var raw = [];
        raw.push((0, crypto_1.hexlify)(transaction_1.TransactionBase.normalizeAddress(this.delegatorAddress)));
        raw.push((0, crypto_1.hexlify)(transaction_1.TransactionBase.normalizeAddress(this.validatorAddress)));
        raw.push((0, crypto_1.hexlify)(this.amount));
        return raw;
    };
    return Delegate;
}());
exports.Delegate = Delegate;
var Undelegate = /** @class */ (function () {
    function Undelegate(delegatorAddress, validatorAddress, amount) {
        this.delegatorAddress = delegatorAddress;
        this.validatorAddress = validatorAddress;
        this.amount = amount;
    }
    Undelegate.prototype.encode = function () {
        var raw = [];
        raw.push((0, crypto_1.hexlify)(transaction_1.TransactionBase.normalizeAddress(this.delegatorAddress)));
        raw.push((0, crypto_1.hexlify)(transaction_1.TransactionBase.normalizeAddress(this.validatorAddress)));
        raw.push((0, crypto_1.hexlify)(this.amount));
        return raw;
    };
    return Undelegate;
}());
exports.Undelegate = Undelegate;
var CollectRewards = /** @class */ (function () {
    function CollectRewards(delegatorAddress) {
        this.delegatorAddress = delegatorAddress;
    }
    CollectRewards.prototype.encode = function () {
        var raw = [];
        raw.push((0, crypto_1.hexlify)(transaction_1.TransactionBase.normalizeAddress(this.delegatorAddress)));
        return raw;
    };
    return CollectRewards;
}());
exports.CollectRewards = CollectRewards;
//# sourceMappingURL=stakingTransaction.js.map