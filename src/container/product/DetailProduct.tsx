'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/ProductType';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import productApi from '@/axios-clients/auth_api/productAPI';
import ProductImageGallery from './ProductImages';
import LogTable from './LogTable';

export default function DetailProduct({ id }: { id: string }) {
    const [product, setProduct] = React.useState<Product | null>(null);
    const router = useRouter();
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [editType, setEditType] = React.useState<'Import' | 'Export'>('Import');
    const [editQuantity, setEditQuantity] = React.useState<number>(0);
    const [rawQuantity, setRawQuantity] = React.useState<string>('0');
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');

    const statusMap: Record<string, { label: string; color: 'success' | 'error' | 'warning' | 'info' | 'default' }> = {
        Available: { label: 'Còn hàng', color: 'success' },
        OutOfStock: { label: 'Hết hàng', color: 'error' },
        Incoming: { label: 'Hàng về', color: 'info' },
        Discontinued: { label: 'Ngừng', color: 'default' },
        PendingApproval: { label: 'Phê duyệt', color: 'warning' },
        Damaged: { label: 'Hư hỏng', color: 'error' },
        Expired: { label: 'Hết hạn', color: 'error' },
    };

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

    const isInvalid = !name.trim() || !phone.trim() || !address.trim() || editQuantity <= 0;

    const handleOpenEditDialog = () => {
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setName('');
        setPhone('');
        setAddress('');
        setEditType('Import');
        setEditQuantity(0);
        setOpenEditDialog(false);
        fetchProduct();
    };

    const handleSaveQuickEdit = async () => {
        try {
            await productApi.UpdateStock(id, editQuantity, editType, { name, phone, address });
            setName('');
            setPhone('');
            setAddress('');
            setEditType('Import');
            setEditQuantity(0);
            setOpenEditDialog(false);
            fetchProduct();
        } catch (error) {
            console.error("Lỗi khi cập nhật tồn kho:", error);
        }
    };
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        if (!/^\d*$/.test(value)) return;

        if (value.length > 1) {
            value = value.replace(/^0+/, '');
        }

        setRawQuantity(value);
        setEditQuantity(Number(value));
    };

    if (!product) return <Typography>Đang tải...</Typography>;

    return (
        <Box sx={{ p: 2 }} >
            <ArrowBackOutlinedIcon
                onClick={() => router.push('/admin/manage_product')}
                sx={{ cursor: 'pointer', color: 'black', ":hover": { color: 'grey' }, alignSelf: 'center' }}
            />
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
                Chi tiết sản phẩm: {product.name}
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    {product.images.length > 0 && (
                        <ProductImageGallery images={product.images} />
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>Danh mục:</Typography>
                            <Typography variant='subtitle1' sx={{ width: "100px", textAlign: "center" }}>{product.category}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>Giá gốc:</Typography>
                            <Typography variant='subtitle1' sx={{ width: "100px", textAlign: "center" }}>
                                {new Intl.NumberFormat('vi-VN').format(product.originalPrice)} VNĐ</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>Giá bán:</Typography>
                            <Typography variant='subtitle1' sx={{ width: "100px", textAlign: "center" }}>
                                {new Intl.NumberFormat('vi-VN').format(product.sellingPrice)} VNĐ
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>Nguồn hàng:</Typography>
                            <Typography variant='subtitle1' sx={{ width: "100px", textAlign: "center" }}>{product.sourceOfProducts}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>Chi phí nhập:</Typography>
                            <Typography variant='subtitle1' sx={{ width: "100px", textAlign: "center" }}>
                                {new Intl.NumberFormat('vi-VN').format(product.importCosts)} VNĐ
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>Tồn kho:</Typography>
                            <Typography variant='subtitle1' sx={{ width: "100px", textAlign: "center" }}>
                                {new Intl.NumberFormat('vi-VN').format(product.stockQuantity)}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>Tình trạng:</Typography>
                            <Chip
                                label={statusMap[product.status]?.label || 'Không xác định'}
                                color={statusMap[product.status]?.color || 'default'}
                                variant="outlined"
                                sx={{ width: "100px", textAlign: "center", fontSize: "16px" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>Trạng thái:</Typography>
                            <Typography variant='subtitle1' sx={{ width: "100px", textAlign: "center" }}>{product.isDeleted ? "Ngừng" : "Hoạt động"}</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" gap={2} justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => router.push(`/admin/manage_product/${id}/edit?from=detail`)}
                            >
                                Chỉnh sửa sản phẩm
                            </Button>

                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleOpenEditDialog}
                            >
                                Xuất/Nhập
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Box mt={5}>
                <Typography variant="h5" gutterBottom>Lịch sử sản phẩm</Typography>
                <LogTable props={product.logs} />
            </Box>
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Chỉnh sửa tồn kho</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Tên người thực hiện"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Số điện thoại"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                setPhone(value);
                            }
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Địa chỉ"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <FormControl fullWidth>
                        <Select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value as 'Import' | 'Export')}
                            sx={{ fontWeight: 700 }}
                        >
                            <MenuItem value="Import" sx={{ fontWeight: 200 }}>Nhập hàng</MenuItem>
                            <MenuItem value="Export" sx={{ fontWeight: 200 }}>Xuất hàng</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Số lượng"
                        type="text"
                        value={rawQuantity}
                        onChange={handleQuantityChange}

                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Hủy</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveQuickEdit}
                        disabled={isInvalid}
                    >
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}