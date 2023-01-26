export interface Reply {
  id?: number
  user_id: number
  title: string
  contents: string
  image?: { url: string }
  reply_from_id?: number
}
