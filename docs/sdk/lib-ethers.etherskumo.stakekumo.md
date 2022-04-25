<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@liquity/lib-ethers](./lib-ethers.md) &gt; [EthersKumo](./lib-ethers.etherskumo.md) &gt; [stakeKUMO](./lib-ethers.etherskumo.stakekumo.md)

## EthersKumo.stakeKUMO() method

Stake KUMO to start earning fee revenue or increase existing stake.

<b>Signature:</b>

```typescript
stakeKUMO(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<void>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  amount | [Decimalish](./lib-base.decimalish.md) | Amount of KUMO to add to new or existing stake. |
|  overrides | [EthersTransactionOverrides](./lib-ethers.etherstransactionoverrides.md) |  |

<b>Returns:</b>

Promise&lt;void&gt;

## Exceptions

Throws [EthersTransactionFailedError](./lib-ethers.etherstransactionfailederror.md) in case of transaction failure. Throws [EthersTransactionCancelledError](./lib-ethers.etherstransactioncancellederror.md) if the transaction is cancelled or replaced.

## Remarks

As a side-effect, the transaction will also pay out an existing KUMO stake's [collateral gain](./lib-base.kumostake.collateralgain.md) and [KUSD gain](./lib-base.kumostake.kusdgain.md)<!-- -->.
