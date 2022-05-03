import React from "react";
import { Flex } from "theme-ui";

import { KumoStoreState } from "@liquity/lib-base";
import { useKumoSelector } from "@liquity/lib-react";

const selector = ({ remainingLiquidityMiningKUMOReward }: KumoStoreState) => ({
  remainingLiquidityMiningKUMOReward
});

export const RemainingKUMO: React.FC = () => {
  const { remainingLiquidityMiningKUMOReward } = useKumoSelector(selector);

  return (
    <Flex sx={{ mr: 2, fontSize: 2, fontWeight: "medium" }}>
      {remainingLiquidityMiningKUMOReward.prettify(0)} KUMO remaining
    </Flex>
  );
};
