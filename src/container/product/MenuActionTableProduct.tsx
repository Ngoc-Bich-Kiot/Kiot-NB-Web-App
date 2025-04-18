'use client';

import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { useRouter } from 'next/navigation';

export default function MenuActionTableProduct({
    id,
    status,
}: {
    id: string;
    status?: string;
}) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const router = useRouter();

    const handleAction = {
        detail: (id: string) => {
            // router.push(`/admin/manage_product/${id}/detail`);
            router.push(`/admin/manage_product/${id}/detail`);
        },
        update: (id: string) => {
            console.log("Cập nhật:", id);
        },
        delete: (id: string) => {
            console.log("Xóa:", id);
        },
    }

    const actions = [
        {
            label: "Chi Tiết",
            icon: <InfoOutlinedIcon sx={{ mr: 1 }} color="info" />,
            action: handleAction.detail,
        },
        {
            label: "Cập nhật",
            icon: <EditOutlinedIcon sx={{ mr: 1, color: "#9ADE7B" }} />,
            action: handleAction.update,
        },
        {
            label: status === "UnActive" ? "Khôi phục" : "Xóa",
            icon: (
                <BlockOutlinedIcon
                    sx={{ mr: 1 }}
                    color={status === "UnActive" ? "success" : "error"}
                />
            ),
            action: handleAction.delete,
        },
    ];

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
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
                            action.action(id);
                            handleClose();
                        }}>
                        {action.icon}
                        <span>{action.label}</span>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
