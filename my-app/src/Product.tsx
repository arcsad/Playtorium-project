export interface Product {
  name: string;
  category: string;
  price: number;
}

export interface Campaign {
  campaign: string;
  category: string;
  discount: number;
  xAmount?: number;
  yAmount?: number;
  itemCategory?: string;
}