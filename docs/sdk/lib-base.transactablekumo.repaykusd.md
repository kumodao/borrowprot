<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@kumodao/lib-base](./lib-base.md) &gt; [TransactableKumo](./lib-base.transactablekumo.md) &gt; [repayKUSD](./lib-base.transactablekumo.repaykusd.md)

## TransactableKumo.repayKUSD() method

Adjust existing Trove by repaying some of its debt.

<b>Signature:</b>

```typescript
repayKUSD(amount: Decimalish): Promise<TroveAdjustmentDetails>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  amount | [Decimalish](./lib-base.decimalish.md) | The amount of KUSD to repay. |

<b>Returns:</b>

Promise&lt;[TroveAdjustmentDetails](./lib-base.troveadjustmentdetails.md)<!-- -->&gt;

## Exceptions

Throws [TransactionFailedError](./lib-base.transactionfailederror.md) in case of transaction failure.

## Remarks

Equivalent to:

```typescript
adjustTrove({ repayKUSD: amount })
```
