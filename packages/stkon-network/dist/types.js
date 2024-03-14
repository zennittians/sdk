"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 * @ignore
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeReturns = exports.MiddlewareType = void 0;
var MiddlewareType;
(function (MiddlewareType) {
    MiddlewareType[MiddlewareType["REQ"] = 0] = "REQ";
    MiddlewareType[MiddlewareType["RES"] = 1] = "RES";
})(MiddlewareType || (exports.MiddlewareType = MiddlewareType = {}));
var SubscribeReturns;
(function (SubscribeReturns) {
    SubscribeReturns["all"] = "all";
    SubscribeReturns["id"] = "id";
    SubscribeReturns["method"] = "method";
})(SubscribeReturns || (exports.SubscribeReturns = SubscribeReturns = {}));
//# sourceMappingURL=types.js.map