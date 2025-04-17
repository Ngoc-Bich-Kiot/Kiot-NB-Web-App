import axiosClient from "../axiosClient";

const authApi = {
  login: (body: any) => {
    const url = "/authenticate/login";
    return axiosClient.post(url, body);
  },
};

export default authApi;
