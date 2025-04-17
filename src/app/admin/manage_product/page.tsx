import nameApi from "@/axios-clients/auth_api/exAPI";
import CustomizeTable from "@/components/table/customize-table";
import React from "react";

const ManageProductPage = () => {
  // Sample data for the table
  const data = [
    {
      id: 1,
      name: "Sản phẩm A",
      price: 100000,
      category: "Danh mục 1",
      status: "Còn hàng",
    },
    {
      id: 2,
      name: "Sản phẩm B",
      price: 200000,
      category: "Danh mục 2",
      status: "Hết hàng",
    },
    {
      id: 3,
      name: "Sản phẩm C",
      price: 150000,
      category: "Danh mục 1",
      status: "Còn hàng",
    },
  ];

  const [proDta, setProDta] = React.useState(data);

  const getOrderData = async () => {
    try {
      const res = await nameApi.getSomeThing();
      setProDta(data);
    } catch (error) {
      console.log(error);
    }
  };

  const tableHeader = [
    { id: "id", label: "ID", align: "center" },
    { id: "name", label: "Tên sản phẩm" },
    { id: "price", label: "Giá" },
    { id: "category", label: "Danh mục" },
    { id: "status", label: "Trạng thái" },
    { id: "action", label: "Hành động" },
  ];

  return (
    <div>
      {/* <CustomizeTable tableHeaderTitle={tableHeader} data={data} /> */}
    </div>
  );
};

export default ManageProductPage;
