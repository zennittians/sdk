/**
 * @packageDocumentation
 * @module stkon-network
 * @hidden
 */
import { Messenger } from '../messenger/messenger';
import { SubscriptionMethod } from './Subscription';
export declare class Syncing extends SubscriptionMethod {
    isSyncing: boolean | null;
    constructor(messenger: Messenger, shardID?: number);
    onNewSubscriptionItem(subscriptionItem: any): any;
}
//# sourceMappingURL=SyncingSub.d.ts.map