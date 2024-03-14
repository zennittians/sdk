/**
 * @packageDocumentation
 * @module stkon-core
 * @hidden
 */

import { HttpProvider, Messenger } from '@stkon-js/network';
import { TransactionFactory, Transaction } from '@stkon-js/transaction';
import { Wallet, Account } from '@stkon-js/account';
import { ChainType, ChainID } from '@stkon-js/utils';
import { Blockchain } from './blockchain';

export interface StkonModule {
  HttpProvider: HttpProvider;
  Messenger: Messenger;
  Blockchain: Blockchain;
  TransactionFactory: TransactionFactory;
  Wallet: Wallet;
  Transaction: Transaction;
  Account: Account;
}

export enum UrlType {
  http,
  ws,
}

export interface StkonSetting<T extends ChainType, I extends ChainID> {
  type: T;
  id: I;
}
