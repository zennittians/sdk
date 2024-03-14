/**
 * @packageDocumentation
 * @module stkon-core
 * @hidden
 */
import { ChainType, ChainID } from '@stkon-js/utils';
export interface StkonConfig {
    chainUrl?: string;
    chainType: ChainType;
    chainId: ChainID;
    shardID?: number;
}
export declare function createWeb3(_web3: any): void;
//# sourceMappingURL=util.d.ts.map