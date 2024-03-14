"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSocket = exports.EmittType = exports.SocketState = exports.SocketConnection = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("@stkon-js/utils");
var mitt_1 = tslib_1.__importDefault(require("mitt"));
var baseProvider_1 = require("./baseProvider");
var SocketConnection;
(function (SocketConnection) {
    SocketConnection["READY"] = "ready";
    SocketConnection["CONNECT"] = "connect";
    SocketConnection["ERROR"] = "error";
    SocketConnection["CLOSE"] = "close";
})(SocketConnection || (exports.SocketConnection = SocketConnection = {}));
var SocketState;
(function (SocketState) {
    SocketState["SOCKET_MESSAGE"] = "socket_message";
    SocketState["SOCKET_READY"] = "socket_ready";
    SocketState["SOCKET_CLOSE"] = "socket_close";
    SocketState["SOCKET_ERROR"] = "socket_error";
    SocketState["SOCKET_CONNECT"] = "socket_connect";
    SocketState["SOCKET_NETWORK_CHANGED"] = "socket_networkChanged";
    SocketState["SOCKET_ACCOUNTS_CHANGED"] = "socket_accountsChanged";
})(SocketState || (exports.SocketState = SocketState = {}));
var EmittType;
(function (EmittType) {
    EmittType["INSTANCE"] = "instance";
    EmittType["PUBSUB"] = "pubsub";
})(EmittType || (exports.EmittType = EmittType = {}));
var BaseSocket = /** @class */ (function (_super) {
    tslib_1.__extends(BaseSocket, _super);
    function BaseSocket(url) {
        var _this = _super.call(this, url) || this;
        _this.handlers = {};
        if (!(0, utils_1.isWs)(url)) {
            throw new Error("".concat(url, " is not websocket"));
        }
        _this.url = url;
        _this.emitter = (0, mitt_1.default)(_this.handlers);
        return _this;
    }
    BaseSocket.prototype.resetHandlers = function () {
        // tslint:disable-next-line: forin
        for (var i in this.handlers) {
            delete this.handlers[i];
        }
    };
    BaseSocket.prototype.once = function (type, handler) {
        this.emitter.on(type, handler);
        this.removeEventListener(type);
    };
    BaseSocket.prototype.addEventListener = function (type, handler) {
        this.emitter.on(type, handler);
    };
    BaseSocket.prototype.removeEventListener = function (type, handler) {
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
    BaseSocket.prototype.reset = function () {
        this.removeEventListener('*');
        // this.registerEventListeners();
    };
    BaseSocket.prototype.removeAllSocketListeners = function () {
        this.removeEventListener(SocketState.SOCKET_MESSAGE);
        this.removeEventListener(SocketState.SOCKET_READY);
        this.removeEventListener(SocketState.SOCKET_CLOSE);
        this.removeEventListener(SocketState.SOCKET_ERROR);
        this.removeEventListener(SocketState.SOCKET_CONNECT);
    };
    BaseSocket.prototype.onReady = function (event) {
        this.emitter.emit(SocketConnection.READY, event);
        this.emitter.emit(SocketState.SOCKET_READY, event);
    };
    BaseSocket.prototype.onError = function (error) {
        this.emitter.emit(SocketConnection.ERROR, error);
        this.emitter.emit(SocketState.SOCKET_ERROR, error);
        this.removeAllSocketListeners();
        this.removeEventListener('*');
    };
    BaseSocket.prototype.onClose = function (error) {
        if (error === void 0) { error = null; }
        this.emitter.emit(SocketConnection.CLOSE, error);
        this.emitter.emit(SocketState.SOCKET_CLOSE, error);
        this.removeAllSocketListeners();
        this.removeEventListener('*');
    };
    return BaseSocket;
}(baseProvider_1.BaseProvider));
exports.BaseSocket = BaseSocket;
//# sourceMappingURL=baseSocket.js.map