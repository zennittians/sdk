/**
 * @packageDocumentation
 * @module stkon-core
 */
import { HttpProvider, WSProvider, Messenger, ShardingItem } from '@stkon-js/network';
import { Transaction, TransactionFactory } from '@stkon-js/transaction';
import { Blockchain } from './blockchain';
import { ContractFactory } from '@stkon-js/contract';
import { StkonConfig } from './util';
/** @hidden */
export declare enum ExtensionType {
    MathWallet = "MathWallet",
    StkWallet = "StkWallet"
}
/** @hidden */
export interface ExtensionAccount {
    address: 'string';
    name: 'string';
}
/** @hidden */
export interface ExtensionNetwork {
    chain_url: string;
    net_version: number;
}
/** @hidden */
export interface ExtensionInterface {
    signTransaction: (transaction: Transaction, updateNonce: boolean, encodeMode: string, blockNumber: string) => Promise<Transaction>;
    getAccount: () => Promise<ExtensionAccount>;
    forgetIdentity: () => Promise<void>;
    messenger?: Messenger;
    version: string;
    isMathWallet?: boolean;
    isStkWallet?: boolean;
    network: ExtensionNetwork;
}
export declare class StkonExtension {
    /**@ignore*/
    extensionType: ExtensionType | null;
    /**@ignore*/
    wallet: ExtensionInterface;
    /**@ignore*/
    provider: HttpProvider | WSProvider;
    /**@ignore*/
    messenger: Messenger;
    /**@ignore*/
    blockchain: Blockchain;
    /**@ignore*/
    transactions: TransactionFactory;
    /**@ignore*/
    contracts: ContractFactory;
    /**@ignore*/
    crypto: any;
    /**@ignore*/
    utils: any;
    /**@ignore*/
    defaultShardID?: number;
    /**
     * Create an blockchain instance support wallet injection
     *
     * @param wallet could be MathWallet or StkWallet instance
     * @param config (optional), using default `Chain_Id` and `Chain_Type`
     *
     * @example
     * ```javascript
     * // Using Mathwallet instance
     * export const initEx = async() => {
     *   stkEx = new StkonExtension(window.stkon);
     * }
     * // Using StkWallet instance
     * export const initEx = async() => {
     *   stkEx = new StkonExtension(window.stkwallet);
     * }
     * ```
     */
    constructor(wallet: ExtensionInterface, config?: StkonConfig);
    /**
     * Will change the provider for its module.
     *
     * @param provider a valid provider, you can replace it with your own working node
     *
     * @example
     * ```javascript
     * const tmp = stkEx.setProvider('http://localhost:9500');
     * ```
     */
    setProvider(provider: string | HttpProvider | WSProvider): void;
    /**
     * Change the Shard ID
     *
     * @example
     * ```
     * stkEx.setShardID(2);
     * ```
     */
    setShardID(shardID: number): void;
    isExtension(wallet: ExtensionInterface): void;
    /**
     * Get the wallet account
     *
     * @example
     * ```javascript
     * const account = stkEx.login();
     * console.log(account);
     * ```
     */
    login(): Promise<ExtensionAccount>;
    /**
     * Log out the wallet account
     *
     * @example
     * ```javascript
     * stkEx.logout();
     * ```
     */
    logout(): Promise<void>;
    /**
     * Set the sharding Structure
     *
     * @param shardingStructures The array of information of sharding structures
     *
     * @example
     * ```javascript
     * stkEx.shardingStructures([
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
//# sourceMappingURL=stkonExtension.d.ts.map