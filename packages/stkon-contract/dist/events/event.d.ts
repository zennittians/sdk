/**
 * @packageDocumentation
 * @module stkon-contract
 */
import { LogSub } from '@stkon-js/network';
import { AbiItemModel } from '../models/types';
import { Contract } from '../contract';
export declare class EventMethod extends LogSub {
    params: any;
    methodKey: string;
    contract: Contract;
    abiItem: AbiItemModel;
    constructor(methodKey: string, params: any, abiItem: AbiItemModel, contract: Contract);
    onNewSubscriptionItem(subscriptionItem: any): any;
}
//# sourceMappingURL=event.d.ts.map