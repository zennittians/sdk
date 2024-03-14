/**
 * @packageDocumentation
 * @module stkon-contract
 */
import { Wallet } from '@stkon-js/account';
import { Contract } from './contract';
import { ContractOptions } from './utils/options';
export declare class ContractFactory {
    wallet: Wallet | any;
    constructor(wallet: Wallet | any);
    createContract(abi: any[], address?: string, options?: ContractOptions): Contract;
}
//# sourceMappingURL=contractFactory.d.ts.map