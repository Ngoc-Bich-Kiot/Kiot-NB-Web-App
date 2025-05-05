import axiosClient from "../axiosClient";

const dashboardApi = {
  dashboard: (params?: any) => {
    const url = "Dashboards/GetDashboardData";
    return axiosClient.get(url, {
      params,
    });
  },
};

export default dashboardApi;
