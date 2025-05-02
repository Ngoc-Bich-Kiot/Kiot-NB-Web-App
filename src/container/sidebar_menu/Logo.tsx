import { Role } from "@/enum/Role";
import useAuth from "@/hook/useAuth";
import { font_size, font_weight } from "@/styles/config-file";
import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

const Logo = () => {
  const { auth } = useAuth();
  console.log("get auth: ", auth);

  //format role
  const roleFormat = (role: any) => {
    switch (role) {
      case "1":
        return "Quản trị viên";
      default:
        break;
    }
    return "-";
  };

  return (
    <Box
      sx={{
        pt: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          src="https://png.pngtree.com/png-vector/20220711/ourlarge/pngtree-dragon-logo-template-vector-design-png-image_5656615.png"
          style={{ height: "150px", width: "150px" }}
        />
        <br />
        <Typography
          sx={{ fontSize: font_size.subTitle, fontWeight: font_weight.light }}
        >
          Chào mừng,{" "}
          <a style={{ fontWeight: font_weight.bold }}>
            {roleFormat(auth?.user?.Role)}
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;
