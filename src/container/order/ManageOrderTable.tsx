"use client";
import orderApi from "@/axios-clients/order_api/orderAPI";
import CustomizeTable from "@/components/table/customize-table";
import useDebounce from "@/hook/useDebounce";
import { Order } from "@/types/OrderType";
import { Box, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { toast } from "react-toastify";
import MenuActionOrder from "../menu_action/Order/MenuActionOrder";
import CreateOrder from "./popup/CreateOrder";
import { font_size } from "@/styles/config-file";
import IntroTour from "@/components/intro/IntroTour";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
        id="search-order"
        onChange={(e) => setFilter({ ...filter, SearchTerm: e.target.value })}
      />
    </Box>
  );
};

const orderTableIntroSteps = [
  {
    element: "#intro-order-table",
    title: "Bảng đơn hàng",
    intro: "Đây là danh sách các đơn hàng đã tạo.",
  },
  {
    element: "#search-order",
    title: "Thanh tìm kiếm",
    intro: "Nhập vào đây để tìm kiếm đơn hàng",
  },
  {
    element: "#menu-action",
    title: "Nút hành động",
    intro: "Nhấn vào đây để thực hiện các hành động trên đơn hàng đã chọn.",
  },
  {
    element: "#create-order-btn",
    title: "Tạo đơn hàng",
    intro: "Nhấn vào đây để thêm đơn hàng mới.",
  },
];


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
    { id: "name", label: "Khách hàng" },
    { id: "phone", label: "Điện thoại" },
    { id: "orderDate", label: "Ngày đặt", format: "date" },
    { id: "orderStatus", label: "Trạng thái", format: "orderStatus", introId: "order-status-header" },
    { id: "orderAmount", label: "Đơn giá", format: "price" },
  ];

  //Event action
  const CreateOrderAction = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          id="create-order-btn"
          sx={(theme) => ({
            [theme.breakpoints.down("mobile")]: {
              fontSize: 10,
            },
          })}
        >
          Tạo đơn hàng
        </Button>
        <IntroTour
          steps={orderTableIntroSteps}
          buttonContent={
            <InfoOutlinedIcon sx={{ cursor: 'pointer' }} />
          }
        />
      </Box>
    );
  };

  //Handle open create order popup
  const [openCreateOrder, setOpenCreateOrder] = React.useState(false);
  const handleClickOpen = () => {
    setOpenCreateOrder(true);
  };
  const handleClose = () => {
    setOpenCreateOrder(false);
  };

  return (
    <div>
      <CreateOrder
        open={openCreateOrder}
        handleClose={handleClose}
        fetchData={getOrders}
      />
      <CustomizeTable
        data={orders}
        tableHeaderTitle={tableHeader}
        title="Quản lý đơn hàng"
        menuAction={
          <MenuActionOrder
            orderData={selectedRow}
            fetchData={getOrders}
            onOpenDetail={selectedData}
            introId="menu-action"
          />
        }
        eventAction={<CreateOrderAction />}
        page={pageIndex}
        size={pageSize}
        total={totalItemsCount}
        selectedData={selectedData}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        searchTool={<SearchTool filter={filter} setFilter={setFilter} />}
        tableContainerId="intro-order-table"
      />
    </div>
  );
};

export default ManageOrderTable;
