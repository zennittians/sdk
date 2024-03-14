"use strict";
/**
 # @stkon-js/utils

This package provides a collection of utility apis for unit conversions like `fromWei`, `toWei`, `hexToNumber`, `numberToHex`, `isAddress`, etc.

## Installation

```
npm install @stkon-js/utils
```

## Usage

Available units
```
const { Units } = require('@stkon-js/utils');

[Units.wei, '1'], // 1 wei
[Units.Kwei, '1000'], // 1e3 wei
[Units.Mwei, '1000000'], // 1e6 wei
[Units.Gwei, '1000000000'], // 1e9 wei
[Units.szabo, '1000000000000'], // 1e12 wei
[Units.finney, '1000000000000000'], // 1e15 wei
[Units.ether, '1000000000000000000'], // 1e18 wei
[Units.one, '1000000000000000000'], // 1e18 wei
[Units.Kether, '1000000000000000000000'], // 1e21 wei
[Units.Mether, '1000000000000000000000000'], // 1e24 wei
[Units.Gether, '1000000000000000000000000000'], // 1e27 wei
[Units.Tether, '1000000000000000000000000000000'], // 1e30 wei
```

Converting between different units
```javascript
const { Units, Unit, numberToString, add0xToString, fromWei, toWei, numToStr} = require('@stkon-js/utils');
const { BN } = require('@stkon-js/crypto');

const one = new Unit('1').asOne();
const oneToGwei = one.toGwei();
console.log(oneToGwei);

// numberToString
const num = 123;
const str = numberToString(num)
console.log(str);

// add0xToString
const str = '12345';
const expected = add0xToString(str)
console.log(expected);

// fromWei
const Wei = new BN('1000000000000000000');
const expected = fromWei(Wei, Units.one);
console.log(expected);

// toWei
const one = new BN('1');
const expected = toWei(one, stk.utils.Units.one);
const num = numToStr(expected);
console.log(num);
```
 *
 * @packageDocumentation
 * @module stkon-utils
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressSuffix = exports.HDPath = exports.StkonCore = exports.defaultConfig = exports.ChainID = exports.ChainType = void 0;
var ChainType;
(function (ChainType) {
    ChainType["Stkon"] = "stk";
    ChainType["Ethereum"] = "eth";
})(ChainType || (exports.ChainType = ChainType = {}));
var ChainID;
(function (ChainID) {
    ChainID[ChainID["Default"] = 0] = "Default";
    ChainID[ChainID["EthMainnet"] = 1] = "EthMainnet";
    ChainID[ChainID["Morden"] = 2] = "Morden";
    ChainID[ChainID["Ropsten"] = 3] = "Ropsten";
    ChainID[ChainID["Rinkeby"] = 4] = "Rinkeby";
    ChainID[ChainID["RootstockMainnet"] = 30] = "RootstockMainnet";
    ChainID[ChainID["RootstockTestnet"] = 31] = "RootstockTestnet";
    ChainID[ChainID["Kovan"] = 42] = "Kovan";
    ChainID[ChainID["EtcMainnet"] = 61] = "EtcMainnet";
    ChainID[ChainID["EtcTestnet"] = 62] = "EtcTestnet";
    ChainID[ChainID["Geth"] = 1337] = "Geth";
    ChainID[ChainID["Ganache"] = 0] = "Ganache";
    ChainID[ChainID["StkMainnet"] = 1] = "StkMainnet";
    ChainID[ChainID["StkTestnet"] = 2] = "StkTestnet";
    ChainID[ChainID["StkLocal"] = 2] = "StkLocal";
    ChainID[ChainID["StkPangaea"] = 3] = "StkPangaea";
})(ChainID || (exports.ChainID = ChainID = {}));
/** @hidden */
exports.defaultConfig = {
    Default: {
        Chain_ID: ChainID.StkLocal,
        Chain_Type: ChainType.Stkon,
        Chain_URL: 'http://localhost:9500',
        Network_ID: 'Local',
    },
    DefaultWS: {
        Chain_ID: ChainID.StkLocal,
        Chain_Type: ChainType.Stkon,
        Chain_URL: 'ws://localhost:9800',
        Network_ID: 'LocalWS',
    },
};
/** @hidden */
var StkonCore = /** @class */ (function () {
    function StkonCore(chainType, chainId) {
        if (chainId === void 0) { chainId = exports.defaultConfig.Default.Chain_ID; }
        this.chainType = chainType;
        this.chainId = chainId;
    }
    Object.defineProperty(StkonCore.prototype, "chainPrefix", {
        get: function () {
            switch (this.chainType) {
                case ChainType.Ethereum: {
                    return 'eth';
                }
                case ChainType.Stkon: {
                    return 'stk';
                }
                default: {
                    return 'stk';
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StkonCore.prototype, "getChainId", {
        get: function () {
            return this.chainId;
        },
        enumerable: false,
        configurable: true
    });
    StkonCore.prototype.setChainId = function (chainId) {
        this.chainId = chainId;
    };
    StkonCore.prototype.setChainType = function (chainType) {
        this.chainType = chainType;
    };
    return StkonCore;
}());
exports.StkonCore = StkonCore;
/** @hidden */
exports.HDPath = "m/44'/1023'/0'/0/";
/** @hidden */
exports.AddressSuffix = '-';
//# sourceMappingURL=chain.js.map