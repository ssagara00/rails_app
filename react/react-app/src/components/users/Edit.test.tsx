import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AxiosResponse } from 'axios'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { AuthContext } from '../../Context'
import { Edit } from './Edit'
import { mockedUseAlertReturn } from '../../__mocks__/react-alert'
import * as ApiActions from '../../api/api_actions'

jest.mock('../../api/api_actions')

const renderEdit = () => {
  const edit = true
  const setEdit = jest.fn()
  const setCurrentUser = jest.fn()
  render(
    <AuthContext.Provider
        value={
          {
            isSignedIn: true,
            setCurrentUser,
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

  it('名前が空の場合、エラーメッセージを表示', async() => {
    renderEdit()
    const nameInput = screen.getByPlaceholderText('Type name here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.clear(nameInput)
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('名前を入力してください')).toBeInTheDocument()
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
      expect(screen.getByText('100文字以内で入力してください')).toBeInTheDocument()
    })
  })
})

describe('Edit email', () => {

  it('メールアドレスが空の場合、エラーメッセージを表示', async() => {
    renderEdit()
    const emailInput = screen.getByPlaceholderText('Type email here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.clear(emailInput)
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument()
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
      expect(screen.getByText('メールアドレスの形式が不正です')).toBeInTheDocument()
    })
  })
})

describe('Edit post', () => {

  it('更新が成功する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.editUser.mockResolvedValue({ status: 200, data: { data: 'sample' } } as AxiosResponse)
    renderEdit()
    
    const nameInput = screen.getByPlaceholderText('Type name here')
    const emailInput = screen.getByPlaceholderText('Type email here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.type(nameInput,'テスト名前')
    userEvent.type(emailInput,'test@example.com')
    userEvent.click(submitButton)

    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('会員情報を更新します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // editUserが起動することを確認
    await waitFor(() => {
      expect(mockedApi.editUser).toHaveBeenCalled()
      expect(mockedUseAlertReturn.success.mock.calls[0][0]).toBe('更新に成功しました') 
    })
  })

  it('更新が失敗する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.editUser.mockResolvedValue({ status: 404, data: {message: 'エラー'} } as AxiosResponse)
    console.log = jest.fn()
    renderEdit()

    const nameInput = screen.getByPlaceholderText('Type name here')
    const emailInput = screen.getByPlaceholderText('Type email here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.type(nameInput,'テスト名前')
    userEvent.type(emailInput,'test@example.com')
    userEvent.click(submitButton)

    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('会員情報を更新します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // editUserが起動することを確認
    await waitFor(() => {
      expect(mockedApi.editUser).toHaveBeenCalled()
      expect(mockedUseAlertReturn.error.mock.calls[0][0]).toBe('更新に失敗しました。入力内容の形式に不備があります') 
    })
  })
})