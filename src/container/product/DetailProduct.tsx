'use client';


import React from 'react';
import { useParams } from 'next/navigation';
import { Product, ProductListResponse } from '@/types/ProductType';
import { Box, Card, CardContent, CardMedia, Divider, Grid, Typography } from '@mui/material';
import productApi from '@/axios-clients/auth_api/productAPI';
import ProductImageGallery from './ProductImages';
import LogTable from './LogTable';

export default function DetailProduct({ id }: { id: string }) {
    const [product, setProduct] = React.useState<Product | null>(null);

    const fetchProduct = async () => {
        try {
            const data: Product = await productApi.getProductById(id);

            if (data) {
                setProduct(data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        }
    };

    React.useEffect(() => {
        fetchProduct();
    }, []);

    if (!product) return <Typography>Đang tải...</Typography>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Thông tin sản phẩm: {product.name}
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    {product.images.length > 0 && (
                        <ProductImageGallery images={product.images} />
                    )}
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Danh mục: {product.category}</Typography>
                            <Typography>Giá gốc: {product.originalPrice} VNĐ</Typography>
                            <Typography>Giá bán: {product.sellingPrice} VNĐ</Typography>
                            <Typography>Nguồn hàng: {product.sourceOfProducts}</Typography>
                            <Typography>Chi phí nhập: {product.importCosts} VNĐ</Typography>
                            <Typography>Tồn kho: {product.stockQuantity}</Typography>
                            <Typography>Trạng thái: {product.status}</Typography>
                            <Typography>Trạng thái: {product.isDeleted}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box mt={5}>
                <Typography variant="h5" gutterBottom>Lịch sử sản phẩm</Typography>
                <LogTable props={product.logs} />
            </Box>
        </Box>
    );
}