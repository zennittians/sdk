"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRPC = void 0;
var tslib_1 = require("tslib");
var cross_fetch_1 = tslib_1.__importDefault(require("cross-fetch"));
exports.fetchRPC = {
    requestHandler: function (request, headers) {
        return (0, cross_fetch_1.default)(request.url, {
            method: request.options && request.options.method ? request.options.method : 'POST',
            cache: 'no-cache',
            mode: 'cors',
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(request.payload),
            headers: tslib_1.__assign(tslib_1.__assign({}, headers), (request.options && request.options.headers ? request.options.headers : {})),
        });
    },
    responseHandler: function (response, request, handler) {
        return response
            .json()
            .then(function (body) {
            return tslib_1.__assign(tslib_1.__assign({}, body), { req: request });
        })
            .then(handler);
    },
};
//# sourceMappingURL=defaultFetcher.js.map