import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AxiosResponse } from 'axios'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { AuthContext } from '../../Context'
import { SignIn } from './SignIn'
import { mockedUseAlertReturn } from '../../__mocks__/react-alert'
import * as ApiActions from '../../api/api_actions'

jest.mock('../../api/api_actions')

const renderSignin = () => {
  const signin = true
  const setSignin = jest.fn()
  const setLoading = jest.fn()

  render(
    <AuthContext.Provider
        value={
          {
            isSignedIn: false,
            setLoading
          } as any
        }
      >
      <SignIn signin={signin} setSignin={setSignin} />
    </AuthContext.Provider>
  )
}

describe('SignIn', () => {

  it('画面表示が適切', () => {
    renderSignin()

    const emailLabel = screen.queryByText('メールアドレス')
    expect(emailLabel).toBeInTheDocument()
    const passwordLabel = screen.queryByText('パスワード')
    expect(passwordLabel).toBeInTheDocument()

    const emailInput = screen.getByPlaceholderText('Type email here')
    expect(emailInput).toBeInTheDocument()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    expect(passwordInput).toBeInTheDocument()

    const submitButton = screen.getByRole('button', { name: 'ログインする' })
    expect(submitButton).toBeInTheDocument()
    const closeButton = screen.getByRole('button', { name: '閉じる' })
    expect(closeButton).toBeInTheDocument()
  })
})

describe('SignIn email', () => {

  it('メールアドレスが空の場合、エラーメッセージを表示', async() => {
    renderSignin()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: 'ログインする' })

    userEvent.type(passwordInput,'xxxx1111')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument()
    })
  })

  it('メールアドレスの形式が不正の場合、エラーメッセージを表示', async() => {
    renderSignin()
    const emailInput = screen.getByPlaceholderText('Type email here')
    const submitButton = screen.getByRole('button', { name: 'ログインする' })

    userEvent.type(emailInput,'xxxx1111')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('メールアドレスの形式が不正です')).toBeInTheDocument()
    })
  })
})

describe('SignIn password', () => {

  it('パスワードが空の場合、エラーメッセージを表示', async() => {
    renderSignin()
    const emailInput = screen.getByPlaceholderText('Type email here')
    const submitButton = screen.getByRole('button', { name: 'ログインする' })

    userEvent.type(emailInput,'test@example.com')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('パスワードを入力してください')).toBeInTheDocument()
    })
  })

  it('パスワード5文字以内の場合、エラーメッセージを表示', async() => {
    renderSignin()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: 'ログインする' })

    userEvent.type(passwordInput,'aaaaa')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('6文字以上入力してください')).toBeInTheDocument()
    })
  })

  it('パスワードが129文字以上の場合、エラーメッセージを表示', async() => {
    renderSignin()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: 'ログインする' })

    userEvent.type(passwordInput,'a'.repeat(129))
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('128文字以内で入力してください')).toBeInTheDocument()
    })
  })

  it('パスワードが半角英数字以外の場合、エラーメッセージを表示', async() => {
    renderSignin()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: 'ログインする' })

    userEvent.type(passwordInput,'ああああああああ')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('パスワードは半角英数字のみ有効です')).toBeInTheDocument()
    })
  })

  describe('SignIn post', () => {
  
    it('ログインが成功する', async() => {
      const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
      mockedApi.signIn.mockResolvedValue({ status: 200, data: {headers: 99} } as AxiosResponse)
      console.log = jest.fn()
      renderSignin()

      const emailInput = screen.getByPlaceholderText('Type email here')
      const passwordInput = screen.getByPlaceholderText('Type password here')
      const submitButton = screen.getByRole('button', { name: 'ログインする' })

      userEvent.type(emailInput,'test@example.com')
      userEvent.type(passwordInput,'xxxx1111')
      userEvent.click(submitButton)
      
      // signInが起動することを確認
      await waitFor(() => {
        expect(mockedApi.signIn).toHaveBeenCalled()
        expect(mockedUseAlertReturn.success.mock.calls[0][0]).toBe('ログインに成功しました') 
      })
    })
  
    it('ログインが失敗する', async() => {
      const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
      mockedApi.signIn.mockResolvedValue({ status: 404, data: {message: 'エラー'} } as AxiosResponse)
      console.log = jest.fn()
      renderSignin()
      
      const emailInput = screen.getByPlaceholderText('Type email here')
      const passwordInput = screen.getByPlaceholderText('Type password here')
      const submitButton = screen.getByRole('button', { name: 'ログインする' })

      userEvent.type(emailInput,'test@example.com')
      userEvent.type(passwordInput,'xxxx1111')
      userEvent.click(submitButton)

      // signInが起動することを確認
      await waitFor(() => {
        expect(mockedApi.signIn).toHaveBeenCalled()
        expect(mockedUseAlertReturn.error.mock.calls[0][0]).toBe('ログインに失敗しました。しばらくしてからもう一度お試しください。または管理者にお問合せください') 
      })
    })
  })
})