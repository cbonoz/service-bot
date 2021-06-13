import axios from "axios";

const baseURL = "http://localhost:8000";

var axiosInstance = axios.create({
  baseURL,
});

export const getCount = () => {
  return axiosInstance.get("/count");
};

export const postData = (data) => {
  return axiosInstance.post("/data", { data });
};

export const postResponse = (query) => {
  return axiosInstance.post("/chat", { query });
};
