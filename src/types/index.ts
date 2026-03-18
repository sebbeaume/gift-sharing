export type Gift = {
  id: string;
  name: string;
  link?: string;
  price?: number;
  status: 'suggested' | 'purchased';
}

export type Contribution = {
  id: string;
  amount: number;
  createdAt: string;
}

export type GiftEvent = {
  id: string;
  name: string;
  date: string;
  password: string;
  gifts: Gift[];
  contributions: Contribution[];
  createdAt: string;
}
