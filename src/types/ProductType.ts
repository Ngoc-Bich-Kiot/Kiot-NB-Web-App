export interface ProductImage {
  id?: string;
  urlPath: string;
}

export interface ProductLog {
  id: string;
  productId: string;
  quantity: number;
  type: string;
  name: string;
  phone: string;
  address: string;
  createDate: string;
}

export interface CreateProductFormInput {
  name: string;
  category: string;
  //originalPrice: number;
  sellingPrice: number;
  sourceOfProducts: string;
  userName: string;
  //phone: string;
  //address: string;
  importCosts: number;
  stockQuantity: number;
  unit: string;
  status: string;
  productImages: (File | string)[];
}

export interface EditProductFormInput {
  name: string;
  category: string;
  //originalPrice: number;
  sellingPrice: number;
  sourceOfProducts: string;
  importCosts: number;
  //stockQuantity: number;
  status: string;
  productImages: (File | string)[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  //originalPrice: number;
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
