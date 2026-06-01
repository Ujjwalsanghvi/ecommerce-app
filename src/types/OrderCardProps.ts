import { ImpOrder } from "./ImpOrder";

export interface OrderCardProps {
  order: ImpOrder;
  getStatusColor: (status: string) => string;
}