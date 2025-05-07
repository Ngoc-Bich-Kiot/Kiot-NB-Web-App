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
import { colors, font_weight } from '@/styles/config-file';

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

    const statusMap: Record<string, { label: string; color: string }> = {
        Available: { label: "Còn hàng", color: "#2e7d32" },
        OutOfStock: { label: "Hết hàng", color: "#d32f2f" },
        Incoming: { label: "Hàng về", color: "#0288d1" },
        Discontinued: { label: "Ngừng", color: "#616161" },
        PendingApproval: { label: "Phê duyệt", color: "#ed6c02" },
        Damaged: { label: "Hư hỏng", color: "#c62828" },
        Expired: { label: "Hết hạn", color: "#b71c1c" },
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
            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: font_weight.semiBold, textAlign: 'center' }}
            >
                Chi tiết sản phẩm: {product.name}
            </Typography>

            <Grid2 container spacing={4}>
                <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                    {product.images.length > 0 && (
                        <ProductImageGallery images={product.images} />
                    )}
                </Grid2>
                <Grid2 size={{ xs: 12, mobile: 12, tablet: 6, desktop: 6 }}>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Danh mục:</Typography>
                            <Typography variant="body1" sx={{ color: colors.grey_600 }}>{product.category}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Giá gốc:</Typography>
                            <Typography variant="body1" sx={{ color: colors.grey_600 }}>
                                {new Intl.NumberFormat('vi-VN').format(product.originalPrice)} VNĐ</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Giá bán:</Typography>
                            <Typography variant="body1" sx={{ color: colors.grey_600 }}>
                                {new Intl.NumberFormat('vi-VN').format(product.sellingPrice)} VNĐ
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Nguồn hàng:</Typography>
                            <Typography variant="body1" sx={{ color: colors.grey_600 }}>{product.sourceOfProducts}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Chi phí nhập:</Typography>
                            <Typography variant="body1" sx={{ color: colors.grey_600 }}>
                                {new Intl.NumberFormat('vi-VN').format(product.importCosts)} VNĐ
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Tồn kho:</Typography>
                            <Typography variant="body1" sx={{ color: colors.grey_600 }}>
                                {new Intl.NumberFormat('vi-VN').format(product.stockQuantity)}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Tình trạng:</Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: statusMap[product.status]?.color || "text.primary",
                                    fontSize: "16px",
                                    fontFamily: "sans-serif",
                                    fontWeight: 600,
                                }}
                            >
                                {statusMap[product.status]?.label || "KHÔNG"}
                            </Typography>
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
                            {product.isDeleted === false && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={() => router.push(`/admin/manage_product/${id}/edit`)}
                                        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                                    >
                                        Chỉnh sửa
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
                                </>
                            )}
                            <Button
                                variant="contained"
                                color={product.isDeleted ? 'success' : 'error'}
                                fullWidth
                                onClick={() => setOpenDeleteDialog(true)}
                                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                            >
                                {product.isDeleted ? 'Khôi phục' : 'Tạm dừng'}
                            </Button>
                        </Box>

                    </Box>
                </Grid2>
            </Grid2>

            <Box mt={5}>
                <Typography variant="h6" gutterBottom>Lịch sử sản phẩm</Typography>
                <LogTable logs={product.logs} />
            </Box>
            <Dialog fullWidth open={openEditDialog} onClose={handleCloseEditDialog}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 1,
                        bgcolor: colors.primary,
                        color: colors.white,
                    }}
                >
                    <DialogTitle
                        width="100%"
                        sx={{
                            textTransform: "uppercase",
                            fontWeight: font_weight.regular,
                        }}
                    >
                        Chỉnh sửa tồn kho
                    </DialogTitle>
                </Box>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Tên người thực hiện"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap={2}
                    px={3}
                    mb={2}
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
                        variant="contained"
                        onClick={handleSaveQuickEdit}
                        disabled={isInvalid}
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
                        Lưu
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCloseEditDialog}
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
                        Hủy
                    </Button>
                </Box>
            </Dialog>
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                disableEnforceFocus
                disableAutoFocus
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: colors.primary,
                        color: colors.white,
                    }}
                >
                    <DialogTitle width="100%">
                        {product.isDeleted ? "Xác nhận khôi phục sản phẩm?" : "Xác nhận ngừng hoạt động sản phẩm?"}
                    </DialogTitle>
                </Box>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn {product.isDeleted ? "khôi phục" : "ngừng hoạt động"} sản phẩm này?
                    </Typography>
                </DialogContent>
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap={2}
                    px={3}
                    mb={2}
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
                        onClick={handleDelete}
                        color="primary"
                        variant="contained"
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
                        Xác nhận
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setOpenDeleteDialog(false)}
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
                        Hủy
                    </Button>
                </Box>
            </Dialog>
        </Box >
    );
}