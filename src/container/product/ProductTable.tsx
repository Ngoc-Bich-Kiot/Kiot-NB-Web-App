"use client";

import React from "react";
import CustomizeTable from "@/components/table/customize-table";
import productApi from "@/axios-clients/auth_api/productAPI";
import { Product, ProductListResponse } from "@/types/ProductType";
import useDebounce from "@/hook/useDebounce";
import { useRouter } from "next/navigation";
import { Box, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import MenuActionTableProduct from "../menu_action/Product/MenuActionProduct";

interface SearchToolProps {
  filter: any;
  setFilter: any;
}

const SearchTool: React.FC<SearchToolProps> = ({ filter, setFilter }) => {
  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label="Tìm kiếm"
        variant="outlined"
        size="small"
        onChange={(e) => setFilter({ ...filter, SearchTerm: e.target.value })}
      />
    </Box>
  );
};

const ProductTable = () => {
  //Define the state for products
  const [products, setProducts] = React.useState<Product[]>([]);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [totalItemsCount, setTotalItemsCount] = React.useState<number>(0);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const router = useRouter();
  const [filter, setFilter] = React.useState<any>({ SearchTerm: "" });
  const debounce = useDebounce(filter, 0);

  //Call the API to get the products
  const getProducts = async () => {
    try {
      const res: any = await productApi.getProductList({
        ...filter,
        pageIndex,
        pageSize,
        totalItemsCount,
      });
      setProducts(res.items);
      setTotalItemsCount(res.totalItemsCount);
    } catch (error) {
      toast.error("Lấy sản phẩm thất bại");
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  React.useEffect(() => {
    getProducts();
  }, [pageIndex, pageSize, debounce]);

  //select data
  const selectedData = (row: any) => {
    setSelectedRow(row);
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageIndex(0);
  };

  const tableHeaderTitle = [
    {
      id: "images",
      label: "Hình ảnh",
      align: "center",
      format: "images",
    },
    { id: "name", label: "Tên sản phẩm", align: "center" },
    //{ id: "category", label: "Loại", align: "center" },
    //{ id: "sourceOfProducts", label: "Nguồn nhập", align: "center" },
    { id: "sellingPrice", label: "Giá bán", align: "center", format: "price" },
    { id: "importCosts", label: "Giá nhập", align: "center", format: "price" },
    { id: "stockQuantity", label: "Số lượng tồn", align: "center", format: "quantity" },
    { id: "unit", label: "Đơn vị", align: "center" },
    {
      id: "isDeleted",
      label: "Trạng thái",
      align: "center",
      format: "deleted",
    },
  ];

  const createProduct = () => {
    return (
      <Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => router.push("/admin/manage_product/create")}
        >
          Thêm sản phẩm
        </Button>
      </Box>
    );
  }

  const menuAction = (
    <MenuActionTableProduct
      id={selectedRow?.id as string}
      isDeleted={selectedRow?.isDeleted as boolean}
      onActionSuccess={getProducts}
    />
  );
  return (
    <div>
      <CustomizeTable
        tableHeaderTitle={tableHeaderTitle}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        total={totalItemsCount}
        size={pageSize}
        page={pageIndex}
        searchTool={<SearchTool filter={filter} setFilter={setFilter} />}
        menuAction={menuAction}
        eventAction={createProduct()}
        selectedData={(row: Product) => setSelectedRow(row)}
        data={products}
        title="Danh sách sản phẩm"
      />
    </div>
  );
}
export default ProductTable;