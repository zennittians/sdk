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
export declare enum RPCMethod {
    GetBlockByHash = "stk_getBlockByHash",
    GetBlockByNumber = "stk_getBlockByNumber",
    GetBlockTransactionCountByHash = "stk_getBlockTransactionCountByHash",
    GetBlockTransactionCountByNumber = "stk_getBlockTransactionCountByNumber",
    GetCode = "stk_getCode",
    GetTransactionByBlockHashAndIndex = "stk_getTransactionByBlockHashAndIndex",
    GetTransactionByBlockNumberAndIndex = "stk_getTransactionByBlockNumberAndIndex",
    GetTransactionByHash = "stk_getTransactionByHash",
    GetTransactionReceipt = "stk_getTransactionReceipt",
    GetCXReceiptByHash = "stk_getCXReceiptByHash",
    Syncing = "stk_syncing",
    PeerCount = "net_peerCount",
    GetBalance = "stk_getBalance",
    GetStorageAt = "stk_getStorageAt",
    GetTransactionCount = "stk_getTransactionCount",
    SendTransaction = "stk_sendTransaction",
    SendRawTransaction = "stk_sendRawTransaction",
    Subscribe = "stk_subscribe",
    GetPastLogs = "stk_getLogs",
    GetWork = "stk_getWork",
    GetProof = "stk_getProof",
    GetFilterChanges = "stk_getFilterChanges",
    NewPendingTransactionFilter = "stk_newPendingTransactionFilter",
    NewBlockFilter = "stk_newBlockFilter",
    NewFilter = "stk_newFilter",
    Call = "stk_call",
    EstimateGas = "stk_estimateGas",
    GasPrice = "stk_gasPrice",
    BlockNumber = "stk_blockNumber",
    UnSubscribe = "stk_unsubscribe",
    NetVersion = "net_version",
    ProtocolVersion = "stk_protocolVersion",
    GetShardingStructure = "stk_getShardingStructure",
    SendRawStakingTransaction = "stk_sendRawStakingTransaction",
    GetAccountNonce = "stk_getAccountNonce",
    GetBlocks = "stk_getBlocks"
}
/**@ignore */
export declare enum RPCErrorCode {
    RPC_INVALID_REQUEST = -32600,
    RPC_METHOD_NOT_FOUND = -32601,
    RPC_INVALID_PARAMS = -32602,
    RPC_INTERNAL_ERROR = -32603,
    RPC_PARSE_ERROR = -32700,
    RPC_MISC_ERROR = -1,// std::exception thrown in command handling
    RPC_TYPE_ERROR = -3,// Unexpected type was passed as parameter
    RPC_INVALID_ADDRESS_OR_KEY = -5,// Invalid address or key
    RPC_INVALID_PARAMETER = -8,// Invalid, missing or duplicate parameter
    RPC_DATABASE_ERROR = -20,// Database error
    RPC_DESERIALIZATION_ERROR = -22,// Error parsing or validating structure in raw format
    RPC_VERIFY_ERROR = -25,// General error during transaction or block submission
    RPC_VERIFY_REJECTED = -26,// Transaction or block was rejected by network rules
    RPC_IN_WARMUP = -28,// Client still warming up
    RPC_METHOD_DEPRECATED = -32
}
//# sourceMappingURL=rpc.d.ts.map