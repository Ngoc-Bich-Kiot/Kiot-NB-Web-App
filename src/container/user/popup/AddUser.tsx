"use client";
import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { colors, font_weight } from "@/styles/config-file";
import { ListRole } from "@/enum/Role";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/hook_form";
import userApi from "@/axios-clients/user_api/userAPI";
import { toast } from "react-toastify";

interface AddUserProps {
  open: boolean;
  handleClose: () => void;
}

const AddUser: React.FC<AddUserProps> = ({ open, handleClose }) => {
  //define default values
  const defaultValues = {
    Name: "",
    Email: "",
    Password: "",
    Phone: "",
    Address: "",
    UserImages: [],
    RoleId: 0,
  };

  //Yup validation schema
  const validationSchema = Yup.object().shape({
    Name: Yup.string().trim().min(1, "Tối thiểu 1 kí tự"),
    Email: Yup.string()
      .trim()
      .required("Bắt buộc có email")
      .min(5, "Tối thiểu 5 kí tự"),
    Password: Yup.string().trim().min(6, "Tối thiểu 6 kí tự"),
    Phone: Yup.string().trim().min(10, "Tối thiểu 10 kí tự"),
    Address: Yup.string().trim().min(5, "Tối thiểu 5 kí tự"),
    RoleId: Yup.number().required("Bắt buộc có vị trí"),
  });

  //handle submit
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const createUser = async (data: any) => {
    try {
      const res: any = await userApi.createNewUser({
        ...data,
      });
      console.log("data", data);
      toast.success("Tạo mới người dùng thành công");
      handleClose();
    } catch (error) {
      toast.error("Tạo người dùng thất bại");
      console.log("error", error);
    }
  };

  return (
    <Dialog open={open}>
      <FormProvider methods={methods} onSubmit={handleSubmit(createUser)}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 1,
            bgcolor: colors.primary,
          }}
        >
          <DialogTitle
            sx={{
              color: colors.gray_600,
              textTransform: "uppercase",
              fontWeight: font_weight.regular,
            }}
          >
            Tạo mới người dùng
          </DialogTitle>
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ color: colors.gray_600 }} />
          </IconButton>
        </Box>
        <DialogContent>
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              <RHFTextField name="Name" label="Tên người dùng" />
            </Grid2>
            <Grid2 size={12}>
              <RHFTextField name="Phone" label="SDT" />
            </Grid2>
            <Grid2 size={12}>
              <RHFTextField name="Address" label="Địa chỉ" />
            </Grid2>
            <Grid2 size={12}>
              <RHFTextField name="Email" label="email" />
            </Grid2>
            <Grid2 size={12}>
              <RHFTextField name="Password" label="Mật khẩu" />
            </Grid2>
            <Grid2 size={12}>
              <RHFSelect name="RoleId" label="Vai trò" sx={{ mb: 2 }}>
                {ListRole?.map((i) => (
                  <option key={i.roleId} value={i.roleId}>
                    {i.roleName}
                  </option>
                ))}
              </RHFSelect>
            </Grid2>
            <Grid2 size={12}>
              <RHFTextField name="UserImages" label="Hình ảnh" />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
          >
            Nộp
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default AddUser;
