"use client";
import { colors } from "@/styles/config-file";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardMedia,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import NavBar from "../sidebar_menu/NavBar";
import useAuth from "@/hook/useAuth";
import images from "@/constant/images";

interface menuSettingProps {
  open: boolean;
}

interface menuSettingType {
  id: number;
  itemName: string;
  path?: string;
}

const Nav = () => {
  //auth context
  const { auth } = useAuth();

  //Define the state for the drawer
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => () => {
    setOpen(!open);
  };

  //Define the state and func for menu setting
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenuSetting = Boolean(anchorEl);
  const handleClickOpenMenuSetting = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /*Create menu setting*/
  const menuSettingArray: menuSettingType[] = [
    { id: 1, itemName: "Tài khoản" },
    { id: 2, itemName: "Cài Đặt" },
  ];

  const SettingMenu: React.FC<menuSettingProps> = ({ open }) => {
    return (
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {menuSettingArray.map((item) => (
          <MenuItem key={item.id} onClick={handleClose}>
            {item.itemName}
          </MenuItem>
        ))}
        <MenuItem onClick={logout}>Đăng xuất</MenuItem>
      </Menu>
    );
  };

  //For responsive and css
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("desktop"));

  //Log out func
  const route = useRouter();

  const logout = () => {
    localStorage.clear();
    handleClose();
    route.push("/");
  };

  return (
    <Box>
      {!isDesktop ? (
        <Box>
          <AppBar
            position="fixed"
            sx={{
              bgcolor: colors.grey_100,
              color: colors.dark,
            }}
          >
            <Toolbar
              sx={{
                zIndex: 3,
                boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.1)",
                // position: "fixed",
              }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer()}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }}>
                <img
                  src={images.logo_remove_bg.src}
                  alt="logo"
                  style={{
                    width: 100,
                    height: "auto",
                  }}
                />
              </Box>

              <IconButton onClick={handleClickOpenMenuSetting}>
                <Avatar sx={{ width: 50, height: 50 }}>
                  <Typography variant="h6" component="div">
                    {auth?.user?.Name?.charAt(0)}
                  </Typography>
                </Avatar>
              </IconButton>
              <SettingMenu open={openMenuSetting} />
            </Toolbar>
          </AppBar>

          {open === true ? (
            <Drawer open={open} onClose={toggleDrawer()} sx={{ zIndex: 2000 }}>
              <NavBar />
            </Drawer>
          ) : null}
        </Box>
      ) : (
        <Box>
          <AppBar
            position="fixed"
            sx={{
              bgcolor: colors.grey_100,
              color: colors.dark,
            }}
          >
            <Toolbar
              sx={{
                zIndex: 3,
                boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <img
                  src={images.logo_remove_bg.src}
                  alt="Logo"
                  style={{ width: 100, height: 90 }}
                />
              </Box>
              <IconButton onClick={handleClickOpenMenuSetting}>
                <Avatar sx={{ width: 60, height: 60 }}>
                  <Typography variant="h5" component={"div"}>
                    {auth?.user?.Name?.charAt(0)}
                  </Typography>
                </Avatar>
              </IconButton>
              <SettingMenu open={openMenuSetting} />
            </Toolbar>
          </AppBar>
          <NavBar />
        </Box>
      )}
    </Box>
  );
};

export default Nav;
