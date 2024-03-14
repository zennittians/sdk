"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emitter = void 0;
var tslib_1 = require("tslib");
var mitt_1 = tslib_1.__importDefault(require("mitt"));
var Emitter = /** @class */ (function () {
    function Emitter() {
        var _this = this;
        this.handlers = {};
        this.emitter = (0, mitt_1.default)(this.handlers);
        this.off = this.emitter.off.bind(this);
        this.emit = this.emitter.emit.bind(this);
        // tslint:disable-next-line: no-empty
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
        this.then = this.promise.then.bind(this.promise);
    }
    Emitter.prototype.resetHandlers = function () {
        // tslint:disable-next-line: forin
        for (var i in this.handlers) {
            delete this.handlers[i];
        }
    };
    Emitter.prototype.on = function (type, handler) {
        this.emitter.on(type, handler);
        return this;
    };
    Emitter.prototype.once = function (type, handler) {
        var _this = this;
        this.emitter.on(type, function (e) {
            handler(e);
            _this.removeEventListener(type);
        });
    };
    Emitter.prototype.addEventListener = function (type, handler) {
        this.emitter.on(type, handler);
    };
    Emitter.prototype.removeEventListener = function (type, handler) {
        if (!type) {
            this.handlers = {};
            return;
        }
        if (!handler) {
            delete this.handlers[type];
        }
        else {
            return this.emitter.off(type, handler);
        }
    };
    Emitter.prototype.onError = function (error) {
        this.emitter.on('error', error);
        this.removeEventListener('*');
    };
    Emitter.prototype.onData = function (data) {
        this.emitter.on('data', data);
        this.removeEventListener('*');
    };
    Emitter.prototype.listenerCount = function (listenKey) {
        var count = 0;
        Object.keys(this.handlers).forEach(function (val) {
            if (listenKey === val) {
                count += 1;
            }
        });
        return count;
    };
    return Emitter;
}());
exports.Emitter = Emitter;
//# sourceMappingURL=emitter.js.map