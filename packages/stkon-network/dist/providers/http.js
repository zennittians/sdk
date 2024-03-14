"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpProvider = void 0;
var tslib_1 = require("tslib");
var baseProvider_1 = require("./baseProvider");
var defaultFetcher_1 = require("./defaultFetcher");
var net_1 = require("../rpcMethod/net");
/** @hidden */
var defaultOptions = {
    method: 'POST',
    timeout: net_1.DEFAULT_TIMEOUT,
    headers: net_1.DEFAULT_HEADERS,
    user: null,
    password: null,
};
var HttpProvider = /** @class */ (function (_super) {
    tslib_1.__extends(HttpProvider, _super);
    function HttpProvider(url, options, fetcher) {
        var _this = _super.call(this, url) || this;
        _this.url = url || 'http://localhost:9500';
        _this.fetcher = fetcher || defaultFetcher_1.fetchRPC;
        if (options) {
            _this.options = {
                method: options.method || defaultOptions.method,
                timeout: options.timeout || defaultOptions.timeout,
                user: options.user || defaultOptions.user,
                password: options.password || defaultOptions.password,
                headers: options.headers || defaultOptions.headers,
            };
        }
        else {
            _this.options = defaultOptions;
        }
        return _this;
    }
    /**
     * @function send
     * @memberof HttpProvider.prototype
     * @param  {Object} payload  - payload object
     * @param  {Function} callback - callback function
     * @return {any} - RPC Response
     */
    HttpProvider.prototype.send = function (payload, callback) {
        return this.requestFunc({ payload: payload, callback: callback });
    };
    /**
     * @function sendServer
     * @memberof HttpProvider.prototype
     * @param  {String} endpoint - endpoint to server
     * @param  {Object} payload  - payload object
     * @param  {Function} callback - callback function
     * @return {Function} - RPC Response
     */
    HttpProvider.prototype.sendServer = function (endpoint, payload, callback) {
        return this.requestFunc({ endpoint: endpoint, payload: payload, callback: callback });
    };
    HttpProvider.prototype.requestFunc = function (_a) {
        var _this = this;
        var endpoint = _a.endpoint, payload = _a.payload, callback = _a.callback;
        var _b = tslib_1.__read(this.getMiddleware(payload.method), 2), tReq = _b[0], tRes = _b[1];
        var reqMiddleware = net_1.composeMiddleware.apply(void 0, tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(tReq), false), [function (obj) { return _this.optionsHandler(obj); },
            function (obj) { return _this.endpointHandler(obj, endpoint); },
            this.payloadHandler], false));
        var resMiddleware = net_1.composeMiddleware.apply(void 0, tslib_1.__spreadArray([function (data) { return _this.callbackHandler(data, callback); }], tslib_1.__read(tRes), false));
        var req = reqMiddleware(payload);
        return (0, net_1.performRPC)(req, resMiddleware, this.fetcher);
    };
    /**
     * @function payloadHandler
     * @memberof HttpProvider.prototype
     * @param  {Object} payload - payload object
     * @return {Object} - to payload object
     */
    HttpProvider.prototype.payloadHandler = function (payload) {
        return { payload: payload };
    };
    /**
     * @function endpointHandler
     * @memberof HttpProvider.prototype
     * @param  {Object} obj      - payload object
     * @param  {String} endpoint - add the endpoint to payload object
     * @return {Object} - assign a new object
     */
    HttpProvider.prototype.endpointHandler = function (obj, endpoint) {
        return tslib_1.__assign(tslib_1.__assign({}, obj), { url: endpoint !== null && endpoint !== undefined ? "".concat(this.url).concat(endpoint) : this.url });
    };
    /**
     * @function optionsHandler
     * @memberof HttpProvider.prototype
     * @param  {object} obj - options object
     * @return {object} - assign a new option object
     */
    HttpProvider.prototype.optionsHandler = function (obj) {
        if (this.options.user && this.options.password) {
            var AUTH_TOKEN = "Basic ".concat(Buffer.from("".concat(this.options.user, ":").concat(this.options.password)).toString('base64'));
            this.options.headers.Authorization = AUTH_TOKEN;
        }
        return tslib_1.__assign(tslib_1.__assign({}, obj), { options: this.options });
    };
    /**
     * @function callbackHandler
     * @memberof HttpProvider.prototype
     * @param  {Object} data - from server
     * @param  {Function} cb   - callback function
     * @return {Object|Function} - return object or callback function
     */
    HttpProvider.prototype.callbackHandler = function (data, cb) {
        if (cb) {
            cb(null, data);
        }
        return data;
    };
    HttpProvider.prototype.subscribe = function () {
        throw new Error('HTTPProvider does not support subscriptions.');
    };
    HttpProvider.prototype.unsubscribe = function () {
        throw new Error('HTTPProvider does not support subscriptions.');
    };
    return HttpProvider;
}(baseProvider_1.BaseProvider));
exports.HttpProvider = HttpProvider;
//# sourceMappingURL=http.js.map