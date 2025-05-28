import React from "react";
import { Backdrop, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Stack, TextField, Typography } from "@mui/material";
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { toast } from "react-toastify";
import categoryApi from "@/axios-clients/category_api/categoryAPI";

interface EditCategoryProps {
    category: any,
    open: boolean;
    handleClose: () => void;
    fetchData: () => void;
}
const EditCategory: React.FC<EditCategoryProps> = ({ open, category, handleClose, fetchData }) => {
    const [name, setName] = React.useState(category.name || "");

    const getErrorMessage = (error: any): string => {
        const message = error?.response?.data?.message;

        switch (message) {
            case "Cannot update category because it is in use by some products.":
                return "Không thể cập nhật loại sản phẩm vì đang được sử dụng bởi một số sản phẩm.";
            default:
                if (message) return message;
                if (error.response?.status === 500) return "Lỗi máy chủ. Vui lòng thử lại sau.";
                if (error.request) return "Không nhận được phản hồi từ máy chủ.";
                return "Đã xảy ra lỗi. Vui lòng thử lại.";
        }
    };

    const handleSaveQuickEdit = async () => {
        try {
            await categoryApi.updateCategory(category.id, { name });
            setName("");
            toast.success("Cập nhật thành công");
            handleClose();
            fetchData();
        } catch (error) {
            toast.error(getErrorMessage(error), { autoClose: 5000 });
            console.error("Lỗi khi cập nhật:", error);
        }
    };

    const isInvalid =
        !name.trim();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            TransitionComponent={Fade}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <DialogTitle>
                <Typography variant="body1" fontWeight={600}>
                    Cập nhật loại sản phẩm
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 0.5 }}>
                    <TextField
                        fullWidth
                        label="Tên loại sản phẩm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <CategoryOutlinedIcon sx={{ mr: 1, color: "action.active" }} />
                            ),
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSaveQuickEdit}
                    disabled={isInvalid}
                    sx={{ borderRadius: 2 }}
                >
                    Lưu thay đổi
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditCategory;