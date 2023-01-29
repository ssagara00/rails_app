import axiosreplyInstance from "./reply"
import { Reply } from "../interfaces/reply_interface"

// 一覧を取得
export const getReplies = () => {
  return axiosreplyInstance.get("/replies")
}

// レコードを取得
export const showReply = (reply_from_id: number) => {
  return axiosreplyInstance.get(`/replies/${reply_from_id}`)
}

// 新規作成
export const createReply = (data: Reply) => {
  return axiosreplyInstance.post("/replies", {reply:data})
}

// 削除
export const deleteReply = (id: number) => {
  return axiosreplyInstance.delete(`/replies/${id}`)
}

// 更新
export const updateReply = (id: number, data: Reply) => {
  return axiosreplyInstance.patch(`/replies/${id}`, data)
}
