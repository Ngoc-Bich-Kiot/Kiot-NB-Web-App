"use client";
import Nav from "@/components/nav/Nav";
import NavBar from "@/components/sidebar_menu/NavBar";
import { colors } from "@/styles/config-file";
import OverrideMuiTheme from "@/theme/override";
import { Box } from "@mui/material";
// import dynamic from "next/dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const NoSSR = dynamic(() => import("@/components/sidebar_menu/NavBar"), {
  //   ssr: false,
  // });

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
