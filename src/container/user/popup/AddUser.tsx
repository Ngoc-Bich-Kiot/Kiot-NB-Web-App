"use client";
import userApi from "@/axios-clients/user_api/userAPI";
import { FormProvider, RHFTextField } from "@/components/hook_form";
import { colors, font_weight } from "@/styles/config-file";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface AddUserProps {
  open: boolean;
  handleClose: () => void;
  fetchData?: () => void;
}

const AddUser: React.FC<AddUserProps> = ({ open, handleClose, fetchData }) => {
  //define default values
  const defaultValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    userImages: [],
    roleId: "2",
  };

  //Yup validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string(),
    phone: Yup.string(),
    address: Yup.string(),
    roleId: Yup.string(),
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
    // return console.log("data", data);
    try {
      const res: any = await userApi.createNewUser({ ...data });
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
              color: colors.grey_600,
              textTransform: "uppercase",
              fontWeight: font_weight.regular,
            }}
          >
            Tạo mới người dùng
          </DialogTitle>
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ color: colors.grey_600 }} />
          </IconButton>
        </Box>
        <DialogContent>
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              <RHFTextField name="name" label="Tên người dùng" />
            </Grid2>
            <Grid2 size={12}>
              <RHFTextField name="phone" label="SDT" />
            </Grid2>
            <Grid2 size={12}>
              <RHFTextField name="address" label="Địa chỉ" />
            </Grid2>
            {/* <Grid2 size={12}>
              <RHFTextField name="UserImages" label="Hình ảnh" />
            </Grid2> */}
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
