import SourceTable from "@/container/sourceOfProduct/sourceTable";
import { Source } from "@mui/icons-material";
import React from "react";

const ManageSourcePage = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return (
        <div>
            <SourceTable />
        </div>
    );
};

export default ManageSourcePage;
