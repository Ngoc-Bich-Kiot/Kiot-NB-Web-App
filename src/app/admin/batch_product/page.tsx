import TableBatch from "@/container/ManageBatch/TableBatch";
import React from "react";

const BatchProductPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <main>
      <TableBatch />
    </main>
  );
};

export default BatchProductPage;
