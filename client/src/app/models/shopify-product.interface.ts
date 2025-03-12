export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string | null;
  status: string;
  published_scope: string;
  tags: string;
  variants: ShopifyProductVariant[];
  images: ShopifyProductImage[];
  options: ShopifyProductOption[];
}

export interface ShopifyProductVariant {
  id: string;
  product_id: string;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string | null;
  fulfillment_service: string;
  inventory_management: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string | null;
  grams: number;
  image_id: string | null;
  weight: number;
  weight_unit: string;
  inventory_item_id: string;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
}

export interface ShopifyProductImage {
  id: string;
  product_id: string;
  position: number;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
  alt: string;
}

export interface ShopifyProductOption {
  id: string;
  product_id: string;
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyProductsResponse {
  products: ShopifyProduct[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage?: boolean;
    startCursor?: string;
    endCursor?: string;
  };
} 