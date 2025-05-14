"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/ProductType";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid2,
  MenuItem,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  Fade,
  Backdrop,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import productApi from "@/axios-clients/product_api/productAPI";
import ProductImageGallery from "./ProductImages";
import LogTable from "./LogTable";
import { toast } from "react-toastify";

export default function DetailProduct({ id }: { id: string }) {
  const [product, setProduct] = React.useState<Product | null>(null);
  const router = useRouter();
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [editType, setEditType] = React.useState<"Import" | "Export">("Import");
  const [editQuantity, setEditQuantity] = React.useState<number>(0);
  const [rawQuantity, setRawQuantity] = React.useState<string>("0");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");

  const statusMap: Record<
    string,
    {
      label: string;
      color: "success" | "error" | "warning" | "info" | "default";
    }
  > = {
    Available: { label: "Còn hàng", color: "success" },
    OutOfStock: { label: "Hết hàng", color: "error" },
    Incoming: { label: "Hàng về", color: "info" },
    Discontinued: { label: "Ngừng", color: "default" },
    PendingApproval: { label: "Phê duyệt", color: "warning" },
    Damaged: { label: "Hư hỏng", color: "error" },
    Expired: { label: "Hết hạn", color: "error" },
  };

  const hasExportError =
    editType === "Export" &&
    (product?.stockQuantity === 0 ||
      editQuantity > (product?.stockQuantity ?? 0));

  const exportHelperText =
    editType === "Export" && product
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

  const isInvalid =
    !name.trim() || !phone.trim() || !address.trim() || editQuantity <= 0;

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setName("");
    setPhone("");
    setAddress("");
    setEditType("Import");
    setEditQuantity(0);
    setRawQuantity("0");
    setOpenEditDialog(false);
    fetchProduct();
  };

  const handleSaveQuickEdit = async () => {
    try {
      await productApi.UpdateStock(id, editQuantity, editType, {
        name,
        phone,
        address,
      });
      setName("");
      setPhone("");
      setAddress("");
      setEditType("Import");
      setEditQuantity(0);
      setRawQuantity("0");
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
      value = value.replace(/^0+/, "");
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

  if (!product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6" color="text.secondary">
          Đang tải thông tin sản phẩm...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          borderBottom: "1px solid #e2e8f0",
          px: 3,
          py: 2,
          zIndex: 10,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            onClick={() => router.push("/admin/manage_product")}
            sx={{
              backgroundColor: "#f1f5f9",
              "&:hover": { backgroundColor: "#e2e8f0" },
            }}
          >
            <ArrowBackOutlinedIcon />
          </IconButton>
          <Box flex={1}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Mã sản phẩm: #{id}
            </Typography>
          </Box>
          {!product.isDeleted && (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Chỉnh sửa sản phẩm">
                <Button
                  variant="outlined"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() =>
                    router.push(`/admin/manage_product/${id}/edit`)
                  }
                  sx={{ borderRadius: 3 }}
                >
                  Chỉnh sửa
                </Button>
              </Tooltip>
              <Tooltip title="Xuất/Nhập kho">
                <Button
                  variant="contained"
                  startIcon={<InventoryOutlinedIcon />}
                  onClick={handleOpenEditDialog}
                  sx={{ borderRadius: 3 }}
                >
                  Xuất/Nhập
                </Button>
              </Tooltip>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Grid2 container spacing={3}>
          {/* Images */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}
            >
              <CardContent>
                {product.images.length > 0 ? (
                  <ProductImageGallery images={product.images} />
                ) : (
                  <Box
                    sx={{
                      height: 400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f1f5f9",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Chưa có hình ảnh
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid2>

          {/* Product Info */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              {/* Status & Category */}
              <Card
                elevation={0}
                sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Trạng thái & Danh mục
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={
                          statusMap[product.status]?.label || "Không xác định"
                        }
                        color={statusMap[product.status]?.color || "default"}
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip
                        label={
                          product.isDeleted
                            ? "Không hoạt động"
                            : "Đang hoạt động"
                        }
                        color={product.isDeleted ? "error" : "success"}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CategoryOutlinedIcon color="action" />
                    <Typography variant="body1" color="text.secondary">
                      Danh mục:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {product.category}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card
                elevation={0}
                sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    Thông tin giá
                  </Typography>
                  <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: "#e3f2fd" }}>
                          <AttachMoneyOutlinedIcon />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Giá gốc
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {new Intl.NumberFormat("vi-VN").format(
                              product.originalPrice
                            )}{" "}
                            VNĐ
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid2>
                    <Grid2 size={12}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: "#f3e5f5" }}>
                          <LocalOfferOutlinedIcon />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Giá bán
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="primary"
                          >
                            {new Intl.NumberFormat("vi-VN").format(
                              product.sellingPrice
                            )}{" "}
                            VNĐ
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid2>
                    <Grid2 size={12}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: "#fff3e0" }}>
                          <TrendingUpOutlinedIcon />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Chi phí nhập
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {new Intl.NumberFormat("vi-VN").format(
                              product.importCosts
                            )}{" "}
                            VNĐ
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid2>
                  </Grid2>
                </CardContent>
              </Card>

              {/* Inventory */}
              <Card
                elevation={0}
                sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    Thông tin kho
                  </Typography>
                  <Stack spacing={3}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: "#e8f5e9" }}>
                        <InventoryOutlinedIcon />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary">
                          Tồn kho
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {new Intl.NumberFormat("vi-VN").format(
                            product.stockQuantity
                          )}{" "}
                          sản phẩm
                        </Typography>
                      </Box>
                      <Badge
                        badgeContent={product.stockQuantity === 0 ? "Hết" : ""}
                        color="error"
                      />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: "#ede7f6" }}>
                        <StoreOutlinedIcon />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary">
                          Nguồn hàng
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {product.sourceOfProducts}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card
                elevation={0}
                sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}
              >
                <CardContent>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    color={product.isDeleted ? "success" : "error"}
                    startIcon={
                      product.isDeleted ? (
                        <RestoreFromTrashOutlinedIcon />
                      ) : (
                        <DeleteOutlinedIcon />
                      )
                    }
                    onClick={() => setOpenDeleteDialog(true)}
                    sx={{ borderRadius: 3, py: 1.5 }}
                  >
                    {product.isDeleted
                      ? "Khôi phục sản phẩm"
                      : "Ngừng hoạt động"}
                  </Button>
                </CardContent>
              </Card>
            </Stack>
          </Grid2>
        </Grid2>

        {/* History Section */}
        <Box mt={5}>
          <Card
            elevation={0}
            sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Lịch sử sản phẩm
              </Typography>
              <LogTable logs={product.logs} />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Cập nhật tồn kho
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tồn kho hiện tại: {product.stockQuantity} sản phẩm
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Tên người thực hiện"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <PersonOutlineIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
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
              InputProps={{
                startAdornment: (
                  <PhoneOutlinedIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
            <TextField
              fullWidth
              label="Địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              InputProps={{
                startAdornment: (
                  <LocationOnOutlinedIcon
                    sx={{ mr: 1, color: "action.active" }}
                  />
                ),
              }}
            />
            <FormControl fullWidth>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Loại thao tác
              </Typography>
              <Select
                value={editType}
                onChange={(e) =>
                  setEditType(e.target.value as "Import" | "Export")
                }
                sx={{
                  borderRadius: 2,
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                }}
              >
                <MenuItem value="Import">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <TrendingUpOutlinedIcon color="success" />
                    <Typography>Nhập hàng</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="Export">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <TrendingUpOutlinedIcon
                      color="error"
                      sx={{ transform: "rotate(180deg)" }}
                    />
                    <Typography>Xuất hàng</Typography>
                  </Stack>
                </MenuItem>
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
              InputProps={{
                startAdornment: (
                  <InventoryOutlinedIcon
                    sx={{ mr: 1, color: "action.active" }}
                  />
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseEditDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveQuickEdit}
            disabled={isInvalid}
            sx={{ borderRadius: 2 }}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {product.isDeleted ? (
              <RestoreFromTrashOutlinedIcon color="success" fontSize="large" />
            ) : (
              <DeleteOutlinedIcon color="error" fontSize="large" />
            )}
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {product.isDeleted
                  ? "Khôi phục sản phẩm"
                  : "Ngừng hoạt động sản phẩm"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.isDeleted
                  ? "Sản phẩm sẽ được kích hoạt lại"
                  : "Sản phẩm sẽ được ẩn khỏi hệ thống"}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box
            sx={{
              p: 2,
              backgroundColor: "#f8fafc",
              borderRadius: 2,
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography variant="body1" textAlign="center">
              Bạn có chắc chắn muốn{" "}
              {product.isDeleted ? "khôi phục" : "ngừng hoạt động"} sản phẩm{" "}
              <Typography component="span" fontWeight={600} color="primary">
                "{product.name}"
              </Typography>{" "}
              này không?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color={product.isDeleted ? "success" : "error"}
            sx={{ borderRadius: 2 }}
          >
            {product.isDeleted ? "Khôi phục" : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
