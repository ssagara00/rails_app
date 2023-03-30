import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AxiosResponse } from 'axios'
import '@testing-library/jest-dom'

import { AuthContext } from '../../Context'
import { PostsTop } from './PostsTop'
import * as ApiActions from '../../api/api_actions'

jest.mock('react-alert')
jest.mock('../../api/api_actions')
jest.mock('react-router-dom')

const renderPostsTop = () => {
  const setLoading = jest.fn()
  render(
    <AuthContext.Provider
      value={
        {
          setLoading
        } as any
      }
    >
      <PostsTop />
    </AuthContext.Provider>
    )
}

const renderLoginPostsTop = () => {
  const setLoading = jest.fn()
  render(
    <AuthContext.Provider
        value={
          {
            setLoading,
            isSignedIn: true,
            currentUser: {
              id: 1,
              name: 'テストユーザー'
            },
          } as any
        }
      >
      <PostsTop />
   </AuthContext.Provider>
  )
}

describe('PostsTop', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('未ログイン状態で画面表示が適切', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.getIndexPosts.mockResolvedValue({ status: 200 } as AxiosResponse)
    renderPostsTop()

    const signupButton = screen.getByRole('button', { name: 'Open Signup' })
    expect(signupButton).toBeInTheDocument()
    const signinButton = screen.getByRole('button', { name: 'Open Signin' })
    expect(signinButton).toBeInTheDocument()
    const notLogin = screen.getByText('ログインしていません。')
    expect(notLogin).toBeInTheDocument()
    
    // エラー避けのため、ログ出力終わるまで待つ
    await waitFor(() => {
    })
  })

  it('ログイン状態で画面表示が適切', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.getIndexPosts.mockResolvedValue({ status: 200 } as AxiosResponse)
    renderLoginPostsTop()

    const signupButton = screen.getByRole('button', { name: 'Open Signup' })
    expect(signupButton).toBeInTheDocument()
    const signoutButton = screen.getByRole('button', { name: 'SignOut' })
    expect(signoutButton).toBeInTheDocument()
    const formButton = screen.getByRole('button', { name: 'Open Form' })
    expect(formButton).toBeInTheDocument()
    const postTab = screen.getByText('投稿一覧')
    expect(postTab).toBeInTheDocument()
    const authTab = screen.getByText('ユーザー情報管理画面')
    expect(authTab).toBeInTheDocument()
    const loginName = screen.getByText('ようこそ! テストユーザーさん！')
    expect(loginName).toBeInTheDocument()

    // エラー避けのため、ログ出力終わるまで待つ
    await waitFor(() => {
    })
  })
})