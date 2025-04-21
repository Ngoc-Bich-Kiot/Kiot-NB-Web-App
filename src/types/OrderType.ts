interface Product {
  id: number;
  name: string;
  sellingPrice: number;
}

export interface OrderDetail {
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: Product;
}

interface Log {
  id: number;
  productId: number;
  quantity: number;
  type: "Export" | "Import" | string;
  createDate: string | null;
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  id: number;
  orderAmount: number;
  orderDate: string;
  orderStatus: string;
  orderDetails: OrderDetail[];
  logs: Log[];
}
