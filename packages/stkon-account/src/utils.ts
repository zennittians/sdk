/**
 * @packageDocumentation
 * @module stkon-account
 * @hidden
 */

import { HttpProvider, Messenger } from '@stkon-js/network';
import { ChainType, ChainID } from '@stkon-js/utils';

export const defaultMessenger = new Messenger(
  new HttpProvider('http://localhost:9500'),
  ChainType.Stkon,
  ChainID.StkLocal,
);
