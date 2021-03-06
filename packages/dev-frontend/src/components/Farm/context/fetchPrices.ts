import { Decimal } from "@kumodao/lib-base";

type UniswapResponse = {
  data?: {
    bundle: {
      ethPrice: string;
    } | null;
    token: {
      derivedETH: string;
    } | null;
    pair: {
      reserveUSD: string;
      totalSupply: string;
    } | null;
  };
  errors?: Array<{ message: string }>;
};

const uniswapQuery = (kumoTokenAddress: string, uniTokenAddress: string) => `{
  token(id: "${kumoTokenAddress.toLowerCase()}") {
    derivedETH
  },
  bundle(id: 1) {
    ethPrice
  },
  pair(id: "${uniTokenAddress.toLowerCase()}") {
    totalSupply
    reserveUSD
  }
}`;

export async function fetchPrices(kumoTokenAddress: string, uniTokenAddress: string) {
  const response = await window.fetch("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: uniswapQuery(kumoTokenAddress, uniTokenAddress),
      variables: null
    })
  });

  if (!response.ok) {
    return Promise.reject("Network error connecting to Uniswap subgraph");
  }

  const { data, errors }: UniswapResponse = await response.json();

  if (errors) {
    return Promise.reject(errors);
  }

  if (
    typeof data?.token?.derivedETH === "string" &&
    typeof data?.pair?.reserveUSD === "string" &&
    typeof data?.pair?.totalSupply === "string" &&
    typeof data?.bundle?.ethPrice === "string"
  ) {
    const ethPriceUSD = Decimal.from(data.bundle.ethPrice);
    const kumoPriceUSD = Decimal.from(data.token.derivedETH).mul(ethPriceUSD);
    const uniLpPriceUSD = Decimal.from(data.pair.reserveUSD).div(
      Decimal.from(data.pair.totalSupply)
    );

    return { kumoPriceUSD, uniLpPriceUSD };
  }

  return Promise.reject("Uniswap doesn't have the required data to calculate yield");
}
