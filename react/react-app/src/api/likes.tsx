import axioslikeInstance from "./like"
import { Like } from "../interfaces/like_interface"

// 一覧を取得
export const getLikes = () => {
  return axioslikeInstance.get("/likes")
}

// like_count
export const showLike = (post_id: number) => {
  return axioslikeInstance.get(`/likes/${post_id}`)
}

// 新規作成
export const createLike = (data :Like) => {
  return axioslikeInstance.post("/likes/", data)
}

// 削除
export const deleteLike = (user_id: number, post_id: number) => {
  return axioslikeInstance.delete(`/likes/delete/${user_id}/${post_id}`)
}

// like_by
export const searchLike = (user_id: number, post_id: number) => {
  return axioslikeInstance.get(`/likes/like_by/${user_id}/${post_id}`)
}
