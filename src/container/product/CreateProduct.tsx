"use client";

import { CreateProductFormInput } from "@/types/ProductType";
import React, { useCallback } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Grid2,
  Paper,
  Typography,
} from "@mui/material";
import {
  FormProvider,
  RHFTextField,
  RHFTextFieldNumber,
} from "@/components/hook_form";
import RHFPhoneField from "@/components/text_field/RHFTextFieldPhone";
import productApi from "@/axios-clients/product_api/productAPI";
import { toast } from "react-toastify";
import {
  RHFUploadMultiFile,
  RHFUploadSingleFile,
} from "@/components/text_field";
import { log } from "console";
import uploadImageToFirebase from "@/firebase/uploadImageToFirebase";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Tên sản phẩm là bắt buộc"),
  category: Yup.string().required("Loại là bắt buộc"),
  // originalPrice: Yup.number()
  //   .transform((value, originalValue) => {
  //     if (typeof originalValue === "string") {
  //       const normalized = originalValue.replace(/,/g, "");
  //       return parseFloat(normalized);
  //     }
  //     return value;
  //   })
  //   .typeError("Phải là số")
  //   .required("Giá gốc là bắt buộc"),
  sellingPrice: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const normalized = originalValue.replace(/,/g, "");
        return parseFloat(normalized);
      }
      return value;
    })
    .typeError("Phải là số")
    .required("Giá bán là bắt buộc"),
  sourceOfProducts: Yup.string().required("Nguồn nhập là bắt buộc"),
  userName: Yup.string().required("Tên người dùng là bắt buộc"),
  // phone: Yup.string()
  //   .required("Số điện thoại là bắt buộc")
  //   .transform((value) => value.replace(/\D/g, ""))
  //   .matches(/^\d{10}$/, "Số điện thoại không hợp lệ"),
  // address: Yup.string().required("Địa chỉ là bắt buộc"),
  importCosts: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const normalized = originalValue.replace(/,/g, "");
        return parseFloat(normalized);
      }
      return value;
    })
    .typeError("Phải là số")
    .required("Giá nhập là bắt buộc"),
  stockQuantity: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const normalized = originalValue.replace(/,/g, "");
        return parseFloat(normalized);
      }
      return value;
    })
    .typeError("Phải là số")
    .required("Số lượng tồn là bắt buộc"),
  unit: Yup.string().required("Đơn vị là bắt buộc"),
  status: Yup.string().required("Trạng thái là bắt buộc"),
  productImages: Yup.array()
    .min(1, "Images is required")
    .required("Ảnh là bắt buộc"),
  // productImages: Yup.mixed().required("Cover is required"),
});
const capitalizedWords = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CreateProduct = () => {
  const router = useRouter();

  const methods = useForm<CreateProductFormInput>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      category: "",
      //originalPrice: 0,
      sellingPrice: 0,
      sourceOfProducts: "",
      userName: "",
      // phone: "",
      // address: "",
      importCosts: 0,
      stockQuantity: 0,
      unit: "",
      status: "Available",
      productImages: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;

  const values = watch();

  // nhiều hình
  const handleDropImage = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (acceptedFiles: any) => {
      const images = values.productImages || [];

      const uploadedImages = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        acceptedFiles.map(async (file: any) => {
          const downloadURL = await uploadImageToFirebase(file);
          return downloadURL;
        })
      );

      setValue("productImages", [...images, ...uploadedImages]);
    },
    [setValue, values.productImages]
  );

  const handleRemoveAll = () => {
    setValue("productImages", []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.productImages?.filter(
      (_file) => _file !== file
    );
    setValue("productImages", filteredItems);
  };

  //   dùng cho 1 hình
  //  const handleDrop = useCallback(
  //    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //    async (acceptedFiles: any[]) => {
  //      const file = acceptedFiles[0];

  //      const coverImage = await uploadImageToFirebase(file);
  //      if (typeof coverImage === "string") {
  //        setValue("productImages", coverImage);
  //      }
  //    },
  //    [setValue]
  //  );

  const onSubmit = async (data: CreateProductFormInput) => {
    try {
      await productApi.CreateProduct(data);
      toast.success("Nhập sản phẩm thành công");
      router.push("/admin/manage_product");
      console.log(data)
    } catch (error) {
      toast.error("Nhập sản phẩm thất bại");
      console.error("Nhập sản phẩm thất bại:", error);
    }
  };
  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography
          sx={{ fontSize: { xs: "2rem", md: "1.5rem" }, fontWeight: 500 }}
          gutterBottom
        >
          Nhập sản phẩm mới
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="name"
                label="Tên sản phẩm"
                placeholder="Nhập tên sản phẩm"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="category"
                label="Loại"
                placeholder="Nhập loại sản phẩm"
              />
            </Grid2>
            {/* <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextFieldNumber
                name="originalPrice"
                label="Giá gốc"
                placeholder="Ví dụ: 100000"
              />
            </Grid2> */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextFieldNumber
                name="importCosts"
                label="Giá nhập"
                placeholder="Giá nhập từ nhà cung cấp"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextFieldNumber
                name="sellingPrice"
                label="Giá bán"
                placeholder="Ví dụ: 120000"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="unit"
                label="Đơn vị"
                placeholder="VD: chiếc, hộp, kg..."
                onBlur={(e) => {
                  const formatted = capitalizedWords(e.target.value);
                  setValue("unit", formatted, { shouldValidate: true });
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="sourceOfProducts"
                label="Nguồn nhập"
                placeholder="Tên nhà cung cấp hoặc nguồn hàng"
              />
            </Grid2>
            {/* <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextFieldNumber
                name="stockQuantity"
                label="Số lượng tồn"
                placeholder="Ví dụ: 50"
              />
            </Grid2> */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="userName"
                label="Người nhập"
                placeholder="Tên nhân viên nhập hàng"
              />
            </Grid2>
            {/* <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFPhoneField
                name="phone"
                label="Số điện thoại"
                placeholder="Ví dụ: 0797302367"
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <RHFTextField
                name="address"
                label="Địa chỉ"
                placeholder="Địa chỉ kho hoặc nơi nhập hàng"
              />
            </Grid2> */}

            <Grid2 size={{ xs: 12 }}>
              <RHFUploadMultiFile
                name="productImages"
                showPreview
                label="Ảnh sản phẩm"
                onDrop={handleDropImage}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
              />

              {/* <RHFUploadSingleFile
                name="productImages"
                label="Ảnh sản phẩm"
                onDrop={handleDrop}
              /> */}
            </Grid2>
          </Grid2>

          <Box
            mt={4}
            display="flex"
            flexDirection={{ xs: "column", lg: "row" }}
            justifyContent="flex-end"
            alignItems="center"
            gap={2}
          >
            <Button
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{
                width: { xs: "100%", sm: "auto" },
                order: { xs: 1, lg: 2 },
              }}
            >
              {isSubmitting ? "Đang tạo..." : "Nhập sản phẩm"}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push("/admin/manage_product")}
              sx={{
                borderColor: "secondary.main",
                color: "secondary.main",
                ":hover": {
                  backgroundColor: (theme) => theme.palette.secondary.light,
                  borderColor: "secondary.dark",
                  color: "white",
                },
                width: { xs: "100%", sm: "auto" },
                order: { xs: 2, lg: 1 },
              }}
            >
              Quay lại
            </Button>
          </Box>
        </FormProvider>
      </Paper>
    </Container>
  );
};
export default CreateProduct;