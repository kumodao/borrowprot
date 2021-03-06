<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@kumodao/lib-base](./lib-base.md) &gt; [SendableKumo](./lib-base.sendablekumo.md) &gt; [unstakeUniTokens](./lib-base.sendablekumo.unstakeunitokens.md)

## SendableKumo.unstakeUniTokens() method

Withdraw Uniswap ETH/KUSD LP tokens from liquidity mining.

<b>Signature:</b>

```typescript
unstakeUniTokens(amount: Decimalish): Promise<SentKumoTransaction<S, KumoReceipt<R, void>>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  amount | [Decimalish](./lib-base.decimalish.md) | Amount of LP tokens to withdraw. |

<b>Returns:</b>

Promise&lt;[SentKumoTransaction](./lib-base.sentkumotransaction.md)<!-- -->&lt;S, [KumoReceipt](./lib-base.kumoreceipt.md)<!-- -->&lt;R, void&gt;&gt;&gt;

