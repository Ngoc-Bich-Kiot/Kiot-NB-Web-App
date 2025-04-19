export interface ProducType {
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  sellingPrice: number;
  sourceOfProducts: string;
  importCosts: number;
  stockQuantity: number;
  status: string;
  images: string[];
  logs: any[];
}

export interface ProductListType {
  items: ProducType[];
  totalItemsCount: number;
  pageSize: number;
  totalPagesCount: number;
  pageIndex: number;
  next: boolean;
  previous: boolean;
}
