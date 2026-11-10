export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: 'customer' | 'admin';
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  is_active: boolean;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  is_active: boolean;
}

export interface ProductImage {
  id: number;
  product_id: number;
  path: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  color?: string | null;
  ram?: string | null;
  storage?: string | null;
  price: number | string;
  compare_price?: number | string | null;
  stock: number;
  sku?: string | null;
  is_active: boolean;
}

export interface Product {
  id: number;
  category_id?: number | null;
  brand_id?: number | null;
  name: string;
  slug: string;
  description?: string | null;
  specifications?: string | null;
  price: number | string;
  compare_price?: number | string | null;
  stock: number;
  sku?: string | null;
  processor?: string | null;
  display?: string | null;
  camera?: string | null;
  battery?: string | null;
  os?: string | null;
  is_active: boolean;
  is_featured: boolean;
  views?: number;
  category?: Category | null;
  brand?: Brand | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  primary_image_url?: string | null;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  product_variant_id?: number | null;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
}

export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state?: string | null;
  postal_code?: string | null;
  country: string;
  is_default: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id?: number | null;
  product_variant_id?: number | null;
  product_name: string;
  variant_info?: string | null;
  price: number | string;
  quantity: number;
  total: number | string;
}

export interface Payment {
  id: number;
  order_id: number;
  method: string;
  amount: number | string;
  status: string;
  reference?: string | null;
  screenshot?: string | null;
  paid_at?: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  address_id?: number | null;
  subtotal: number | string;
  delivery_fee: number | string;
  total: number | string;
  status: string;
  payment_method: string;
  payment_status: string;
  notes?: string | null;
  cancelled_at?: string | null;
  created_at?: string;
  items: OrderItem[];
  address?: Address | null;
  payments?: Payment[];
  user?: User;
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
