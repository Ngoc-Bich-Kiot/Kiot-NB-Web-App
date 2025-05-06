import ManageOrderTable from "@/container/order/ManageOrderTable";
import React from "react";

const ManageOrderPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div>
      <ManageOrderTable />
    </div>
  );
};

export default ManageOrderPage;
