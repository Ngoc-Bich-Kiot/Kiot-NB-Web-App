import ManageUserTable from "@/container/user/ManageUserTable";
import React from "react";

const ManageUserPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div>
      <ManageUserTable />
    </div>
  );
};

export default ManageUserPage;
