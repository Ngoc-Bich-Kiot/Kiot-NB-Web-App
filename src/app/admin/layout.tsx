"use client";
import Nav from "@/container/nav/Nav";
import NavBar from "@/container/sidebar_menu/NavBar";
import { colors } from "@/styles/config-file";
import OverrideMuiTheme from "@/theme/override";
import { Box } from "@mui/material";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <OverrideMuiTheme>
        <Box sx={{ display: "flex" }}>
          <NavBar />
          <Box width={"100%"}>
            <Nav />
            <Box sx={{ bgcolor: colors.white, p: 5 }}>{children}</Box>
          </Box>
        </Box>
      </OverrideMuiTheme>
    </>
  );
}
