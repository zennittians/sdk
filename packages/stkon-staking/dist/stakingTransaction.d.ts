/**
 * # @stkon-js/staking

This package provides a collection of apis to create, sign/send staking transaction, and receive confirm/receipt.

## Installation

```
npm install @stkon-js/staking
```

## Usage

Create a stkon instance connecting to testnet

```javascript
* const { Stkon } = require('@stkon-js/core');
* const {
*   ChainID,
*   ChainType,
*   hexToNumber,
*   numberToHex,
*   fromWei,
*   Units,
*   Unit,
* } = require('@stkon-js/utils');

* const stk = new Stkon(
*     'https://api.s0.b.stkon.xyz/',
*     {
*         chainType: ChainType.Stkon,
*         chainId: ChainID.StkTestnet,
*     },
* );
```
Below, examples show how to send delegate, undelegate, and collect rewards staking transactions. First, set the chainId, gasLimit, gasPrice for all subsequent staking transactions
```javascript
* stk.stakings.setTxParams({
*   gasLimit: 25000,
*   gasPrice: numberToHex(new stk.utils.Unit('1').asGwei().toWei()),
*   chainId: 2
* });
```
<span style="color:red">Note: create and edit validator transactions are not fully supported in the sdk</span>

Create delegate staking transaction
```javascript
* const delegate = stk.stakings.delegate({
*   delegatorAddress: 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7',
*   validatorAddress: 'one1vfqqagdzz352mtvdl69v0hw953hm993n6v26yl',
*   amount: numberToHex(new Unit(1000).asOne().toWei())
* });
* const delegateStakingTx = delegate.build();
```

Sign and send the delegate transaction and receive confirmation
```javascript
* // key corresponds to one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7, only has testnet balance
* stk.wallet.addByPrivateKey('45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e');

* stk.wallet.signStaking(delegateStakingTx).then(signedTxn => {
*   signedTxn.sendTransaction().then(([tx, hash]) => {
*     console.log(hash);
*     signedTxn.confirm(hash).then(response => {
*       console.log(response.receipt);
*     });
*   });
* });
```

Similarily, undelegate and collect reward transactions can be composed, signed and sent
Create undelegate staking transaction
```javascript
* const undelegate = stk.stakings.undelegate({
*   delegatorAddress: 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7',
*   validatorAddress: 'one1vfqqagdzz352mtvdl69v0hw953hm993n6v26yl',
*   amount: numberToHex(new Unit(1000).asOne().toWei())
* });
* const undelegateStakingTx = undelegate.build();
```

Create collect rewards staking transaction
```javascript
* const collectRewards = stk.stakings.collectRewards({
*   delegatorAddress: 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
* });
* const collectRewardsStakingTx = collectRewards.build();
```

Also, similar to normal transaction, signing and sending can be performed asynchronously.
 * @packageDocumentation
 * @module stkon-staking
 */
/// <reference types="bn.js" />
import { BN, Signature } from '@stkon-js/crypto';
import { Messenger } from '@stkon-js/network';
import { TransactionBase, TxStatus } from '@stkon-js/transaction';
/** @hidden */
export declare class StakingSettings {
    static PRECISION: number;
    static MAX_DECIMAL: number;
}
/** @hidden */
export declare enum Directive {
    DirectiveCreateValidator = 0,
    DirectiveEditValidator = 1,
    DirectiveDelegate = 2,
    DirectiveUndelegate = 3,
    DirectiveCollectRewards = 4
}
export declare class StakingTransaction extends TransactionBase {
    private directive;
    private stakeMsg;
    private nonce;
    private gasLimit;
    private gasPrice;
    private chainId;
    private rawTransaction;
    private unsignedRawTransaction;
    private signature;
    private from;
    constructor(directive: Directive, stakeMsg: CreateValidator | EditValidator | Delegate | Undelegate | CollectRewards, nonce: number | string, gasPrice: number | string, gasLimit: number | string, chainID: number, messenger?: Messenger, txStatus?: TxStatus);
    encode(): [string, any[]];
    rlpSign(prv: string): [Signature, string];
    getRLPSigned(raw: any[], signature: Signature): string;
    sendTransaction(): Promise<[StakingTransaction, string]>;
    setUnsigned(unSigned: string): void;
    setRawTransaction(rawTransaction: string): void;
    setSignature(signature: Signature): void;
    setNonce(nonce: number): void;
    setFromAddress(address: string): void;
    getUnsignedRawTransaction(): string;
    getRawTransaction(): string;
    getSignature(): Signature;
    getFromAddress(): string;
    confirm(txHash: string, maxAttempts?: number, interval?: number, shardID?: number | string, toShardID?: number | string): Promise<TransactionBase>;
}
/** @hidden */
export declare class Description {
    name: string;
    identity: string;
    website: string;
    securityContact: string;
    details: string;
    constructor(name: string, identity: string, website: string, securityContact: string, details: string);
    encode(): any[];
}
/** @hidden */
export declare class Decimal {
    value: BN;
    constructor(value: string);
    encode(): any[];
}
/** @hidden */
export declare class CommissionRate {
    rate: Decimal;
    maxRate: Decimal;
    maxChangeRate: Decimal;
    constructor(rate: Decimal, maxRate: Decimal, maxChangeRate: Decimal);
    encode(): any[];
}
export declare class CreateValidator {
    validatorAddress: string;
    description: Description;
    commissionRates: CommissionRate;
    minSelfDelegation: number;
    maxTotalDelegation: number;
    slotPubKeys: string[];
    amount: number;
    constructor(validatorAddress: string, description: Description, commissionRates: CommissionRate, minSelfDelegation: number, maxTotalDelegation: number, slotPubKeys: string[], amount: number);
    encode(): any[];
    encodeArr(): any[];
}
export declare class EditValidator {
    validatorAddress: string;
    description: Description;
    commissionRate: Decimal;
    minSelfDelegation: number;
    maxTotalDelegation: number;
    slotKeyToRemove: string;
    slotKeyToAdd: string;
    constructor(validatorAddress: string, description: Description, commissionRate: Decimal, minSelfDelegation: number, maxTotalDelegation: number, slotKeyToRemove: string, slotKeyToAdd: string);
    encode(): any[];
}
export declare class Delegate {
    delegatorAddress: string;
    validatorAddress: string;
    amount: number;
    constructor(delegatorAddress: string, validatorAddress: string, amount: number);
    encode(): any[];
}
export declare class Undelegate {
    delegatorAddress: string;
    validatorAddress: string;
    amount: number;
    constructor(delegatorAddress: string, validatorAddress: string, amount: number);
    encode(): any[];
}
export declare class CollectRewards {
    delegatorAddress: string;
    constructor(delegatorAddress: string);
    encode(): any[];
}
//# sourceMappingURL=stakingTransaction.d.ts.map