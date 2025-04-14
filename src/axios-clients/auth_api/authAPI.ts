import axiosClient from "../axiosClient";

const authApi = {
  login: (body: any) => {
    const url = "/auth/login";
    return axiosClient.post(url, body);
  },
};

export default authApi;
