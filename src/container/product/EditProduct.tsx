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
    Grid2,
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
import { toast } from "react-toastify";

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

export default function EditProduct({ id }: { id: string }) {
    const router = useRouter();
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
                toast.error("Lấy thông tin sản phẩm thất bại");
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
            await productApi.UpdateProduct(id, formData);
            toast.success("Cập nhật sản phẩm thành công");
            router.push(`/admin/manage_product/${id}/detail`);
        } catch (error) {
            toast.error("Cập nhật sản phẩm thất bại");
            console.error("Cập nhật sản phẩm thất bại:", error);
        }
    };

    return (
        <Container maxWidth="tablet" sx={{ my: 2 }}>
            <Paper elevation={4} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom >
                    Chỉnh sửa sản phẩm
                </Typography>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextField name="name" label="Tên sản phẩm" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextField name="category" label="Loại" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextFieldNumber name="originalPrice" label="Giá gốc" inputProps={{
                                pattern: '[0-9]*'
                            }} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextFieldNumber name="sellingPrice" label="Giá bán" inputProps={{
                                pattern: '[0-9]*'
                            }} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextFieldNumber name="importCosts" label="Giá nhập" inputProps={{
                                pattern: '[0-9]*'
                            }} />
                        </Grid2>
                        {/* <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextField name="sourceOfProducts" label="Nguồn nhập" />
                        </Grid2> */}
                        {/* <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFTextField name="stockQuantity" label="Số lượng tồn" slotProps={{ input: { readOnly: true } }} />
                        </Grid2> */}
                        <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                            <RHFSelect name="status" label="Trạng thái">
                                {productStatusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </RHFSelect>
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                            <RHFMultiImageUpload name="productImages" label="Ảnh sản phẩm" />
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
                            {isSubmitting ? "Đang cập nhật..." : "Lưu thay đổi"}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => router.push(`/admin/manage_product/${id}/detail`)}
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
