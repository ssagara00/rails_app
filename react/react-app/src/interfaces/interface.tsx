export interface Post {
  id?: number
  user_id: number
  title: string
  contents: string
  image?: { url: string }
}

export interface Reply {
  id?: number
  user_id?: number | undefined
  title: string
  contents: string
  image?: { url: string }
  reply_from_id?: number
}

export interface SignUpParams {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface SignEditParams {
  id: number
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface SignInParams {
  email: string
  password: string
}

export interface User {
  id: number
  uid: string
  provider: string
  email: string
  name: string
  nickname?: string
  image?: string
  allowPasswordChange: boolean
  created_at: Date
  updated_at: Date
}

export interface Like {
  id?: number
  user_id: number
  post_id: number
}
