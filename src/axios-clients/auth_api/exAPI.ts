import axiosClient from "../axiosClient";

const nameApi = {
  //GET api
  getSomeThing: (params?: any) => {
    const url = "/api/v1/someThing";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  //POST api
  postSomeThing: (body: any) => {
    const url = "/api/v1/someThing";
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

export default nameApi;
