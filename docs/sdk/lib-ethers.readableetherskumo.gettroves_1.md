<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@kumodao/lib-ethers](./lib-ethers.md) &gt; [ReadableEthersKumo](./lib-ethers.readableetherskumo.md) &gt; [getTroves](./lib-ethers.readableetherskumo.gettroves_1.md)

## ReadableEthersKumo.getTroves() method

Get a slice from the list of Troves.

<b>Signature:</b>

```typescript
getTroves(params: TroveListingParams, overrides?: EthersCallOverrides): Promise<UserTrove[]>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  params | [TroveListingParams](./lib-base.trovelistingparams.md) | Controls how the list is sorted, and where the slice begins and ends. |
|  overrides | [EthersCallOverrides](./lib-ethers.etherscalloverrides.md) |  |

<b>Returns:</b>

Promise&lt;[UserTrove](./lib-base.usertrove.md)<!-- -->\[\]&gt;

Pairs of owner addresses and their Troves.
