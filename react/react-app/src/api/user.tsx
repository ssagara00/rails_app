import axios from "axios"

const axiosuserInstance = axios.create({
  baseURL: "http://localhost:3000"
})

export default axiosuserInstance;
