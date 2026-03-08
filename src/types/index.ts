export type Gift = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  status: 'suggested' | 'purchased';
}

export type GiftEvent = {
  id: string;
  name: string;
  date: string;
  password: string;
  gifts: Gift[];
  createdAt: string;
}
