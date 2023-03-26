import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PostsTop from './PostsTop'
import { AuthContext } from "../../App"

jest.mock('react-alert')
jest.mock('react-router-dom')

const setupPostsTop = () => {
  render(<PostsTop />);
}

const renderPostsTop = () => {
  render(
    <AuthContext.Provider
        value={
          {
            isSignedIn: true,
            currentUser: {
              id: 1,
              name: 'テスト'
            },
          } as any
        }
      >
    <PostsTop />
   </AuthContext.Provider>
  )
}

describe('PostsTop notLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('未ログイン状態で画面表示が適切', () => {
    setupPostsTop()

    const signupbutton = screen.getByRole('button', { name: 'Open Signup' });
    expect(signupbutton).toBeInTheDocument();
    const signinbutton = screen.getByRole('button', { name: 'Open Signin' });
    expect(signinbutton).toBeInTheDocument();
    const yetlogin = screen.getByText('ログインしていません。')
    expect(yetlogin).toBeInTheDocument()
  })
})

describe('PostsTop Login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('ログイン状態で画面表示が適切', async() => {
    renderPostsTop()

    await waitFor(() => {
      const signupbutton = screen.getByRole('button', { name: 'Open Signup' });
      expect(signupbutton).toBeInTheDocument();
      const signoutbutton = screen.getByRole('button', { name: 'SignOut' });
      expect(signoutbutton).toBeInTheDocument();
      const formbutton = screen.getByRole('button', { name: 'Open Form' });
      expect(formbutton).toBeInTheDocument();
      const posttab = screen.getByText('投稿一覧')
      expect(posttab).toBeInTheDocument()
      const authtab = screen.getByText('ユーザー情報管理画面')
      expect(authtab).toBeInTheDocument()
      const loginname = screen.getByText('ようこそ! テストさん！')
      expect(loginname).toBeInTheDocument()
    })
  });
});