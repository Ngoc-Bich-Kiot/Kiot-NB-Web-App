export interface ProductImage {
  id: number;
  urlPath: string;
}

export interface ProductLog {
  id: number;
  productId: number;
  quantity: number;
  type: string;
  name: string;
  phone: string;
  address: string;
}
export interface Product {
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  sellingPrice: number;
  sourceOfProducts: string;
  importCosts: number;
  isDeleted: boolean;
  stockQuantity: number;
  status: string;
  images: ProductImage[];
  logs: ProductLog[];
}

export interface ProductListResponse {
  items: Product[];
  totalItemsCount: number;
  pageSize: number;
  totalPagesCount: number;
  pageIndex: number;
  next: boolean;
  previous: boolean;
}
