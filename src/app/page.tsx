"use client";
import authApi from "@/axios-clients/auth_api/authAPI";
import useAuth from "@/hook/useAuth";
import { colors, font_size } from "@/styles/config-file";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HttpsIcon from "@mui/icons-material/Https";
import {
  Box,
  Button,
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

  const [loginForm, setLoginForm] = React.useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    // return console.log("Login form data", loginForm);
    try {
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
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "30vw",
          p: 2,
        }}
      >
        <Stack spacing={4}>
          <Typography textAlign={"center"} variant="h4">
            Ki-ot
          </Typography>
          <TextField
            label={"Tài Khoản"}
            // fullWidth
            id="email"
            name="email"
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
            sx={{ width: "400px" }}
          />
          <TextField
            label={"Mật khẩu"}
            // fullWidth
            id="password"
            name="password"
            type="password"
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
            sx={{ width: "400px" }}
          />
          <Typography textAlign={"right"}>Quên mật khẩu? tìm lại</Typography>
          <Button
            sx={{
              bgcolor: colors.buttonColor,
              color: colors.buttonTextColor,
              fontSize: font_size.buttonFontSize,
            }}
            onClick={() => handleLogin()}
          >
            Đăng nhập
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
