"use client";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HttpsIcon from "@mui/icons-material/Https";
import { colors, font_size } from "@/styles/config-file";
import { useRouter } from "next/navigation";

export default function Home() {
  const route = useRouter();

  const handleLogin = () => {
    route.push("/admin/dashboard");
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
            id="userName"
            name="userName"
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
