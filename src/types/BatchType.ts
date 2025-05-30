export interface ProductImage {
  id: number;
  urlPath: string;
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductBatch {
  id: number;
  name: string;
  sellingPrice: number;
  importCosts: number;
  unit: string;
  isDeleted: boolean;
  categoryId: number;
  status: string;
  createDate: string;
  category: ProductCategory;
  images: ProductImage[];
  logs: any[];
}
