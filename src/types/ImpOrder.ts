export interface ImpOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  items: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
}