import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AxiosResponse } from 'axios'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { AuthContext } from '../../Context'
import { SignUp } from './SignUp'
import { mockedUseAlertReturn } from '../../__mocks__/react-alert'
import * as ApiActions from '../../api/api_actions'

jest.mock('../../api/api_actions')

const renderSignup = () => {
  const signup = true
  const setSignup = jest.fn()
  const setLoading = jest.fn()
  const setIsSignedIn = jest.fn()
  const setCurrentUser = jest.fn()

  render(
    <AuthContext.Provider
        value={
          {
            isSignedIn: false,
            setLoading,
            setIsSignedIn,
            setCurrentUser
          } as any
        }
      >
      <SignUp signup={signup} setSignup={setSignup} />
    </AuthContext.Provider>
  )
}

describe('SignUp', () => {

  it('画面表示が適切', () => {
    renderSignup()

    const nameLabel = screen.queryByText('名前')
    expect(nameLabel).toBeInTheDocument()
    const emailLabel = screen.queryByText('メールアドレス')
    expect(emailLabel).toBeInTheDocument()
    const passwordLabel = screen.queryByText('パスワード')
    expect(passwordLabel).toBeInTheDocument()
    const passwordconfirmationLabel = screen.queryByText('パスワード（確認）')
    expect(passwordconfirmationLabel).toBeInTheDocument()

    const nameInput = screen.getByPlaceholderText('Type name here')
    expect(nameInput).toBeInTheDocument()
    const emailInput = screen.getByPlaceholderText('Type email here')
    expect(emailInput).toBeInTheDocument()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    expect(passwordInput).toBeInTheDocument()
    const passwordconfirmationInput = screen.getByPlaceholderText('Type passwordconfirmation here')
    expect(passwordconfirmationInput).toBeInTheDocument()

    const submitButton = screen.getByRole('button', { name: '会員登録する' })
    expect(submitButton).toBeInTheDocument()
    const closeButton = screen.getByRole('button', { name: '閉じる' })
    expect(closeButton).toBeInTheDocument()
  })
})

describe('SignUp name', () => {

  it('名前が空の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const emailInput = screen.getByPlaceholderText('Type email here')
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const passwordconfirmationInput = screen.getByPlaceholderText('Type passwordconfirmation here')
    const submitButton = screen.getByRole('button', { name: '会員登録する' })

    userEvent.type(emailInput,'test@example.com')
    userEvent.type(passwordInput,'xxxx1111')
    userEvent.type(passwordconfirmationInput,'xxxx1111')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('名前を入力してください')).toBeInTheDocument()
    })
  })

  it('名前が101文字以上の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const nameInput = screen.getByPlaceholderText('Type name here')
    const submitButton = screen.getByRole('button', { name: '会員登録する' })

    userEvent.type(nameInput,'あ'.repeat(101))
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('100文字以内で入力してください')).toBeInTheDocument()
    })
  })
})

describe('SignUp email', () => {

  it('メールアドレスが空の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const nameInput = screen.getByPlaceholderText('Type name here')
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const passwordconfirmationInput = screen.getByPlaceholderText('Type passwordconfirmation here')
    const submitButton = screen.getByRole('button', { name: '会員登録する' })

    userEvent.type(nameInput,'テスト')
    userEvent.type(passwordInput,'xxxx1111')
    userEvent.type(passwordconfirmationInput,'xxxx1111')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument()
    })
  })

  it('メールアドレスの形式が不正の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const emailInput = screen.getByPlaceholderText('Type email here')
    const submitButton = screen.getByRole('button', { name: '会員登録する' })

    userEvent.type(emailInput,'xxxx1111')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('メールアドレスの形式が不正です')).toBeInTheDocument()
    })
  })
})

describe('SignUp password', () => {

  it('パスワードが空の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const nameInput = screen.getByPlaceholderText('Type name here')
    const emailInput = screen.getByPlaceholderText('Type email here')
    const passwordconfirmationInput = screen.getByPlaceholderText('Type passwordconfirmation here')
    const submitButton = screen.getByRole('button', { name: '会員登録する' })

    userEvent.type(nameInput,'テスト')
    userEvent.type(emailInput,'test@example.com')
    userEvent.type(passwordconfirmationInput,'xxxx1111')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('パスワードを入力してください')).toBeInTheDocument()
    })
  })

  it('パスワード5文字以内の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: '会員登録する' })

    userEvent.type(passwordInput,'aaaaa')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('6文字以上入力してください')).toBeInTheDocument()
    })
  })

  it('パスワードが129文字以上の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: '会員登録する' })

    userEvent.type(passwordInput,'a'.repeat(129))
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('128文字以内で入力してください')).toBeInTheDocument()
    })
  })

  it('パスワードが半角英数字以外の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: '会員登録する' })

    userEvent.type(passwordInput,'ああああああああ')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('パスワードは半角英数字のみ有効です')).toBeInTheDocument()
    })
  })
})

describe('SignUp passwordconfirmation', () => {

  it('確認パスワードが空の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const nameInput = screen.getByPlaceholderText('Type name here')
    const emailInput = screen.getByPlaceholderText('Type email here')
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: '会員登録する' })

    userEvent.type(nameInput,'テスト')
    userEvent.type(emailInput,'test@example.com')
    userEvent.type(passwordInput,'xxxx1111')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('確認用パスワードを入力してください')).toBeInTheDocument()
    })
  })

  it('パスワードが一致しない場合、エラーメッセージを表示', async() => {
    renderSignup()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const passwordconfirmationInput = screen.getByPlaceholderText('Type passwordconfirmation here')
    const submitButton = screen.getByRole('button', { name: '会員登録する' })

    userEvent.type(passwordInput,'xxxx1111')
    userEvent.type(passwordconfirmationInput,'xxxx1112')
    userEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('パスワードが一致しません')).toBeInTheDocument()
    })
  })
})

describe('SignUp post', () => {

  it('会員登録が成功する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.signUp.mockResolvedValue({ status: 200, data: {}, headers: {} } as AxiosResponse)
    renderSignup()

    const nameInput = screen.getByPlaceholderText('Type name here')
    const emailInput = screen.getByPlaceholderText('Type email here')
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const passwordconfirmationInput = screen.getByPlaceholderText('Type passwordconfirmation here')
    const submitButton = screen.getByRole('button', { name: '会員登録する' })

    userEvent.type(nameInput,'テスト')
    userEvent.type(emailInput,'test@example.com')
    userEvent.type(passwordInput,'xxxx1111')
    userEvent.type(passwordconfirmationInput,'xxxx1111')
    userEvent.click(submitButton)

    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('会員登録します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // signUpが起動することを確認
    await waitFor(() => {
      expect(mockedApi.signUp).toHaveBeenCalled()
      expect(mockedUseAlertReturn.success.mock.calls[0][0]).toBe('登録に成功しました') 
    })
  })

  it('会員登録が失敗する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.signUp.mockResolvedValue({ status: 404, data: {message: 'エラー'} } as AxiosResponse)
    console.log = jest.fn()
    renderSignup()

    const nameInput = screen.getByPlaceholderText('Type name here')
    const emailInput = screen.getByPlaceholderText('Type email here')
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const passwordconfirmationInput = screen.getByPlaceholderText('Type passwordconfirmation here')
    const submitButton = screen.getByRole('button', { name: '会員登録する' })

    userEvent.type(nameInput,'テスト')
    userEvent.type(emailInput,'test@example.com')
    userEvent.type(passwordInput,'xxxx1111')
    userEvent.type(passwordconfirmationInput,'xxxx1111')
    userEvent.click(submitButton)

    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('会員登録します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // signUpが起動することを確認
    await waitFor(() => {
      expect(mockedApi.signUp).toHaveBeenCalled()
      expect(mockedUseAlertReturn.error.mock.calls[0][0]).toBe('登録に失敗しました。入力内容の形式に不備があります') 
    })
  })
})