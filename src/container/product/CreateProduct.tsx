'use client';

import { CreateProductFormInput } from "@/types/ProductType";
import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Box, Button, Container, Grid2, Paper, Typography } from "@mui/material";
import { FormProvider, RHFTextField, RHFTextFieldNumber } from "@/components/hook_form";
import RHFPhoneField from "@/components/text_field/RHFTextFieldPhone";
import productApi from "@/axios-clients/auth_api/productAPI";
import RHFMultiImageUpload from "@/components/text_field/RHFMultiImageUpload";
import { toast } from "react-toastify";


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
        .required("Số điện thoại là bắt buộc"),
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
const capitalizedWords = (str: string): string => {
    return str
        .toLowerCase()
        .split(" ")
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
};

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
        watch, setValue
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
            console.log("Data:", data);
            // console.log("FormData:", formData);
            await productApi.CreateProduct(formData);
            toast.success("Nhập sản phẩm thành công");
            router.push("/admin/manage_product");
        } catch (error) {
            toast.error("Nhập sản phẩm thất bại");
            console.error("Nhập sản phẩm thất bại:", error);
        }
    };
    return (
        <Container maxWidth="tablet" sx={{ my: 4 }}>
            <Paper elevation={4} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom >
                    Nhập sản phẩm mới
                </Typography>

                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextField
                                name="name"
                                label="Tên sản phẩm"
                                placeholder="Nhập tên sản phẩm" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextField
                                name="category"
                                label="Loại"
                                placeholder="Nhập loại sản phẩm" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextFieldNumber
                                name="originalPrice"
                                label="Giá gốc"
                                placeholder="Ví dụ: 100000"
                                inputProps={{
                                    pattern: '[0-9]*'
                                }} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextFieldNumber
                                name="sellingPrice"
                                label="Giá bán"
                                placeholder="Ví dụ: 120000"
                                inputProps={{
                                    pattern: '[0-9]*'
                                }} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextFieldNumber
                                name="importCosts"
                                label="Giá nhập"
                                placeholder="Giá nhập từ nhà cung cấp"
                                inputProps={{
                                    pattern: '[0-9]*'
                                }} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
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
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextField
                                name="sourceOfProducts"
                                label="Nguồn nhập"
                                placeholder="Tên nhà cung cấp hoặc nguồn hàng" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextFieldNumber
                                name="stockQuantity"
                                label="Số lượng tồn"
                                placeholder="Ví dụ: 50"
                                inputProps={{
                                    pattern: '[0-9]*'
                                }} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextField
                                name="userName"
                                label="Người nhập"
                                placeholder="Tên nhân viên nhập hàng" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextFieldNumber
                                name="phone"
                                label="Số điện thoại"
                                placeholder="Ví dụ: 0797302367"
                                inputProps={{
                                    maxLength: 15,
                                    pattern: '[0-9]*'
                                }} />
                        </Grid2>
                        <Grid2 size={12}>
                            <RHFTextField
                                name="address"
                                label="Địa chỉ"
                                placeholder="Địa chỉ kho hoặc nơi nhập hàng" />
                        </Grid2>

                        <Grid2 size={12}>
                            <RHFMultiImageUpload
                                name="productImages"
                                label="Ảnh sản phẩm" />
                        </Grid2>
                    </Grid2>

                    <Box
                        mt={4}
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        gap={2}
                        sx={(theme) => ({
                            [theme.breakpoints.down("mobile")]: {
                                flexDirection: "column"
                            },
                            [theme.breakpoints.between("mobile", "tablet")]: {
                                flexDirection: "column"
                            },
                            [theme.breakpoints.up("tablet")]: {
                                flexDirection: "row"
                            },
                        })}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting || !isValid || productImages.length === 0}
                            sx={(theme) => ({
                                [theme.breakpoints.down("mobile")]: {
                                    width: "100%"
                                },
                                [theme.breakpoints.between("mobile", "tablet")]: {
                                    width: "80%"
                                },
                                [theme.breakpoints.up("tablet")]: {
                                    width: "auto",
                                    order: 1
                                },
                            })}
                        >
                            {isSubmitting ? "Đang tạo..." : "Nhập sản phẩm"}
                        </Button>

                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => router.push("/admin/manage_product")}
                            sx={(theme) => ({
                                [theme.breakpoints.down("mobile")]: {
                                    width: "100%"
                                },
                                [theme.breakpoints.between("mobile", "tablet")]: {
                                    width: "80%"
                                },
                                [theme.breakpoints.up("tablet")]: {
                                    width: "auto",
                                    order: 2
                                },
                            })}
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