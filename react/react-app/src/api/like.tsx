import axios from "axios"

const axioslikeInstance = axios.create({
  baseURL: "http://localhost:3000"
})

export default axioslikeInstance;
