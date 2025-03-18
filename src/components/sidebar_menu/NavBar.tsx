import { num } from "@/cons/cons";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { MenuItems } from "./SideBarMenu";
import { colors } from "@/styles/config-file";
import React from "react";

const NavBar = () => {
  const pathName = usePathname();

  const isActive = (path: string) => {
    return pathName.includes(path);
  };

  return (
    <Box
      sx={{
        maxWidth: num.SIDEBAR_WITH,
        bgcolor: colors.sideBarBG,
        width: "100%",
        height: "100vh",
        borderRight: "1px solid #e0e0e0",
      }}
    >
      <List>
        <Logo />

        {MenuItems.map((itemNav, index) => (
          <Link
            key={index}
            style={{ textDecoration: "none", color: "black" }}
            href={itemNav.path}
          >
            <ListItemButton
              sx={{
                bgcolor: isActive(itemNav.path)
                  ? colors.itemNavBG
                  : "transparent",
                height: "60px",
              }}
            >
              {itemNav.icon && React.createElement(itemNav.icon)}
              <ListItemText primary={itemNav.label} />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default NavBar;
