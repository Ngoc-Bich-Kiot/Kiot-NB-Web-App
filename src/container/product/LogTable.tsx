'use client'

import React from "react";
import CustomizeTable from "@/components/table/customize-table";
import { ProductLog } from "@/types/ProductType";
import { Tabs, Tab, Box } from "@mui/material";

export default function LogTableTabs({ logs }: { logs: ProductLog[] }) {
    const [tabIndex, setTabIndex] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(5);

    const groupedLogs = React.useMemo(() => {
        return logs.reduce<Record<string, ProductLog[]>>((acc, log) => {
            const key = (log.type === "Import" || log.type === "Export") ? "Import/Export" : log.type;
            if (!acc[key]) acc[key] = [];
            acc[key].push(log);
            return acc;
        }, {});
    }, [logs]);

    const tabKeys = Object.keys(groupedLogs);

    const tabLabels: Record<string, string> = {
        "Import/Export": "Nhập / Xuất kho",
        "UpdatePrice": "Cập nhật giá",
    };

    const headerByType: Record<string, any[]> = {
        "Import/Export": [
            { id: "name", label: "Tên", align: "center" },
            { id: "phone", label: "Số điện thoại", align: "center", format: "phoneNumber" },
            { id: "address", label: "Địa chỉ", align: "center" },
            { id: "quantity", label: "Số lượng", align: "center" },
            { id: "type", label: "Nhập/Xuất", align: "center", format: "type" },
            { id: "createDate", label: "Thời gian", align: "center", format: "createDate" },
        ],
        "UpdatePrice": [
            { id: "oldOriginalPrice", label: "Giá vốn cũ", align: "center" },
            { id: "newOriginalPrice", label: "Giá vốn mới", align: "center" },
            { id: "oldSellingPrice", label: "Giá bán cũ", align: "center" },
            { id: "newSellingPrice", label: "Giá bán mới", align: "center" },
            { id: "oldImportCost", label: "Giá bán cũ", align: "center" },
            { id: "newImportCost", label: "Giá bán mới", align: "center" },
            { id: "createDate", label: "Thời gian", align: "center", format: "createDate" },
        ],
    };

    const currentTabKey = tabKeys[tabIndex];
    const data = groupedLogs[currentTabKey] || [];
    const headers = headerByType[currentTabKey] || [];

    const dataToDisplay = React.useMemo(() => {
        const start = page * pageSize;
        const end = start + pageSize;
        return data.slice(start, end);
    }, [data, page, pageSize]);

    const handleChangePage = (_: any, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setPageSize(parseInt(e.target.value, 10));
        setPage(0);
    };

    const handleTabChange = (_: any, newValue: number) => {
        setTabIndex(newValue);
        setPage(0);
    };

    return (
        <Box>
            <Tabs value={tabIndex} onChange={handleTabChange} sx={{ px: "16px" }}>
                {tabKeys.map((key) => (
                    <Tab key={key} label={tabLabels[key] || key} />
                ))}
            </Tabs>
            <Box mt={2}>
                <CustomizeTable
                    tableHeaderTitle={headers}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    total={data.length}
                    size={pageSize}
                    page={page}
                    data={dataToDisplay}
                />
            </Box>
        </Box>
    );
}
