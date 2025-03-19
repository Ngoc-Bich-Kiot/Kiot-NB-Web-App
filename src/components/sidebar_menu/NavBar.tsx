"use client";
import { num } from "@/cons/cons";
import { Box, Collapse, List, ListItemButton } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { MenuItems } from "./SideBarMenu";
import { colors } from "@/styles/config-file";
import { useState } from "react";

const NavBar = () => {
  const pathName = usePathname();

  const isActive = (path: string) => {
    return pathName.includes(path);
  };

  //handle open nested
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
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
        <>
          <Logo />
        </>
        {MenuItems.map((itemNav, index) =>
          !itemNav?.children ? (
            <Link
              key={index}
              style={{ textDecoration: "none", color: "black" }}
              href={itemNav?.path}
            >
              <ListItemButton
                sx={{
                  bgcolor: isActive(itemNav.path)
                    ? colors.itemNavBG
                    : "transparent",
                  height: "60px",
                }}
                key={index}
              >
                {itemNav.label}
              </ListItemButton>
            </Link>
          ) : (
            <>
              <ListItemButton onClick={handleClick}>
                {itemNav?.label}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {itemNav?.children.map((item) => (
                    <ListItemButton sx={{ pl: 4 }}>
                      {item?.label}
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </>
          )
        )}
      </List>
    </Box>
  );
};

export default NavBar;
