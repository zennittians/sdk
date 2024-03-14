"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 * @ignore
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeMiddleware = exports.performRPC = exports.DEFAULT_HEADERS = exports.DEFAULT_TIMEOUT = void 0;
var tslib_1 = require("tslib");
exports.DEFAULT_TIMEOUT = 120000;
exports.DEFAULT_HEADERS = { 'Content-Type': 'application/json' };
function _fetch(fetchPromise, timeout) {
    var abortFn;
    var abortPromise = new Promise(function (resolve, reject) {
        abortFn = function () { return reject(new Error("request Timeout in ".concat(timeout, " ms"))); };
    });
    var abortablePromise = Promise.race([fetchPromise, abortPromise]);
    setTimeout(function () {
        abortFn();
    }, timeout);
    return abortablePromise;
}
var performRPC = function (request, handler, fetcher) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var response, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, _fetch(fetcher.requestHandler(request, exports.DEFAULT_HEADERS), request.options && request.options.timeout ? request.options.timeout : exports.DEFAULT_TIMEOUT)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, fetcher.responseHandler(response, request, handler)];
            case 2:
                err_1 = _a.sent();
                throw err_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.performRPC = performRPC;
function composeMiddleware() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    if (fns.length === 0) {
        return function (arg) { return arg; };
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return fns.reduce(function (a, b) { return function (arg) { return a(b(arg)); }; });
}
exports.composeMiddleware = composeMiddleware;
//# sourceMappingURL=net.js.map