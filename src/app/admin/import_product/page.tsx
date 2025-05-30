import ImportProduct from "@/container/ImportProduct/ImportProduct";
import React from "react";

const ImportProductPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <main>
      <ImportProduct />
    </main>
  );
};

export default ImportProductPage;
