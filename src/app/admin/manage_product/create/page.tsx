'use client';

import { CreateProductFormInput } from "@/types/ProductType";
import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { FormProvider, RHFTextField, RHFTextFieldNumber } from "@/components/hook_form";
import RHFPhoneField from "@/components/text_field/RHFTextFieldPhone";
import productApi from "@/axios-clients/auth_api/productAPI";
import RHFMultiImageUpload from "@/components/text_field/RHFMultiImageUpload";


const validationSchema = Yup.object().shape({
    name: Yup.string().required('Tên sản phẩm là bắt buộc'),
    category: Yup.string().required('Loại là bắt buộc'),
    originalPrice: Yup.number()
        .transform((value, originalValue) => {
            if (typeof originalValue === 'string') {
                const normalized = originalValue.replace(/,/g, '');
                return parseFloat(normalized);
            }
            return value;
        })
        .typeError('Phải là số')
        .required('Giá gốc là bắt buộc'),
    sellingPrice: Yup.number()
        .transform((value, originalValue) => {
            if (typeof originalValue === 'string') {
                const normalized = originalValue.replace(/,/g, '');
                return parseFloat(normalized);
            }
            return value;
        })
        .typeError('Phải là số')
        .required('Giá bán là bắt buộc'),
    sourceOfProducts: Yup.string().required('Nguồn nhập là bắt buộc'),
    userName: Yup.string().required('Tên người dùng là bắt buộc'),
    phone: Yup.string()
        .required("Số điện thoại là bắt buộc")
        .transform((value) => value.replace(/\D/g, ""))
        .matches(/^\d{10}$/, "Số điện thoại không hợp lệ"),
    address: Yup.string().required('Địa chỉ là bắt buộc'),
    importCosts: Yup.number()
        .transform((value, originalValue) => {
            if (typeof originalValue === 'string') {
                const normalized = originalValue.replace(/,/g, '');
                return parseFloat(normalized);
            }
            return value;
        })
        .typeError('Phải là số')
        .required('Giá nhập là bắt buộc'),
    stockQuantity: Yup.number()
        .transform((value, originalValue) => {
            if (typeof originalValue === 'string') {
                const normalized = originalValue.replace(/,/g, '');
                return parseFloat(normalized);
            }
            return value;
        })
        .typeError('Phải là số')
        .required('Số lượng tồn là bắt buộc'),
    unit: Yup.string().required('Đơn vị là bắt buộc'),
    status: Yup.string().required('Trạng thái là bắt buộc'),
    productImages: Yup.array()
        .of(
            Yup.mixed<File | string>()
                .test("is-valid", "Chỉ chấp nhận ảnh hợp lệ", (value) =>
                    typeof value === "string" || value instanceof File
                )
                .defined()
        )
        .required("Ảnh là bắt buộc")
});

const CreateProduct = () => {
    const router = useRouter();

    const methods = useForm<CreateProductFormInput>({
        resolver: yupResolver(validationSchema),
        mode: "onChange",
        defaultValues: {
            name: '',
            category: '',
            originalPrice: 0,
            sellingPrice: 0,
            sourceOfProducts: '',
            userName: '',
            phone: '',
            address: '',
            importCosts: 0,
            stockQuantity: 0,
            unit: '',
            status: 'Available',
            productImages: [],
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting, isValid },
        watch
    } = methods;

    const productImages = watch("productImages");
    const convertToFormData = (data: Record<string, any>): FormData => {
        const formData = new FormData();

        for (const [key, value] of Object.entries(data)) {
            if (key === "productImages") {
                value.forEach((file: File) => formData.append("ProductImages", file));
            } else {
                formData.append(key, value.toString());
            }
        }

        return formData;
    };

    const onSubmit = async (data: CreateProductFormInput) => {
        try {
            const formData = convertToFormData(data);
            //console.log("Data:", data);
            // console.log("FormData:", formData);
            await productApi.CreateProduct(formData);
            router.push("/admin/manage_product");
        } catch (error) {
            console.error("Nhập sản phẩm thất bại:", error);
        }
    };
    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper elevation={3}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    border: '1px solid #e0e0e0',
                }}>
                <Typography variant="h4" gutterBottom>
                    Nhập sản phẩm mới
                </Typography>

                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <RHFTextField name="name" label="Tên sản phẩm" placeholder="Nhập tên sản phẩm" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextField name="category" label="Loại" placeholder="Nhập loại sản phẩm" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextFieldNumber name="originalPrice" label="Giá gốc" placeholder="Ví dụ: 100000" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextFieldNumber name="sellingPrice" label="Giá bán" placeholder="Ví dụ: 120000" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextFieldNumber name="importCosts" label="Giá nhập" placeholder="Giá nhập từ nhà cung cấp" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextField name="unit" label="Đơn vị" placeholder="VD: chiếc, hộp, kg..." />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextField name="sourceOfProducts" label="Nguồn nhập" placeholder="Tên nhà cung cấp hoặc nguồn hàng" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextFieldNumber name="stockQuantity" label="Số lượng tồn" placeholder="Ví dụ: 50" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextField name="userName" label="Người nhập" placeholder="Tên nhân viên nhập hàng" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFPhoneField name="phone" label="Số điện thoại" placeholder="Ví dụ: 0797302367" />
                        </Grid>
                        <Grid item xs={12}>
                            <RHFTextField name="address" label="Địa chỉ" placeholder="Địa chỉ kho hoặc nơi nhập hàng" />
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

}
export default CreateProduct;