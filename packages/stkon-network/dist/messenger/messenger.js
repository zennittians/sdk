"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messenger = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("@stkon-js/utils");
var builder_1 = require("../rpcMethod/builder");
var responseMiddleware_1 = require("./responseMiddleware");
var http_1 = require("../providers/http");
var ws_1 = require("../providers/ws");
// import { getResultForData } from '../util';
var rpc_1 = require("../rpcMethod/rpc");
var types_1 = require("../types");
/**
 * ## How to Create a Massage
 * @example
 * ```
 * const { HttpProvider, Messenger } = require('@stkon-js/network');
 * const { ChainType, ChainID } = require('@stkon-js/utils');
 *
 * // create a custom messenger
 * const customMessenger = new Messenger(
 *   new HttpProvider('http://localhost:9500'),
 *   ChainType.Stkon, // if you are connected to Stkon's blockchain
 *   ChainID.StkLocal, // check if the chainId is correct
 * )
 * ```
 */
var Messenger = /** @class */ (function (_super) {
    tslib_1.__extends(Messenger, _super);
    function Messenger(provider, chainType, chainId, config) {
        if (chainType === void 0) { chainType = utils_1.defaultConfig.Default.Chain_Type; }
        if (chainId === void 0) { chainId = utils_1.defaultConfig.Default.Chain_ID; }
        if (config === void 0) { config = utils_1.defaultConfig; }
        var _this = _super.call(this, chainType, chainId) || this;
        // tslint:disable-next-line: variable-name
        _this.Network_ID = 'Default';
        /**
         * @function send
         * @memberof Messenger.prototype
         * @param  {String} method - RPC method
         * @param  {Object} params - RPC method params
         * @return {Object} RPC result
         */
        _this.send = function (method_1, params_1, rpcPrefix_1) {
            var args_1 = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args_1[_i - 3] = arguments[_i];
            }
            return tslib_1.__awaiter(_this, tslib_1.__spreadArray([method_1, params_1, rpcPrefix_1], tslib_1.__read(args_1), false), void 0, function (method, params, rpcPrefix, shardID) {
                var rpcMethod, payload, provider, result, e_1;
                if (shardID === void 0) { shardID = this.currentShard; }
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.providerCheck();
                            rpcMethod = method;
                            if (rpcPrefix && (0, utils_1.isString)(rpcPrefix) && rpcPrefix !== this.chainPrefix) {
                                rpcMethod = this.setRPCPrefix(method, rpcPrefix);
                            }
                            else if (!rpcPrefix || rpcPrefix === this.chainPrefix) {
                                rpcMethod = this.setRPCPrefix(method, this.chainPrefix);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            payload = this.JsonRpc.toPayload(rpcMethod, params);
                            provider = this.getShardProvider(shardID);
                            this.setResMiddleware(function (data) {
                                if (!(data instanceof responseMiddleware_1.ResponseMiddleware)) {
                                    return new responseMiddleware_1.ResponseMiddleware(data);
                                }
                                else {
                                    return data;
                                }
                            }, '*', provider);
                            return [4 /*yield*/, provider.send(payload)];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, result];
                        case 3:
                            e_1 = _a.sent();
                            throw new Error(typeof e_1 === 'string' ? e_1 : undefined);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        _this.subscribe = function (method_1, params_1) {
            var args_1 = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args_1[_i - 2] = arguments[_i];
            }
            return tslib_1.__awaiter(_this, tslib_1.__spreadArray([method_1, params_1], tslib_1.__read(args_1), false), void 0, function (method, params, returnType, rpcPrefix, shardID) {
                var rpcMethod, id, provider, reProvider_1, payload, error_1;
                if (returnType === void 0) { returnType = types_1.SubscribeReturns.all; }
                if (rpcPrefix === void 0) { rpcPrefix = this.chainPrefix; }
                if (shardID === void 0) { shardID = this.currentShard; }
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rpcMethod = method;
                            if (rpcPrefix && (0, utils_1.isString)(rpcPrefix) && rpcPrefix !== this.chainPrefix) {
                                rpcMethod = this.setRPCPrefix(method, rpcPrefix);
                            }
                            else if (!rpcPrefix || rpcPrefix === this.chainPrefix) {
                                rpcMethod = this.setRPCPrefix(method, this.chainPrefix);
                            }
                            id = null;
                            provider = this.getShardProvider(shardID);
                            if (!(provider instanceof ws_1.WSProvider)) return [3 /*break*/, 5];
                            reProvider_1 = provider;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            payload = this.JsonRpc.toPayload(rpcMethod, params);
                            return [4 /*yield*/, reProvider_1.subscribe(payload)];
                        case 2:
                            id = _a.sent();
                            reProvider_1.on(id, function (result) {
                                reProvider_1.emitter.emit('data', result);
                            });
                            reProvider_1.once('error', function (error) {
                                reProvider_1.removeEventListener(id);
                                reProvider_1.emitter.emit('error', error);
                                reProvider_1.removeEventListener('*');
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            reProvider_1.emitter.emit('error', error_1);
                            reProvider_1.removeEventListener('*');
                            return [3 /*break*/, 4];
                        case 4:
                            if (returnType === types_1.SubscribeReturns.all) {
                                return [2 /*return*/, [reProvider_1, id]];
                            }
                            else if (returnType === types_1.SubscribeReturns.method) {
                                return [2 /*return*/, reProvider_1];
                            }
                            else if (returnType === types_1.SubscribeReturns.id) {
                                return [2 /*return*/, id];
                            }
                            else {
                                throw new Error('Invalid returns');
                            }
                            return [3 /*break*/, 6];
                        case 5: throw new Error('HttpProvider does not support this');
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        _this.unsubscribe = function (method_1, params_1, rpcPrefix_1) {
            var args_1 = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args_1[_i - 3] = arguments[_i];
            }
            return tslib_1.__awaiter(_this, tslib_1.__spreadArray([method_1, params_1, rpcPrefix_1], tslib_1.__read(args_1), false), void 0, function (method, params, rpcPrefix, shardID) {
                var rpcMethod, provider, reProvider, payload, response, error_2;
                if (shardID === void 0) { shardID = this.currentShard; }
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rpcMethod = method;
                            if (rpcPrefix && (0, utils_1.isString)(rpcPrefix) && rpcPrefix !== this.chainPrefix) {
                                rpcMethod = this.setRPCPrefix(method, rpcPrefix);
                            }
                            else if (!rpcPrefix || rpcPrefix === this.chainPrefix) {
                                rpcMethod = this.setRPCPrefix(method, this.chainPrefix);
                            }
                            provider = this.getShardProvider(shardID);
                            if (!(provider instanceof ws_1.WSProvider)) return [3 /*break*/, 5];
                            reProvider = this.provider;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            payload = this.JsonRpc.toPayload(rpcMethod, params);
                            return [4 /*yield*/, reProvider.unsubscribe(payload)];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, response];
                        case 3:
                            error_2 = _a.sent();
                            throw error_2;
                        case 4: return [3 /*break*/, 6];
                        case 5: throw new Error('HttpProvider does not support this');
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @var {Provider} provider
         * @memberof Messenger.prototype
         * @description Provider instance
         */
        _this.provider = provider;
        /**
         * @var {Object} config
         * @memberof Messenger.prototype
         * @description Messenger config
         */
        _this.config = config;
        /**
         * @var {Number} Network_ID
         * @memberof Messenger.prototype
         * @description Network ID for current provider
         */
        /**
         * @var {JsonRpc} JsonRpc
         * @memberof Messenger.prototype
         * @description JsonRpc instance
         */
        _this.JsonRpc = new builder_1.JsonRpc();
        // set Network ID
        _this.setNetworkID(utils_1.defaultConfig.Default.Network_ID);
        // set shardingProviders
        _this.shardProviders = new Map();
        return _this;
        // this.setShardingProviders();
    }
    Object.defineProperty(Messenger.prototype, "currentShard", {
        /**
         * @example
         * ```
         * customMessenger.currentShard
         * ```
         */
        get: function () {
            return this.getCurrentShardID() || this.defaultShardID || 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Messenger.prototype, "shardCount", {
        /**
         * @example
         * ```
         * customMessenger.shardCount
         * ```
         */
        get: function () {
            return this.shardProviders.size;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @function setProvider
     * @memberof Messenger
     * @description provider setter
     * @param  {Provider} provider - provider instance
     */
    Messenger.prototype.setProvider = function (provider) {
        this.provider = provider;
    };
    /**
     * @function providerCheck
     * @memberof Messenger
     * @description provider checker
     * @return {Error|null} provider validator
     */
    Messenger.prototype.providerCheck = function () {
        if (!this.provider) {
            throw new Error('provider is not found');
        }
    };
    /**
     * @function setReqMiddleware
     * @description set request middleware
     * @memberof Messenger
     * @param  {any} middleware - middle ware for req
     * @param  {String} method  - method name
     * @hidden
     */
    Messenger.prototype.setReqMiddleware = function (middleware, method, provider) {
        if (method === void 0) { method = '*'; }
        provider.middlewares.request.use(middleware, method);
    };
    /**
     * @function setResMiddleware
     * @description set response middleware
     * @memberof Messenger
     * @param  {any} middleware - middle ware for req
     * @param  {String} method  - method name
     * @hidden
     */
    Messenger.prototype.setResMiddleware = function (middleware, method, provider) {
        if (method === void 0) { method = '*'; }
        provider.middlewares.response.use(middleware, method);
    };
    /**
     * @function setNetworkID
     * @description set network id
     * @memberof Messenger
     * @param  {String} id network id string
     */
    Messenger.prototype.setNetworkID = function (id) {
        this.Network_ID = id;
    };
    Messenger.prototype.setRPCPrefix = function (method, prefix) {
        var stringArray = method.split('_');
        if (stringArray.length !== 2) {
            throw new Error("could not set prefix with ".concat(method));
        }
        stringArray[0] = prefix;
        return stringArray.join('_');
    };
    Messenger.prototype.setShardingProviders = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, shardingStructures, shardingStructures_1, shardingStructures_1_1, shard, shardID, error_3;
            var e_2, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.chainPrefix !== utils_1.ChainType.Stkon) {
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.send(rpc_1.RPCMethod.GetShardingStructure, [], this.chainPrefix)];
                    case 2:
                        response = _b.sent();
                        if (response.result) {
                            shardingStructures = response.result;
                            try {
                                for (shardingStructures_1 = tslib_1.__values(shardingStructures), shardingStructures_1_1 = shardingStructures_1.next(); !shardingStructures_1_1.done; shardingStructures_1_1 = shardingStructures_1.next()) {
                                    shard = shardingStructures_1_1.value;
                                    shardID = typeof shard.shardID === 'string' ? Number.parseInt(shard.shardID, 10) : shard.shardID;
                                    this.shardProviders.set(shardID, {
                                        current: shard.current,
                                        shardID: shardID,
                                        http: shard.http,
                                        ws: shard.ws,
                                    });
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (shardingStructures_1_1 && !shardingStructures_1_1.done && (_a = shardingStructures_1.return)) _a.call(shardingStructures_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @example
     * ```
     * stk.messenger.getShardProvider()
     * ```
     */
    Messenger.prototype.getShardProvider = function (shardID) {
        var provider = this.shardProviders.get(shardID);
        if (provider) {
            return this.provider instanceof http_1.HttpProvider
                ? new http_1.HttpProvider(provider.http)
                : new ws_1.WSProvider(provider.ws);
        }
        return this.provider;
    };
    /**
     * @example
     * ```
     * stk.messenger.getCurrentShardID()
     * ```
     */
    Messenger.prototype.getCurrentShardID = function () {
        var e_3, _a;
        try {
            for (var _b = tslib_1.__values(this.shardProviders), _c = _b.next(); !_c.done; _c = _b.next()) {
                var shard = _c.value;
                if (shard[1].current === true ||
                    shard[1].http === this.provider.url ||
                    shard[1].ws === this.provider.url) {
                    return shard[1].shardID;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    Messenger.prototype.setDefaultShardID = function (shardID) {
        this.defaultShardID = shardID;
    };
    return Messenger;
}(utils_1.StkonCore));
exports.Messenger = Messenger;
//# sourceMappingURL=messenger.js.map