/**
 * @packageDocumentation
 * @module stkon-account
 * @hidden
 */
/**
 * test type docs
 */
export type ShardID = string | number;
export interface BalanceObject {
    address: string;
    balance: string;
    nonce: number;
}
export type Shards = Map<ShardID, BalanceObject>;
//# sourceMappingURL=types.d.ts.map