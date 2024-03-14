"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpc = void 0;
var tslib_1 = require("tslib");
/**
 * @class JsonRpc
 * @description json rpc instance
 * @return {JsonRpc} Json RPC instance
 */
var JsonRpc = /** @class */ (function () {
    function JsonRpc() {
        var _this = this;
        /**
         * @function toPayload
         * @memberof JsonRpc.prototype
         * @description convert method and params to payload object
         * @param  {String} method - RPC method
         * @param  {Array<object>} params - params that send to RPC
         * @return {Object} payload object
         */
        this.toPayload = function (method, params) {
            // FIXME: error to be done by shared/errors
            if (!method) {
                throw new Error('jsonrpc method should be specified!');
            }
            // advance message ID
            _this.messageId += 1;
            var sendParams = params === undefined ? [] : typeof params === 'string' ? [params] : tslib_1.__spreadArray([], tslib_1.__read(params), false);
            return {
                jsonrpc: '2.0',
                id: _this.messageId,
                method: method,
                params: sendParams,
            };
        };
        /**
         * @var {Number} messageId
         * @memberof JsonRpc.prototype
         * @description message id, default 0
         */
        this.messageId = 0;
    }
    return JsonRpc;
}());
exports.JsonRpc = JsonRpc;
//# sourceMappingURL=builder.js.map