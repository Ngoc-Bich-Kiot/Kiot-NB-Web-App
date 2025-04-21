"use client";
import orderApi from "@/axios-clients/order_api/orderAPI";
import CustomizeTable from "@/components/table/customize-table";
import useDebounce from "@/hook/useDebounce";
import { Order } from "@/types/OrderType";
import { Box, TextField } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import MenuActionOrder from "../menu_action/Order/MenuActionOrder";

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

const ManageOrderTable = () => {
  //Define the state for orders
  const [orders, setOrders] = React.useState<Order>();
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const [filter, setFilter] = React.useState<any>({ SearchTerm: "" });
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [totalItemsCount, setTotalItemsCount] = React.useState<number>(0);
  const debounce = useDebounce(filter, 1000);

  //Call the API to get the orders
  const getOrders = async () => {
    try {
      const res: any = await orderApi.getListOrder({
        ...filter,
        pageIndex,
        pageSize,
        totalItemsCount,
      });
      setOrders(res.items);
      setTotalItemsCount(res.totalItemsCount);
    } catch (error) {
      toast.error("Có lỗi xay ra trong quá trình lấy danh sách đơn hàng");
    }
  };

  React.useEffect(() => {
    getOrders();
  }, [pageIndex, pageSize, debounce]);

  //select data
  const selectedData = (row: any) => {
    setSelectedRow(row);
  };

  //Handle pagination
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

  //TableHeader
  const tableHeader = [
    { id: "orderDate", label: "Ngày đặt", format: "date" },
    { id: "orderStatus", label: "Trạng thái", format: "orderStatus" },
    { id: "orderAmount", label: "Đơn giá", format: "price" },
  ];

  return (
    <div>
      <CustomizeTable
        data={orders}
        tableHeaderTitle={tableHeader}
        title="Quản lý đơn hàng"
        menuAction={
          <MenuActionOrder
            orderData={selectedRow}
            fetchData={getOrders}
            onOpenDetail={selectedData}
          />
        }
        page={pageIndex}
        size={pageSize}
        total={totalItemsCount}
        selectedData={selectedData}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        searchTool={<SearchTool filter={filter} setFilter={setFilter} />}
      />
    </div>
  );
};

export default ManageOrderTable;
