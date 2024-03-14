/**
 * @packageDocumentation
 * @module stkon-network
 */
import { StkonCore, ChainType, ChainID } from '@stkon-js/utils';
import { JsonRpc } from '../rpcMethod/builder';
import { HttpProvider } from '../providers/http';
import { WSProvider } from '../providers/ws';
import { RPCMethod } from '../rpcMethod/rpc';
import { SubscribeReturns } from '../types';
/** @hidden */
export interface ShardingProvider {
    current: boolean;
    shardID: number;
    http: string;
    ws: string;
}
/**
 * ## How to Create a Massage
 * @example
 * ```
 * const { HttpProvider, Messenger } = require('@stkon-js/network');
 * const { ChainType, ChainID } = require('@stkon-js/utils');
 *
 * // create a custom messenger
 * const customMessenger = new Messenger(
 *   new HttpProvider('http://localhost:9500'),
 *   ChainType.Stkon, // if you are connected to Stkon's blockchain
 *   ChainID.StkLocal, // check if the chainId is correct
 * )
 * ```
 */
declare class Messenger extends StkonCore {
    provider: HttpProvider | WSProvider;
    config?: object;
    Network_ID: string;
    shardProviders: Map<number, ShardingProvider>;
    JsonRpc: JsonRpc;
    defaultShardID?: number;
    constructor(provider: HttpProvider | WSProvider, chainType?: ChainType, chainId?: ChainID, config?: object);
    /**
     * @example
     * ```
     * customMessenger.currentShard
     * ```
     */
    get currentShard(): number;
    /**
     * @example
     * ```
     * customMessenger.shardCount
     * ```
     */
    get shardCount(): number;
    /**
     * @function send
     * @memberof Messenger.prototype
     * @param  {String} method - RPC method
     * @param  {Object} params - RPC method params
     * @return {Object} RPC result
     */
    send: (method: RPCMethod | string, params?: string | any[] | undefined, rpcPrefix?: string, shardID?: number) => Promise<any>;
    /**
     * @function setProvider
     * @memberof Messenger
     * @description provider setter
     * @param  {Provider} provider - provider instance
     */
    setProvider(provider: HttpProvider | WSProvider): void;
    /**
     * @function providerCheck
     * @memberof Messenger
     * @description provider checker
     * @return {Error|null} provider validator
     */
    providerCheck(): void;
    /**
     * @function setReqMiddleware
     * @description set request middleware
     * @memberof Messenger
     * @param  {any} middleware - middle ware for req
     * @param  {String} method  - method name
     * @hidden
     */
    setReqMiddleware(middleware: any, method: string | undefined, provider: HttpProvider | WSProvider): void;
    /**
     * @function setResMiddleware
     * @description set response middleware
     * @memberof Messenger
     * @param  {any} middleware - middle ware for req
     * @param  {String} method  - method name
     * @hidden
     */
    setResMiddleware(middleware: any, method: string | undefined, provider: HttpProvider | WSProvider): void;
    /**
     * @function setNetworkID
     * @description set network id
     * @memberof Messenger
     * @param  {String} id network id string
     */
    setNetworkID(id: string): void;
    setRPCPrefix(method: RPCMethod | string, prefix: string): string;
    subscribe: (method: RPCMethod | string, params?: string | any[] | undefined, returnType?: SubscribeReturns, rpcPrefix?: string, shardID?: number) => Promise<any>;
    unsubscribe: (method: RPCMethod | string, params?: string | any[] | undefined, rpcPrefix?: string, shardID?: number) => Promise<any>;
    setShardingProviders(): Promise<void>;
    /**
     * @example
     * ```
     * stk.messenger.getShardProvider()
     * ```
     */
    getShardProvider(shardID: number): HttpProvider | WSProvider;
    /**
     * @example
     * ```
     * stk.messenger.getCurrentShardID()
     * ```
     */
    getCurrentShardID(): number | undefined;
    setDefaultShardID(shardID: number): void;
}
export { Messenger };
//# sourceMappingURL=messenger.d.ts.map