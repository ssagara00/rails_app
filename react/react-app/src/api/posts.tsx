import axiosInstance from "./axios"
import { Post } from "../interfaces/interface"

// 一覧を取得
export const getPosts = () => {
  return axiosInstance.get("/posts")
}

// レコードをページネーションで取得
export const getIndexPosts = (limit: number, offset: number) => {
  return axiosInstance.get(`/posts/limit_index/${limit}/${offset}`)
}

// 自分の投稿を取得
export const myPosts = (user_id: number, limit: number, offset: number) => {
  return axiosInstance.get(`/posts/my_posts/${user_id}/${limit}/${offset}`)
}

// レコードを１件取得
export const showPost = (id: number) => {
  return axiosInstance.get(`/posts/${id}`)
}

// 新規作成
export const createPost = (data: Post) => {
  return axiosInstance.post("/posts", data)
}

// 削除
export const deletePost = (id: number) => {
  return axiosInstance.delete(`/posts/${id}`)
}

// 更新
export const updatePost = (id: number, data: FormData) => {
  return axiosInstance.patch(`/posts/${id}`, data)
}
