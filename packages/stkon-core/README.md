# @stkon-js/core

This package provides a collection of apis to interact with stkon blockchain.

## Installation

```
npm install @stkon-js/core
```

## Usage

Create a stkon instance connecting to testnet

```javascript
const { stkon } = require('@stkon-js/core');
const {
  ChainID,
  ChainType,
  hexToNumber,
  numberToHex,
  fromWei,
  Units,
  Unit,
} = require('@stkon-js/utils');

const stk = new stkon(
    'https://api.s0.b.stkon.xyz/',
    {
        chainType: ChainType.stkon,
        chainId: ChainID.StkTestnet,
    },
);
```
