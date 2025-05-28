import CategoryTable from "@/container/category/CategoryTable";
import React from "react";

const ManageCategoryPage = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return (
        <div>
            <CategoryTable />
        </div>
    );
};

export default ManageCategoryPage;
