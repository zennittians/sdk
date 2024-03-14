/**
 * @packageDocumentation
 * @module stkon-network
 */
import { Messenger } from '../messenger/messenger';
import { SubscriptionMethod } from './Subscription';
/**
 * ### Description:
 * Subscribes to incoming pending transactions
 */
export declare class NewPendingTransactions extends SubscriptionMethod {
    constructor(messenger: Messenger, shardID?: number);
}
//# sourceMappingURL=NewPendingTransactionsSub.d.ts.map