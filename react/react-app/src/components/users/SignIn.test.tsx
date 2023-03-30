import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { SignIn } from './SignIn'

jest.mock('react-alert')

const renderSignin = () => {
  const signin = true
  const setSignin = jest.fn()
  render(<SignIn signin={signin} setSignin={setSignin} />)
}

describe('SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('画面表示が適切', () => {
    renderSignin()

    const emailLabel = screen.queryByText('Email')
    expect(emailLabel).toBeInTheDocument()
    const passwordLabel = screen.queryByText('Password')
    expect(passwordLabel).toBeInTheDocument()

    const emailInput = screen.getByPlaceholderText('Type email here')
    expect(emailInput).toBeInTheDocument()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    expect(passwordInput).toBeInTheDocument()

    const submitButton = screen.getByRole('button', { name: 'SignIN' })
    expect(submitButton).toBeInTheDocument()
    const closeButton = screen.getByRole('button', { name: 'Close Modal' })
    expect(closeButton).toBeInTheDocument()
  })
})

describe('SignIn email', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('メールアドレスが空の場合、エラーメッセージを表示', async() => {
    renderSignin()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: 'SignIN' })

    userEvent.type(passwordInput,'xxxx1111')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('メールアドレスを入力してください。')).toBeInTheDocument()
    })
  })

  it('メールアドレスの形式が不正の場合、エラーメッセージを表示', async() => {
    renderSignin()
    const emailInput = screen.getByPlaceholderText('Type email here')
    const submitButton = screen.getByRole('button', { name: 'SignIN' })

    userEvent.type(emailInput,'xxxx1111')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('メールアドレスの形式が不正です。')).toBeInTheDocument()
    })
  })
})

describe('SignIn password', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('パスワードが空の場合、エラーメッセージを表示', async() => {
    renderSignin()
    const emailInput = screen.getByPlaceholderText('Type email here')
    const submitButton = screen.getByRole('button', { name: 'SignIN' })

    userEvent.type(emailInput,'test@example.com')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('パスワードを入力してください。')).toBeInTheDocument()
    })
  })

  it('パスワード5文字以内の場合、エラーメッセージを表示', async() => {
    renderSignin()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: 'SignIN' })

    userEvent.type(passwordInput,'aaaaa')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('6文字以上入力してください。')).toBeInTheDocument()
    })
  })

  it('パスワードが129文字以上の場合、エラーメッセージを表示', async() => {
    renderSignin()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: 'SignIN' })

    userEvent.type(passwordInput,'a'.repeat(129))
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('128文字以内で入力してください。')).toBeInTheDocument()
    })
  })

  it('パスワードが半角英数字以外の場合、エラーメッセージを表示', async() => {
    renderSignin()
    const passwordInput = screen.getByPlaceholderText('Type password here')
    const submitButton = screen.getByRole('button', { name: 'SignIN' })

    userEvent.type(passwordInput,'ああああああああ')
    await userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('パスワードは半角英数字のみ有効です。')).toBeInTheDocument()
    })
  })
})