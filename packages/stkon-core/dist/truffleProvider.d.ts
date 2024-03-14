/**
 * @packageDocumentation
 * @module stkon-core
 * @hidden
 */
import { HttpProvider, WSProvider, RPCRequestPayload, ResponseMiddleware } from '@stkon-js/network';
import { ChainID, ChainType } from '@stkon-js/utils';
import { HDNode } from '@stkon-js/account';
export interface ArgsResolver {
    newArgs: any;
    id: number;
    params: any;
    newMethod: string;
    callback: (error: any, res?: any) => void;
}
export interface HDOptions {
    menmonic?: string;
    index: number;
    addressCount: number;
}
export interface ChainOptions {
    shardID: number;
    chainType: ChainType;
    chainId: ChainID;
}
export interface TransactionOptions {
    gasLimit: string;
    gasPrice: string;
}
export declare class TruffleProvider extends HDNode {
    constructor(provider?: string | HttpProvider | WSProvider, hdOptions?: HDOptions, chainOptions?: ChainOptions, transactionOptions?: TransactionOptions);
    send(...args: [RPCRequestPayload<any>, any]): Promise<any>;
    sendAsync(...args: [RPCRequestPayload<any>, any]): Promise<any>;
    resolveArgs(...args: [RPCRequestPayload<any>, any]): ArgsResolver;
    resolveResult: (response: ResponseMiddleware | any) => any;
    resolveCallback: (err: any, res: any, callback: (error: any, res?: ResponseMiddleware | any) => void) => void;
}
//# sourceMappingURL=truffleProvider.d.ts.map