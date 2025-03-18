import { Box, Typography } from "@mui/material";
import React from "react";

const Logo = () => {
  return (
    <Box
      sx={{
        height: "4rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5">Logo here</Typography>
    </Box>
  );
};

export default Logo;
