"use client";
import authApi from "@/axios-clients/auth_api/authAPI";
import images from "@/constant/images";
import useAuth from "@/hook/useAuth";
import { colors, font_size } from "@/styles/config-file";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HttpsIcon from "@mui/icons-material/Https";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const route = useRouter();
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const [loginForm, setLoginForm] = React.useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    // return console.log("Login form data", loginForm);
    try {
      setIsLoading(true);
      const res: any = await authApi.login(loginForm);
      localStorage.setItem("userInfor", JSON.stringify(res));
      const decoded: any = jwtDecode(res?.accessToken);
      console.log("first", decoded);
      setAuth({
        user: decoded,
        accessToken: res?.accessToken,
      });
      route.push("/admin/dashboard");
    } catch (error) {
      console.log("Login error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${images.loginBg.src})`,
      }}
    >
      <Paper
        sx={(theme) => ({
          opacity: 0.9,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          bgcolor: "wheat",
          p: 2,
          [theme.breakpoints.down("mobile")]: {
            width: "90vw",
          },
          [theme.breakpoints.between("tablet", "desktop")]: {
            width: "70vw",
          },
          [theme.breakpoints.up("desktop")]: { width: "30vw" },
        })}
      >
        <Stack spacing={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={images.logo_remove_bg.src}
              alt="logo"
              style={{
                width: 200,
                height: 200,
              }}
            />
          </Box>
          <TextField
            label={"Tài Khoản"}
            id="email"
            name="email"
            color="success"
            focused
            onChange={(e) => {
              setLoginForm({ ...loginForm, email: e.target.value });
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label={"Mật khẩu"}
            id="password"
            name="password"
            type="password"
            color="success"
            focused
            onChange={(e) => {
              setLoginForm({ ...loginForm, password: e.target.value });
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <HttpsIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Typography textAlign={"right"}>
            Quên mật khẩu?{" "}
            <a href="#" style={{ color: colors.dark }}>
              tìm lại
            </a>
          </Typography>
          <Button
            sx={{
              bgcolor: colors.green_300,
              color: colors.buttonTextColor,
              fontSize: font_size.buttonFontSize,
            }}
            onClick={() => handleLogin()}
          >
            {isLoading ? <CircularProgress /> : "Đăng nhập"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
