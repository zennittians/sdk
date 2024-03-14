/**
 * @packageDocumentation
 * @module stkon-contract
 * @hidden
 */

import { AbiCoderClass } from './api';
import { AbiCoder as EtherCoder } from './abiCoder';

export function AbiCoder() {
  return new AbiCoderClass(new EtherCoder());
}
