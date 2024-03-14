/**
 * @packageDocumentation
 * @module stkon-transaction
 * @hidden
 */
import { Messenger } from '@stkon-js/network';
import { Transaction } from './transaction';
import { TxParams, TxStatus } from './types';
export declare class ShardingTransaction extends Transaction {
    constructor(params?: TxParams | any, messenger?: Messenger, txStatus?: TxStatus);
}
//# sourceMappingURL=shardingTransaction.d.ts.map