import React from "react";
import { Backdrop, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Stack, TextField, Typography } from "@mui/material";
import StoreIcon from '@mui/icons-material/Store';
import { toast } from "react-toastify";
import sourceOfProductApi from "@/axios-clients/source_of_product_api/sourceOfProductAPI";

interface CreateSourceProps {
    open: boolean;
    handleClose: () => void;
    fetchData: () => void;
}
const CreateSource: React.FC<CreateSourceProps> = ({ open, handleClose, fetchData }) => {
    const [name, setName] = React.useState("");

    const getErrorMessage = (error: any): string => {
        const message = error?.response?.data?.message;

        switch (message) {
            case "SourceOfProduct already exists.":
                return "Nhà cung cấp đã tồn tại.";
            default:
                if (message) return message;
                if (error.response?.status === 500) return "Lỗi máy chủ. Vui lòng thử lại sau.";
                if (error.request) return "Không nhận được phản hồi từ máy chủ.";
                return "Đã xảy ra lỗi. Vui lòng thử lại.";
        }
    };

    const handleSaveQuickCreate = async () => {
        try {
            await sourceOfProductApi.createSource({ name });
            setName("");
            toast.success("Tạo thành công");
            handleClose();
            fetchData();
        } catch (error) {
            toast.error(getErrorMessage(error), { autoClose: 5000 });
            console.error("Lỗi khi tạo:", error);
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
                    Thêm nhà cung cấp
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Tên nhà cung cấp"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <StoreIcon sx={{ mr: 1, color: "action.active" }} />
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
                    onClick={handleSaveQuickCreate}
                    disabled={isInvalid}
                    sx={{ borderRadius: 2 }}
                >
                    Tạo mới
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateSource;