"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProvider = void 0;
var tslib_1 = require("tslib");
var types_1 = require("../types");
var BaseProvider = /** @class */ (function () {
    function BaseProvider(url, reqMiddleware, resMiddleware) {
        if (reqMiddleware === void 0) { reqMiddleware = new Map(); }
        if (resMiddleware === void 0) { resMiddleware = new Map(); }
        var _this = this;
        this.middlewares = {
            request: {
                use: function (fn, match) {
                    if (match === void 0) { match = '*'; }
                    _this.pushMiddleware(fn, types_1.MiddlewareType.REQ, match);
                },
            },
            response: {
                use: function (fn, match) {
                    if (match === void 0) { match = '*'; }
                    _this.pushMiddleware(fn, types_1.MiddlewareType.RES, match);
                },
            },
        };
        this.reqMiddleware = new Map().set('*', []);
        this.resMiddleware = new Map().set('*', []);
        this.reqMiddleware = reqMiddleware;
        this.resMiddleware = resMiddleware;
        this.url = url;
    }
    BaseProvider.prototype.pushMiddleware = function (fn, type, match) {
        if (type !== types_1.MiddlewareType.REQ && type !== types_1.MiddlewareType.RES) {
            throw new Error('Please specify the type of middleware being added');
        }
        if (type === types_1.MiddlewareType.REQ) {
            var current = this.reqMiddleware.get(match) || [];
            this.reqMiddleware.set(match, tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(current), false), [fn], false));
        }
        else {
            var current = this.resMiddleware.get(match) || [];
            this.resMiddleware.set(match, tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(current), false), [fn], false));
        }
    };
    BaseProvider.prototype.getMiddleware = function (method) {
        var e_1, _a, e_2, _b;
        var requests = [];
        var responses = [];
        try {
            for (var _c = tslib_1.__values(this.reqMiddleware.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = tslib_1.__read(_d.value, 2), key = _e[0], transformers = _e[1];
                if (typeof key === 'string' && key !== '*' && key === method) {
                    requests.push.apply(requests, tslib_1.__spreadArray([], tslib_1.__read(transformers), false));
                }
                if (key instanceof RegExp && key.test(method)) {
                    requests.push.apply(requests, tslib_1.__spreadArray([], tslib_1.__read(transformers), false));
                }
                if (key === '*') {
                    requests.push.apply(requests, tslib_1.__spreadArray([], tslib_1.__read(transformers), false));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _f = tslib_1.__values(this.resMiddleware.entries()), _g = _f.next(); !_g.done; _g = _f.next()) {
                var _h = tslib_1.__read(_g.value, 2), key = _h[0], transformers = _h[1];
                if (typeof key === 'string' && key !== '*' && key === method) {
                    responses.push.apply(responses, tslib_1.__spreadArray([], tslib_1.__read(transformers), false));
                }
                if (key instanceof RegExp && key.test(method)) {
                    responses.push.apply(responses, tslib_1.__spreadArray([], tslib_1.__read(transformers), false));
                }
                if (key === '*') {
                    responses.push.apply(responses, tslib_1.__spreadArray([], tslib_1.__read(transformers), false));
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return [requests, responses];
    };
    return BaseProvider;
}());
exports.BaseProvider = BaseProvider;
//# sourceMappingURL=baseProvider.js.map