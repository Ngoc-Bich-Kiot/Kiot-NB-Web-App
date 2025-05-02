'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/ProductType';
import { Box, Button, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid2, MenuItem, Select, TextField, Typography } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import productApi from '@/axios-clients/auth_api/productAPI';
import ProductImageGallery from './ProductImages';
import LogTable from './LogTable';
import { toast } from 'react-toastify';

export default function DetailProduct({ id }: { id: string }) {
    const [product, setProduct] = React.useState<Product | null>(null);
    const router = useRouter();
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
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
    const hasExportError = editType === 'Export' && (
        product?.stockQuantity === 0 ||
        editQuantity > (product?.stockQuantity ?? 0)
    );

    const exportHelperText = editType === 'Export' && product
        ? product.stockQuantity === 0
            ? "Không thể xuất khi hết kho"
            : editQuantity > product.stockQuantity
                ? `Số lượng xuất vượt quá tồn kho (${product.stockQuantity})`
                : ""
        : "";

    const fetchProduct = async () => {
        try {
            const data: Product = await productApi.getProductById(id);
            if (data) {
                setProduct(data);
            }
        } catch (error) {
            toast.error("Lấy thông tin sản phẩm thất bại");
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
        setRawQuantity('0');
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
            setRawQuantity('0');
            setOpenEditDialog(false);
            toast.success("Cập nhật tồn kho thành công");
            fetchProduct();
        } catch (error) {
            toast.error("Cập nhật tồn kho thất bại");
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
    const handleDelete = async () => {
        try {
            await productApi.DeleteOrEnable(id, !product?.isDeleted ? 1 : 0);
            toast.success("Đổi trạng thái sản phẩm thành công");
            fetchProduct();
        } catch (error) {
            toast.error("Đổi trạng thái sản phẩm thất bại");
            console.error("Lỗi khi xoá/khôi phục sản phẩm:", error);
        } finally {
            setOpenDeleteDialog(false);
        }
    };

    if (!product) return <Typography>Đang tải...</Typography>;

    return (
        <Box sx={{
            width: 'auto',
            mx: 1,
            my: 1,
            p: 2,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 3,
            border: '1px solid #e0e0e0',
        }} >
            <ArrowBackOutlinedIcon
                onClick={() => router.push('/admin/manage_product')}
                sx={{ cursor: 'pointer', color: 'black', ":hover": { color: 'grey' }, alignSelf: 'center' }}
            />
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
                Chi tiết sản phẩm: {product.name}
            </Typography>

            <Grid2 container spacing={4}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    {product.images.length > 0 && (
                        <ProductImageGallery images={product.images} />
                    )}
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>Danh mục:</Typography>
                            <Typography variant='subtitle1' sx={{ width: "200px", textAlign: "center" }}>{product.category}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>Giá gốc:</Typography>
                            <Typography variant='subtitle1' sx={{ width: "200px", textAlign: "center" }}>
                                {new Intl.NumberFormat('vi-VN').format(product.originalPrice)} VNĐ</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>Giá bán:</Typography>
                            <Typography variant='subtitle1' sx={{ width: "200px", textAlign: "center" }}>
                                {new Intl.NumberFormat('vi-VN').format(product.sellingPrice)} VNĐ
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>Nguồn hàng:</Typography>
                            <Typography variant='subtitle1' sx={{ width: "200px", textAlign: "center" }}>{product.sourceOfProducts}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>Chi phí nhập:</Typography>
                            <Typography variant='subtitle1' sx={{ width: "200px", textAlign: "center" }}>
                                {new Intl.NumberFormat('vi-VN').format(product.importCosts)} VNĐ
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>Tồn kho:</Typography>
                            <Typography variant='subtitle1' sx={{ width: "200px", textAlign: "center" }}>
                                {new Intl.NumberFormat('vi-VN').format(product.stockQuantity)}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>Tình trạng:</Typography>
                            <Chip
                                label={statusMap[product.status]?.label || 'KHÔNG'}
                                color={statusMap[product.status]?.color || 'default'}
                                variant="outlined"
                                sx={{ width: "200px", textAlign: "center", fontSize: "16px", fontFamily: "sans-serif" }}
                            />
                        </Box>
                        {/* <Box display="flex" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>Trạng thái:</Typography>
                            <Chip
                                label={product.isDeleted ? "Không hoạt động" : "Đang Hoạt động"}
                                variant="outlined"
                                sx={{
                                    width: "200px",
                                    textAlign: "center",
                                    fontSize: "16px",
                                    fontFamily: "sans-serif",
                                    backgroundColor: product.isDeleted ? "#ef9a9a" : "#a5d6a7",
                                    color: product.isDeleted ? "#E53935" : "#2e7d32",
                                    borderColor: product.isDeleted ? "#E53935" : "#2e7d32",
                                }}
                            />
                        </Box> */}
                        <Divider sx={{ my: 2 }} />
                        <Box
                            display="flex"
                            flexDirection={{ xs: 'column', sm: 'row' }}
                            gap={2}
                            justifyContent="flex-end"
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => router.push(`/admin/manage_product/${id}/edit`)}
                                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                            >
                                Chỉnh sửa sản phẩm
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={handleOpenEditDialog}
                                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                            >
                                Xuất/Nhập
                            </Button>

                            <Button
                                variant="contained"
                                color={product.isDeleted ? 'success' : 'error'}
                                fullWidth
                                onClick={() => setOpenDeleteDialog(true)}
                                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                            >
                                {product.isDeleted ? 'Khôi phục' : 'Ngừng hoạt động'}
                            </Button>
                        </Box>

                    </Box>
                </Grid2>
            </Grid2>

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
                        error={hasExportError}
                        helperText={exportHelperText}
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
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                disableEnforceFocus
                disableAutoFocus
            >
                <DialogTitle sx={{ color: 'red' }}>
                    {product.isDeleted ? "Xác nhận khôi phục sản phẩm?" : "Xác nhận ngừng hoạt động sản phẩm?"}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn {product.isDeleted ? "khôi phục" : "ngừng hoạt động"} sản phẩm này?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
                    <Button onClick={handleDelete} color="primary" variant="contained">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}