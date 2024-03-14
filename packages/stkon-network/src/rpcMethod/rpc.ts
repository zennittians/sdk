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

/**@ignore */
export enum RPCMethod {
  // 1. stk_getBlockByHash
  GetBlockByHash = 'stk_getBlockByHash',
  // 2. stk_getBlockByNumber
  GetBlockByNumber = 'stk_getBlockByNumber',
  // 3. stk_getBlockTransactionCountByHash
  GetBlockTransactionCountByHash = 'stk_getBlockTransactionCountByHash',
  // 4. stk_getBlockTransactionCountByNumber
  GetBlockTransactionCountByNumber = 'stk_getBlockTransactionCountByNumber',
  // 5. stk_getCode
  GetCode = 'stk_getCode',
  // 6. stk_getTransactionByBlockHashAndIndex
  GetTransactionByBlockHashAndIndex = 'stk_getTransactionByBlockHashAndIndex',
  // 7. stk_getTransactionByBlockNumberAndIndex
  GetTransactionByBlockNumberAndIndex = 'stk_getTransactionByBlockNumberAndIndex',
  // 8. stk_getTransactionByHash
  GetTransactionByHash = 'stk_getTransactionByHash',

  GetTransactionReceipt = 'stk_getTransactionReceipt',

  GetCXReceiptByHash = 'stk_getCXReceiptByHash',
  // 9. stk_syncing
  Syncing = 'stk_syncing',
  // 10. net_peerCount
  PeerCount = 'net_peerCount',

  // 11. stk_getBalance
  GetBalance = 'stk_getBalance',
  // 12. stk_getStorageAt
  GetStorageAt = 'stk_getStorageAt',
  // 13. stk_getTransactionCount
  GetTransactionCount = 'stk_getTransactionCount',
  // 14. stk_sendTransaction
  SendTransaction = 'stk_sendTransaction',
  // 15. stk_sendRawTransaction
  SendRawTransaction = 'stk_sendRawTransaction',
  // 16. stk_subscribe
  Subscribe = 'stk_subscribe',
  // 17. stk_getlogs
  GetPastLogs = 'stk_getLogs',
  // 18. stk_getWork
  GetWork = 'stk_getWork',
  // 19. stk_submitWork
  // SubmitWork = 'stk_submitWork',
  // 20. stk_getProof
  GetProof = 'stk_getProof',
  // 21, stk_getFilterChanges
  GetFilterChanges = 'stk_getFilterChanges',
  // 22. stk_newPendingTransactionFilter
  NewPendingTransactionFilter = 'stk_newPendingTransactionFilter',
  // 23. stk_newBlockFilter
  NewBlockFilter = 'stk_newBlockFilter',
  // 24. stk_newFilter
  NewFilter = 'stk_newFilter',
  // 25. stk_call
  Call = 'stk_call',
  // 26. stk_estimateGas
  EstimateGas = 'stk_estimateGas',
  // 27. stk_gasPrice
  GasPrice = 'stk_gasPrice',
  // 28. stk_blockNumber
  BlockNumber = 'stk_blockNumber',
  // 29. stk_unsubscribe
  UnSubscribe = 'stk_unsubscribe',
  // 30. net_version
  NetVersion = 'net_version',
  // 31. stk_protocolVersion
  ProtocolVersion = 'stk_protocolVersion',
  // 32. stk_getShardingStructure
  GetShardingStructure = 'stk_getShardingStructure',
  // 33. stk_sendRawStakingTransaction
  SendRawStakingTransaction = 'stk_sendRawStakingTransaction',
  // 34. stk_getAccountNonce
  GetAccountNonce = 'stk_getAccountNonce',
  // 35. stk_getBlocks
  GetBlocks = 'stk_getBlocks',
}

/**@ignore */
export enum RPCErrorCode {
  // Standard JSON-RPC 2.0 errors
  // RPC_INVALID_REQUEST is internally mapped to HTTP_BAD_REQUEST (400).
  // It should not be used for application-layer errors.
  RPC_INVALID_REQUEST = -32600,
  // RPC_METHOD_NOT_FOUND is internally mapped to HTTP_NOT_FOUND (404).
  // It should not be used for application-layer errors.
  RPC_METHOD_NOT_FOUND = -32601,
  RPC_INVALID_PARAMS = -32602,
  // RPC_INTERNAL_ERROR should only be used for genuine errors in bitcoind
  // (for example datadir corruption).
  RPC_INTERNAL_ERROR = -32603,
  RPC_PARSE_ERROR = -32700,

  // General application defined errors
  RPC_MISC_ERROR = -1, // std::exception thrown in command handling
  RPC_TYPE_ERROR = -3, // Unexpected type was passed as parameter
  RPC_INVALID_ADDRESS_OR_KEY = -5, // Invalid address or key
  RPC_INVALID_PARAMETER = -8, // Invalid, missing or duplicate parameter
  RPC_DATABASE_ERROR = -20, // Database error
  RPC_DESERIALIZATION_ERROR = -22, // Error parsing or validating structure in raw format
  RPC_VERIFY_ERROR = -25, // General error during transaction or block submission
  RPC_VERIFY_REJECTED = -26, // Transaction or block was rejected by network rules
  RPC_IN_WARMUP = -28, // Client still warming up
  RPC_METHOD_DEPRECATED = -32, // RPC method is deprecated
}
