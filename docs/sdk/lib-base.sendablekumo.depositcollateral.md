<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@kumodao/lib-base](./lib-base.md) &gt; [SendableKumo](./lib-base.sendablekumo.md) &gt; [depositCollateral](./lib-base.sendablekumo.depositcollateral.md)

## SendableKumo.depositCollateral() method

Adjust existing Trove by depositing more collateral.

<b>Signature:</b>

```typescript
depositCollateral(amount: Decimalish): Promise<SentKumoTransaction<S, KumoReceipt<R, TroveAdjustmentDetails>>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  amount | [Decimalish](./lib-base.decimalish.md) | The amount of collateral to add to the Trove's existing collateral. |

<b>Returns:</b>

Promise&lt;[SentKumoTransaction](./lib-base.sentkumotransaction.md)<!-- -->&lt;S, [KumoReceipt](./lib-base.kumoreceipt.md)<!-- -->&lt;R, [TroveAdjustmentDetails](./lib-base.troveadjustmentdetails.md)<!-- -->&gt;&gt;&gt;

## Remarks

Equivalent to:

```typescript
adjustTrove({ depositCollateral: amount })
```
