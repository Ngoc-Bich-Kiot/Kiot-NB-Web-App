import axiosClient from "../axiosClient";
import { AxiosResponse } from "axios";

const BatchAPI = {
  //GET api
  getBatchList: (params?: any) => {
    const url = "/Batch/GetBatchPagination?IsDescending=true";
    return axiosClient.get(url, {
      params,
    });
  },

  //POST api
  CreateBatch: (params?: any) => {
    const url = "/Batch/CreateBatch";
    return axiosClient.post(url, params);
  },
};

export default BatchAPI;
