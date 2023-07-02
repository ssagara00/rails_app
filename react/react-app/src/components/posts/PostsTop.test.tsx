import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AxiosResponse } from 'axios'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { AuthContext } from '../../Context'
import { PostsTop } from './PostsTop'
import { mockedUseAlertReturn } from '../../__mocks__/react-alert'
import * as ApiActions from '../../api/api_actions'

jest.mock('../../api/api_actions')

// useNavigateをモック化
const mockedNavigator = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}))

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

  it('未ログイン状態で画面表示が適切', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.getPosts.mockResolvedValue({ status: 200, data: [] } as AxiosResponse)
    mockedApi.getIndexPosts.mockResolvedValue({ status: 200, data: [] } as AxiosResponse)
    renderPostsTop()

    const signupButton = screen.getByRole('button', { name: '会員登録' })
    expect(signupButton).toBeInTheDocument()
    const signinButton = screen.getByRole('button', { name: 'ログイン' })
    expect(signinButton).toBeInTheDocument()
    const notLogin = screen.getByText('右のメニューからログインしてください。')
    expect(notLogin).toBeInTheDocument()
    
    // エラー避けのため、ログ出力終わるまで待つ
    await waitFor(() => {
    })
  })

  it('ログイン状態で画面表示が適切', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.getPosts.mockResolvedValue({ status: 200, data: [] } as AxiosResponse)
    mockedApi.getIndexPosts.mockResolvedValue({ status: 200, data: [] } as AxiosResponse)
    renderLoginPostsTop()

    const signoutButton = screen.getByRole('button', { name: 'ログアウト' })
    expect(signoutButton).toBeInTheDocument()
    const formButton = screen.getByRole('button', { name: '新規投稿' })
    expect(formButton).toBeInTheDocument()
    const postTab = screen.getByText('投稿一覧')
    expect(postTab).toBeInTheDocument()
    const authTab = screen.getByText('会員情報管理画面')
    expect(authTab).toBeInTheDocument()
    const loginName = screen.getByText('ようこそ! テストユーザーさん！')
    expect(loginName).toBeInTheDocument()

    // エラー避けのため、ログ出力終わるまで待つ
    await waitFor(() => {
    })
  })
})

describe('SignOut', () => {

  it('ログアウトが成功する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.getPosts.mockResolvedValue({ status: 200, data: []} as AxiosResponse)
    mockedApi.getIndexPosts.mockResolvedValue({ status: 200, data: [] } as AxiosResponse)
    mockedApi.signOut.mockResolvedValue({ status: 200, data:{ success: true } } as AxiosResponse)
    console.log = jest.fn()
    renderLoginPostsTop()

    await waitFor(() => {
      const signoutButton = screen.getByRole('button', { name: 'ログアウト' })
      userEvent.click(signoutButton)
    })

    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('ログアウトします。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })
      
    // signOutが起動することを確認
    await waitFor(() => {
      expect(mockedApi.signOut).toHaveBeenCalled()
      // 以下のメッセージはPostsTop遷移後に表示するため、テストしない。
      // expect(mockedUseAlertReturn.success.mock.calls[0][0]).toBe('ログアウトに成功しました')
    })
  })

  it('ログアウトが失敗する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.getPosts.mockResolvedValue({ status: 200, data: [] } as AxiosResponse)
    mockedApi.getIndexPosts.mockResolvedValue({ status: 200, data: [] } as AxiosResponse)
    mockedApi.signOut.mockResolvedValue({ status: 404, data:{ success: Error } } as AxiosResponse)
    console.log = jest.fn()
    renderLoginPostsTop()

    await waitFor(() => {
      const signoutButton = screen.getByRole('button', { name: 'ログアウト' })
      userEvent.click(signoutButton)
    })

    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('ログアウトします。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // signOutが起動することを確認
    await waitFor(() => {
      expect(mockedApi.signOut).toHaveBeenCalled()
      expect(mockedUseAlertReturn.error.mock.calls[0][0]).toBe('ログアウトに失敗しました。しばらくしてからもう一度お試しください。または管理者にお問合せください') 
    })
  })
})