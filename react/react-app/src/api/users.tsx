import axiosuserInstance from "./user"
import { SignEditParams } from "../interfaces/user_interface"

// レコードを１件取得
export const showUser = (id: number) => {
  return axiosuserInstance.get(`/users/${id}`)
}

// 削除
export const deleteUser = (id: number) => {
  return axiosuserInstance.delete(`/users/${id}`)
}

// 編集
export const editUser = (id: number, data: any) => {
  return axiosuserInstance.patch(`/users/${id}`, data)
}