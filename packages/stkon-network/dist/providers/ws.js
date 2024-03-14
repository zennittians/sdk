"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSProvider = void 0;
var tslib_1 = require("tslib");
// TODO: implement Websocket Provider
var websocket_1 = require("websocket");
var baseSocket_1 = require("./baseSocket");
var utils_1 = require("@stkon-js/utils");
var builder_1 = require("../rpcMethod/builder");
var net_1 = require("../rpcMethod/net");
var WSProvider = /** @class */ (function (_super) {
    tslib_1.__extends(WSProvider, _super);
    // ws: w3cwebsocket;
    function WSProvider(url, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, url) || this;
        if (!(0, utils_1.isWs)(url)) {
            throw new Error("".concat(url, " is not websocket"));
        }
        _this.url = url;
        _this.options = options;
        _this.connection = _this.createWebsocketProvider(_this.url, _this.options);
        _this.jsonRpc = new builder_1.JsonRpc();
        _this.subscriptions = {};
        _this.registerEventListeners();
        return _this;
        // this.on = this.emitter.on.bind(this);
    }
    Object.defineProperty(WSProvider.prototype, "connected", {
        get: function () {
            return this.connection.readyState === this.connection.OPEN;
        },
        enumerable: false,
        configurable: true
    });
    WSProvider.prototype.on = function (type, handler) {
        this.emitter.on(type, handler);
        return this;
    };
    WSProvider.prototype.onData = function (handler) {
        this.emitter.on('data', handler);
        return this;
    };
    WSProvider.prototype.onError = function (event) {
        if (event.code === 'ECONNREFUSED') {
            this.reconnect();
            return;
        }
        _super.prototype.onError.call(this, event);
    };
    WSProvider.prototype.onClose = function (closeEvent) {
        if (closeEvent.code !== 1000 || closeEvent.wasClean === false) {
            this.reconnect();
            return;
        }
        _super.prototype.onClose.call(this);
    };
    WSProvider.prototype.createWebsocketProvider = function (url, options) {
        if (options === void 0) { options = {}; }
        // tslint:disable-next-line: no-string-literal
        if (typeof window !== 'undefined' && window.WebSocket) {
            // tslint:disable-next-line: no-string-literal
            return new WebSocket(url, options.protocol);
        }
        else {
            var headers = options.headers || {};
            var urlObject = new URL(url);
            if (!headers.authorization && urlObject.username && urlObject.password) {
                var authToken = Buffer.from("".concat(urlObject.username, ":").concat(urlObject.password)).toString('base64');
                headers.authorization = "Basic ".concat(authToken);
            }
            return new websocket_1.w3cwebsocket(url, options.protocol, undefined, headers, undefined, options.clientConfig);
        }
    };
    WSProvider.prototype.reconnect = function () {
        var _this = this;
        setTimeout(function () {
            _this.removeAllSocketListeners();
            _this.connection = _this.createWebsocketProvider(_this.url, _this.options);
            _this.registerEventListeners();
        }, 5000);
    };
    WSProvider.prototype.isConnecting = function () {
        return this.connection.readyState === this.connection.CONNECTING;
    };
    WSProvider.prototype.send = function (payload) {
        var _this = this;
        var _a = tslib_1.__read(this.getMiddleware(payload.method), 2), tReq = _a[0], tRes = _a[1];
        var reqMiddleware = net_1.composeMiddleware.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(tReq), false));
        var resMiddleware = net_1.composeMiddleware.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(tRes), false));
        return new Promise(function (resolve, reject) {
            // TODO: test on Error
            if (_this.connected) {
                try {
                    _this.connection.send(reqMiddleware(JSON.stringify(payload)));
                }
                catch (error) {
                    // TODO !isConnecting then reconnect?
                    _this.removeEventListener(baseSocket_1.SocketConnection.ERROR);
                    throw error;
                }
            }
            _this.emitter.on(baseSocket_1.SocketConnection.CONNECT, function () {
                try {
                    _this.connection.send(reqMiddleware(JSON.stringify(payload)));
                }
                catch (error) {
                    // TODO !isConnecting then reconnect?
                    _this.removeEventListener(baseSocket_1.SocketConnection.ERROR);
                    throw error;
                }
            });
            _this.emitter.on("".concat(payload.id), function (data) {
                resolve(resMiddleware(data));
                _this.removeEventListener("".concat(payload.id));
            });
            _this.emitter.on(baseSocket_1.SocketConnection.ERROR, reject);
        });
    };
    WSProvider.prototype.subscribe = function (payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, responseValidateResult;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.send(payload)];
                    case 1:
                        response = _a.sent();
                        responseValidateResult = this.validate(response);
                        if (responseValidateResult instanceof Error) {
                            throw responseValidateResult;
                        }
                        this.subscriptions[response.result] = {
                            id: response.result,
                            subscribeMethod: payload.method,
                            parameters: payload.params,
                            payload: payload,
                        };
                        return [2 /*return*/, response.result];
                }
            });
        });
    };
    WSProvider.prototype.unsubscribe = function (payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var subscriptionId;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                subscriptionId = payload.params[0];
                if (this.hasSubscription(subscriptionId)) {
                    return [2 /*return*/, this.send(payload).then(function (response) {
                            if (response) {
                                _this.removeEventListener(_this.getSubscriptionEvent(subscriptionId));
                                delete _this.subscriptions[subscriptionId];
                            }
                            return response;
                        })];
                }
                return [2 /*return*/, Promise.reject(new Error("Provider error: Subscription with ID ".concat(subscriptionId, " does not exist.")))];
            });
        });
    };
    WSProvider.prototype.clearSubscriptions = function (unsubscribeMethod) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var unsubscribePromises, results;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unsubscribePromises = [];
                        Object.keys(this.subscriptions).forEach(function (key) {
                            _this.removeEventListener(key);
                            unsubscribePromises.push(_this.unsubscribe(_this.jsonRpc.toPayload(unsubscribeMethod, _this.subscriptions[key].id)));
                        });
                        return [4 /*yield*/, Promise.all(unsubscribePromises)];
                    case 1:
                        results = _a.sent();
                        if (results.includes(false)) {
                            throw new Error("Could not unsubscribe all subscriptions: ".concat(JSON.stringify(results)));
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    WSProvider.prototype.registerEventListeners = function () {
        this.connection.onmessage = this.onMessage.bind(this);
        this.connection.onopen = this.onReady.bind(this);
        this.connection.onopen = this.onConnect.bind(this);
        this.connection.onclose = this.onClose.bind(this);
        this.connection.onerror = this.onError.bind(this);
    };
    WSProvider.prototype.onMessage = function (msg) {
        if (msg && msg.data) {
            var result = void 0;
            var event_1;
            try {
                result = (0, utils_1.isObject)(msg.data) ? msg.data : JSON.parse(msg.data);
                if ((0, utils_1.isArray)(result)) {
                    event_1 = result[0].id;
                }
                // tslint:disable-next-line: prefer-conditional-expression
                if (typeof result.id === 'undefined') {
                    event_1 =
                        this.getSubscriptionEvent(result.params.subscription) || result.params.subscription;
                    // result = result.params;
                }
                else {
                    event_1 = result.id;
                }
            }
            catch (error) {
                throw error;
            }
            this.emitter.emit(baseSocket_1.SocketState.SOCKET_MESSAGE, result);
            this.emitter.emit("".concat(event_1), result);
        }
        else {
            throw new Error('provider error');
        }
    };
    WSProvider.prototype.onConnect = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var subscriptionKeys, subscriptionKeys_1, subscriptionKeys_1_1, key, subscriptionId, e_1_1;
            var e_1, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.subscriptions) {
                            this.subscriptions = {};
                        }
                        subscriptionKeys = Object.keys(this.subscriptions);
                        if (!(subscriptionKeys.length > 0)) return [3 /*break*/, 8];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        subscriptionKeys_1 = tslib_1.__values(subscriptionKeys), subscriptionKeys_1_1 = subscriptionKeys_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!subscriptionKeys_1_1.done) return [3 /*break*/, 5];
                        key = subscriptionKeys_1_1.value;
                        return [4 /*yield*/, this.subscribe(this.subscriptions[key].payload)];
                    case 3:
                        subscriptionId = _b.sent();
                        delete this.subscriptions[subscriptionId];
                        this.subscriptions[key].id = subscriptionId;
                        _b.label = 4;
                    case 4:
                        subscriptionKeys_1_1 = subscriptionKeys_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (subscriptionKeys_1_1 && !subscriptionKeys_1_1.done && (_a = subscriptionKeys_1.return)) _a.call(subscriptionKeys_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        this.emitter.emit(baseSocket_1.SocketState.SOCKET_CONNECT);
                        this.emitter.emit(baseSocket_1.SocketConnection.CONNECT);
                        return [2 /*return*/];
                }
            });
        });
    };
    WSProvider.prototype.getSubscriptionEvent = function (subscriptionId) {
        var _this = this;
        if (this.subscriptions[subscriptionId]) {
            return subscriptionId;
        }
        var event;
        Object.keys(this.subscriptions).forEach(function (key) {
            if (_this.subscriptions[key].id === subscriptionId) {
                event = key;
            }
        });
        return event;
    };
    WSProvider.prototype.hasSubscription = function (subscriptionId) {
        return typeof this.getSubscriptionEvent(subscriptionId) !== 'undefined';
    };
    WSProvider.prototype.validate = function (response, payload) {
        if ((0, utils_1.isObject)(response)) {
            if (response.error) {
                if (response.error instanceof Error) {
                    return new Error("Node error: ".concat(response.error.message));
                }
                return new Error("Node error: ".concat(JSON.stringify(response.error)));
            }
            if (payload && response.id !== payload.id) {
                return new Error("Validation error: Invalid JSON-RPC response ID (request: ".concat(payload.id, " / response: ").concat(response.id, ")"));
            }
            if (response.result === undefined) {
                return new Error('Validation error: Undefined JSON-RPC result');
            }
            return true;
        }
        return new Error('Validation error: Response should be of type Object');
    };
    return WSProvider;
}(baseSocket_1.BaseSocket));
exports.WSProvider = WSProvider;
//# sourceMappingURL=ws.js.map