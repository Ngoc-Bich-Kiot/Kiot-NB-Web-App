"use client";

import { Box, Button, TextField } from "@mui/material";
import CustomizeTable from "@/components/table/customize-table";
import React from "react";
import productApi from "@/axios-clients/auth_api/productAPI";
import { Product, ProductListResponse } from "@/types/ProductType";
import MenuActionTableProduct from "./MenuActionTableProduct";

export default function ProductTable() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRow, setSelectedRow] = React.useState<Product | null>(null);

  const tableHeaderTitle = [
    {
      id: "images",
      label: "Hình ảnh",
      align: "center",
      format: "images",
    },
    { id: "name", label: "Tên sản phẩm", align: "center" },
    { id: "category", label: "Loại", align: "center" },
    // { id: "originalPrice", label: "Giá gốc", align: "center", format: "price" },
    { id: "sourceOfProducts", label: "Nguồn nhập", align: "center" },
    { id: "sellingPrice", label: "Giá bán", align: "center", format: "price" },
    { id: "importCosts", label: "Giá nhập", align: "center", format: "price" },
    { id: "stockQuantity", label: "Số lượng tồn", align: "center" },
    {
      id: "isDeleted",
      label: "Trạng thái",
      align: "center",
      format: "deleted",
    },
  ];

  const fetchProducts = async () => {
    try {
      const data: ProductListResponse = await productApi.getProductList({
        SearchTerm: searchTerm,
        // PageIndex: page + 1,
        // PageSize: pageSize,
      });
      if (data) {
        const { items, totalItemsCount } = data;
        setProducts(items);
        setTotal(totalItemsCount);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, [page, pageSize, searchTerm]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const searchTool = (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center", px: 2, mb: 2 }}>
      <TextField
        size="small"
        label="Tìm kiếm sản phẩm"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchInputChange}
      />
      <Button variant="contained" color="primary">
        Thêm mới
      </Button>
    </Box>
  );

  const menuAction = (
    <MenuActionTableProduct
      id={selectedRow?.id as string}
      isDeleted={selectedRow?.isDeleted as boolean}
      onActionSuccess={fetchProducts}
    />
  );
  return (
    <div>
      <CustomizeTable
        tableHeaderTitle={tableHeaderTitle}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        total={total}
        size={pageSize}
        page={page}
        searchTool={searchTool}
        menuAction={menuAction}
        selectedData={(row: Product) => setSelectedRow(row)}
        data={products}
        title="Danh sách sản phẩm"
      />
    </div>
  );
}
