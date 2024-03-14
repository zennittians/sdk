"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventFactory = void 0;
var utils_1 = require("@stkon-js/utils");
var event_1 = require("./event");
var formatter_1 = require("../utils/formatter");
var encoder_1 = require("../utils/encoder");
var EventFactory = /** @class */ (function () {
    // constructor
    function EventFactory(contract) {
        this.contract = contract;
        this.abiModel = this.contract.abiModel;
        this.abiCoder = this.contract.abiCoder;
        this.eventKeys = this.mapEventKeys();
    }
    EventFactory.prototype.addEventsToContract = function () {
        var _this = this;
        this.eventKeys.forEach(function (key) {
            var newObject = {};
            newObject[key] = function (params) {
                return new event_1.EventMethod(key, 
                // params,
                _this.map(_this.abiModel.getEvent(key), _this.contract, params), _this.abiModel.getEvent(key), _this.contract);
            };
            Object.assign(_this.contract.events, newObject);
        });
        return this.contract;
    };
    /**
     * @function mapMethodKeys
     * @return {string[]} {description}
     */
    EventFactory.prototype.mapEventKeys = function () {
        return Object.keys(this.abiModel.abi.events);
    };
    EventFactory.prototype.map = function (abiItemModel, contract, options) {
        if (!options) {
            options = {};
        }
        if (!(0, utils_1.isArray)(options.topics)) {
            options.topics = [];
        }
        if (typeof options.fromBlock !== 'undefined') {
            options.fromBlock = (0, formatter_1.inputBlockNumberFormatter)(options.fromBlock);
        }
        // else if (contract.defaultBlock !== null) {
        //   options.fromBlock = contract.defaultBlock;
        // }
        if (typeof options.toBlock !== 'undefined') {
            options.toBlock = (0, formatter_1.inputBlockNumberFormatter)(options.toBlock);
        }
        if (typeof options.filter !== 'undefined') {
            options.topics = options.topics.concat((0, encoder_1.eventFilterEncoder)(this.abiCoder, abiItemModel, options.filter));
            delete options.filter;
        }
        if (!abiItemModel.anonymous) {
            options.topics.unshift(abiItemModel.signature);
        }
        if (!options.address) {
            options.address = contract.address;
        }
        return options;
    };
    return EventFactory;
}());
exports.EventFactory = EventFactory;
//# sourceMappingURL=eventFactory.js.map