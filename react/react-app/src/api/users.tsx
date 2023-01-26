import axiosuserInstance from "./user"
import { User } from "../interfaces/user_interface"


// レコードを１件取得
export const showUser = (id: number) => {
  return axiosuserInstance.get(`/users/${id}`)
}
