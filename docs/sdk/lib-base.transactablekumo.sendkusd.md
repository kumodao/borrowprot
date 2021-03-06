<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@kumodao/lib-base](./lib-base.md) &gt; [TransactableKumo](./lib-base.transactablekumo.md) &gt; [sendKUSD](./lib-base.transactablekumo.sendkusd.md)

## TransactableKumo.sendKUSD() method

Send KUSD tokens to an address.

<b>Signature:</b>

```typescript
sendKUSD(toAddress: string, amount: Decimalish): Promise<void>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  toAddress | string | Address of receipient. |
|  amount | [Decimalish](./lib-base.decimalish.md) | Amount of KUSD to send. |

<b>Returns:</b>

Promise&lt;void&gt;

## Exceptions

Throws [TransactionFailedError](./lib-base.transactionfailederror.md) in case of transaction failure.

