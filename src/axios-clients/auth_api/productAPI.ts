import { Product, ProductListResponse } from "@/types/ProductType";
import axiosClient from "../axiosClient";

const productApi = {
    //GET api
    getProductList: (params?: any): Promise<ProductListResponse> => {
        const url = "/Products/GetProductPagination";
        return axiosClient.get(url, {
            params,
        });
    },
    getProductById: (id: string, params?: any): Promise<Product> => {
        const url = `/Products/GetProductById/${id}`;
        return axiosClient.get(url, {
            params,
        });
    },

    //POST api
    CreateProduct: (body: any): Promise<Product> => {
        const url = "/Products/CreateProduct";
        return axiosClient.post(url, body, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    //PUT api
    UpdateProduct: (id: string, body: any): Promise<Product> => {
        const url = `/Products/UpdateProduct/${id}`;
        return axiosClient.put(url, body, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    UpdateProductQuantity: (id: string, body: any): Promise<{ message: string }> => {
        const url = `/Products/UpdateProductQuantity/${id}`;
        return axiosClient.put(url, body);
    },

    UpdateStock: (params: { productId: number; quantity: number; type: string }): Promise<{ message: string }> => {
        const url = `/Products/UpdateStock`;
        return axiosClient.put(url, null, {
            params,
        });
    },

    //DELETE api
    // deleteSomeThing: (id: string) => {
    //     const url = `/api/v1/someThing/${id}`;
    //     return axiosClient.delete(url);
    // },

    //PATCH api
    // patchSomeThing: (id: string, body: any) => {
    //     const url = `/api/v1/someThing/${id}`;
    //     return axiosClient.patch(url, body);
    // },
};

export default productApi;
