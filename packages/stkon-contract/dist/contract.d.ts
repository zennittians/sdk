/**
 * @packageDocumentation
 * @module stkon-contract
 *
 */
import { Wallet } from '@stkon-js/account';
import { Messenger } from '@stkon-js/network';
import { Transaction } from '@stkon-js/transaction';
import { ContractOptions } from './utils/options';
import { AbiModel } from './models/types';
import { AbiCoderClass } from './abi/api';
import { ContractStatus } from './utils/status';
export declare class Contract {
    methods: any;
    events: any;
    fallback: any;
    receive: any;
    abi: any;
    abiModel: any | AbiModel;
    abiCoder: AbiCoderClass;
    options: ContractOptions | any;
    wallet: Wallet | any;
    transaction?: Transaction;
    status: ContractStatus;
    shardID: number;
    errorFunc: string;
    errorFuncSig: string;
    constructor(abi: any, address: string | undefined, options: ContractOptions | undefined, wallet: Wallet, status?: ContractStatus);
    isInitialised(): boolean;
    isSigned(): boolean;
    isSent(): boolean;
    isDeployed(): boolean;
    isRejected(): boolean;
    isCalled(): boolean;
    setStatus(status: ContractStatus): void;
    get jsonInterface(): any[];
    set jsonInterface(value: any[]);
    get address(): string;
    set address(value: string);
    get data(): any;
    set data(value: any);
    deploy(options: any): any;
    runMethodFactory(): Contract;
    runEventFactory(): Contract;
    connect(wallet: Wallet): void;
    setMessenger(messenger: Messenger): void;
}
//# sourceMappingURL=contract.d.ts.map