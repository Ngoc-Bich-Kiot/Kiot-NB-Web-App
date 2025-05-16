import ExcelExport from "@/container/export_excel/ExportExcel";
import React from "react";

const ExportExcelPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <main>
      <ExcelExport />
    </main>
  );
};

export default ExportExcelPage;
