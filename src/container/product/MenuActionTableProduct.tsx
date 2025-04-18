'use client';

import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { useRouter } from 'next/navigation';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import productApi from '@/axios-clients/auth_api/productAPI';

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
            onActionSuccess();
        } catch (error) {
            console.error("Lỗi khi xoá/khôi phục sản phẩm:", error);
        } finally {
            setConfirmOpen(false);
        }
    };


    const actions = [
        {
            label: "Chi Tiết",
            icon: <InfoOutlinedIcon sx={{ mr: 1 }} color="info" />,
            action: () => {
                router.push(`/admin/manage_product/${id}/detail`)
            },
        },
        {
            label: "Cập nhật",
            icon: <EditOutlinedIcon sx={{ mr: 1, color: "#9ADE7B" }} />,
            action: () => {
                console.log("Cập nhật:", id);
            },
        },
        {
            label: isDeleted === true ? "Khôi phục" : "Ngừng",
            icon: isDeleted === true ? (<AddOutlinedIcon sx={{ mr: 1 }} color='success' />) : (<RemoveOutlinedIcon sx={{ mr: 1 }} color='error' />),
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
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
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
                <DialogTitle sx={{ color: 'red' }}>
                    {isDeleted ? "Xác nhận khôi phục sản phẩm?" : "Xác nhận ngừng hoạt động sản phẩm?"}
                </DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn {isDeleted ? "khôi phục" : "ngừng hoạt động"} sản phẩm này?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>
                    <Button onClick={handleDelete} color="primary" variant="contained">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
