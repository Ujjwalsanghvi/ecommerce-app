import { IAddress } from "./Address";
import { ImpOrder } from "./ImpOrder";
import { Transaction } from "./Transaction";

export interface AccountStatisticsProps {
  orders: ImpOrder[];
  addresses: IAddress[];
  transactions: Transaction[];
  walletBalance: number;
  isStatsOpen: boolean;
  selectedStat: string | null;
  onToggleStats: () => void;
  onStatClick: (statName: string) => void;
}