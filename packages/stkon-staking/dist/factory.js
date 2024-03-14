"use strict";
/**
 * @packageDocumentation
 * @module stkon-staking
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingFactory = void 0;
var stakingTransaction_1 = require("./stakingTransaction");
var utils_1 = require("@stkon-js/utils");
var transaction_1 = require("@stkon-js/transaction");
var StakingFactory = /** @class */ (function () {
    function StakingFactory(messenger) {
        this.messenger = messenger;
        this.nonce = 0;
        this.gasPrice = new utils_1.Unit('100').asGwei().toHex();
        this.gasLimit = new utils_1.Unit('210000').asWei().toHex();
        this.chainId = 1;
        this.signature = {
            v: 0,
            r: '',
            s: '',
        };
    }
    StakingFactory.prototype.createValidator = function (_a) {
        var validatorAddress = _a.validatorAddress, description = _a.description, commissionRate = _a.commissionRate, minSelfDelegation = _a.minSelfDelegation, maxTotalDelegation = _a.maxTotalDelegation, slotPubKeys = _a.slotPubKeys, amount = _a.amount;
        this.stakeMsg = new stakingTransaction_1.CreateValidator(validatorAddress, new stakingTransaction_1.Description(description.name, description.identity, description.website, description.securityContact, description.details), new stakingTransaction_1.CommissionRate(new stakingTransaction_1.Decimal(commissionRate.rate), new stakingTransaction_1.Decimal(commissionRate.maxRate), new stakingTransaction_1.Decimal(commissionRate.maxChangeRate)), minSelfDelegation, maxTotalDelegation, slotPubKeys, amount);
        this.directive = stakingTransaction_1.Directive.DirectiveCreateValidator;
        return this;
    };
    StakingFactory.prototype.editValidator = function (_a) {
        var validatorAddress = _a.validatorAddress, description = _a.description, commissionRate = _a.commissionRate, minSelfDelegation = _a.minSelfDelegation, maxTotalDelegation = _a.maxTotalDelegation, slotKeyToRemove = _a.slotKeyToRemove, slotKeyToAdd = _a.slotKeyToAdd;
        this.stakeMsg = new stakingTransaction_1.EditValidator(validatorAddress, new stakingTransaction_1.Description(description.name, description.identity, description.website, description.securityContact, description.details), new stakingTransaction_1.Decimal(commissionRate), minSelfDelegation, maxTotalDelegation, slotKeyToRemove, slotKeyToAdd);
        this.directive = stakingTransaction_1.Directive.DirectiveEditValidator;
        return this;
    };
    StakingFactory.prototype.delegate = function (_a) {
        var delegatorAddress = _a.delegatorAddress, validatorAddress = _a.validatorAddress, amount = _a.amount;
        this.stakeMsg = new stakingTransaction_1.Delegate(delegatorAddress, validatorAddress, amount);
        this.directive = stakingTransaction_1.Directive.DirectiveDelegate;
        return this;
    };
    StakingFactory.prototype.undelegate = function (_a) {
        var delegatorAddress = _a.delegatorAddress, validatorAddress = _a.validatorAddress, amount = _a.amount;
        this.stakeMsg = new stakingTransaction_1.Undelegate(delegatorAddress, validatorAddress, amount);
        this.directive = stakingTransaction_1.Directive.DirectiveUndelegate;
        return this;
    };
    StakingFactory.prototype.collectRewards = function (_a) {
        var delegatorAddress = _a.delegatorAddress;
        this.stakeMsg = new stakingTransaction_1.CollectRewards(delegatorAddress);
        this.directive = stakingTransaction_1.Directive.DirectiveCollectRewards;
        return this;
    };
    StakingFactory.prototype.setTxParams = function (_a) {
        var nonce = _a.nonce, gasPrice = _a.gasPrice, gasLimit = _a.gasLimit, chainId = _a.chainId, signature = _a.signature;
        this.nonce = nonce;
        this.gasPrice = gasPrice;
        this.gasLimit = gasLimit;
        this.chainId = chainId;
        this.signature = signature;
        return this;
    };
    StakingFactory.prototype.build = function () {
        if (this.directive === undefined) {
            throw new Error('cannot build stakingTransaction without Directive');
        }
        if (this.stakeMsg === undefined) {
            throw new Error('cannot build stakingTransaction without stakeMsg');
        }
        return new stakingTransaction_1.StakingTransaction(this.directive, this.stakeMsg, this.nonce !== undefined ? this.nonce : 0, this.gasPrice !== undefined ? this.gasPrice : new utils_1.Unit('100').asGwei().toHex(), this.gasLimit !== undefined ? this.gasLimit : new utils_1.Unit('210000').asWei().toHex(), this.chainId !== undefined ? this.chainId : 1, this.messenger, transaction_1.TxStatus.INTIALIZED);
    };
    StakingFactory.prototype.setMessenger = function (messenger) {
        this.messenger = messenger;
    };
    return StakingFactory;
}());
exports.StakingFactory = StakingFactory;
//# sourceMappingURL=factory.js.map