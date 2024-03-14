"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
var account_1 = require("@stkon-js/account");
var index_1 = require("./abi/index");
var mapper_1 = require("./utils/mapper");
var methodFactory_1 = require("./methods/methodFactory");
var eventFactory_1 = require("./events/eventFactory");
var status_1 = require("./utils/status");
// class Contract
var Contract = /** @class */ (function () {
    function Contract(abi, address, options, wallet, status) {
        if (abi === void 0) { abi = []; }
        if (address === void 0) { address = '0x'; }
        if (options === void 0) { options = {}; }
        if (status === void 0) { status = status_1.ContractStatus.INITIALISED; }
        this.fallback = undefined;
        this.receive = undefined;
        this.abi = [];
        this.errorFunc = 'Error(string)';
        // super();
        this.abi = abi;
        this.abiCoder = (0, index_1.AbiCoder)();
        this.abiModel = (0, mapper_1.abiMapper)(abi, this.abiCoder);
        this.options = options;
        this.address = this.options.address || address;
        this.shardID = this.options.shardID || wallet.messenger.currentShard;
        this.wallet = wallet;
        this.methods = {};
        this.events = {};
        this.runMethodFactory();
        this.runEventFactory();
        this.status = status;
        this.errorFuncSig = this.abiCoder.encodeFunctionSignature(this.errorFunc);
        // tslint:disable-next-line: no-unused-expression
    }
    Contract.prototype.isInitialised = function () {
        return this.status === status_1.ContractStatus.INITIALISED;
    };
    Contract.prototype.isSigned = function () {
        return this.status === status_1.ContractStatus.SIGNED;
    };
    Contract.prototype.isSent = function () {
        return this.status === status_1.ContractStatus.SENT;
    };
    Contract.prototype.isDeployed = function () {
        return this.status === status_1.ContractStatus.DEPLOYED;
    };
    Contract.prototype.isRejected = function () {
        return this.status === status_1.ContractStatus.REJECTED;
    };
    Contract.prototype.isCalled = function () {
        return this.status === status_1.ContractStatus.CALLED;
    };
    Contract.prototype.setStatus = function (status) {
        this.status = status;
    };
    Object.defineProperty(Contract.prototype, "jsonInterface", {
        get: function () {
            return this.abiModel;
        },
        set: function (value) {
            this.abiModel = (0, mapper_1.abiMapper)(value, this.abiCoder);
            this.runMethodFactory();
            this.runEventFactory();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Contract.prototype, "address", {
        get: function () {
            return this.options.address || this.address;
        },
        set: function (value) {
            this.options.address = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Contract.prototype, "data", {
        get: function () {
            return this.options.data;
        },
        set: function (value) {
            this.options.data = value;
        },
        enumerable: false,
        configurable: true
    });
    // deploy
    Contract.prototype.deploy = function (options) {
        return this.methods.contractConstructor(options);
    };
    Contract.prototype.runMethodFactory = function () {
        return new methodFactory_1.MethodFactory(this).addMethodsToContract();
    };
    Contract.prototype.runEventFactory = function () {
        return new eventFactory_1.EventFactory(this).addEventsToContract();
    };
    Contract.prototype.connect = function (wallet) {
        this.wallet = wallet;
    };
    Contract.prototype.setMessenger = function (messenger) {
        if (this.wallet instanceof account_1.Wallet) {
            this.wallet.setMessenger(messenger);
        }
        else {
            this.wallet.messenger = messenger;
        }
    };
    return Contract;
}());
exports.Contract = Contract;
//# sourceMappingURL=contract.js.map