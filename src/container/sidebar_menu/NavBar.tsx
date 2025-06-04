import { num } from "@/cons/cons";
import { colors } from "@/styles/config-file";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Logo from "./Logo";
import { MenuItems } from "./SideBarMenu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { preconnect } from "react-dom";

// interface NavBarProps {
//   openDrawer: boolean;
// }

const NavBar = () => {
  const pathName = usePathname();

  const isActive = (path: string) => {
    return pathName.includes(path);
  };

  //handle open nested
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  const handleClick = (index: number) => {
    setOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  // const handleClick = (index: number) => {
  //   setOpenMenus((prev) => ({
  //     ...prev,
  //     [index]: !prev[index],
  //   }));
  // };

  return (
    <Box
      sx={{
        maxWidth: num.SIDEBAR_WITH,
        bgcolor: colors.grey_100,
        width: "100%",
        height: "100%",
        zIndex: 2,
        position: "fixed",
        borderRight: "1px solid #e0e0e0",
        overflow: "auto",
      }}
    >
      <List
        sx={(theme) => ({
          [theme.breakpoints.down("mobile")]: {
            pt: 2,
          },

          [theme.breakpoints.between("mobile", "desktop")]: {
            pt: 2,
          },

          [theme.breakpoints.up("desktop")]: {
            pt: 16,
          },
        })}
      >
        <>
          <Logo />
        </>
        <Box sx={{ pt: 5 }}>
          {MenuItems.map((itemNav, index) =>
            !itemNav?.children ? (
              <Link
                key={index}
                style={{ textDecoration: "none", color: colors.grey }}
                href={itemNav?.path}
              >
                <ListItemButton
                  sx={{
                    bgcolor: isActive(itemNav?.path)
                      ? colors.green_100
                      : "transparent",
                    height: "60px",
                  }}
                  key={index}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pr: 2,
                    }}
                  >
                    {itemNav.icon && React.createElement(itemNav.icon)}
                  </Box>
                  <ListItemText primary={itemNav?.label} />
                </ListItemButton>
              </Link>
            ) : (
              <div key={index}>
                <ListItemButton
                  key={index}
                  onClick={() => handleClick(index)}
                  sx={{ color: colors.grey }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pr: 2,
                    }}
                  >
                    {itemNav.icon && React.createElement(itemNav.icon)}
                  </Box>
                  <ListItemText primary={itemNav?.label} />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse
                  in={open[index] || false}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {itemNav?.children.map((item, index) => (
                      <Link
                        key={index}
                        style={{ textDecoration: "none", color: colors.grey }}
                        href={item?.path}
                      >
                        <ListItemButton
                          sx={{
                            bgcolor: isActive(item?.path)
                              ? colors.green_100
                              : "transparent",
                            height: "60px",
                            pl: 4,
                          }}
                          key={index}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              pr: 2,
                            }}
                          >
                            {item.icon && React.createElement(item.icon)}
                          </Box>
                          {item?.label}
                        </ListItemButton>
                      </Link>
                    ))}
                  </List>
                </Collapse>
              </div>
            )
          )}
        </Box>
      </List>
    </Box>
  );
};

export default NavBar;
