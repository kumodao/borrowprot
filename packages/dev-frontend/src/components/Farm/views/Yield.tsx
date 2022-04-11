import React, { useEffect, useState } from "react";
import { Card, Paragraph, Text } from "theme-ui";
import { Decimal, LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { InfoIcon } from "../../InfoIcon";
import { useLiquity } from "../../../hooks/LiquityContext";
import { Badge } from "../../Badge";
import { fetchPrices } from "../context/fetchPrices";

const selector = ({
  remainingLiquidityMiningKUMOReward,
  totalStakedUniTokens
}: LiquityStoreState) => ({
  remainingLiquidityMiningKUMOReward,
  totalStakedUniTokens
});

export const Yield: React.FC = () => {
  const {
    liquity: {
      connection: { addresses, liquidityMiningKUMORewardRate }
    }
  } = useLiquity();

  const { remainingLiquidityMiningKUMOReward, totalStakedUniTokens } = useLiquitySelector(selector);
  const [kumoPrice, setKumoPrice] = useState<Decimal | undefined>(undefined);
  const [uniLpPrice, setUniLpPrice] = useState<Decimal | undefined>(undefined);
  const hasZeroValue = remainingLiquidityMiningKUMOReward.isZero || totalStakedUniTokens.isZero;
  const kumoTokenAddress = addresses["kumoToken"];
  const uniTokenAddress = addresses["uniToken"];
  const secondsRemaining = remainingLiquidityMiningKUMOReward.div(liquidityMiningKUMORewardRate);
  const daysRemaining = secondsRemaining.div(60 * 60 * 24);

  useEffect(() => {
    (async () => {
      try {
        const { kumoPriceUSD, uniLpPriceUSD } = await fetchPrices(kumoTokenAddress, uniTokenAddress);
        setKumoPrice(kumoPriceUSD);
        setUniLpPrice(uniLpPriceUSD);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [kumoTokenAddress, uniTokenAddress]);

  if (hasZeroValue || kumoPrice === undefined || uniLpPrice === undefined) return null;

  const remainingKumoInUSD = remainingLiquidityMiningKUMOReward.mul(kumoPrice);
  const totalStakedUniLpInUSD = totalStakedUniTokens.mul(uniLpPrice);
  const yieldPercentage = remainingKumoInUSD.div(totalStakedUniLpInUSD).mul(100);

  if (yieldPercentage.isZero) return null;

  return (
    <Badge>
      <Text>
        {daysRemaining?.prettify(0)} day yield {yieldPercentage.toString(2)}%
      </Text>
      <InfoIcon
        tooltip={
          <Card variant="tooltip" sx={{ minWidth: ["auto", "352px"] }}>
            <Paragraph>
              An <Text sx={{ fontWeight: "bold" }}>estimate</Text> of the KUMO return on staked UNI
              LP tokens. The farm runs for 6-weeks, and the return is relative to the time remaining.
            </Paragraph>
            <Paragraph sx={{ fontSize: "12px", fontFamily: "monospace", mt: 2 }}>
              ($KUMO_REWARDS / $STAKED_UNI_LP) * 100 ={" "}
              <Text sx={{ fontWeight: "bold" }}> Yield</Text>
            </Paragraph>
            <Paragraph sx={{ fontSize: "12px", fontFamily: "monospace" }}>
              ($
              {remainingKumoInUSD.shorten()} / ${totalStakedUniLpInUSD.shorten()}) * 100 =
              <Text sx={{ fontWeight: "bold" }}> {yieldPercentage.toString(2)}%</Text>
            </Paragraph>
          </Card>
        }
      ></InfoIcon>
    </Badge>
  );
};
