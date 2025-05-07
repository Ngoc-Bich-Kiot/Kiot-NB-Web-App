'use client';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import { useState } from "react";
import { OrderStatusType } from "@/enum/OrderStatus";
import orderApi from "@/axios-clients/order_api/orderAPI";
import { toast } from "react-toastify";
import { colors } from "@/styles/config-file";

interface ConfirmOrderProps {
    data: any;
    type: OrderStatusType;
    onOpen: boolean;
    handleClose: () => void;
    fetchData: () => void;
}

const confirmTextByStatus: Record<OrderStatusType, { title: string; content: string }> = {
    Prepared: {
        title: "Xác nhận đơn hàng đã chuẩn bị xong?",
        content: "Bạn có chắc chắn đơn hàng đã chuẩn bị xong!",
    },
    Finish: {
        title: "Xác nhận đơn hàng đã thanh toán?",
        content: "Vui lòng chọn phương thức thanh toán cho đơn hàng này.",
    },
    Canceled: {
        title: "Xác nhận huỷ đơn hàng?",
        content: "Bạn có chắc chắn muốn huỷ đơn hàng này!",
    },
};

const paymentMethods = [
    { label: "Thanh toán khi nhận hàng (COD)", value: "COD" },
    // { label: "Chuyển khoản ngân hàng", value: "BANK" },
    // { label: "Ví điện tử", value: "WALLET" },
];

const ConfirmOrder: React.FC<ConfirmOrderProps> = ({ type, onOpen, data, handleClose, fetchData }) => {
    const [paymentMethod, setPaymentMethod] = useState<string>("");

    const handleConfirm = async () => {
        try {
            if (type === "Finish" && !paymentMethod) {
                toast.warn("Vui lòng chọn phương thức thanh toán");
                return;
            }

            const statusActionMap: Record<OrderStatusType, () => Promise<any>> = {
                Prepared: () => orderApi.updateOrderStatus(data.id, { orderStatus: "Prepared" }),
                Canceled: () => orderApi.updateOrderStatus(data.id, { orderStatus: "Canceled" }),
                Finish: () => orderApi.checkOut(data.id, paymentMethod),
            };

            const action = statusActionMap[type];
            if (!action) throw new Error("Không tìm thấy hành động phù hợp");

            await action();
            toast.success("Cập nhật trạng thái đơn hàng thành công");
            fetchData();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
            toast.error("Lỗi khi cập nhật trạng thái đơn hàng");
        } finally {
            handleClose();
        }
    };

    return (
        <Dialog
            open={onOpen}
            onClose={handleClose}
            disableEnforceFocus
            disableAutoFocus
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: colors.primary,
                    color: colors.white,
                }}
            >
                <DialogTitle width="100%">
                    {confirmTextByStatus[type]?.title || "Xác nhận hành động?"}
                </DialogTitle>
            </Box>
            <DialogContent>
                <Typography sx={{ mb: 2 }}>
                    {confirmTextByStatus[type]?.content || "Bạn có chắc chắn muốn thực hiện hành động này?"}
                </Typography>

                {type === "Finish" && (
                    <FormControl fullWidth>
                        <InputLabel id="payment-method-label">Phương thức thanh toán</InputLabel>
                        <Select
                            labelId="payment-method-label"
                            value={paymentMethod}
                            label="Phương thức thanh toán"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            {paymentMethods.map((method) => (
                                <MenuItem key={method.value} value={method.value}>
                                    {method.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </DialogContent>
            <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap={2}
                px={3}
                mb={2}
                sx={(theme) => ({
                    [theme.breakpoints.down("mobile")]: {
                        flexDirection: "column"
                    },
                    [theme.breakpoints.between("mobile", "tablet")]: {
                        flexDirection: "column"
                    },
                    [theme.breakpoints.up("tablet")]: {
                        flexDirection: "row"
                    },
                })}
            >
                <Button
                    onClick={handleConfirm}
                    color="primary"
                    variant="contained"
                    disabled={type === "Finish" && !paymentMethod}
                    sx={(theme) => ({
                        [theme.breakpoints.down("mobile")]: {
                            width: "100%"
                        },
                        [theme.breakpoints.between("mobile", "tablet")]: {
                            width: "80%"
                        },
                        [theme.breakpoints.up("tablet")]: {
                            width: "auto",
                            order: 1
                        },
                    })}
                >
                    Xác nhận
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClose}
                    sx={(theme) => ({
                        [theme.breakpoints.down("mobile")]: {
                            width: "100%"
                        },
                        [theme.breakpoints.between("mobile", "tablet")]: {
                            width: "80%"
                        },
                        [theme.breakpoints.up("tablet")]: {
                            width: "auto",
                            order: 2
                        },
                    })}
                >
                    Hủy
                </Button>
            </Box>
        </Dialog>
    );
};

export default ConfirmOrder;
