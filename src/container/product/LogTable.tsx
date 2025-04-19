'use client'

import React from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import CustomizeTable from "@/components/table/customize-table";
import productApi from "@/axios-clients/auth_api/productAPI";
import { Product, ProductListResponse, ProductLog } from "@/types/ProductType";
import MenuActionTableProduct from "./MenuActionTableProduct";
import { format } from "path";

export default function LogTable({ props }: { props: ProductLog[] }) {
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const [total, setTotal] = React.useState(0);

    const tableHeaderTitle = [
        { id: "name", label: "Tên", align: "center" },
        { id: "phone", label: "Số điện thoại", align: "center", format: "phoneNumber" },
        { id: "address", label: "Địa chỉ", align: "center" },
        { id: "quantity", label: "Số lượng", align: "center" },
        { id: "type", label: "Nhập/Xuất", align: "center", format: "type" },
        { id: "createDate", label: "Thời gian", align: "center", format: "createDate" },
    ];

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

    return (
        <div>
            <CustomizeTable
                tableHeaderTitle={tableHeaderTitle}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                total={total}
                size={pageSize}
                page={page}
                data={props}
            />
        </div>
    );
}