"use client";
//toastify
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

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
            <Box sx={{ bgcolor: colors.white, pl: 33, pt: 10 }}>
              {children}
              <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </Box>
          </Box>
        </Box>
      </OverrideMuiTheme>
    </>
  );
}
