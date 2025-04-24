/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { alpha, styled } from "@mui/material/styles";
import React, { ReactNode } from "react";
import moment from "moment"; // Import moment.js for date formatting
import { colors, font_weight } from "@/styles/config-file";
import { OrderStatus } from "@/enum/OrderStatus";

interface CTbaleProps {
  tableHeaderTitle?: any;
  data?: any;
  title?: string;
  menuAction?: any;
  selectedData?: any;
  searchTool?: ReactNode;
  eventAction?: ReactNode;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  total: number;
  size: number;
  page: number;
}

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
  "& .MuiTableRow-root": {
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      transform: "translateY(-2px)",
    },
  },
}));

const CustomizeTable: React.FC<CTbaleProps> = ({
  data,
  tableHeaderTitle,
  title,
  menuAction,
  selectedData,
  searchTool,
  handleChangePage,
  handleChangeRowsPerPage,
  eventAction,
  page,
  size,
  total,
}) => {
  //Declare
  const theme = useTheme();

  //func
  function getNestedValue(obj: any, path: any) {
    return path
      .split(".")
      .reduce((acc: any, part: any) => acc && acc[part], obj);
  }

  function formatValue(value: any, column: any) {
    //date time
    if (column.format && column.format == "date") {
      if (value) {
        return moment(value).format("DD/MM/YYYY");
      }
      return "-";
    }
    //role
    if (column.format && column.format == "role") {
      switch (value) {
        case "Customer":
          return "Khách hàng";
        case "Admin":
          return "Quản trị viên";
        case "Manager":
          return "Quản lý";
        case "Staff":
          return "Nhân viên";
        default:
          return "-";
      }
    }

    //status
    if (column.format && column.format == "status") {
      switch (value) {
        case "Active":
          return (
            <Chip
              label="Hoạt động"
              sx={{
                bgcolor: colors.green_200,
                color: colors.green_800,
                fontWeight: font_weight.semiBold,
              }}
            />
          );
        case "UnActive":
          return (
            <Chip
              label="Không hoạt động"
              sx={{
                bgcolor: colors.red_200,
                color: colors.red_600,
                fontWeight: font_weight.semiBold,
              }}
            />
          );
        default:
          return "-";
      }
    }

    //image
    if (column.format && column.format === "images") {
      if (Array.isArray(value) && value.length > 0) {
        return (
          <img
            src={value[0]?.urlPath}
            alt="product"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        );
      }
    }

    //price
    if (column.format && column.format == "price") {
      if (value === undefined || value === null) return "N/A";
      return value.toLocaleString("vi-VN") + " VND";
    }

    //date
    if (column.format && column.format == "createDate") {
      if (value) {
        return moment(value).utcOffset(7).format("DD/MM/YYYY HH:mm:ss");
      }
    }

    //phoneNumber
    if (column.format && column.format === "phoneNumber") {
      if (!value) return "-";

      const digits = value.replace(/\D/g, "");

      if (digits.length === 10) {
        return `${digits.slice(0, 4)}.${digits.slice(4, 7)}.${digits.slice(7)}`;
      }

      return digits;
    }

    //quantity
    if (column.format && column.format === "quantity") {
      if (value) {
        return value.toLocaleString("vi-VN");
      }
    }

    //Import&Export
    if (column.format && column.format === "type") {
      switch (value) {
        case "Import":
          return "Nhập hàng";
        case "Export":
          return "Xuất hàng";
        default:
          return "-";
      }
    }

    //isDeleted
    if (column.format && column.format === "deleted") {
      switch (value) {
        case true:
          return (
            <Chip
              label="Không khả dụng"
              sx={{
                bgcolor: colors.red_200,
                color: colors.red_800,
                fontWeight: font_weight.semiBold,
              }}
            />
          );
        case false:
          return (
            <Chip
              label="Đang khả dụng"
              sx={{
                bgcolor: colors.green_200,
                color: colors.green_800,
                fontWeight: font_weight.semiBold,
              }}
            />
          );
        default:
          return "-";
      }
    }

    //Order status
    if (column.format && column.format === "orderStatus") {
      switch (value) {
        case OrderStatus.PENDING:
          return (
            <Chip
              label="Chờ xử lý"
              sx={{
                bgcolor: colors.yellow_200,
                color: colors.yellow_800,
                fontWeight: font_weight.semiBold,
              }}
            />
          );
        case OrderStatus.PAID:
          return (
            <Chip
              label="Đã thanh toán"
              sx={{
                bgcolor: colors.green_200,
                color: colors.green_800,
                fontWeight: font_weight.semiBold,
              }}
            />
          );
        case OrderStatus.CANCELED:
          return (
            <Chip
              label="Đã hủy"
              sx={{
                bgcolor: colors.red_200,
                color: colors.red_800,
                fontWeight: font_weight.semiBold,
              }}
            />
          );
        default:
          return "-";
      }
    }

    return value;
  }

  return (
    <Box sx={{ minWidth: "auto", mx: "auto", p: 2, width: "auto" }}>
      <StyledCard>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CardHeader
            title={
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {title}
              </Typography>
            }
          />
          <Box sx={{ pr: 2 }}>{eventAction}</Box>
        </Box>
        <Box>{searchTool}</Box>
        <CardContent>
          <StyledTableContainer sx={{ minWidth: 650 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  {tableHeaderTitle?.map((column: any) => (
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      key={column.id}
                      align={column.align || "left"}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((row: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{page * size + index + 1}</TableCell>
                    {tableHeaderTitle.map((column: any) => (
                      <TableCell key={column.id} align={column.align || "left"}>
                        {/* {getNestedValue(row, column.id)
                          ? formatValue(getNestedValue(row, column.id), column)
                          : "-"} */}
                        {formatValue(getNestedValue(row, column.id), column)}
                      </TableCell>
                    ))}
                    <TableCell
                      onClick={() => selectedData && selectedData(row)}
                    >
                      {menuAction}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={total ?? 0}
              rowsPerPage={size ?? 10}
              page={page ?? 0}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số hàng trên trang"
              labelDisplayedRows={({ from, to, count }) => {
                return `${from}–${to} trên ${
                  count !== -1 ? count : `nhiều hơn ${to}`
                }`;
              }}
            />
          </StyledTableContainer>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default CustomizeTable;
