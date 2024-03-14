"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseMiddleware = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("@stkon-js/utils");
/**
 * @class ResponseMiddleware
 * @description Response middleware of RPC
 * @param  {Object}  ResponseBody - response from rpc
 * @return {ResponseMiddleware} response middleware instance
 */
var ResponseMiddleware = /** @class */ (function () {
    function ResponseMiddleware(ResponseBody) {
        this.result = ResponseBody.result;
        this.error = ResponseBody.error;
        this.raw = ResponseBody;
        this.responseType = this.getResponseType();
    }
    Object.defineProperty(ResponseMiddleware.prototype, "getResult", {
        get: function () {
            return (0, utils_1.isObject)(this.result) ? tslib_1.__assign(tslib_1.__assign({}, this.result), { responseType: 'result' }) : this.result;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResponseMiddleware.prototype, "getError", {
        get: function () {
            return (0, utils_1.isObject)(this.error) ? tslib_1.__assign(tslib_1.__assign({}, this.error), { responseType: 'error' }) : this.error;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResponseMiddleware.prototype, "getRaw", {
        get: function () {
            return tslib_1.__assign(tslib_1.__assign({}, this.raw), { responseType: 'raw' });
        },
        enumerable: false,
        configurable: true
    });
    ResponseMiddleware.prototype.getResponseType = function () {
        if (this.error) {
            return 'error';
        }
        else if (this.result || (this.result === null && this.result !== undefined)) {
            return 'result';
        }
        else {
            return 'raw';
        }
    };
    ResponseMiddleware.prototype.isError = function () {
        return this.responseType === 'error';
    };
    ResponseMiddleware.prototype.isResult = function () {
        return this.responseType === 'result';
    };
    ResponseMiddleware.prototype.isRaw = function () {
        return this.responseType === 'raw';
    };
    return ResponseMiddleware;
}());
exports.ResponseMiddleware = ResponseMiddleware;
//# sourceMappingURL=responseMiddleware.js.map