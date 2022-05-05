import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import {
  Decimal,
  FrontendStatus,
  KUMOStake,
  Trove,
  KumoStoreState,
  UserTrove,
  UserTroveStatus,
  StabilityDeposit
} from "@kumodao/lib-base";
import { useKumoSelector } from "@kumodao/lib-react";


type StabilityDepositChange = {
  depositKUSD: Decimal | undefined;
  withdrawKUSD: Decimal | undefined;
  withdrawAllKUSD: boolean;
};

type DashboardContextValue = {
  numberOfTroves: number;
  price: Decimal;
  kusdInStabilityPool: Decimal;
  total: Trove;
  borrowingRate: Decimal;
  totalStakedKUMO: Decimal;
  kickbackRate: Decimal | null;
  frontend: FrontendStatus;
  kumoStake: KUMOStake;
  selectedTrove: Trove;
  vaults: vaultsType;
  depositKusd: StabilityDepositChange;
  handleDepositKusd: (
    depositKUSD: Decimal | undefined,
    withdrawKUSD: Decimal | undefined,
    withdrawAllKUSD: boolean
  ) => void;
  openTroveT: (type: string, collateral: Decimal, borrowAmount: Decimal, price: Decimal) => void;
  adjustTroveT: (
    type: string,
    collateral: Decimal,
    netDebt: Decimal,
    collateralRatio: Decimal
  ) => void;
  openStabilityDeposit: (type: string, amount: Decimal) => void;
};

type vaultsType = Array<{
  type: string;
  collateralRatio: Decimal;
  troveStatus: UserTroveStatus;
  stabilityStatus: Boolean;
  trove: UserTrove;
  stabilityDeposit: StabilityDeposit;
}>;

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

const select = ({
  trove,
  numberOfTroves,
  price,
  total,
  kusdInStabilityPool,
  borrowingRate,
  redemptionRate,
  totalStakedKUMO,
  frontend,
  kumoStake,
  stabilityDeposit
}: KumoStoreState) => ({
  trove,
  numberOfTroves,
  price,
  total,
  kusdInStabilityPool,
  borrowingRate,
  redemptionRate,
  totalStakedKUMO,
  frontend,
  kumoStake,
  stabilityDeposit,
  kickbackRate: frontend.status === "registered" ? frontend.kickbackRate : null
});

export const DashboardProvider: React.FC = ({ children }) => {
  const {
    numberOfTroves,
    price,
    kusdInStabilityPool,
    total,
    borrowingRate,
    totalStakedKUMO,
    kickbackRate,
    frontend,
    kumoStake,
    trove,
    stabilityDeposit
  } = useKumoSelector(select);
  const [vaults, setVaults] = useState<vaultsType>([
    {
      type: "bct",
      collateralRatio: Decimal.ZERO,
      troveStatus: "nonExistent",
      stabilityStatus: true,
      trove: trove,
      stabilityDeposit: stabilityDeposit
    },
    {
      type: "mco2",
      collateralRatio: Decimal.ZERO,
      troveStatus: "nonExistent",
      stabilityStatus: true,
      trove: trove,
      stabilityDeposit: stabilityDeposit
    }
  ]);
  const [selectedTrove] = useState<UserTrove>(trove);
  const [depositKusd, setDepositKusd] = useState<StabilityDepositChange>({
    depositKUSD: undefined,
    withdrawKUSD: undefined,
    withdrawAllKUSD: false
  });

  useEffect(() => {
    const { status } = trove;
    if (status === "open") {
      const updatedVaults =
        vaults &&
        vaults.map(vault => {
          if (vault.troveStatus === "nonExistent") {
            if (stabilityDeposit.isEmpty === true) {
              const updatedTrove = new UserTrove(
                vault.trove.ownerAddress,
                "nonExistent",
                Decimal.ZERO,
                Decimal.ZERO
              );
              const updatedStabilityDeposit = new StabilityDeposit(
                Decimal.ZERO,
                Decimal.ZERO,
                Decimal.ZERO,
                Decimal.ZERO,
                ""
              );
              return {
                ...vault,
                stabilityStatus: true,
                stabilityDiff: Decimal.ZERO,
                collateralRatio: Decimal.ZERO,
                trove: updatedTrove,
                stabilityDeposit: updatedStabilityDeposit
              };
            }
          }
          return vault;
        });
      setVaults(updatedVaults);
    }
  }, [trove, stabilityDeposit, vaults]);

  const handleDepositKusd = (
    depositKUSD: Decimal | undefined,
    withdrawKUSD: Decimal | undefined,
    withdrawAllKUSD: boolean
  ) => {
    setDepositKusd({ depositKUSD, withdrawKUSD, withdrawAllKUSD });
  };

  const adjustTroveT = (
    type: string,
    collateral: Decimal,
    netDebt: Decimal,
    price: Decimal
  ): void => {
    const updatedVaults =
      vaults &&
      vaults.map(vault => {
        if (vault.type === type) {
          const updatedTrove = new UserTrove(vault.trove.ownerAddress, "open", collateral, netDebt);
          const collateralRatio = updatedTrove.collateralRatio(price);
          return { ...vault, collateralRatio: collateralRatio, trove: updatedTrove };
        }
        return vault;
      });
    setVaults(updatedVaults);
  };

  const openTroveT = (
    type: string,
    collateral: Decimal,
    borrowAmount: Decimal,
    price: Decimal
  ): void => {
    const updatedVaults =
      vaults &&
      vaults.map(vault => {
        if (vault.type === type) {
          const updatedTrove = new UserTrove(
            vault.trove.ownerAddress,
            "open",
            collateral,
            borrowAmount
          );
          const collateralRatio = updatedTrove.collateralRatio(price);
          return {
            ...vault,
            troveStatus: updatedTrove.status,
            collateralRatio: collateralRatio,
            trove: updatedTrove
          };
        }
        return vault;
      });
    setVaults(updatedVaults);
  };
  const openStabilityDeposit = (type: string, amount: Decimal): void => {
    const updatedVaults =
      vaults &&
      vaults.map(vault => {
        if (vault.troveStatus === "open" && vault.type === type) {
          const updatedStabilityDeposit = new StabilityDeposit(
            amount,
            amount,
            Decimal.ZERO,
            Decimal.ZERO,
            "0x0000000000000000000000000000000000000000"
          );
          return {
            ...vault,
            stabilityStatus: false,
            stabilityDeposit: updatedStabilityDeposit
          };
        }
        return vault;
      });
    setVaults(updatedVaults);
  };

  return (
    <DashboardContext.Provider
      value={{
        numberOfTroves,
        price,
        kusdInStabilityPool,
        total,
        borrowingRate,
        totalStakedKUMO,
        kickbackRate,
        frontend,
        kumoStake,
        depositKusd,
        handleDepositKusd,
        selectedTrove: selectedTrove ? selectedTrove : trove,
        vaults,
        openTroveT,
        adjustTroveT,
        openStabilityDeposit
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const dashboardContext = useContext(DashboardContext);

  if (!dashboardContext) {
    throw new Error("You must provide a DashboardContext via LiquityProvider");
  }

  return dashboardContext;
};
