"use strict";
/**
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
const customHTTPMessenger = new Messenger(http, ChainType.Stkon, ChainID.StkTestnet); // for local ChainID.StkLocal
const customWSMessenger = new Messenger(ws, ChainType.Stkon, ChainID.StkTestnet); // for local ChainID.StkLocal
```
 *
 * @packageDocumentation
 * @module stkon-network
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCErrorCode = exports.RPCMethod = void 0;
/**@ignore */
var RPCMethod;
(function (RPCMethod) {
    // 1. stk_getBlockByHash
    RPCMethod["GetBlockByHash"] = "stk_getBlockByHash";
    // 2. stk_getBlockByNumber
    RPCMethod["GetBlockByNumber"] = "stk_getBlockByNumber";
    // 3. stk_getBlockTransactionCountByHash
    RPCMethod["GetBlockTransactionCountByHash"] = "stk_getBlockTransactionCountByHash";
    // 4. stk_getBlockTransactionCountByNumber
    RPCMethod["GetBlockTransactionCountByNumber"] = "stk_getBlockTransactionCountByNumber";
    // 5. stk_getCode
    RPCMethod["GetCode"] = "stk_getCode";
    // 6. stk_getTransactionByBlockHashAndIndex
    RPCMethod["GetTransactionByBlockHashAndIndex"] = "stk_getTransactionByBlockHashAndIndex";
    // 7. stk_getTransactionByBlockNumberAndIndex
    RPCMethod["GetTransactionByBlockNumberAndIndex"] = "stk_getTransactionByBlockNumberAndIndex";
    // 8. stk_getTransactionByHash
    RPCMethod["GetTransactionByHash"] = "stk_getTransactionByHash";
    RPCMethod["GetTransactionReceipt"] = "stk_getTransactionReceipt";
    RPCMethod["GetCXReceiptByHash"] = "stk_getCXReceiptByHash";
    // 9. stk_syncing
    RPCMethod["Syncing"] = "stk_syncing";
    // 10. net_peerCount
    RPCMethod["PeerCount"] = "net_peerCount";
    // 11. stk_getBalance
    RPCMethod["GetBalance"] = "stk_getBalance";
    // 12. stk_getStorageAt
    RPCMethod["GetStorageAt"] = "stk_getStorageAt";
    // 13. stk_getTransactionCount
    RPCMethod["GetTransactionCount"] = "stk_getTransactionCount";
    // 14. stk_sendTransaction
    RPCMethod["SendTransaction"] = "stk_sendTransaction";
    // 15. stk_sendRawTransaction
    RPCMethod["SendRawTransaction"] = "stk_sendRawTransaction";
    // 16. stk_subscribe
    RPCMethod["Subscribe"] = "stk_subscribe";
    // 17. stk_getlogs
    RPCMethod["GetPastLogs"] = "stk_getLogs";
    // 18. stk_getWork
    RPCMethod["GetWork"] = "stk_getWork";
    // 19. stk_submitWork
    // SubmitWork = 'stk_submitWork',
    // 20. stk_getProof
    RPCMethod["GetProof"] = "stk_getProof";
    // 21, stk_getFilterChanges
    RPCMethod["GetFilterChanges"] = "stk_getFilterChanges";
    // 22. stk_newPendingTransactionFilter
    RPCMethod["NewPendingTransactionFilter"] = "stk_newPendingTransactionFilter";
    // 23. stk_newBlockFilter
    RPCMethod["NewBlockFilter"] = "stk_newBlockFilter";
    // 24. stk_newFilter
    RPCMethod["NewFilter"] = "stk_newFilter";
    // 25. stk_call
    RPCMethod["Call"] = "stk_call";
    // 26. stk_estimateGas
    RPCMethod["EstimateGas"] = "stk_estimateGas";
    // 27. stk_gasPrice
    RPCMethod["GasPrice"] = "stk_gasPrice";
    // 28. stk_blockNumber
    RPCMethod["BlockNumber"] = "stk_blockNumber";
    // 29. stk_unsubscribe
    RPCMethod["UnSubscribe"] = "stk_unsubscribe";
    // 30. net_version
    RPCMethod["NetVersion"] = "net_version";
    // 31. stk_protocolVersion
    RPCMethod["ProtocolVersion"] = "stk_protocolVersion";
    // 32. stk_getShardingStructure
    RPCMethod["GetShardingStructure"] = "stk_getShardingStructure";
    // 33. stk_sendRawStakingTransaction
    RPCMethod["SendRawStakingTransaction"] = "stk_sendRawStakingTransaction";
    // 34. stk_getAccountNonce
    RPCMethod["GetAccountNonce"] = "stk_getAccountNonce";
    // 35. stk_getBlocks
    RPCMethod["GetBlocks"] = "stk_getBlocks";
})(RPCMethod || (exports.RPCMethod = RPCMethod = {}));
/**@ignore */
var RPCErrorCode;
(function (RPCErrorCode) {
    // Standard JSON-RPC 2.0 errors
    // RPC_INVALID_REQUEST is internally mapped to HTTP_BAD_REQUEST (400).
    // It should not be used for application-layer errors.
    RPCErrorCode[RPCErrorCode["RPC_INVALID_REQUEST"] = -32600] = "RPC_INVALID_REQUEST";
    // RPC_METHOD_NOT_FOUND is internally mapped to HTTP_NOT_FOUND (404).
    // It should not be used for application-layer errors.
    RPCErrorCode[RPCErrorCode["RPC_METHOD_NOT_FOUND"] = -32601] = "RPC_METHOD_NOT_FOUND";
    RPCErrorCode[RPCErrorCode["RPC_INVALID_PARAMS"] = -32602] = "RPC_INVALID_PARAMS";
    // RPC_INTERNAL_ERROR should only be used for genuine errors in bitcoind
    // (for example datadir corruption).
    RPCErrorCode[RPCErrorCode["RPC_INTERNAL_ERROR"] = -32603] = "RPC_INTERNAL_ERROR";
    RPCErrorCode[RPCErrorCode["RPC_PARSE_ERROR"] = -32700] = "RPC_PARSE_ERROR";
    // General application defined errors
    RPCErrorCode[RPCErrorCode["RPC_MISC_ERROR"] = -1] = "RPC_MISC_ERROR";
    RPCErrorCode[RPCErrorCode["RPC_TYPE_ERROR"] = -3] = "RPC_TYPE_ERROR";
    RPCErrorCode[RPCErrorCode["RPC_INVALID_ADDRESS_OR_KEY"] = -5] = "RPC_INVALID_ADDRESS_OR_KEY";
    RPCErrorCode[RPCErrorCode["RPC_INVALID_PARAMETER"] = -8] = "RPC_INVALID_PARAMETER";
    RPCErrorCode[RPCErrorCode["RPC_DATABASE_ERROR"] = -20] = "RPC_DATABASE_ERROR";
    RPCErrorCode[RPCErrorCode["RPC_DESERIALIZATION_ERROR"] = -22] = "RPC_DESERIALIZATION_ERROR";
    RPCErrorCode[RPCErrorCode["RPC_VERIFY_ERROR"] = -25] = "RPC_VERIFY_ERROR";
    RPCErrorCode[RPCErrorCode["RPC_VERIFY_REJECTED"] = -26] = "RPC_VERIFY_REJECTED";
    RPCErrorCode[RPCErrorCode["RPC_IN_WARMUP"] = -28] = "RPC_IN_WARMUP";
    RPCErrorCode[RPCErrorCode["RPC_METHOD_DEPRECATED"] = -32] = "RPC_METHOD_DEPRECATED";
})(RPCErrorCode || (exports.RPCErrorCode = RPCErrorCode = {}));
//# sourceMappingURL=rpc.js.map