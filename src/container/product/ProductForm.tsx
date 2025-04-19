'use client';

import { CreateProductFormInput } from "@/types/ProductType";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Box, Button, Grid, Typography } from "@mui/material";
import { FormProvider, RHFTextField, RHFTextFieldNumber } from "@/components/hook_form";
import RHFPhoneField from "@/components/text_field/RHFTextFieldPhone";

type Props = {
    onSubmit: (data: CreateProductFormInput) => void;
    isSubmitting: boolean;
    defaultValues?: Partial<CreateProductFormInput>;
    formTitle: string;
    from: string;
};

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Tên sản phẩm là bắt buộc'),
    category: Yup.string().required('Loại là bắt buộc'),
    originalPrice: Yup.number().required(),
    sellingPrice: Yup.number().required(),
    sourceOfProducts: Yup.string().required(),
    userName: Yup.string().required(),
    phone: Yup.string().required().matches(/^\d{10}$/, "Số điện thoại không hợp lệ"),
    address: Yup.string().required(),
    importCosts: Yup.number().required(),
    stockQuantity: Yup.number().required(),
    unit: Yup.string().required(),
    status: Yup.string().required(),
});

const ProductForm = ({ onSubmit, isSubmitting, defaultValues, formTitle, from }: Props) => {
    const methods = useForm<CreateProductFormInput>({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    // const router = useRouter();
    // const params = useParams();
    // const searchParams = useSearchParams();

    // const id = params.id as string;
    // const from = searchParams.get('from');
    // const handleBack = () => {
    //     if (from === 'table') {
    //         router.push('/admin/manage_product');
    //     } else if (from === 'detail') {
    //         router.push(`/admin/manage_product/${id}/detail`);
    //     } else {
    //         router.push('/admin/manage_product'); // fallback
    //     }
    // };
    return (
        <>
            <Typography variant="h5" gutterBottom>{formTitle}</Typography>

            <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><RHFTextField name="name" label="Tên sản phẩm" /></Grid>
                    <Grid item xs={12} sm={6}><RHFTextField name="category" label="Loại" /></Grid>
                    <Grid item xs={12} sm={6}><RHFTextFieldNumber name="originalPrice" label="Giá gốc" type="number" /></Grid>
                    <Grid item xs={12} sm={6}><RHFTextFieldNumber name="sellingPrice" label="Giá bán" type="number" /></Grid>
                    <Grid item xs={12} sm={6}><RHFTextFieldNumber name="importCosts" label="Giá nhập" type="number" /></Grid>
                    <Grid item xs={12} sm={6}><RHFTextFieldNumber name="stockQuantity" label="Số lượng tồn" type="number" /></Grid>
                    <Grid item xs={12} sm={6}><RHFTextField name="unit" label="Đơn vị" /></Grid>
                    <Grid item xs={12} sm={6}><RHFTextField name="status" label="Trạng thái" /></Grid>
                    <Grid item xs={12} sm={6}><RHFTextField name="sourceOfProducts" label="Nguồn nhập" /></Grid>
                    <Grid item xs={12} sm={6}><RHFTextField name="userName" label="Người tạo" /></Grid>
                    <Grid item xs={12} sm={6}><RHFPhoneField name="phone" label="Số điện thoại" /></Grid>
                    <Grid item xs={12} sm={6}><RHFTextField name="address" label="Địa chỉ" /></Grid>
                </Grid>

                <Box mt={4} display="flex" justifyContent="flex-end" gap={3}>
                    <Button variant="outlined" color="secondary" onClick={() => window.history.back()}>
                        Quay lại
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang xử lý...' : 'Lưu'}
                    </Button>
                </Box>
            </FormProvider>
        </>
    );
};

export default ProductForm;
