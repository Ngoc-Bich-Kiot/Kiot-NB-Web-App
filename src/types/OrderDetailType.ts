interface Product {
  id: number;
  name: string;
  sellingPrice: number;
}

interface OrderInf {
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
  type: string;
  createDate: string | null;
  name: string;
  phone: string;
  address: string;
}

export interface OrderDetailType {
  id: number;
  orderAmount: number;
  orderDate: string;
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  orderDetails: OrderInf[];
  logs: Log[];
}
