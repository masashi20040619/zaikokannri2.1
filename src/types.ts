export type PrizeCategory =
  | "フィギュア"
  | "ぬいぐるみ"
  | "キーホルダー"
  | "雑貨"
  | "その他";

export interface PrizeImage {
  id: string;
  dataUrl: string; // base64
  name?: string;
}

export interface Prize {
  id: string;
  name: string;
  category: PrizeCategory;
  quantity: number;
  note?: string;
  images?: PrizeImage[];
  createdAt: number;
  updatedAt: number;
}
