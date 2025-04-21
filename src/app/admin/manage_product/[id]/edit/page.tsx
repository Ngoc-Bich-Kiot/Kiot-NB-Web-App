"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  MenuItem,
} from "@mui/material";

import productApi from "@/axios-clients/auth_api/productAPI";
import { EditProductFormInput, ProductImage } from "@/types/ProductType";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFTextFieldNumber,
} from "@/components/hook_form";
import RHFMultiImageUpload from "@/components/text_field/RHFMultiImageUpload";

const productStatusOptions = [
  { value: "", label: "Chọn trạng thái" },
  { value: "Available", label: "Còn hàng" },
  { value: "OutOfStock", label: "Hết hàng" },
  { value: "Incoming", label: "Hàng về" },
  { value: "Discontinued", label: "Ngừng" },
  { value: "PendingApproval", label: "Phê duyệt" },
  { value: "Damaged", label: "Hư hỏng" },
  { value: "Expired", label: "Hết hạn" },
];

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Tên sản phẩm là bắt buộc"),
  category: Yup.string().required("Loại là bắt buộc"),
  originalPrice: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const normalized = originalValue.replace(/,/g, "");
        return parseFloat(normalized);
      }
      return value;
    })
    .typeError("Phải là số")
    .required("Giá gốc là bắt buộc"),
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
  status: Yup.string().required("Trạng thái là bắt buộc"),
  productImages: Yup.array()
    .of(
      Yup.mixed<File | string>()
        .test(
          "is-valid",
          "Chỉ chấp nhận ảnh hợp lệ",
          (value) => typeof value === "string" || value instanceof File
        )
        .defined()
    )
    .required("Ảnh là bắt buộc"),
});

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const from = searchParams.get("from");
  const [initialImages, setInitialImages] = React.useState<ProductImage[]>([]);

  const methods = useForm<EditProductFormInput>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      category: "",
      originalPrice: 0,
      sellingPrice: 0,
      sourceOfProducts: "",
      importCosts: 0,
      status: "",
      stockQuantity: 0,
      productImages: [],
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isValid },
  } = methods;
  const productImages = watch("productImages");

  const handleBack = () => {
    if (from === "table") {
      router.push("/admin/manage_product");
    } else if (from === "detail") {
      router.push(`/admin/manage_product/${id}/detail`);
    } else {
      router.push("/admin/manage_product");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getProductById(id);
        console.log(data);
        setInitialImages(data.images);
        reset({
          ...data,
          productImages: data.images.map((img) => img.urlPath),
        });
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    if (id) fetchProduct();
  }, [id, reset]);

  const convertToFormData = (data: Record<string, any>): FormData => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if (key === "productImages") {
        value.forEach((file: File | string) => {
          if (file instanceof File) {
            formData.append("ProductImages", file);
          }
        });
      } else if (key === "ImageIdsToDelete") {
        if (Array.isArray(value)) {
          value.forEach((id) => {
            formData.append("ImageIdsToDelete", id.toString());
          });
        }
      } else {
        formData.append(key, value.toString());
      }
    }

    return formData;
  };

  const onSubmit = async (data: EditProductFormInput) => {
    try {
      const currentImageUrls = data.productImages.filter(
        (img): img is string => typeof img === "string"
      );
      const imageIdsToDelete = initialImages
        .filter((img) => !currentImageUrls.includes(img.urlPath))
        .map((img) => img.id);

      const formData = convertToFormData({
        ...data,
        ImageIdsToDelete: imageIdsToDelete,
      });
      // console.log(data, imageIdsToDelete, formData);
      await productApi.UpdateProduct(id, formData);
      router.push(`/admin/manage_product/${id}/detail`);
    } catch (error) {
      console.error("Cập nhật sản phẩm thất bại:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 2 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Chỉnh sửa sản phẩm
        </Typography>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="name" label="Tên sản phẩm" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="category" label="Loại" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="originalPrice" label="Giá gốc" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="sellingPrice" label="Giá bán" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="importCosts" label="Giá nhập" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="sourceOfProducts" label="Nguồn nhập" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="stockQuantity" label="Số lượng tồn" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFSelect name="status" label="Trạng thái">
                {productStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
            </Grid>
            <Grid item xs={12}>
              <RHFMultiImageUpload name="productImages" label="Ảnh sản phẩm" />
            </Grid>
          </Grid>

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
              disabled={isSubmitting || !isValid || productImages.length === 0}
              sx={{
                width: { xs: "100%", sm: "auto" },
                order: { xs: 1, lg: 2 },
              }}
            >
              {isSubmitting ? "Đang cập nhật..." : "Lưu thay đổi"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleBack}
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
}
