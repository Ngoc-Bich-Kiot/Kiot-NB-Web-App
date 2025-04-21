/* eslint-disable @typescript-eslint/no-explicit-any */
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { redirect } from "next/navigation";
import * as React from "react";

interface MenuActionOrderProps {
  orderData: any;
  onOpenUpdate?: any;
  onOpenDetail?: any;
  onOpenDelete?: any;
  fetchData: () => void;
}

const MenuActionOrder: React.FC<MenuActionOrderProps> = ({
  orderData,
  onOpenUpdate,
  onOpenDetail,
  onOpenDelete,
  fetchData,
}) => {
  console.log("data dc chọn: ", orderData);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [openDetail, setOpenDetail] = React.useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = React.useState<boolean>(false);
  const [openDelete, setOpenDelete] = React.useState<boolean>(false);
  const [openAssign, setOpenAssign] = React.useState<boolean>(false);
  const open = Boolean(anchorEl);

  //func
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    onOpenUpdate(orderData);
    setOpenUpdate(true);
    setAnchorEl(null);
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleDetail = () => {
    setOpenDetail(true);
    setAnchorEl(null);
    redirect(`/admin/manage_orders/${orderData.id}/order_detail`);
  };

  const handleDelete = () => {
    onOpenDelete(orderData);
    setOpenDelete(true);
    setAnchorEl(null);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
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
        <MoreHorizIcon
          sx={{
            color: "#6464CD",
          }}
        />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
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
        <MenuItem onClick={() => handleDetail()}>
          <InfoIcon sx={{ mr: "4px" }} color="info" />
          <span>Chi Tiết</span>
        </MenuItem>
        <MenuItem onClick={() => handleUpdate()}>
          <EditIcon sx={{ mr: "4px", color: "#9ADE7B" }} />
          <span>Cập nhật</span>
        </MenuItem>

        <MenuItem onClick={() => handleDelete()}>
          <BlockIcon sx={{ mr: "4px" }} color="error" />
          <span>Xóa</span>
        </MenuItem>
      </Menu>
      {/* {openDetail == true && (
        <DetailPopup
          handleOpen={openDetail}
          handleClose={handleCloseDetail}
          orderData={orderData}
        />
      )}

      {openUpdate == true && (
        <UpdatePopup
          onOpen={openUpdate}
          onClose={handleCloseUpdate}
          orderData={orderData}
          fetchData={fetchData}
        />
      )}
      {openDelete == true && (
        <DeleteUser
          onOpen={openDelete}
          onClose={handleCloseDelete}
          data={orderData}
          fetchData={fetchData}
        />
      )} */}
    </div>
  );
};

export default MenuActionOrder;
