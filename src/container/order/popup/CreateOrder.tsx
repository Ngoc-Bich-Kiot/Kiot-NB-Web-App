"use client";
import productApi from "@/axios-clients/product_api/productAPI";
import orderApi from "@/axios-clients/order_api/orderAPI";
import {
  FormProvider,
  RHFAutoComplete,
  RHFSelect,
  RHFTextField,
} from "@/components/hook_form";
import { colors, font_weight } from "@/styles/config-file";
import { Product } from "@/types/ProductType";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
} from "@mui/material";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "@/axios-clients/user_api/userAPI";
import { User } from "@/types/Usertype";

interface CreateOrderProps {
  open: boolean;
  handleClose: () => void;
  fetchData: () => void;
}

interface OrderDetailForm {
  productId: number;
  quantity: number;
}

interface CreateOrderForm {
  name: string;
  phone: string;
  // address: string;
  orderDetails: OrderDetailForm[];
}

interface userInformationType {
  name: string;
  phone: string;
  address: string;
}

const CreateOrder: React.FC<CreateOrderProps> = ({
  open,
  handleClose,
  fetchData,
}) => {
  // Define state
  const [listProduct, setListProduct] = React.useState<Product[]>([]);
  const [isPhoneNumber, setIsPhoneNumber] = React.useState<boolean>(false);
  const [userInformation, setUserInformation] =
    React.useState<userInformationType>();
  const [usersList, setUsersList] = React.useState<User[]>([]); // Thay đổi kiểu dữ liệu nếu cần

  // Define default values
  const defaultValues: CreateOrderForm = {
    name: "",
    phone: "",
    // address: "",
    orderDetails: [
      {
        productId: 0,
        quantity: 1, // Đặt giá trị mặc định cho số lượng là 1
      },
    ],
  };

  // Call api to get list product
  const getListProduct = async () => {
    try {
      const res: any = await productApi.getAvailableProductList({
        pageIndex: 0,
        pageSize: 100,
      });
      setListProduct(res.items);
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình lấy danh sách sản phẩm");
      console.error("Lỗi khi lấy danh sách sản phẩm:", error); // Thêm log lỗi chi tiết
    }
  };

  // Call api to get list user
  const getListUser = async () => {
    try {
      const res: any = await userApi.getListUsers({
        pageIndex: 0,
        pageSize: 1000,
      });
      setUsersList(res.items);
      console.log("Danh sách người dùng:", res.items); // In log danh sách người dùng
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình lấy danh sách người dùng");
      console.error("Lỗi khi lấy danh sách người dùng:", error); // Thêm log lỗi chi tiết
    }
  };

  React.useEffect(() => {
    getListProduct();
    getListUser();
  }, []);

  // Yup validation schema
  const orderDetailSchema = Yup.object().shape({
    productId: Yup.number()
      .required("Vui lòng chọn sản phẩm")
      .min(1, "Sản phẩm không hợp lệ"),
    quantity: Yup.number()
      .required("Vui lòng nhập số lượng")
      .min(1, "Số lượng phải lớn hơn 0"),
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Vui lòng nhập tên người đặt"),
    phone: Yup.string().required("Vui lòng nhập số điện thoại"),
    // address: Yup.string().required("Vui lòng nhập địa chỉ"),
    orderDetails: Yup.array()
      .of(orderDetailSchema)
      .min(1, "Vui lòng chọn ít nhất một sản phẩm"),
  });

  // Handle submit
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control, // Thêm control để sử dụng với useFieldArray
    getValues,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    // Sử dụng useFieldArray để quản lý mảng orderDetails
    control,
    name: "orderDetails",
  });

  const createOrder = async (data: any) => {
    console.log("Dữ liệu đơn hàng:", data);
    try {
      const res = await orderApi.createOrder(data);
      console.log("Phản hồi từ API:", res); // In log phản hồi từ API
      toast.success("Tạo đơn hàng thành công");
      handleClose();
      fetchData();
    } catch (error: any) {
      toast.error("Tạo đơn hàng thất bại");
      console.error("Lỗi tạo đơn hàng:", error.response?.data || error.message); // Log lỗi chi tiết từ response hoặc message
    }
  };

  //func add field product
  const handleAddProduct = () => {
    append({ productId: 0, quantity: 1 }); // Thêm một sản phẩm mới vào form
  };

  //func check phone number
  const handleCheckPhoneNumber = async () => {
    const phone = getValues("phone");
    try {
      const res: any = await userApi.getUserByPhone({ phone });
      console.log("Thông tin khách hàng:", res); // In log thông tin khách hàng
      setUserInformation(res);
      methods.setValue("name", res.name);
      // methods.setValue("address", res.address);
      setIsPhoneNumber(true);
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình lấy thông tin khách hàng");
      console.error("Lỗi khi lấy thông tin khách hàng:", error); // Thêm log lỗi chi tiết
    }
  };

  // Watch the phone field for changes and reset isPhoneNumber if it changes
  const phoneValue = watch("phone");

  React.useEffect(() => {
    if (!phoneValue) {
      setIsPhoneNumber(false);
    }
  }, [phoneValue]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(createOrder)}>
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
            sx={{
              textTransform: "uppercase",
              fontWeight: font_weight.regular,
            }}
          >
            Tạo đơn hàng
          </DialogTitle>
          <IconButton onClick={handleClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Grid2 container spacing={4} sx={{ mt: 1 }}>
            <Grid2 size={12}>
              <Grid2
                container
                spacing={4}
                sx={{ mt: 1, display: "flex", alignItems: "center" }}
              >
                <Grid2 size={10}>
                  <RHFAutoComplete
                    name="phone"
                    label="Số điện thoại"
                    options={usersList}
                  />
                </Grid2>
                <Grid2 size={2}>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: colors.green_400 }}
                    onClick={() => handleCheckPhoneNumber()}
                  >
                    Chọn
                  </Button>
                </Grid2>
              </Grid2>
            </Grid2>
            {isPhoneNumber === true ? (
              <>
                <Grid2 size={12}>
                  <RHFTextField
                    name="name"
                    label="Tên người đặt"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid2>
                {/* <Grid2 size={12}>
                  <RHFTextField
                    name="address"
                    label="Địa chỉ"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid2> */}
              </>
            ) : null}
            {fields.map((item, index) => (
              <React.Fragment key={item.id}>
                <Grid2 container spacing={2} alignItems="center">
                  <Grid2 size={8}>
                    <RHFSelect
                      name={`orderDetails.${index}.productId`}
                      label="Sản Phẩm"
                      fullWidth
                    >
                      <option value={0}>Chọn sản phẩm</option>
                      {listProduct?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </RHFSelect>
                  </Grid2>
                  <Grid2 size={3}>
                    <RHFTextField
                      name={`orderDetails.${index}.quantity`}
                      label="Số lượng"
                      type="number"
                    />
                  </Grid2>
                  <Grid2 size={1}>
                    <IconButton onClick={() => remove(index)} color="error">
                      <CloseIcon />
                    </IconButton>
                  </Grid2>
                </Grid2>
              </React.Fragment>
            ))}
            <Grid2 size={12}>
              <Button onClick={handleAddProduct} variant="outlined">
                Thêm sản phẩm
              </Button>
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang tạo..." : "Tạo đơn hàng"}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default CreateOrder;
