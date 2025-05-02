import ProductTable from "@/container/product/ProductTable";
import React from "react";

const ManageProductPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div>
      <ProductTable />
    </div>
  );
};

export default ManageProductPage;
