import Cookies from 'js-cookie'
import axiosInstance from './axios'
import { Post, Reply, SignUpParams, SignEditParams, SignInParams, Like } from '../interfaces/interface'

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

// 一覧を取得
export const getLikes = () => {
  return axiosInstance.get("/likes")
}

// いいね数を取得
export const showLike = (post_id: number) => {
  return axiosInstance.get(`/likes/${post_id}`)
}

// 新規作成
export const createLike = (data :Like) => {
  return axiosInstance.post("/likes/", data)
}

// 削除
export const deleteLike = (user_id: number, post_id: number) => {
  return axiosInstance.delete(`/likes/delete/${user_id}/${post_id}`)
}

// いいね済判定
export const searchLike = (user_id: number, post_id: number) => {
  return axiosInstance.get(`/likes/is_liked/${user_id}/${post_id}`)
}

// 一覧を取得
export const getReplies = () => {
  return axiosInstance.get("/replies")
}

// レコードを取得
export const showReply = (reply_from_id: number) => {
  return axiosInstance.get(`/replies/${reply_from_id}`)
}

// 新規作成
export const createReply = (data: Reply) => {
  return axiosInstance.post("/replies", data)
}

// 削除
export const deleteReply = (id: number) => {
  return axiosInstance.delete(`/replies/${id}`)
}

// 更新
export const updateReply = (id: number, data: Reply) => {
  return axiosInstance.patch(`/replies/${id}`, data)
}

// サインアップ（新規アカウント作成）
export const signUp = (params: SignUpParams) => {
  return axiosInstance.post("auth", params)
}

// サインイン（ログイン）
export const signIn = (params: SignInParams)  => {
  return axiosInstance.post("auth/sign_in", params)
}

// サインアウト（ログアウト）
export const signOut = () => {
  return axiosInstance.delete("auth/sign_out", { headers: {
    "access-token": Cookies.get("_access_token") || "",
    "client": Cookies.get("_client") || "",
    "uid": Cookies.get("_uid") || ""
  }})
}

// 認証済みのユーザーを取得
export const getCurrentUser = () => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return
  return axiosInstance.get("/auth/sessions", { headers: {
    "access-token": Cookies.get("_access_token") || "",
    "client": Cookies.get("_client") || "",
    "uid": Cookies.get("_uid") || ""
  }})
}

// レコードを１件取得
export const showUser = (id: number) => {
  return axiosInstance.get(`/users/${id}`)
}

// 削除
export const deleteUser = (id: number) => {
  return axiosInstance.delete(`/users/${id}`)
}

// 編集
export const editUser = (id: number, data: SignEditParams) => {
  return axiosInstance.patch(`/users/${id}`, data)
}