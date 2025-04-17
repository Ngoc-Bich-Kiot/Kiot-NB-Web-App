export interface Product {
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

export interface ProductListResponse {
    items: Product[];
    totalItemsCount: number;
    pageSize: number;
    totalPagesCount: number;
    pageIndex: number;
    next: boolean;
    previous: boolean;
}