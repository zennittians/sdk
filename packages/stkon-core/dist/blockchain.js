"use strict";
/**
 # @stkon-js/core

This package provides a collection of apis to interact with Stkon blockchain.

## Installation

```
npm install @stkon-js/core
```

## Usage

Create a Stkon instance connecting to testnet

```javascript
* const { Stkon } = require('@stkon-js/core');
* const {
*   ChainID,
*   ChainType,
*   hexToNumber,
*   numberToHex,
*   fromWei,
*   Units,
*   Unit,
* } = require('@stkon-js/utils');

* const stk = new Stkon(
*     'https://api.s0.b.stkon.xyz/',
*     {
*         chainType: ChainType.Stkon,
*         chainId: ChainID.StkTestnet,
*     },
* );
```

Getting balance of account `one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7`
```javascript
* stk.blockchain
*   .getBalance({ address: 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7' })
*   .then((response) => {
*     console.log('balance in ONEs: ' + fromWei(hexToNumber(response.result), Units.one));
*   });
```

Getting the latest block number
```javascript
* stk.blockchain.getBlockNumber().then((response) => {
*   console.log('current block number: ' + hexToNumber(response.result));
* });
```

Getting the block using block hash
```javascript
* stk.blockchain
*   .getBlockByHash({
*     blockHash: '0x08c46ae7249362a7d1f602d44c5a81f33ebdab6a7dcb6068f99610b57911aafd',
*   })
*   .then((response) => {
*     console.log(response.result);
*   });
```

Getting the block using block number
```javascript
* stk.blockchain
*   .getBlockByNumber({
*     blockNumber: numberToHex(422635),
*   })
*   .then((response) => {
*     console.log(response.result);
*   });
```

Getting the transaction using hash
```javascript
* stk.blockchain
*   .getTransactionByHash({
*     txnHash: '0x56c73eb993b18dc04baacec5c2e9d1292a090f6a978a4a1c461db5255fcbc831',
*   })
*   .then((response) => {
*     console.log(response.result);
*   });
```

Getting the transaction receipt
```javascript
* stk.blockchain
*   .getTransactionReceipt({
*     txnHash: '0x56c73eb993b18dc04baacec5c2e9d1292a090f6a978a4a1c461db5255fcbc831',
*   })
*   .then((response) => {
*     console.log(response.result);
*   });
```

Getting the cross-shard transaction receipt
```javascript
* stk.blockchain
*   .getCxReceiptByHash({
*     txnHash: '0xcd36a90ff5d5373285c2896ba7bbcd3f5324263c0cb8ecfb7cad2f5fc2fbdbda',
*     shardID: 1,
*   })
*   .then((value) => {
*     console.log(value.result);
*   });
```

Getting the deployed smart contract code
```javascript
* stk.blockchain
*   .getCode({
*     address: '0x08AE1abFE01aEA60a47663bCe0794eCCD5763c19',
*     blockNumber: 'latest',
*   })
*   .then((response) => {
*     console.log(response.result);
*   });
```

Getting the transaction count of an account
```javascript
* stk.blockchain
*   .getTransactionCount({
*     address: 'one1pdv9lrdwl0rg5vglh4xtyrv3wjk3wsqket7zxy',
*   })
*   .then((response) => {
*     console.log(hexToNumber(response.result));
*   });
```

Getting the shard structure and details
```javascript
* stk.blockchain.getShardingStructure().then((response) => {
*   console.log(response.result);
* });
```

Transferring funds using `sendTransaction`
```javascript
// key corresponds to one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7, only has testnet balance
* stk.wallet.addByPrivateKey('45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e');

* async function transfer() {
*   const txn = stk.transactions.newTx({
*     to: 'one166axnkjmghkf3df7xfvd0hn4dft8kemrza4cd2',
*     value: new Unit(1).asOne().toWei(),
*     // gas limit, you can use string
*     gasLimit: '21000',
*     // send token from shardID
*     shardID: 0,
*     // send token to toShardID
*     toShardID: 0,
*     // gas Price, you can use Unit class, and use Gwei, then remember to use toWei(), which will be transformed to BN
*     gasPrice: new stk.utils.Unit('1').asGwei().toWei(),
*   });

*   // sign the transaction use wallet;
*   const signedTxn = await stk.wallet.signTransaction(txn);
*   const txnHash = await stk.blockchain.sendTransaction(signedTxn);
*   console.log(txnHash.result);
* }

* transfer();
```
 *
 * @packageDocumentation
 * @module stkon-core
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
var tslib_1 = require("tslib");
var network_1 = require("@stkon-js/network");
var utils_1 = require("@stkon-js/utils");
var crypto_1 = require("@stkon-js/crypto");
var Blockchain = /** @class */ (function () {
    /**
     * @hidden
     */
    function Blockchain(messenger) {
        this.messenger = messenger;
    }
    /**
     * @hidden
     */
    Blockchain.prototype.setMessenger = function (messenger) {
        this.messenger = messenger;
    };
    /**
     *
     * @hidden
     */
    Blockchain.prototype.getRpcResult = function (result) {
        if (result instanceof network_1.ResponseMiddleware) {
            return result.getRaw;
        }
        else {
            return result;
        }
    };
    /**
     * Get the balance of an address at a given block.
     *
     * @param address the address to get the balance of.
     * @param blockNumber (option) If you pass this parameter it will not use the default block set with `DefaultBlockParams.latest`
     * @param shardID (option) If you pass this parameter it will not use the default block set with `this.messenger.currentShard`
     *
     * @returns The current balance for the given address in wei.
     *
     * @hint
     * ```
     * the third param `shardID` is binding with the endpoint
     * shard 0: localhost:9500
     * shard 1: localhost:9501
     * ```
     *
     * @example
     * ```javascript
     * stk.blockchain.getBalance({
     *   address: 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7',
     *   blockNumber: 'latest'
     * }).then(value => {
     *   console.log(value.result);
     * });
     * ```
     */
    Blockchain.prototype.getBalance = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var address = _b.address, _c = _b.blockNumber, blockNumber = _c === void 0 ? utils_1.DefaultBlockParams.latest : _c, _d = _b.shardID, shardID = _d === void 0 ? this.messenger.currentShard : _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetBalance, [(0, crypto_1.getAddress)(address).checksum, blockNumber], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _e.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Returns the current block number.
     *
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @return `Promise` - The number of the most recent block.
     *
     * @hint
     * ```
     * the third param `shardID` is binding with the endpoint
     * shard 0: localhost:9500
     * shard 1: localhost:9501
     * ```
     *
     * @example
     * ```javascript
     * stk.blockchain.getBlockNumber().then((value) => {
     *   console.log(value.result);
     * });
     * ```
     */
    Blockchain.prototype.getBlockNumber = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (shardID) {
            var result;
            if (shardID === void 0) { shardID = this.messenger.currentShard; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.BlockNumber, [], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Returns a block matching the block Hash.
     *
     * @param blockHash the block hash
     * @param returnObject By default it is `true`, Features in development, IGNORE it!
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @returns `Promise` - The block object
     *
     * @example
     * ```javascript
     * stk.blockchain.getBlockByHash({
     *   blockHash: '0x9cd821b576efdff61280e8857ef218fb2cff8db0cf0fb27dfceef7237042b79e',
     * }).then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.getBlockByHash = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var blockHash = _b.blockHash, _c = _b.returnObject, returnObject = _c === void 0 ? true : _c, _d = _b.shardID, shardID = _d === void 0 ? this.messenger.currentShard : _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetBlockByHash, [blockHash, returnObject], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _e.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Returns a block matching the block Number.
     *
     * @param blockNumber the block number
     * @param returnObject By default it is `true`, Features in development, IGNORE it!
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @returns `Promise` - The block object
     *
     * @example
     * ```javascript
     * stk.blockchain.getBlockByNumber({
     *   blockNumber: '0x89',
     * }).then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.getBlockByNumber = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var _c = _b.blockNumber, blockNumber = _c === void 0 ? utils_1.DefaultBlockParams.latest : _c, _d = _b.returnObject, returnObject = _d === void 0 ? true : _d, _e = _b.shardID, shardID = _e === void 0 ? this.messenger.currentShard : _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetBlockByNumber, [blockNumber, returnObject], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _f.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Returns blocks in range [from; to]
     *
     * @param from starting block number in 0x format
     * @param to ending block number in 0x format
     * @param blockArgs optional args struct in json format (should be used just with { })
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @returns `Promise` - An array of block objects
     *
     * @example
     * ```javascript
     * stk.blockchain.getBlocks({
     *   from: '0x89',
     *   to: '0x89',
     * }).then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.getBlocks = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var from = _b.from, to = _b.to, _c = _b.blockArgs, blockArgs = _c === void 0 ? {
                fullTx: false,
                withSigners: false,
            } : _c, _d = _b.shardID, shardID = _d === void 0 ? this.messenger.currentShard : _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetBlocks, [from, to, blockArgs], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _e.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Returns the number of transaction in a given block.
     *
     * @param blockHash the block number Hash
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @returns `Promise` -  The number of transactions in the given block.
     *
     * @example
     * ```javascript
     * stk.blockchain.getBlockTransactionCountByHash({
     *   blockHash: '0x4142514a238157e7fe57b9d54abedb33943507fa15b3799954c273a12705ced1'
     * }).then((value) => {
     *   console.log(value):
     * });
     * ```
     */
    Blockchain.prototype.getBlockTransactionCountByHash = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var blockHash = _b.blockHash, _c = _b.shardID, shardID = _c === void 0 ? this.messenger.currentShard : _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetBlockTransactionCountByHash, [blockHash], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Returns the number of transaction in a given block.
     *
     * @param blockNumber the block number Hash
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @returns `Promise` -  The number of transactions in the given block.
     *
     * @example
     * ```javascript
     * stk.blockchain.getBlockTransactionCountByNumber({
     *   blockNumber: '0x2403C'
     * }).then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.getBlockTransactionCountByNumber = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var blockNumber = _b.blockNumber, _c = _b.shardID, shardID = _c === void 0 ? this.messenger.currentShard : _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetBlockTransactionCountByNumber, [blockNumber], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Returns a transaction based on a block hash and the transactions index position.
     *
     * @param blockHash the block number Hash
     * @param index The transactions index position. **Hex Number**
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @returns `Promise` -  A transaction object
     *
     * @example
     * ```javascript
     * stk.blockchain.getTransactionByBlockHashAndIndex({
     *   blockHash: '0x4142514a238157e7fe57b9d54abedb33943507fa15b3799954c273a12705ced1',
     *   index: '0x0'
     * }).then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.getTransactionByBlockHashAndIndex = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var blockHash = _b.blockHash, index = _b.index, _c = _b.shardID, shardID = _c === void 0 ? this.messenger.currentShard : _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetTransactionByBlockHashAndIndex, [blockHash, index], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Returns a transaction based on a block number and the transactions index position.
     *
     * @param blockNumber the block number
     * @param index The transactions index position. **Hex Number**
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @returns `Promise` -  A transaction object
     *
     * @example
     * ```javascript
     * stk.blockchain.getTransactionByBlockNumberAndIndex({
     *   blockNumber: '0x2403C',
     *   index: '0x0'
     * }).then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.getTransactionByBlockNumberAndIndex = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var _c = _b.blockNumber, blockNumber = _c === void 0 ? utils_1.DefaultBlockParams.latest : _c, index = _b.index, _d = _b.shardID, shardID = _d === void 0 ? this.messenger.currentShard : _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetTransactionByBlockNumberAndIndex, [blockNumber, index], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _e.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Returns a transaction matching the given transaction hash.
     *
     * @param txnHash The transaction hash
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @returns `Promise` -  A transaction object
     *
     * @example
     * ```javascript
     * stk.blockchain.getTransactionByHash({
     *   txnHash: '0x146a0cf7e8da45b44194207c4e7785564527059483b765f9a04424554443b224'
     * }).then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.getTransactionByHash = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var txnHash = _b.txnHash, _c = _b.shardID, shardID = _c === void 0 ? this.messenger.currentShard : _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetTransactionByHash, [txnHash], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Returns the receipt of a transaction by transaction hash.
     *
     * @param txnHash The transaction hash
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @returns `Promise` -  A transaction receipt object, or `null` when no receipt was found
     *
     * @example
     * ```javascript
     * stk.blockchain.getTransactionReceipt({
     *   txnHash: '0x146a0cf7e8da45b44194207c4e7785564527059483b765f9a04424554443b224'
     * }).then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.getTransactionReceipt = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var txnHash = _b.txnHash, _c = _b.shardID, shardID = _c === void 0 ? this.messenger.currentShard : _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetTransactionReceipt, [txnHash], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Get transaction recepit from cross shard transaction
     *
     * @param txnHash The transaction hash
     * @param shardID the shard id of receiver's address
     * @returns `Promise` -  A transaction receipt object, or `null` when no receipt was found
     *
     * @example
     * ```javascript
     * // This transaction sends from shard 0 to shard 1
     * stk.blockchain.getCxReceiptByHash({
     *   txnHash: '0x7fae9252fbda68d718e610bc10cf2b5c6a9cafb42d4a6b9d6e392c77d587b9ea',
     *   shardID: 1,
     * }).then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.getCxReceiptByHash = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var txnHash = _b.txnHash, shardID = _b.shardID;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetCXReceiptByHash, [txnHash], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Get the code at a specific address.
     *
     * @param address The address to get the code from (eg:smart contract)
     * @param blockNumber (OPTIONAL) If you pass this parameter it will not use the default block
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @return `Promise` - The data at given `address`
     *
     * @example
     * ```javascript
     * stk.blockchain.getCode({
     *   address: '0x08AE1abFE01aEA60a47663bCe0794eCCD5763c19',
     *   blockNumber: 'latest'
     * }).then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.getCode = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var address = _b.address, _c = _b.blockNumber, blockNumber = _c === void 0 ? utils_1.DefaultBlockParams.latest : _c, _d = _b.shardID, shardID = _d === void 0 ? this.messenger.currentShard : _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetCode, [(0, crypto_1.getAddress)(address).checksum, blockNumber], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _e.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Get the number of peers connected to.
     *
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @returns `Promise` - number of peer count
     *
     * @example
     * ```javascript
     * stk.blockchain.net_peerCount().then((value) => {
     *   console.log(value.result);
     * });
     * ```
     */
    Blockchain.prototype.net_peerCount = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (shardID) {
            var result;
            if (shardID === void 0) { shardID = this.messenger.currentShard; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.PeerCount, [], 'net', shardID)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Get the version of net.
     *
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @returns `Promise` - the current version.
     *
     * @example
     * ```javascript
     * stk.blockchain.net_version().then((value) => {
     *   console.log(value.result);
     * });
     * ```
     */
    Blockchain.prototype.net_version = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (shardID) {
            var result;
            if (shardID === void 0) { shardID = this.messenger.currentShard; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.NetVersion, [], 'net', shardID)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Get the protocal version.
     *
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @returns `Promise` - the current protocol version.
     *
     * @example
     * ```javascript
     * stk.blockchain.getProtocolVersion().then((value) => {
     *   console.log(value.result);
     * });
     * ```
     */
    Blockchain.prototype.getProtocolVersion = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (shardID) {
            var result;
            if (shardID === void 0) { shardID = this.messenger.currentShard; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.ProtocolVersion, [], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Get the storage at a specific position of an address
     *
     * @param address The address to get the storage from
     * @param position The index position of the storage
     * @param blockNumber by default it's `latest`.
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     *
     * @example
     * ```javascript
     * stk.blockchain.getStorageAt({
     *   address: 'one1d0kw95t6kkljmkk9vu0zv25jraut8ngv5vrs5g',
     *   position: '0x0'
     * }).then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.getStorageAt = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var address = _b.address, position = _b.position, _c = _b.blockNumber, blockNumber = _c === void 0 ? utils_1.DefaultBlockParams.latest : _c, _d = _b.shardID, shardID = _d === void 0 ? this.messenger.currentShard : _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetStorageAt, [(0, crypto_1.getAddress)(address).checksum, position, blockNumber], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _e.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Get the numbers of transactions sent from this address.
     *
     * @param address The address to get the numbers of transactions from
     * @param blockNumber by default it's `latest`
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @return `Promise` - The number of transactions sent from the given address.
     *
     * @example
     * ```javascript
     * stk.blockchain.getTransactionCount({
     *   address: "one1d0kw95t6kkljmkk9vu0zv25jraut8ngv5vrs5g"
     * }).then((value) => {
     *   console.log(value.result);
     * });
     * ```
     */
    Blockchain.prototype.getTransactionCount = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var address = _b.address, _c = _b.blockNumber, blockNumber = _c === void 0 ? utils_1.DefaultBlockParams.latest : _c, _d = _b.shardID, shardID = _d === void 0 ? this.messenger.currentShard : _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetTransactionCount, [(0, crypto_1.getAddress)(address).checksum, blockNumber], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _e.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Get the sharding structure of current network
     *
     * @return `Promise` - The sharding structure of current network.
     *
     * @example
     * ```javascript
     * stk.blockchain.getShardingStructure().then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.getShardingStructure = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GetShardingStructure, [], this.messenger.chainPrefix)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Sends a signed transaction to the network.
     *
     * @param transaction `Object` - The transaction object to send:
     * @return The **callbalck** will return the 32 bytes transaction hash
     *
     * @example
     * ```javascript
     * // add privateKey to wallet
     * const privateKey = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
     * stk.wallet.addByPrivateKey(privateKey);
     *
     * async function transfer() {
     *   const txn = stk.transactions.newTx({
     *     //  token send to
     *     to: 'one166axnkjmghkf3df7xfvd0hn4dft8kemrza4cd2',
     *     // amount to send
     *     value: '10000',
     *     // gas limit, you can use string
     *     gasLimit: '210000',
     *     // send token from shardID
     *     shardID: 0,
     *     // send token to toShardID
     *     toShardID: 0,
     *     // gas Price, you can use Unit class, and use Gwei, then remember to use toWei(), which will be transformed to BN
     *     gasPrice: new stk.utils.Unit('100').asGwei().toWei(),
     *   });
     *
     *   // sign the transaction use wallet;
     *   const signedTxn = await stk.wallet.signTransaction(txn);
     *   const txnHash = await stk.blockchain.sendTransaction(signedTxn);
     *   console.log(txnHash.result);
     * }
     *
     * transfer();
     * ```
     */
    Blockchain.prototype.sendTransaction = function (transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!transaction.isSigned() || !transaction) {
                            throw new Error('transaction is not signed or not exist');
                        }
                        return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.SendRawTransaction, [transaction.getRawTransaction()], this.messenger.chainPrefix, typeof transaction.txParams.shardID === 'string'
                                ? Number.parseInt(transaction.txParams.shardID, 10)
                                : transaction.txParams.shardID)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Sends a raw transaction to the network.
     *
     * @param transaction `Object` - The transaction object to send:
     * @return The **callbalck** will return the 32 bytes transaction hash
     *
     * @example
     * ```javascript
     * // add privateKey to wallet
     * const privateKey = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
     * stk.wallet.addByPrivateKey(privateKey);
     *
     * async function transfer() {
     *   const txn = stk.transactions.newTx({
     *     //  token send to
     *     to: 'one166axnkjmghkf3df7xfvd0hn4dft8kemrza4cd2',
     *     // amount to send
     *     value: '10000',
     *     // gas limit, you can use string
     *     gasLimit: '210000',
     *     // send token from shardID
     *     shardID: 0,
     *     // send token to toShardID
     *     toShardID: 0,
     *     // gas Price, you can use Unit class, and use Gwei, then remember to use toWei(), which will be transformed to BN
     *     gasPrice: new stk.utils.Unit('100').asGwei().toWei(),
     *   });
     *
     *   // sign the transaction use wallet;
     *   const signedTxn = await stk.wallet.signTransaction(txn);
     *   recovered = signedTxn.recover(signedTxn.rawTransaction);
     *
     *   const txnHash = await stk.blockchain.sendRawTransaction(recovered);
     *   console.log(txnHash);
     * }
     *
     * transfer();
     * ```
     */
    Blockchain.prototype.sendRawTransaction = function (transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, txn, result;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!transaction.isSigned() || !transaction) {
                            throw new Error('transaction is not signed or not exist');
                        }
                        return [4 /*yield*/, transaction.sendTransaction()];
                    case 1:
                        _a = tslib_1.__read.apply(void 0, [_b.sent(), 2]), txn = _a[0], result = _a[1];
                        if (txn.isPending()) {
                            return [2 /*return*/, result];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * send a transaction and check whether it exists
     *
     * @param transaction `Object` - The transaction object to send:
     * @return The **callbalck** will return the 32 bytes transaction hash
     *
     * @example
     * ```javascript
     * // add privateKey to wallet
     * const privateKey = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
     * stk.wallet.addByPrivateKey(privateKey);
     *
     * async function transfer() {
     *   const txn = stk.transactions.newTx({
     *     //  token send to
     *     to: 'one166axnkjmghkf3df7xfvd0hn4dft8kemrza4cd2',
     *     // amount to send
     *     value: '10000',
     *     // gas limit, you can use string
     *     gasLimit: '210000',
     *     // send token from shardID
     *     shardID: 0,
     *     // send token to toShardID
     *     toShardID: 0,
     *     // gas Price, you can use Unit class, and use Gwei, then remember to use toWei(), which will be transformed to BN
     *     gasPrice: new stk.utils.Unit('100').asGwei().toWei(),
     *   });
     *
     *   // sign the transaction use wallet;
     *   const signedTxn = await stk.wallet.signTransaction(txn);
     *   const txnHash = await stk.blockchain.createObservedTransaction(signedTxn);
     *   console.log(txnHash);
     * }
     *
     * transfer();
     * ```
     */
    Blockchain.prototype.createObservedTransaction = function (transaction) {
        try {
            transaction.sendTransaction().then(function (response) {
                var _a = tslib_1.__read(response, 2), txReturned = _a[0], TranID = _a[1];
                txReturned.confirm(TranID).then(function (txConfirmed) {
                    transaction.emitter.resolve(txConfirmed);
                });
            });
            return transaction.emitter;
        }
        catch (err) {
            throw err;
        }
    };
    /**
     * send raw staking transaction
     *
     * @param staking
     * @ignore
     *
     * @warning
     * ```
     * At present, this function is not implement yet, will Coming soon!!!
     * ```
     */
    Blockchain.prototype.sendRawStakingTransaction = function (staking) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, txn, result;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!staking.isSigned() || !staking) {
                            throw new Error('staking transaction is not signed or not exist');
                        }
                        return [4 /*yield*/, staking.sendTransaction()];
                    case 1:
                        _a = tslib_1.__read.apply(void 0, [_b.sent(), 2]), txn = _a[0], result = _a[1];
                        if (txn.isPending()) {
                            return [2 /*return*/, result];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * send raw staking transaction and check whether it exists
     *
     * @param staking
     * @ignore
     *
     * @warning
     * ```
     * At present, this function is not implement yet, will Coming soon!!!
     * ```
     */
    Blockchain.prototype.createObservedStakingTransaction = function (staking) {
        try {
            staking.sendTransaction().then(function (response) {
                var _a = tslib_1.__read(response, 2), txReturned = _a[0], TranID = _a[1];
                txReturned.confirm(TranID).then(function (txConfirmed) {
                    staking.emitter.resolve(txConfirmed);
                });
            });
            return staking.emitter;
        }
        catch (err) {
            throw err;
        }
    };
    /**
     * Executes a message call or transaction and returns the amount of the gas used.
     *
     * @param to the address will send to
     * @param data the data will send to that address
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @return `promise` -  the used gas for the simulated call/transaction.
     *
     * @warning
     * ```
     * At present, this function stk_estimateGas is not implement yet, will Coming soon!!!
     * ```
     *
     * @example
     * ```javascript
     * stk.blockchain.estimateGas({
     *   to: 'one1d0kw95t6kkljmkk9vu0zv25jraut8ngv5vrs5g',
     *   data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
     * }).then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.estimateGas = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var to = _b.to, data = _b.data, _c = _b.shardID, shardID = _c === void 0 ? this.messenger.currentShard : _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.EstimateGas, [{ to: (0, crypto_1.getAddress)(to).checksum, data: data }], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Returns the current gas price oracle. The gas price is determined by the last few blocks median gas price.
     *
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @return `promise` - Number string of the current gas price in wei.
     *
     * @example
     * ```javascript
     * stk.blockchain.gasPrice().then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.gasPrice = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (shardID) {
            var result;
            if (shardID === void 0) { shardID = this.messenger.currentShard; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.GasPrice, [], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Executes a message call transaction,
     * which is directly executed in the VM of the node, but never mined into the blockchain.
     *
     * @param payload some data you want put into these fucntions
     * @param blockNumber by default it's `latest`
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     *
     * @example
     * ```javascript
     * stk.blockchain.call({
     *   to: "0x08AE1abFE01aEA60a47663bCe0794eCCD5763c19",
     * }).then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    Blockchain.prototype.call = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var result;
            var payload = _b.payload, _c = _b.blockNumber, blockNumber = _c === void 0 ? utils_1.DefaultBlockParams.latest : _c, _d = _b.shardID, shardID = _d === void 0 ? this.messenger.currentShard : _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.messenger.send(network_1.RPCMethod.Call, [payload, blockNumber], this.messenger.chainPrefix, shardID)];
                    case 1:
                        result = _e.sent();
                        return [2 /*return*/, this.getRpcResult(result)];
                }
            });
        });
    };
    /**
     * Return new pending Transactions
     *
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     *
     * @example
     * ```javascript
     * const stk = new Stkon(
     *   // rpc url
     *   'ws://api.s0.b.stkon.xyz/',
     *   {
     *     // chainType set to Stkon
     *     chainType: ChainType.Stkon,
     *     // chainType set to StkLocal
     *     chainId: ChainID.StkLocal,
     *   },
     * );
     *
     * const tmp = stk.blockchain.newPendingTransactions();
     * console.log(tmp)
     * ```
     */
    Blockchain.prototype.newPendingTransactions = function (shardID) {
        if (shardID === void 0) { shardID = this.messenger.currentShard; }
        if (this.messenger.provider instanceof network_1.WSProvider) {
            return new network_1.NewPendingTransactions(this.messenger, shardID);
        }
        else {
            throw new Error('HttpProvider does not support this feature');
        }
    };
    /**
     *
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     *
     * @example
     * ```javascript
     * const stk = new Stkon(
     *   // rpc url
     *   'ws://api.s0.b.stkon.xyz/',
     *   {
     *     // chainType set to Stkon
     *     chainType: ChainType.Stkon,
     *     // chainType set to StkLocal
     *     chainId: ChainID.StkLocal,
     *   },
     * );
     *
     * const tmp = stk.blockchain.newBlockHeaders();
     * console.log(tmp)
     * ```
     */
    Blockchain.prototype.newBlockHeaders = function (shardID) {
        if (shardID === void 0) { shardID = this.messenger.currentShard; }
        if (this.messenger.provider instanceof network_1.WSProvider) {
            return new network_1.NewHeaders(this.messenger, shardID);
        }
        else {
            throw new Error('HttpProvider does not support this feature');
        }
    };
    /**
     *
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     *
     * @example
     * ```javascript
     * const stk = new Stkon(
     *   // rpc url
     *   'ws://api.s0.b.stkon.xyz/',
     *   {
     *     // chainType set to Stkon
     *     chainType: ChainType.Stkon,
     *     // chainType set to StkLocal
     *     chainId: ChainID.StkLocal,
     *   },
     * );
     *
     * const tmp = stk.blockchain.syncing();
     * console.log(tmp)
     * ```
     */
    Blockchain.prototype.syncing = function (shardID) {
        if (shardID === void 0) { shardID = this.messenger.currentShard; }
        if (this.messenger.provider instanceof network_1.WSProvider) {
            return new network_1.Syncing(this.messenger, shardID);
        }
        else {
            throw new Error('HttpProvider does not support this feature');
        }
    };
    /**
     *
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     *
     * @example
     * ```javascript
     * const stk = new Stkon(
     *   // rpc url
     *   'ws://api.s0.b.stkon.xyz/',
     *   {
     *     // chainType set to Stkon
     *     chainType: ChainType.Stkon,
     *     // chainType set to StkLocal
     *     chainId: ChainID.StkLocal,
     *   },
     * );
     *
     * const tmp = stk.blockchain.logs({
     *   from: '0x12'
     * });
     * console.log(tmp)
     * ```
     */
    Blockchain.prototype.logs = function (options, shardID) {
        if (shardID === void 0) { shardID = this.messenger.currentShard; }
        if (this.messenger.provider instanceof network_1.WSProvider) {
            return new network_1.LogSub(options, this.messenger, shardID);
        }
        else {
            throw new Error('HttpProvider does not support this feature');
        }
    };
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            address: ['isValidAddress', utils_1.AssertType.required],
            blockNumber: ['isBlockNumber', utils_1.AssertType.optional],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getBalance", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            blockHash: ['isHash', utils_1.AssertType.required],
            returnObject: ['isBoolean', utils_1.AssertType.optional],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getBlockByHash", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            blockNumber: ['isBlockNumber', utils_1.AssertType.optional],
            returnObject: ['isBoolean', utils_1.AssertType.optional],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getBlockByNumber", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            from: ['isBlockNumber', utils_1.AssertType.required],
            to: ['isBlockNumber', utils_1.AssertType.required],
            blockArgs: ['isObject', utils_1.AssertType.optional],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getBlocks", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            blockHash: ['isHash', utils_1.AssertType.required],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getBlockTransactionCountByHash", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            blockNumber: ['isBlockNumber', utils_1.AssertType.required],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getBlockTransactionCountByNumber", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            blockHash: ['isHash', utils_1.AssertType.required],
            index: ['isHex', utils_1.AssertType.required],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getTransactionByBlockHashAndIndex", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            blockNumber: ['isBlockNumber', utils_1.AssertType.optional],
            index: ['isHex', utils_1.AssertType.required],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getTransactionByBlockNumberAndIndex", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            txnHash: ['isHash', utils_1.AssertType.required],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getTransactionByHash", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            txnHash: ['isString', utils_1.AssertType.required],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getTransactionReceipt", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            txnHash: ['isString', utils_1.AssertType.required],
            shardID: ['isNumber', utils_1.AssertType.required],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getCxReceiptByHash", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            address: ['isValidAddress', utils_1.AssertType.required],
            blockNumber: ['isBlockNumber', utils_1.AssertType.optional],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getCode", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            address: ['isValidAddress', utils_1.AssertType.required],
            position: ['isHex', utils_1.AssertType.required],
            blockNumber: ['isBlockNumber', utils_1.AssertType.optional],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getStorageAt", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            address: ['isValidAddress', utils_1.AssertType.required],
            blockNumber: ['isBlockNumber', utils_1.AssertType.optional],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "getTransactionCount", null);
    tslib_1.__decorate([
        (0, utils_1.assertObject)({
            to: ['isValidAddress', utils_1.AssertType.optional],
            data: ['isHex', utils_1.AssertType.optional],
            shardID: ['isNumber', utils_1.AssertType.optional],
        }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], Blockchain.prototype, "estimateGas", null);
    return Blockchain;
}());
exports.Blockchain = Blockchain;
//# sourceMappingURL=blockchain.js.map