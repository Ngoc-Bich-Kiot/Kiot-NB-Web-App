import { Avatar, Box, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import React from "react";
import { colors } from "@/styles/config-file";

const Nav = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        bgcolor: colors.navBG,
        borderBottom: "1px solid #e0e0e0",
        height: "4rem",
        position: "fixed",
        zIndex: 1,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 80,
        }}
      >
        <Avatar>N</Avatar>
        {/* <IconButton>
          <SettingsIcon />
        </IconButton> */}
      </Box>
    </Box>
  );
};

export default Nav;
