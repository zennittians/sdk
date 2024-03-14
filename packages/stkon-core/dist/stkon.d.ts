/**
 * @packageDocumentation
 * @module stkon-core
 */
import * as utils from '@stkon-js/utils';
import { HttpProvider, Messenger, WSProvider, ShardingItem } from '@stkon-js/network';
import { TransactionFactory, Transaction } from '@stkon-js/transaction';
import { StakingTransaction, StakingFactory } from '@stkon-js/staking';
import { ContractFactory, Contract } from '@stkon-js/contract';
import { Wallet, Account } from '@stkon-js/account';
import { Blockchain } from './blockchain';
import { StkonConfig } from './util';
export declare class Stkon extends utils.StkonCore {
    /**@ignore*/
    Modules: {
        HttpProvider: typeof HttpProvider;
        WSProvider: typeof WSProvider;
        Messenger: typeof Messenger;
        Blockchain: typeof Blockchain;
        TransactionFactory: typeof TransactionFactory;
        StakingFactory: typeof StakingFactory;
        Wallet: typeof Wallet;
        Transaction: typeof Transaction;
        StakingTransaction: typeof StakingTransaction;
        Account: typeof Account;
        Contract: typeof Contract;
    };
    /**@ignore*/
    messenger: Messenger;
    /**@ignore*/
    transactions: TransactionFactory;
    /**@ignore*/
    stakings: StakingFactory;
    /**@ignore*/
    wallet: Wallet;
    /**@ignore*/
    blockchain: Blockchain;
    /**@ignore*/
    contracts: ContractFactory;
    /**@ignore*/
    crypto: any;
    /**@ignore*/
    utils: any;
    /**@ignore*/
    defaultShardID?: number;
    /**@ignore*/
    private provider;
    /**
     * Create a Stkon instance
     *
     * @param url The end-points of the stk blockchain
     * @param config set up `ChainID` and `ChainType`, typically we can use the default values
     *
     * @example
     * ```
     * // import or require Stkon class
     * const { Stkon } = require('@stkon-js/core');
     *
     * // import or require settings
     * const { ChainID, ChainType } = require('@stkon-js/utils');
     *
     * // Initialize the Stkon instance
     * const stk = new Stkon(
     *   // rpc url:
     *   // local: http://localhost:9500
     *   // testnet: https://api.s0.b.stkon.xyz/
     *   // mainnet: https://api.s0.t.stkon.xyz/
     *   'http://localhost:9500',
     *   {
     *     // chainType set to Stkon
     *     chainType: ChainType.Stkon,
     *     // chainType set to stkLocal
     *     chainId: ChainID.StkLocal,
     *   },
     * );
     * ```
     */
    constructor(url: string, config?: StkonConfig);
    /**
     * Will change the provider for its module.
     *
     * @param provider a valid provider, you can replace it with your own working node
     *
     * @example
     * ```javascript
     * const tmp = stk.setProvider('http://localhost:9500');
     * ```
     */
    setProvider(provider: string | HttpProvider | WSProvider): void;
    /**
     * set the chainID
     *
     * @hint
     * ```
     * Default = 0,
     * EthMainnet = 1,
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
     * ```
     * @param chainId
     *
     * @example
     * ```
     * stk.setChainId(2);
     * ```
     */
    setChainId(chainId: utils.ChainID): void;
    /**
     * Change the Shard ID
     *
     * @example
     * ```
     * stk.setShardID(2);
     * ```
     */
    setShardID(shardID: number): void;
    /**
     * set the chainType
     *
     * @param chainType `stk` or `eth`
     *
     * @example
     * ```
     * // set chainType to stk
     * stk.setChainType('stk');
     * // set chainType to eth
     * stk.setChainType('eth');
     * ```
     */
    setChainType(chainType: utils.ChainType): void;
    /**
     * Set the sharding Structure
     *
     * @param shardingStructures The array of information of sharding structures
     *
     * @example
     * ```javascript
     * stk.shardingStructures([
     *   {"current":true,"http":"http://127.0.0.1:9500",
     *    "shardID":0,"ws":"ws://127.0.0.1:9800"},
     *   {"current":false,"http":"http://127.0.0.1:9501",
     *    "shardID":1,"ws":"ws://127.0.0.1:9801"}
     * ]);
     * ```
     */
    shardingStructures(shardingStructures: ShardingItem[]): void;
    /**@ignore*/
    private setMessenger;
}
//# sourceMappingURL=stkon.d.ts.map