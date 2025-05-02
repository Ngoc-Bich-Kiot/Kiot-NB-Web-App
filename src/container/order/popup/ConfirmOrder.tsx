'use client';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { OrderStatusType } from "@/enum/OrderStatus";
import orderApi from "@/axios-clients/order_api/orderAPI";
import { toast } from "react-toastify";


interface ConfirmOrderProps {
    data: any,
    type: OrderStatusType;
    onOpen: boolean;
    handleClose: () => void;
    fetchData: () => void;
}
const confirmTextByStatus: Record<OrderStatusType, { title: string; content: string }> = {
    Paid: {
        title: "Xác nhận đơn hàng đã thanh toán!",
        content: "Bạn có chắc chắn đơn hàng đã thanh toán không?",
    },
    Canceled: {
        title: "Xác nhận huỷ đơn hàng!",
        content: "Bạn có chắc chắn muốn huỷ đơn hàng này?",
    },
};

const ConfirmOrder: React.FC<ConfirmOrderProps> = ({ type, onOpen, data, handleClose, fetchData }) => {
    const handleConfirm = async () => {
        try {
            await orderApi.updateOrderStatus(data.id, { orderStatus: type });
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
            <DialogTitle sx={{ color: 'red' }}>
                {confirmTextByStatus[type]?.title || "Xác nhận hành động?"}
            </DialogTitle>
            <DialogContent>
                <Typography>
                    {confirmTextByStatus[type]?.content || "Bạn có chắc chắn muốn thực hiện hành động này?"}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={handleConfirm} color="primary" variant="contained">
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default ConfirmOrder;