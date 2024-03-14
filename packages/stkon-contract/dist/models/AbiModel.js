"use strict";
/**
 * @packageDocumentation
 * @module stkon-contract
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbiModel = void 0;
var AbiModel = /** @class */ (function () {
    function AbiModel(mappedAbi) {
        this.abi = mappedAbi;
    }
    AbiModel.prototype.getMethod = function (name) {
        if (this.hasMethod(name)) {
            return this.abi.methods[name];
        }
        return false;
    };
    AbiModel.prototype.getMethods = function () {
        return this.abi.methods;
    };
    AbiModel.prototype.getEvent = function (name) {
        if (this.hasEvent(name)) {
            return this.abi.events[name];
        }
        return false;
    };
    AbiModel.prototype.getFallback = function () {
        if (this.hasFallback()) {
            return this.abi.fallback;
        }
        return false;
    };
    AbiModel.prototype.getReceive = function () {
        if (this.hasReceive()) {
            return this.abi.receive;
        }
        return false;
    };
    AbiModel.prototype.getEvents = function () {
        return this.abi.events;
    };
    AbiModel.prototype.getEventBySignature = function (signature) {
        var _this = this;
        var event;
        Object.keys(this.abi.events).forEach(function (key) {
            if (_this.abi.events[key].signature === signature) {
                event = _this.abi.events[key];
            }
        });
        return event;
    };
    AbiModel.prototype.hasMethod = function (name) {
        return typeof this.abi.methods[name] !== 'undefined';
    };
    AbiModel.prototype.hasFallback = function () {
        return typeof this.abi.fallback !== 'undefined';
    };
    AbiModel.prototype.hasReceive = function () {
        return typeof this.abi.receive !== 'undefined';
    };
    AbiModel.prototype.hasEvent = function (name) {
        return typeof this.abi.events[name] !== 'undefined';
    };
    return AbiModel;
}());
exports.AbiModel = AbiModel;
//# sourceMappingURL=AbiModel.js.map