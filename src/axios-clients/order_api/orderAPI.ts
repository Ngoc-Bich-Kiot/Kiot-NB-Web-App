import axiosClient from "../axiosClient";

const orderApi = {
  //GET api
  getListOrder: (params?: any) => {
    const url = "/Orders/GetOrderPagination";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  getOrderDetail: (id?: any) => {
    const url = `/Orders/GetOrderById/${id}`;
    return axiosClient.get(url);
  },

  //POST api
  createOrder: (body: any) => {
    const url = "/Orders/CreateOrder";
    return axiosClient.post(url, body);
  },

  //PUT api
  putSomeThing: (body: any) => {
    const url = "/api/v1/someThing";
    return axiosClient.put(url, body);
  },

  //DELETE api
  deleteSomeThing: (id: string) => {
    const url = `/api/v1/someThing/${id}`;
    return axiosClient.delete(url);
  },

  //PATCH api
  patchSomeThing: (id: string, body: any) => {
    const url = `/api/v1/someThing/${id}`;
    return axiosClient.patch(url, body);
  },
};

export default orderApi;
