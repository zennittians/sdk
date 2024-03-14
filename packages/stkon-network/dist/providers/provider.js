"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = exports.ProviderType = void 0;
var http_1 = require("./http");
var ws_1 = require("./ws");
var utils_1 = require("@stkon-js/utils");
var ProviderType;
(function (ProviderType) {
    ProviderType["http"] = "http";
    ProviderType["ws"] = "ws";
})(ProviderType || (exports.ProviderType = ProviderType = {}));
var Provider = /** @class */ (function () {
    function Provider(url) {
        this.provider = this.onInitSetProvider(url);
        this.providerType = this.getType(this.provider);
    }
    Provider.getProvider = function (provider) {
        try {
            this.getProvider(provider);
            return new Provider(provider);
        }
        catch (error) {
            throw error;
        }
    };
    Provider.prototype.onInitSetProvider = function (providerUrl) {
        if (typeof providerUrl === 'string') {
            return (0, utils_1.isHttp)(providerUrl)
                ? new http_1.HttpProvider(providerUrl)
                : (0, utils_1.isWs)(providerUrl)
                    ? new ws_1.WSProvider(providerUrl)
                    : new http_1.HttpProvider(utils_1.defaultConfig.Default.Chain_URL);
        }
        try {
            var providerType = this.getType(providerUrl);
            if (providerType === ProviderType.http || providerType === ProviderType.ws) {
                return providerUrl;
            }
            else {
                throw new Error('cannot get provider type');
            }
        }
        catch (error) {
            throw error;
        }
    };
    Provider.prototype.getType = function (provider) {
        if (provider instanceof http_1.HttpProvider) {
            return ProviderType.http;
        }
        if (provider instanceof ws_1.WSProvider) {
            return ProviderType.ws;
        }
        throw new Error('provider is not correct');
    };
    return Provider;
}());
exports.Provider = Provider;
//# sourceMappingURL=provider.js.map