import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';

const handleAction = {
    detail: (id: string) => {
        console.log("Chi tiết:", id);
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
        label: "Xóa",
        icon: <BlockOutlinedIcon sx={{ mr: 1 }} color="error" />,
        action: handleAction.delete,
    },
];

export default function MenuActionTableProduct({ id }: { id: string }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

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
