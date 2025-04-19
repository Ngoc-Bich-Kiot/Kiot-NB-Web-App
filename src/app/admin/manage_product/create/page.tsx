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
    // productImages: Yup.array()
    //     .of(
    //         Yup.object().shape({
    //             id: Yup.number().optional(),
    //             urlPath: Yup.string().required("Đường dẫn ảnh là bắt buộc"),
    //         })
    //     )
    //     .required("Ảnh sản phẩm là bắt buộc")
    //     .min(1, "Cần ít nhất 1 ảnh"),
});

const CreateProduct = () => {
    const router = useRouter();

    const methods = useForm<CreateProductFormInput>({
        resolver: yupResolver(validationSchema),
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
            status: '',
            // productImages: [],
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const convertToFormData = (data: Record<string, any>): FormData => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
            formData.append(key, value.toString());
        }
        return formData;
    };

    const onSubmit = async (data: CreateProductFormInput) => {
        try {
            const formData = convertToFormData(data);
            await productApi.CreateProduct(formData);
            router.push("/admin/manage_product");
        } catch (error) {
            console.error("Failed to create product:", error);
        }
    };
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Nhập sản phẩm mới
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
                            <RHFTextFieldNumber name="originalPrice" label="Giá gốc" type="number" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextFieldNumber name="sellingPrice" label="Giá bán" type="number" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextFieldNumber name="importCosts" label="Giá nhập" type="number" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextFieldNumber name="stockQuantity" label="Số lượng tồn" type="number" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextField name="unit" label="Đơn vị" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextField name="status" label="Trạng thái" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextField name="sourceOfProducts" label="Nguồn nhập" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextField name="userName" label="Người tạo" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFPhoneField name="phone" label="Số điện thoại" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RHFTextField name="address" label="Địa chỉ" />
                        </Grid>

                        {/* <Grid item xs={12}>
                            <RHFTextField name="productImages" label="Ảnh sản phẩm (URL cách nhau bằng dấu phẩy)" />
                        </Grid> */}
                    </Grid>

                    <Box mt={4} display="flex" justifyContent="flex-end">
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Nhập sản phẩm'}
                        </Button>
                    </Box>
                </FormProvider>
            </Paper>
        </Container>
    );

}
export default CreateProduct;