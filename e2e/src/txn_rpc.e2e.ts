import fetch from 'jest-fetch-mock';
import { stkon, checkCalledMethod } from './stkon';
import txnJsons from '../fixtures/transactions.json';
import { RPCMethod } from '@stkon-js/network';

const messenger = stkon.messenger;

interface TransactionInfo {
  blockHash: string;
  index: string;
  blockNumber: string;
}

describe('e2e test transactions by RPC Method', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  const txnHashesFixtures: any = [];
  const transactionInfoList: any = [];
  const { transactions, hashes, blockHashes } = txnJsons;
  // net_*
  it('should test stk_sendRawTransaction', async () => {
    for(let index = 0; index < transactions.length; index++) {
      fetch.mockResponseOnce(
        JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": hashes[index]}),
      );
      const sent = await messenger.send('stk_sendRawTransaction', transactions[index].rawTransaction);
      expect(stkon.utils.isHash(sent.result)).toEqual(true);
      txnHashesFixtures.push(sent.result);
      expect(checkCalledMethod(index, 'stk_sendRawTransaction')).toEqual(true);
    }
  });
  it('should test stk_getTransactionByHash', async () => {
    for(let index: number = 0; index < txnHashesFixtures.length; index++) {
      const txnHash = txnHashesFixtures[index];
      fetch.mockResponseOnce(
        JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "result": {
            "hash": hashes[index],
            "blockHash": blockHashes[index],
            "blockNumber": stkon.utils.numberToHex(index),
            "transactionIndex": stkon.utils.numberToHex(index),
            "from": transactions[index].senderAddress,
            "gas": transactions[index].gasLimit,
            "gasPrice": transactions[index].gasPrice,
            "input": "0x",
            "nonce": transactions[index].nonce,
            "to": transactions[index].receiverAddressBech32,
            "value": transactions[index].value,
            "v": stkon.utils.numberToHex(index),
            "r": stkon.utils.numberToHex(index),
            "s": stkon.utils.numberToHex(index),
          }
        })
      );
      const txnDetail = await stkon.blockchain.getTransactionByHash({
        txnHash
      });
      expect(checkCalledMethod(index, RPCMethod.GetTransactionByHash)).toEqual(true);
      if (txnDetail.result !== null) {
        expect(checkTransactionDetail(txnDetail.result)).toEqual(true);
        expect(txnDetail.result.hash).toEqual(txnHash);

        const transactionInfo = {
          blockHash: txnDetail.result.blockHash,
          blockNumber: txnDetail.result.blockNumber,
          index: txnDetail.result.transactionIndex,
        };
        transactionInfoList.push(transactionInfo);
      } else {
        fail(`txnDetail for ${txnHash} is null`);
      }
    }
  });
  it('should test stk_getTransactionByBlockHashAndIndex', async () => {
    for (let index: number = 0; index < transactionInfoList.length; index++) {
      fetch.mockResponseOnce((req) => {
        if (!(Buffer.isBuffer(req.body))) {
          fail("POST request body not a buffer");
        }
        const body: any = JSON.parse(req.body.toString());
        // validate that the block hash is as expected
        if (body.params[0] !== blockHashes[index]) {
          fail(`Expected block hash ${blockHashes[index]} but got ${body.params[0]}`);
        }
        // validate that the transaction index is as expected
        let expectedTransactionIndex: string = stkon.utils.numberToHex(index);
        if (expectedTransactionIndex !== body.params[1]) {
          fail(`Expected transactionIndex ${expectedTransactionIndex} but got ${body.params[1]}`);
        }
        return Promise.resolve(JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "result": {
            "hash": hashes[index],
            "blockHash": blockHashes[index],
            "blockNumber": stkon.utils.numberToHex(index),
            "transactionIndex": stkon.utils.numberToHex(index),
            "from": transactions[index].senderAddress,
            "gas": transactions[index].gasLimit,
            "gasPrice": transactions[index].gasPrice,
            "input": "0x",
            "nonce": transactions[index].nonce,
            "to": transactions[index].receiverAddressBech32,
            "value": transactions[index].value,
            "v": stkon.utils.numberToHex(index),
            "r": stkon.utils.numberToHex(index),
            "s": stkon.utils.numberToHex(index),
          }
        }));
      });
      const transactionInfo: TransactionInfo = transactionInfoList[index];
      const txnDetail: any = await stkon.blockchain.getTransactionByBlockHashAndIndex({
        blockHash: transactionInfo.blockHash,
        index: transactionInfo.index,
      });
      expect(checkCalledMethod(index, RPCMethod.GetTransactionByBlockHashAndIndex)).toEqual(true);
      if (txnDetail.result !== null) {
        expect(checkTransactionDetail(txnDetail.result)).toEqual(true);
        expect(txnDetail.result.blockHash).toEqual(transactionInfo.blockHash);
        expect(txnDetail.result.transactionIndex).toEqual(transactionInfo.index);
      } else {
        fail(`txnDetail for ${transactionInfo.blockHash}_${transactionInfo.index} is null`);
      }
    }
  });
  it('should test stk_getTransactionByBlockNumberAndIndex', async () => {
    for (let index: number = 0; index < transactionInfoList.length; index++) {
      fetch.mockResponseOnce((req) => {
        if (!(Buffer.isBuffer(req.body))) {
          fail("POST request body not a buffer");
        }
        const body: any = JSON.parse(req.body.toString());
        // validate that the block number is as expected
        let expectedBlockNumber: string = stkon.utils.numberToHex(index);
        if (body.params[0] !== expectedBlockNumber) {
          fail(`Expected block number ${index} but got ${body.params[0]}`);
        }
        // validate that the transaction index is as expected
        let expectedTransactionIndex: string = stkon.utils.numberToHex(index);
        if (expectedTransactionIndex !== body.params[1]) {
          fail(`Expected transactionIndex ${expectedTransactionIndex} but got ${body.params[1]}`);
        }
        return Promise.resolve(JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "result": {
            "hash": hashes[index],
            "blockHash": blockHashes[index],
            "blockNumber": stkon.utils.numberToHex(index),
            "transactionIndex": stkon.utils.numberToHex(index),
            "from": transactions[index].senderAddress,
            "gas": transactions[index].gasLimit,
            "gasPrice": transactions[index].gasPrice,
            "input": "0x",
            "nonce": transactions[index].nonce,
            "to": transactions[index].receiverAddressBech32,
            "value": transactions[index].value,
            "v": stkon.utils.numberToHex(index),
            "r": stkon.utils.numberToHex(index),
            "s": stkon.utils.numberToHex(index),
          }
        }));
      });
      const transactionInfo: TransactionInfo = transactionInfoList[index];
      const txnDetail: any = await stkon.blockchain.getTransactionByBlockNumberAndIndex({
        blockNumber: transactionInfo.blockNumber,
        index: transactionInfo.index,
      });
      expect(checkCalledMethod(index, RPCMethod.GetTransactionByBlockNumberAndIndex)).toEqual(true);
      if (txnDetail.result !== null) {
        expect(checkTransactionDetail(txnDetail.result)).toEqual(true);
        expect(txnDetail.result.blockNumber).toEqual(transactionInfo.blockNumber);
        expect(txnDetail.result.transactionIndex).toEqual(transactionInfo.index);
      } else {
        fail(`txnDetail for ${transactionInfo.blockNumber}_${transactionInfo.index} is null`);
      }
    }
  });
  it('should test stk_getTransactionCountByHash', async () => {
    for (const some of transactionInfoList) {
      fetch.mockResponseOnce(
        JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": "0x1"}),
      );
      const transactionInfo: TransactionInfo = some;
      const txnCount: any = await stkon.blockchain.getBlockTransactionCountByHash({
        blockHash: transactionInfo.blockHash,
      });
      expect(checkCalledMethod(0, RPCMethod.GetBlockTransactionCountByHash)).toEqual(true);
      expect(stkon.utils.isHex(txnCount.result)).toEqual(true);
    }
  });
  it('should test stk_getTransactionCountByNumber', async () => {
    for (const some of transactionInfoList) {
      fetch.mockResponseOnce(
        JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": "0x1"}),
      );
      const transactionInfo: TransactionInfo = some;
      const txnCount: any = await stkon.blockchain.getBlockTransactionCountByNumber({
        blockNumber: transactionInfo.blockNumber,
      });
      expect(checkCalledMethod(0, RPCMethod.GetBlockTransactionCountByNumber)).toEqual(true);
      expect(stkon.utils.isHex(txnCount.result)).toEqual(true);
    }
  });
  it('should test stk_getTransactionReceipt', async () => {
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < txnHashesFixtures.length; index += 1) {
      const txnHash = txnHashesFixtures[index];
      fetch.mockResponseOnce(
        JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "result": {
            "contractAddress": null,
            "blockNumber": stkon.utils.numberToHex(index),
            "from": transactions[index].senderAddress,
            "gasUsed": stkon.utils.numberToHex(index),
            "cumulativeGasUsed": stkon.utils.numberToHex(index),
            "logs": [],
            "logsBloom": stkon.utils.numberToHex(index),
            "shardID": 0,
            "to": transactions[index].receiverAddress,
            "transactionHash": hashes[index],
            "transactionIndex": stkon.utils.numberToHex(index),
            "blockHash": blockHashes[index]
          }
        })
      );
      const receipt: any = await stkon.blockchain.getTransactionReceipt({
        txnHash,
      });
      expect(checkCalledMethod(index, RPCMethod.GetTransactionReceipt)).toEqual(true);

      if (receipt.result !== null) {
        expect(checkTransactionReceipt(receipt.result)).toEqual(true);
        expect(stkon.crypto.getAddress(receipt.result.from).checksum).toEqual(
          transactions[index].senderAddress,
        );
        expect(stkon.crypto.getAddress(receipt.result.to).checksum).toEqual(
          transactions[index].receiverAddress,
        );
        expect(receipt.result.blockHash).toEqual(transactionInfoList[index].blockHash);
        expect(receipt.result.blockNumber).toEqual(transactionInfoList[index].blockNumber);
        expect(receipt.result.transactionIndex).toEqual(transactionInfoList[index].index);
      } else {
        fail(`receipt for ${txnHash} is null`);
      }
    }
  });
  it('should test stk_getTransactionCount', async () => {
    for (let i = 0; i < transactionInfoList; i += 1) {
      fetch.mockResponseOnce(
        JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": "0x1"}),
      );
      const transactionInfo: TransactionInfo = transactionInfoList[i];
      const nonce: any = await stkon.blockchain.getTransactionCount({
        address: transactions[i].senderAddressBech32,
        blockNumber: transactionInfo.blockNumber,
      });
      expect(nonce.result).toEqual(transactions[i].nonce);
    }
  });
});

function checkTransactionDetail(data: any) {
  return stkon.utils.validateArgs(
    data,
    {
      blockHash: [stkon.utils.isHash],
      blockNumber: [stkon.utils.isHex],
      // tslint:disable-next-line: no-shadowed-variable
      from: [stkon.utils.isValidAddress],
      gas: [stkon.utils.isHex],
      gasPrice: [stkon.utils.isHex],
      hash: [stkon.utils.isHash],
      // tslint:disable-next-line: no-shadowed-variable
      input: [(data: any) => data === '0x' || stkon.utils.isHex(data)],
      nonce: [stkon.utils.isHex],
      // tslint:disable-next-line: no-shadowed-variable
      to: [(data: any) => data === '0x' || stkon.utils.isValidAddress(data)],
      transactionIndex: [stkon.utils.isHex],
      value: [stkon.utils.isHex],
      v: [stkon.utils.isHex],
      r: [stkon.utils.isHex],
      s: [stkon.utils.isHex],
    },
    {},
  );
}

function checkTransactionReceipt(data: any) {
  return stkon.utils.validateArgs(
    data,
    {
      blockNumber: [stkon.utils.isHex],
      contractAddress: [
        // tslint:disable-next-line: no-shadowed-variable
        (data: any) => data === null || stkon.utils.isValidAddress,
      ],
      cumulativeGasUsed: [stkon.utils.isHex],
      from: [stkon.utils.isValidAddress],
      gasUsed: [stkon.utils.isHex],
      logs: [stkon.utils.isArray],
      logsBloom: [stkon.utils.isHex],

      shardID: [stkon.utils.isNumber],
      // tslint:disable-next-line: no-shadowed-variable
      to: [(data: any) => data === '0x' || stkon.utils.isValidAddress],
      transactionHash: [stkon.utils.isHash],
      transactionIndex: [stkon.utils.isHex],
    },
    { blockHash: [stkon.utils.isHash], root: [stkon.utils.isHash] },
  );
}
