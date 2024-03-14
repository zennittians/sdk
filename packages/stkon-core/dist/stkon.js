"use strict";
/**
 * @packageDocumentation
 * @module stkon-core
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stkon = void 0;
var tslib_1 = require("tslib");
var crypto = tslib_1.__importStar(require("@stkon-js/crypto"));
var utils = tslib_1.__importStar(require("@stkon-js/utils"));
var network_1 = require("@stkon-js/network");
var transaction_1 = require("@stkon-js/transaction");
var staking_1 = require("@stkon-js/staking");
var contract_1 = require("@stkon-js/contract");
var account_1 = require("@stkon-js/account");
var blockchain_1 = require("./blockchain");
var Stkon = /** @class */ (function (_super) {
    tslib_1.__extends(Stkon, _super);
    /**
     * Create a Stkon instance
     *
     * @param url The end-points of the stk blockchain
     * @param config set up `ChainID` and `ChainType`, typically we can use the default values
     *
     * @example
     * ```
     * // import or require Stkon class
     * const { Stkon } = require('@stkon-js/core');
     *
     * // import or require settings
     * const { ChainID, ChainType } = require('@stkon-js/utils');
     *
     * // Initialize the Stkon instance
     * const stk = new Stkon(
     *   // rpc url:
     *   // local: http://localhost:9500
     *   // testnet: https://api.s0.b.stkon.xyz/
     *   // mainnet: https://api.s0.t.stkon.xyz/
     *   'http://localhost:9500',
     *   {
     *     // chainType set to Stkon
     *     chainType: ChainType.Stkon,
     *     // chainType set to stkLocal
     *     chainId: ChainID.StkLocal,
     *   },
     * );
     * ```
     */
    function Stkon(url, config) {
        if (config === void 0) { config = {
            chainId: utils.defaultConfig.Default.Chain_ID,
            chainType: utils.defaultConfig.Default.Chain_Type,
        }; }
        var _this = _super.call(this, config.chainType, config.chainId) || this;
        /**@ignore*/
        _this.Modules = {
            HttpProvider: network_1.HttpProvider,
            WSProvider: network_1.WSProvider,
            Messenger: network_1.Messenger,
            Blockchain: blockchain_1.Blockchain,
            TransactionFactory: transaction_1.TransactionFactory,
            StakingFactory: staking_1.StakingFactory,
            Wallet: account_1.Wallet,
            Transaction: transaction_1.Transaction,
            StakingTransaction: staking_1.StakingTransaction,
            Account: account_1.Account,
            Contract: contract_1.Contract,
        };
        var providerUrl = config.chainUrl || url || utils.defaultConfig.Default.Chain_URL;
        _this.provider = new network_1.Provider(providerUrl).provider;
        _this.messenger = new network_1.Messenger(_this.provider, _this.chainType, _this.chainId);
        _this.blockchain = new blockchain_1.Blockchain(_this.messenger);
        _this.transactions = new transaction_1.TransactionFactory(_this.messenger);
        _this.stakings = new staking_1.StakingFactory(_this.messenger);
        _this.wallet = new account_1.Wallet(_this.messenger);
        _this.contracts = new contract_1.ContractFactory(_this.wallet);
        _this.crypto = crypto;
        _this.utils = utils;
        _this.defaultShardID = config.shardID;
        if (_this.defaultShardID !== undefined) {
            _this.setShardID(_this.defaultShardID);
        }
        return _this;
    }
    /**
     * Will change the provider for its module.
     *
     * @param provider a valid provider, you can replace it with your own working node
     *
     * @example
     * ```javascript
     * const tmp = stk.setProvider('http://localhost:9500');
     * ```
     */
    Stkon.prototype.setProvider = function (provider) {
        this.provider = new network_1.Provider(provider).provider;
        this.messenger.setProvider(this.provider);
        this.setMessenger(this.messenger);
    };
    /**
     * set the chainID
     *
     * @hint
     * ```
     * Default = 0,
     * EthMainnet = 1,
      Morden = 2,
      Ropsten = 3,
      Rinkeby = 4,
      RootstockMainnet = 30,
      RootstockTestnet = 31,
      Kovan = 42,
      EtcMainnet = 61,
      EtcTestnet = 62,
      Geth = 1337,
      Ganache = 0,
      StkMainnet = 1,
      StkTestnet = 2,
      StkLocal = 2,
      StkPangaea = 3
     * ```
     * @param chainId
     *
     * @example
     * ```
     * stk.setChainId(2);
     * ```
     */
    Stkon.prototype.setChainId = function (chainId) {
        this.chainId = chainId;
        this.messenger.setChainId(this.chainId);
        this.setMessenger(this.messenger);
    };
    /**
     * Change the Shard ID
     *
     * @example
     * ```
     * stk.setShardID(2);
     * ```
     */
    Stkon.prototype.setShardID = function (shardID) {
        this.defaultShardID = shardID;
        this.messenger.setDefaultShardID(this.defaultShardID);
        this.setMessenger(this.messenger);
    };
    /**
     * set the chainType
     *
     * @param chainType `stk` or `eth`
     *
     * @example
     * ```
     * // set chainType to stk
     * stk.setChainType('stk');
     * // set chainType to eth
     * stk.setChainType('eth');
     * ```
     */
    Stkon.prototype.setChainType = function (chainType) {
        this.chainType = chainType;
        this.messenger.setChainType(this.chainType);
        this.setMessenger(this.messenger);
    };
    /**
     * Set the sharding Structure
     *
     * @param shardingStructures The array of information of sharding structures
     *
     * @example
     * ```javascript
     * stk.shardingStructures([
     *   {"current":true,"http":"http://127.0.0.1:9500",
     *    "shardID":0,"ws":"ws://127.0.0.1:9800"},
     *   {"current":false,"http":"http://127.0.0.1:9501",
     *    "shardID":1,"ws":"ws://127.0.0.1:9801"}
     * ]);
     * ```
     */
    Stkon.prototype.shardingStructures = function (shardingStructures) {
        var e_1, _a;
        try {
            for (var shardingStructures_1 = tslib_1.__values(shardingStructures), shardingStructures_1_1 = shardingStructures_1.next(); !shardingStructures_1_1.done; shardingStructures_1_1 = shardingStructures_1.next()) {
                var shard = shardingStructures_1_1.value;
                var shardID = typeof shard.shardID === 'string' ? Number.parseInt(shard.shardID, 10) : shard.shardID;
                this.messenger.shardProviders.set(shardID, {
                    current: shard.current !== undefined ? shard.current : false,
                    shardID: shardID,
                    http: shard.http,
                    ws: shard.ws,
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (shardingStructures_1_1 && !shardingStructures_1_1.done && (_a = shardingStructures_1.return)) _a.call(shardingStructures_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.setMessenger(this.messenger);
    };
    /**@ignore*/
    Stkon.prototype.setMessenger = function (messenger) {
        this.blockchain.setMessenger(messenger);
        this.wallet.setMessenger(messenger);
        this.transactions.setMessenger(messenger);
        this.stakings.setMessenger(messenger);
    };
    return Stkon;
}(utils.StkonCore));
exports.Stkon = Stkon;
//# sourceMappingURL=stkon.js.map