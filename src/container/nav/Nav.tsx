"use client";
import { colors } from "@/styles/config-file";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
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

interface menuSettingProps {
  open: boolean;
  onClose: () => void;
}

interface menuSettingType {
  id: number;
  itemName: string;
  path?: string;
}

const Nav = () => {
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

  const SettingMenu: React.FC<menuSettingProps> = ({ open, onClose }) => {
    return (
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
            position="static"
            sx={{
              bgcolor: colors.navBG,
              color: colors.dark,
            }}
          >
            <Toolbar
              sx={{
                zIndex: 3,
                boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.4)",
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
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Ki-ot
              </Typography>
              <IconButton onClick={handleClickOpenMenuSetting}>
                <Avatar>N</Avatar>
              </IconButton>
              <SettingMenu open={openMenuSetting} onClose={handleClose} />
            </Toolbar>
          </AppBar>

          {open == true ? (
            <Drawer open={open} onClose={toggleDrawer()}>
              <NavBar />
            </Drawer>
          ) : null}
        </Box>
      ) : (
        <Box>
          <AppBar
            position="static"
            sx={{
              bgcolor: colors.navBG,
              color: colors.dark,
            }}
          >
            <Toolbar
              sx={{
                zIndex: 3,
                boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.4)",
              }}
            >
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Ki-ot
              </Typography>
              <IconButton onClick={handleClickOpenMenuSetting}>
                <Avatar>N</Avatar>
              </IconButton>
              <SettingMenu open={openMenuSetting} onClose={handleClose} />
            </Toolbar>
          </AppBar>
          <NavBar />
        </Box>
      )}
    </Box>
  );
};

export default Nav;
