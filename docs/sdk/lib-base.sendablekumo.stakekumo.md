<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@kumodao/lib-base](./lib-base.md) &gt; [SendableKumo](./lib-base.sendablekumo.md) &gt; [stakeKUMO](./lib-base.sendablekumo.stakekumo.md)

## SendableKumo.stakeKUMO() method

Stake KUMO to start earning fee revenue or increase existing stake.

<b>Signature:</b>

```typescript
stakeKUMO(amount: Decimalish): Promise<SentKumoTransaction<S, KumoReceipt<R, void>>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  amount | [Decimalish](./lib-base.decimalish.md) | Amount of KUMO to add to new or existing stake. |

<b>Returns:</b>

Promise&lt;[SentKumoTransaction](./lib-base.sentkumotransaction.md)<!-- -->&lt;S, [KumoReceipt](./lib-base.kumoreceipt.md)<!-- -->&lt;R, void&gt;&gt;&gt;

## Remarks

As a side-effect, the transaction will also pay out an existing KUMO stake's [collateral gain](./lib-base.kumostake.collateralgain.md) and [KUSD gain](./lib-base.kumostake.kusdgain.md)<!-- -->.

