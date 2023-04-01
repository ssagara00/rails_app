import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { AuthContext } from '../../Context'
import { Edit } from './Edit'

jest.mock('react-alert')

const renderEdit = () => {
  const edit = true
  const setEdit = jest.fn()
  render(
    <AuthContext.Provider
        value={
          {
            isSignedIn: true,
            currentUser: {
              id: 1,
              name: 'テストユーザー',
              email: 'test@example.co.jp'
            },
          } as any
        }
      >
    <Edit edit={edit} setEdit={setEdit} />
   </AuthContext.Provider>
  )
}

describe('Edit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('画面表示が適切', () => {
    renderEdit()

    const nameLabel = screen.queryByText('名前')
    expect(nameLabel).toBeInTheDocument()
    const emailLabel = screen.queryByText('メールアドレス')
    expect(emailLabel).toBeInTheDocument()

    const nameInput = screen.getByPlaceholderText('Type name here')
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveValue('テストユーザー')
    const emailInput = screen.getByPlaceholderText('Type email here')
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveValue('test@example.co.jp')

    const submitButton = screen.getByRole('button', { name: '更新する' })
    expect(submitButton).toBeInTheDocument()
    const closeButton = screen.getByRole('button', { name: '閉じる' })
    expect(closeButton).toBeInTheDocument()
  })
})

describe('Edit name', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('名前が空の場合、エラーメッセージを表示', async() => {
    renderEdit()
    const nameInput = screen.getByPlaceholderText('Type name here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.clear(nameInput)
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('名前を入力してください。')).toBeInTheDocument()
    })
  })

  it('名前が101文字以上の場合、エラーメッセージを表示', async() => {
    renderEdit()
    const nameInput = screen.getByPlaceholderText('Type name here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.clear(nameInput)
    userEvent.type(nameInput,'あ'.repeat(101))
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('100文字以内で入力してください。')).toBeInTheDocument()
    })
  })
})

describe('Edit email', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('メールアドレスが空の場合、エラーメッセージを表示', async() => {
    renderEdit()
    const emailInput = screen.getByPlaceholderText('Type email here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.clear(emailInput)
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('メールアドレスを入力してください。')).toBeInTheDocument()
    })
  })

  it('メールアドレスの形式が不正の場合、エラーメッセージを表示', async() => {
    renderEdit()
    const emailInput = screen.getByPlaceholderText('Type email here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.clear(emailInput)
    userEvent.type(emailInput,'xxxx1111')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('メールアドレスの形式が不正です。')).toBeInTheDocument()
    })
  })
})