//'use client';

import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from "@mui/icons-material/Block";
import { useRouter } from 'next/navigation';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import productApi from '@/axios-clients/auth_api/productAPI';
import { toast } from 'react-toastify';
import { colors } from '@/styles/config-file';

export default function MenuActionTableProduct({
    id,
    isDeleted,
    onActionSuccess,
}: {
    id: string;
    isDeleted: boolean;
    onActionSuccess: () => void;
}) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const [confirmOpen, setConfirmOpen] = React.useState(false);

    const handleDelete = async () => {
        try {
            await productApi.DeleteOrEnable(id, !isDeleted ? 1 : 0);
            toast.success("Cập nhật trạng thái sản phẩm thành công!");
            onActionSuccess();
        } catch (error) {
            toast.error("Cập nhật trạng thái sản phẩm thất bại!");
            console.error("Lỗi khi xoá/khôi phục sản phẩm:", error);
        } finally {
            setConfirmOpen(false);
        }
    };


    const actions = [
        {
            label: "Chi Tiết",
            icon: <InfoIcon sx={{ mr: 1 }} color="info" />,
            action: () => {
                router.push(`/admin/manage_product/${id}/detail`)
            },
        },
        ...(!isDeleted
            ? [{
                label: "Chỉnh sửa",
                icon: <EditIcon sx={{ mr: 1, color: "#9ADE7B" }} />,
                action: () => {
                    router.push(`/admin/manage_product/${id}/edit`);
                },
            }]
            : []),
        {
            label: isDeleted === true ? "Khôi phục" : "Ngừng",
            icon: isDeleted === true ? (<AddIcon sx={{ mr: 1 }} color='success' />) : (<BlockIcon sx={{ mr: 1 }} color='error' />),
            action: () => {
                setConfirmOpen(true);
            },
        },
    ];

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.currentTarget;
        setTimeout(() => {
            setAnchorEl(target);
        }, 0);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="demo-positioned-button"
                aria-controls={open ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{ width: "20px" }}
            >
                <MoreHorizIcon sx={{
                    color: "#6464CD",
                }} />
            </Button>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                {actions.map((action, index) => (
                    <MenuItem key={index}
                        onClick={() => {
                            action.action();
                            handleClose();
                        }}>
                        {action.icon}
                        <span>{action.label}</span>
                    </MenuItem>
                ))}
            </Menu>
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
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
                        {isDeleted ? "Xác nhận khôi phục sản phẩm?" : "Xác nhận ngừng hoạt động sản phẩm?"}
                    </DialogTitle>
                </Box>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn {isDeleted ? "khôi phục" : "ngừng hoạt động"} sản phẩm này?</Typography>
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
                        onClick={handleDelete}
                        color="primary"
                        variant="contained"
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
                        onClick={() => setConfirmOpen(false)}
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
        </div>
    );
}
