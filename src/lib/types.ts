export type Category = 'hoodies' | 'tees' | 'pants' | 'accessories';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'ONE SIZE';

export interface ProductColor {
  name: string;
  slug: string;
  hex: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  handle: string;
  name: string;
  category: Category;
  /** Price in euro cents, VAT included. */
  price: number;
  drop: string;
  releasedAt: string;
  isNew: boolean;
  summary: string;
  description: string;
  fit: string;
  material: string;
  care: string[];
  colors: ProductColor[];
  sizes: Size[];
  /** stock[colorSlug][size] = units available */
  stock: Record<string, Partial<Record<Size, number>>>;
  images: ProductImage[];
  /** Optional photos per colour slug; falls back to `images`. */
  colorImages?: Record<string, ProductImage[]>;
  related: string[];
}

/** Lightweight shape sent to client components (cards, search, wishlist). */
export interface ProductSummary {
  handle: string;
  name: string;
  category: Category;
  price: number;
  drop: string;
  isNew: boolean;
  soldOut: boolean;
  releasedAt: string;
  url: string;
  colors: ProductColor[];
  sizes: Size[];
  /** Sizes with stock in at least one colour. */
  availableSizes: Size[];
  images: ProductImage[];
}

export interface CartLine {
  /** `${handle}:${color}:${size}` */
  key: string;
  handle: string;
  name: string;
  url: string;
  image: string;
  color: string;
  colorName: string;
  size: Size;
  price: number;
  quantity: number;
  /** Stock at the time the line was added; server re-checks at checkout. */
  maxQuantity: number;
}
