"use client";
import orderApi from "@/axios-clients/order_api/orderAPI";
import CustomizeTable from "@/components/table/customize-table";
import { Order } from "@/types/OrderType";
import React from "react";
import { toast } from "react-toastify";
import MenuActionOrder from "../menu_action/Order/MenuActionOrder";

interface SearchToolProps {
  filter: any;
  setFilter: any;
}

const SearchTool: React.FC<SearchToolProps> = ({ filter, setFilter }) => {
  return (
    <div>
      <input type="text" placeholder="Search..." />
      <button>Search</button>
    </div>
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
    } catch (error) {
      toast.error("Có lỗi xay ra trong quá trình lấy danh sách đơn hàng");
    }
  };

  React.useEffect(() => {
    getOrders();
  }, [pageIndex, pageSize, filter]);

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
    { id: "orderDate", label: "Order Date", format: "date" },
    { id: "orderStatus", label: "Order Status", format: "orderStatus" },
    { id: "orderAmount", label: "Order Amount", format: "price" },
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
