'use client'

import React from "react";
import CustomizeTable from "@/components/table/customize-table";
import { ProductLog } from "@/types/ProductType";

export default function LogTable({ props }: { props: ProductLog[] }) {
    const [page, setPage] = React.useState(0); // Page index
    const [pageSize, setPageSize] = React.useState(5);

    const dataToDisplay = React.useMemo(() => {
        const start = page * pageSize;
        const end = start + pageSize;
        return props.slice(start, end);
    }, [props, page, pageSize]);

    React.useEffect(() => {
        setPage(0);
    }, [props]);

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
                total={props.length}
                size={pageSize}
                page={page}
                data={dataToDisplay}
            />
        </div>
    );
}
