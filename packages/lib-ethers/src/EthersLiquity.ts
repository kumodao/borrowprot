import { BlockTag } from "@ethersproject/abstract-provider";

import {
  CollateralGainTransferDetails,
  Decimal,
  Decimalish,
  FailedReceipt,
  Fees,
  FrontendStatus,
  LiquidationDetails,
  LiquityStore,
  KUMOStake,
  RedemptionDetails,
  StabilityDeposit,
  StabilityDepositChangeDetails,
  StabilityPoolGainsWithdrawalDetails,
  TransactableLiquity,
  TransactionFailedError,
  Trove,
  TroveAdjustmentDetails,
  TroveAdjustmentParams,
  TroveClosureDetails,
  TroveCreationDetails,
  TroveCreationParams,
  TroveListingParams,
  TroveWithPendingRedistribution,
  UserTrove
} from "@liquity/lib-base";

import {
  EthersLiquityConnection,
  EthersLiquityConnectionOptionalParams,
  EthersLiquityStoreOption,
  _connect,
  _usingStore
} from "./EthersLiquityConnection";

import {
  EthersCallOverrides,
  EthersProvider,
  EthersSigner,
  EthersTransactionOverrides,
  EthersTransactionReceipt
} from "./types";

import {
  BorrowingOperationOptionalParams,
  PopulatableEthersLiquity,
  SentEthersLiquityTransaction
} from "./PopulatableEthersLiquity";
import { ReadableEthersLiquity, ReadableEthersLiquityWithStore } from "./ReadableEthersLiquity";
import { SendableEthersLiquity } from "./SendableEthersLiquity";
import { BlockPolledLiquityStore } from "./BlockPolledLiquityStore";

/**
 * Thrown by {@link EthersLiquity} in case of transaction failure.
 *
 * @public
 */
export class EthersTransactionFailedError extends TransactionFailedError<
  FailedReceipt<EthersTransactionReceipt>
> {
  constructor(message: string, failedReceipt: FailedReceipt<EthersTransactionReceipt>) {
    super("EthersTransactionFailedError", message, failedReceipt);
  }
}

const waitForSuccess = async <T>(tx: SentEthersLiquityTransaction<T>) => {
  const receipt = await tx.waitForReceipt();

  if (receipt.status !== "succeeded") {
    throw new EthersTransactionFailedError("Transaction failed", receipt);
  }

  return receipt.details;
};

/**
 * Convenience class that combines multiple interfaces of the library in one object.
 *
 * @public
 */
export class EthersLiquity implements ReadableEthersLiquity, TransactableLiquity {
  /** Information about the connection to the Liquity protocol. */
  readonly connection: EthersLiquityConnection;

  /** Can be used to create populated (unsigned) transactions. */
  readonly populate: PopulatableEthersLiquity;

  /** Can be used to send transactions without waiting for them to be mined. */
  readonly send: SendableEthersLiquity;

  private _readable: ReadableEthersLiquity;

  /** @internal */
  constructor(readable: ReadableEthersLiquity) {
    this._readable = readable;
    this.connection = readable.connection;
    this.populate = new PopulatableEthersLiquity(readable);
    this.send = new SendableEthersLiquity(this.populate);
  }

  /** @internal */
  static _from(
    connection: EthersLiquityConnection & { useStore: "blockPolled" }
  ): EthersLiquityWithStore<BlockPolledLiquityStore>;

  /** @internal */
  static _from(connection: EthersLiquityConnection): EthersLiquity;

  /** @internal */
  static _from(connection: EthersLiquityConnection): EthersLiquity {
    if (_usingStore(connection)) {
      return new _EthersLiquityWithStore(ReadableEthersLiquity._from(connection));
    } else {
      return new EthersLiquity(ReadableEthersLiquity._from(connection));
    }
  }

  /** @internal */
  static connect(
    signerOrProvider: EthersSigner | EthersProvider,
    optionalParams: EthersLiquityConnectionOptionalParams & { useStore: "blockPolled" }
  ): Promise<EthersLiquityWithStore<BlockPolledLiquityStore>>;

  /**
   * Connect to the Liquity protocol and create an `EthersLiquity` object.
   *
   * @param signerOrProvider - Ethers `Signer` or `Provider` to use for connecting to the Ethereum
   *                           network.
   * @param optionalParams - Optional parameters that can be used to customize the connection.
   */
  static connect(
    signerOrProvider: EthersSigner | EthersProvider,
    optionalParams?: EthersLiquityConnectionOptionalParams
  ): Promise<EthersLiquity>;

  static async connect(
    signerOrProvider: EthersSigner | EthersProvider,
    optionalParams?: EthersLiquityConnectionOptionalParams
  ): Promise<EthersLiquity> {
    return EthersLiquity._from(await _connect(signerOrProvider, optionalParams));
  }

  /**
   * Check whether this `EthersLiquity` is an {@link EthersLiquityWithStore}.
   */
  hasStore(): this is EthersLiquityWithStore;

  /**
   * Check whether this `EthersLiquity` is an
   * {@link EthersLiquityWithStore}\<{@link BlockPolledLiquityStore}\>.
   */
  hasStore(store: "blockPolled"): this is EthersLiquityWithStore<BlockPolledLiquityStore>;

  hasStore(): boolean {
    return false;
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTotalRedistributed} */
  getTotalRedistributed(overrides?: EthersCallOverrides): Promise<Trove> {
    return this._readable.getTotalRedistributed(overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTroveBeforeRedistribution} */
  getTroveBeforeRedistribution(
    address?: string,
    overrides?: EthersCallOverrides
  ): Promise<TroveWithPendingRedistribution> {
    return this._readable.getTroveBeforeRedistribution(address, overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTrove} */
  getTrove(address?: string, overrides?: EthersCallOverrides): Promise<UserTrove> {
    return this._readable.getTrove(address, overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getNumberOfTroves} */
  getNumberOfTroves(overrides?: EthersCallOverrides): Promise<number> {
    return this._readable.getNumberOfTroves(overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getPrice} */
  getPrice(overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getPrice(overrides);
  }

  /** @internal */
  _getActivePool(overrides?: EthersCallOverrides): Promise<Trove> {
    return this._readable._getActivePool(overrides);
  }

  /** @internal */
  _getDefaultPool(overrides?: EthersCallOverrides): Promise<Trove> {
    return this._readable._getDefaultPool(overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTotal} */
  getTotal(overrides?: EthersCallOverrides): Promise<Trove> {
    return this._readable.getTotal(overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getStabilityDeposit} */
  getStabilityDeposit(address?: string, overrides?: EthersCallOverrides): Promise<StabilityDeposit> {
    return this._readable.getStabilityDeposit(address, overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getRemainingStabilityPoolKUMOReward} */
  getRemainingStabilityPoolKUMOReward(overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getRemainingStabilityPoolKUMOReward(overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getKUSDInStabilityPool} */
  getKUSDInStabilityPool(overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getKUSDInStabilityPool(overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getKUSDBalance} */
  getKUSDBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getKUSDBalance(address, overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getKUMOBalance} */
  getKUMOBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getKUMOBalance(address, overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getUniTokenBalance} */
  getUniTokenBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getUniTokenBalance(address, overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getUniTokenAllowance} */
  getUniTokenAllowance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getUniTokenAllowance(address, overrides);
  }

  /** @internal */
  _getRemainingLiquidityMiningKUMORewardCalculator(
    overrides?: EthersCallOverrides
  ): Promise<(blockTimestamp: number) => Decimal> {
    return this._readable._getRemainingLiquidityMiningKUMORewardCalculator(overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getRemainingLiquidityMiningKUMOReward} */
  getRemainingLiquidityMiningKUMOReward(overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getRemainingLiquidityMiningKUMOReward(overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLiquidityMiningStake} */
  getLiquidityMiningStake(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getLiquidityMiningStake(address, overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTotalStakedUniTokens} */
  getTotalStakedUniTokens(overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getTotalStakedUniTokens(overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLiquidityMiningKUMOReward} */
  getLiquidityMiningKUMOReward(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getLiquidityMiningKUMOReward(address, overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getCollateralSurplusBalance} */
  getCollateralSurplusBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getCollateralSurplusBalance(address, overrides);
  }

  /** @internal */
  getTroves(
    params: TroveListingParams & { beforeRedistribution: true },
    overrides?: EthersCallOverrides
  ): Promise<TroveWithPendingRedistribution[]>;

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.(getTroves:2)} */
  getTroves(params: TroveListingParams, overrides?: EthersCallOverrides): Promise<UserTrove[]>;

  getTroves(params: TroveListingParams, overrides?: EthersCallOverrides): Promise<UserTrove[]> {
    return this._readable.getTroves(params, overrides);
  }

  /** @internal */
  _getBlockTimestamp(blockTag?: BlockTag): Promise<number> {
    return this._readable._getBlockTimestamp(blockTag);
  }

  /** @internal */
  _getFeesFactory(
    overrides?: EthersCallOverrides
  ): Promise<(blockTimestamp: number, recoveryMode: boolean) => Fees> {
    return this._readable._getFeesFactory(overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getFees} */
  getFees(overrides?: EthersCallOverrides): Promise<Fees> {
    return this._readable.getFees(overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getKUMOStake} */
  getKUMOStake(address?: string, overrides?: EthersCallOverrides): Promise<KUMOStake> {
    return this._readable.getKUMOStake(address, overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTotalStakedKUMO} */
  getTotalStakedKUMO(overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getTotalStakedKUMO(overrides);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getFrontendStatus} */
  getFrontendStatus(address?: string, overrides?: EthersCallOverrides): Promise<FrontendStatus> {
    return this._readable.getFrontendStatus(address, overrides);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.openTrove}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  openTrove(
    params: TroveCreationParams<Decimalish>,
    maxBorrowingRateOrOptionalParams?: Decimalish | BorrowingOperationOptionalParams,
    overrides?: EthersTransactionOverrides
  ): Promise<TroveCreationDetails> {
    return this.send
      .openTrove(params, maxBorrowingRateOrOptionalParams, overrides)
      .then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.closeTrove}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  closeTrove(overrides?: EthersTransactionOverrides): Promise<TroveClosureDetails> {
    return this.send.closeTrove(overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.adjustTrove}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  adjustTrove(
    params: TroveAdjustmentParams<Decimalish>,
    maxBorrowingRateOrOptionalParams?: Decimalish | BorrowingOperationOptionalParams,
    overrides?: EthersTransactionOverrides
  ): Promise<TroveAdjustmentDetails> {
    return this.send
      .adjustTrove(params, maxBorrowingRateOrOptionalParams, overrides)
      .then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.depositCollateral}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  depositCollateral(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<TroveAdjustmentDetails> {
    return this.send.depositCollateral(amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.withdrawCollateral}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  withdrawCollateral(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<TroveAdjustmentDetails> {
    return this.send.withdrawCollateral(amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.borrowKUSD}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  borrowKUSD(
    amount: Decimalish,
    maxBorrowingRate?: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<TroveAdjustmentDetails> {
    return this.send.borrowKUSD(amount, maxBorrowingRate, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.repayKUSD}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  repayKUSD(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<TroveAdjustmentDetails> {
    return this.send.repayKUSD(amount, overrides).then(waitForSuccess);
  }

  /** @internal */
  setPrice(price: Decimalish, overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.setPrice(price, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.liquidate}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  liquidate(
    address: string | string[],
    overrides?: EthersTransactionOverrides
  ): Promise<LiquidationDetails> {
    return this.send.liquidate(address, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.liquidateUpTo}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  liquidateUpTo(
    maximumNumberOfTrovesToLiquidate: number,
    overrides?: EthersTransactionOverrides
  ): Promise<LiquidationDetails> {
    return this.send.liquidateUpTo(maximumNumberOfTrovesToLiquidate, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.depositKUSDInStabilityPool}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  depositKUSDInStabilityPool(
    amount: Decimalish,
    frontendTag?: string,
    overrides?: EthersTransactionOverrides
  ): Promise<StabilityDepositChangeDetails> {
    return this.send.depositKUSDInStabilityPool(amount, frontendTag, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.withdrawKUSDFromStabilityPool}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  withdrawKUSDFromStabilityPool(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<StabilityDepositChangeDetails> {
    return this.send.withdrawKUSDFromStabilityPool(amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.withdrawGainsFromStabilityPool}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  withdrawGainsFromStabilityPool(
    overrides?: EthersTransactionOverrides
  ): Promise<StabilityPoolGainsWithdrawalDetails> {
    return this.send.withdrawGainsFromStabilityPool(overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.transferCollateralGainToTrove}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  transferCollateralGainToTrove(
    overrides?: EthersTransactionOverrides
  ): Promise<CollateralGainTransferDetails> {
    return this.send.transferCollateralGainToTrove(overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.sendKUSD}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  sendKUSD(
    toAddress: string,
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<void> {
    return this.send.sendKUSD(toAddress, amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.sendKUMO}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  sendKUMO(
    toAddress: string,
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<void> {
    return this.send.sendKUMO(toAddress, amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.redeemKUSD}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  redeemKUSD(
    amount: Decimalish,
    maxRedemptionRate?: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<RedemptionDetails> {
    return this.send.redeemKUSD(amount, maxRedemptionRate, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.claimCollateralSurplus}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  claimCollateralSurplus(overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.claimCollateralSurplus(overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.stakeKUMO}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  stakeKUMO(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.stakeKUMO(amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.unstakeKUMO}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  unstakeKUMO(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.unstakeKUMO(amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.withdrawGainsFromStaking}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  withdrawGainsFromStaking(overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.withdrawGainsFromStaking(overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.registerFrontend}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  registerFrontend(kickbackRate: Decimalish, overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.registerFrontend(kickbackRate, overrides).then(waitForSuccess);
  }

  /** @internal */
  _mintUniToken(
    amount: Decimalish,
    address?: string,
    overrides?: EthersTransactionOverrides
  ): Promise<void> {
    return this.send._mintUniToken(amount, address, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.approveUniTokens}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  approveUniTokens(allowance?: Decimalish, overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.approveUniTokens(allowance, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.stakeUniTokens}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  stakeUniTokens(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.stakeUniTokens(amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.unstakeUniTokens}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  unstakeUniTokens(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.unstakeUniTokens(amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.withdrawKUMORewardFromLiquidityMining}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  withdrawKUMORewardFromLiquidityMining(overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.withdrawKUMORewardFromLiquidityMining(overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @liquity/lib-base#TransactableLiquity.exitLiquidityMining}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  exitLiquidityMining(overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.exitLiquidityMining(overrides).then(waitForSuccess);
  }
}

/**
 * Variant of {@link EthersLiquity} that exposes a {@link @liquity/lib-base#LiquityStore}.
 *
 * @public
 */
export interface EthersLiquityWithStore<T extends LiquityStore = LiquityStore>
  extends EthersLiquity {
  /** An object that implements LiquityStore. */
  readonly store: T;
}

class _EthersLiquityWithStore<T extends LiquityStore = LiquityStore>
  extends EthersLiquity
  implements EthersLiquityWithStore<T> {
  readonly store: T;

  constructor(readable: ReadableEthersLiquityWithStore<T>) {
    super(readable);

    this.store = readable.store;
  }

  hasStore(store?: EthersLiquityStoreOption): boolean {
    return store === undefined || store === this.connection.useStore;
  }
}
