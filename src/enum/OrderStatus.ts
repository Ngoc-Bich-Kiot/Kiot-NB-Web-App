export const OrderStatus = {
  PENDING: "Pending",
  PAID: "Paid",
  CANCELED: "Canceled",
};

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];
