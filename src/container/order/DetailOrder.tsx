"use client";
import orderApi from "@/axios-clients/order_api/orderAPI";
import { colors } from "@/styles/config-file";
import { OrderDetailType } from "@/types/OrderDetailType";
import { Box, Grid2, Stack } from "@mui/material";
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

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={4}>
        <Grid2 container spacing={3}>
          <Grid2 size={4}>
            <div style={{ backgroundColor: colors.bgCardColor }}>card 1</div>
          </Grid2>
          <Grid2 size={4}>
            <div style={{ backgroundColor: colors.bgCardColor }}>card 2</div>
          </Grid2>
          <Grid2 size={4}>
            <div style={{ backgroundColor: colors.bgCardColor }}>card 3</div>
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Grid2 style={{ backgroundColor: colors.bgCardColor }} size={4}>
            <div>Box1</div>
          </Grid2>
          <Grid2 style={{ backgroundColor: colors.bgCardColor }} size={8}>
            <div>Box2</div>
          </Grid2>
        </Grid2>
      </Stack>
    </Box>
  );
};

export default DetailOrder;
