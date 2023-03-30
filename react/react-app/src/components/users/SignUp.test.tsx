import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { SignUp } from './SignUp'

jest.mock('react-alert')

const renderSignup = () => {
  const signup = true
  const setSignup = jest.fn()
  render(<SignUp signup={signup} setSignup={setSignup} />)
}

describe('SignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('画面表示が適切', () => {
    renderSignup()

    const nameLabel = screen.queryByText('Name')
    expect(nameLabel).toBeInTheDocument()
    const emailLabel = screen.queryByText('Email')
    expect(emailLabel).toBeInTheDocument()
    const passwordLabel = screen.queryByText('Password')
    expect(passwordLabel).toBeInTheDocument()
    const passwordconfirmationLabel = screen.queryByText('PasswordConfirmation')
    expect(passwordconfirmationLabel).toBeInTheDocument()

    const nameInput = screen.getByPlaceholderText('Type name here')
    expect(nameInput).toBeInTheDocument()
    const emailInput = screen.getByPlaceholderText('Type email here')
    expect(emailInput).toBeInTheDocument()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    expect(passwordInput).toBeInTheDocument()
    const passwordconfirmationInput = screen.getByPlaceholderText('Type passwordconfirmation here')
    expect(passwordconfirmationInput).toBeInTheDocument()

    const submitButton = screen.getByRole('button', { name: 'SignUp' })
    expect(submitButton).toBeInTheDocument()
    const closeButton = screen.getByRole('button', { name: 'Close Modal' })
    expect(closeButton).toBeInTheDocument()
  })
})

describe('SignUp name', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('名前が空の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const emailInput = screen.getByPlaceholderText('Type email here')
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const passwordconfirmationInput = screen.getByPlaceholderText('Type passwordconfirmation here')
    const submitButton = screen.getByRole('button', { name: 'SignUp' })

    userEvent.type(emailInput,'test@example.com')
    userEvent.type(passwordInput,'xxxx1111')
    userEvent.type(passwordconfirmationInput,'xxxx1111')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('名前を入力してください。')).toBeInTheDocument()
    })
  })

  it('名前が101文字以上の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const nameInput = screen.getByPlaceholderText('Type name here')
    const submitButton = screen.getByRole('button', { name: 'SignUp' })

    userEvent.type(nameInput,'あ'.repeat(101))
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('100文字以内で入力してください。')).toBeInTheDocument()
    })
  })
})

describe('SignUp email', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('メールアドレスが空の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const nameInput = screen.getByPlaceholderText('Type name here')
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const passwordconfirmationInput = screen.getByPlaceholderText('Type passwordconfirmation here')
    const submitButton = screen.getByRole('button', { name: 'SignUp' })

    userEvent.type(nameInput,'テスト')
    userEvent.type(passwordInput,'xxxx1111')
    userEvent.type(passwordconfirmationInput,'xxxx1111')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('メールアドレスを入力してください。')).toBeInTheDocument()
    })
  })

  it('メールアドレスの形式が不正の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const emailInput = screen.getByPlaceholderText('Type email here')
    const submitButton = screen.getByRole('button', { name: 'SignUp' })

    userEvent.type(emailInput,'xxxx1111')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('メールアドレスの形式が不正です。')).toBeInTheDocument()
    })
  })
})

describe('SignUp password', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('パスワードが空の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const nameInput = screen.getByPlaceholderText('Type name here')
    const emailInput = screen.getByPlaceholderText('Type email here')
    const passwordconfirmationInput = screen.getByPlaceholderText('Type passwordconfirmation here')
    const submitButton = screen.getByRole('button', { name: 'SignUp' })

    userEvent.type(nameInput,'テスト')
    userEvent.type(emailInput,'test@example.com')
    userEvent.type(passwordconfirmationInput,'xxxx1111')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('パスワードを入力してください。')).toBeInTheDocument()
    })
  })

  it('パスワード5文字以内の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: 'SignUp' })

    userEvent.type(passwordInput,'aaaaa')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('6文字以上入力してください。')).toBeInTheDocument()
    })
  })

  it('パスワードが129文字以上の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: 'SignUp' })

    userEvent.type(passwordInput,'a'.repeat(129))
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('128文字以内で入力してください。')).toBeInTheDocument()
    })
  })

  it('パスワードが半角英数字以外の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: 'SignUp' })

    userEvent.type(passwordInput,'ああああああああ')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('パスワードは半角英数字のみ有効です。')).toBeInTheDocument()
    })
  })
})

describe('SignUp passwordconfirmation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('確認パスワードが空の場合、エラーメッセージを表示', async() => {
    renderSignup()
    const nameInput = screen.getByPlaceholderText('Type name here')
    const emailInput = screen.getByPlaceholderText('Type email here')
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: 'SignUp' })

    userEvent.type(nameInput,'テスト')
    userEvent.type(emailInput,'test@example.com')
    userEvent.type(passwordInput,'xxxx1111')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('確認用パスワードを入力してください。')).toBeInTheDocument()
    })
  })

  it('パスワードが一致しない場合、エラーメッセージを表示', async() => {
    renderSignup()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const passwordconfirmationInput = screen.getByPlaceholderText('Type passwordconfirmation here')
    const submitButton = screen.getByRole('button', { name: 'SignUp' })

    userEvent.type(passwordInput,'xxxx1111')
    userEvent.type(passwordconfirmationInput,'xxxx1112')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('パスワードが一致しません')).toBeInTheDocument()
    })
  })
})