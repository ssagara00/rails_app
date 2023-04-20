import axios from 'axios'

const api = process.env.REACT_APP_BASE_PATH

const axiosInstance = axios.create({
  baseURL: api,
  headers: { "Content-Type": "multipart/form-data" }
})

export default axiosInstance
