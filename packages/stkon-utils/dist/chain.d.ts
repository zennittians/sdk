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
export declare enum ChainType {
    Stkon = "stk",
    Ethereum = "eth"
}
export declare enum ChainID {
    Default = 0,
    EthMainnet = 1,
    Morden = 2,
    Ropsten = 3,
    Rinkeby = 4,
    RootstockMainnet = 30,
    RootstockTestnet = 31,
    Kovan = 42,
    EtcMainnet = 61,
    EtcTestnet = 62,
    Geth = 1337,
    Ganache = 0,
    StkMainnet = 1,
    StkTestnet = 2,
    StkLocal = 2,
    StkPangaea = 3
}
/** @hidden */
export declare const defaultConfig: {
    Default: {
        Chain_ID: ChainID;
        Chain_Type: ChainType;
        Chain_URL: string;
        Network_ID: string;
    };
    DefaultWS: {
        Chain_ID: ChainID;
        Chain_Type: ChainType;
        Chain_URL: string;
        Network_ID: string;
    };
};
/** @hidden */
export declare abstract class StkonCore {
    chainType: ChainType;
    chainId: ChainID;
    constructor(chainType: ChainType, chainId?: ChainID);
    get chainPrefix(): string;
    get getChainId(): ChainID;
    setChainId(chainId: ChainID): void;
    setChainType(chainType: ChainType): void;
}
/** @hidden */
export declare const HDPath = "m/44'/1023'/0'/0/";
/** @hidden */
export declare const AddressSuffix = "-";
//# sourceMappingURL=chain.d.ts.map