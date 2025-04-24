"use client";
import orderApi from "@/axios-clients/order_api/orderAPI";
import { OrderStatus } from "@/enum/OrderStatus";
import { colors, font_weight } from "@/styles/config-file";
import { OrderDetailType } from "@/types/OrderDetailType";
import {
  Box,
  Chip,
  Grid2,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { toast } from "react-toastify";

interface DetailOrderProps {
  orderId: string;
}

const DetailOrder: React.FC<DetailOrderProps> = ({ orderId }) => {
  //define state
  const [orderDetailData, setOrderDetailData] =
    React.useState<OrderDetailType>();

  //call api to get order detail
  const getOrderDetail = async () => {
    try {
      const res: any = await orderApi.getOrderDetail(orderId);
      setOrderDetailData(res);
      console.log(res);
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình lấy chi tiết đơn hàng");
    }
  };

  React.useEffect(() => {
    getOrderDetail();
  }, []);

  //status format
  const statusFormat = (status?: string) => {
    switch (status) {
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
  };

  //Header title
  const headerTitle = [
    { id: 1, label: "#" },
    { id: 2, label: "Tên sản phẩm" },
    { id: 3, label: "Đơn giá" },
    { id: 4, label: "Số lượng" },
    { id: 5, label: "Thành tiền" },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={4}>
        <Grid2 container spacing={3}>
          <Grid2 size={4}>
            <Paper
              component={Box}
              sx={{
                p: 2,
                borderRadius: 2,
              }}
            >
              <Stack spacing={4}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: font_weight.semiBold }}
                  >
                    Chi tiết đơn hàng
                  </Typography>
                  <Box>{statusFormat(orderDetailData?.orderStatus)}</Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Khách hàng:
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.gray_600 }}>
                    {orderDetailData?.name ?? "-"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Địa chỉ:
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.gray_600 }}>
                    {orderDetailData?.address ?? "-"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Số điện thoại:
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.gray_600 }}>
                    {orderDetailData?.phone ?? "-"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Ngày đặt hàng:
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.gray_600 }}>
                    {moment(orderDetailData?.orderDate).format("DD/MM/YYYY") ??
                      "-"}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid2>
          <Grid2 size={8}>
            <Box style={{ backgroundColor: colors.bgCardColor }}>
              <Paper
                component={Box}
                sx={{
                  p: 2,
                }}
              >
                <TableContainer>
                  <Table
                    sx={{ minWidth: 650, borderRadius: 4 }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        {headerTitle.map((item) => (
                          <TableCell
                            key={item.id}
                            align="left"
                            sx={{
                              fontWeight: font_weight.semiBold,
                              color: colors.dark,
                            }}
                          >
                            {item.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetailData?.orderDetails.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell align="left">{row.product.name}</TableCell>
                          <TableCell align="left">
                            {row.unitPrice.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </TableCell>
                          <TableCell align="left">{row.quantity}</TableCell>
                          <TableCell align="left">
                            {row.totalPrice.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Grid2>
        </Grid2>
      </Stack>
    </Box>
  );
};

export default DetailOrder;
