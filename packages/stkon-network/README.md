# @stkon-js/network

This package provides a collection of apis to create messengers (HTTP, WebSocket) to connect to blockchain networks.

## Installation

```
npm install @stkon-js/network
```

## Usage

```javascript
const { Messenger, HttpProvider, WSProvider } = require('@stkon-js/network');
const { ChainID, ChainType } = require('@stkon-js/utils');
const testnetHTTP = 'https://api.s0.b.stkon.xyz';
const testnetWS = 'wss://ws.s0.b.stkon.xyz';
const localHTTP = 'http://localhost:9500/';
const localWS = 'http://localhost:9800/';
const http = new HttpProvider(testnetHTTP); // for local use localHTTP
const ws = new WSProvider(testnetWS); // for local use testnetWS
const customHTTPMessenger = new Messenger(http, ChainType.stkon, ChainID.StkTestnet); // for local ChainID.StkLocal
const customWSMessenger = new Messenger(ws, ChainType.stkon, ChainID.StkTestnet); // for local ChainID.StkLocal
```