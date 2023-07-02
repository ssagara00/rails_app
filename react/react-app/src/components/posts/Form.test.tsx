import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AxiosResponse } from 'axios'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { AuthContext } from '../../Context'
import { Form } from './Form'
import { mockedUseAlertReturn } from '../../__mocks__/react-alert'
import * as ApiActions from '../../api/api_actions'

jest.mock('../../api/api_actions')

const renderForm = () => {
  const form = true
  const setForm = jest.fn()
  const setLoading = jest.fn()

  render(
    <AuthContext.Provider
        value={
          {
            isSignedIn: true,
            setLoading,
            currentUser: {
              id: 1,
            },
          } as any
        }
      >
      <Form form={form} setForm={setForm} />
    </AuthContext.Provider>
  )
}

describe('Form', () => {

  it('画面表示が適切', () => {
    renderForm()

    const titleLabel = screen.getByText('タイトル')
    expect(titleLabel).toBeInTheDocument()
    const contentLabel = screen.getByText('本文')
    expect(contentLabel).toBeInTheDocument()
    const imageLabel = screen.getByText('画像')
    expect(imageLabel).toBeInTheDocument()

    const titleInput = screen.getByPlaceholderText('Type title here')
    expect(titleInput).toBeInTheDocument()
    const contentInput = screen.getByPlaceholderText('Type contents here')
    expect(contentInput).toBeInTheDocument()
    
    const fileInput = screen.getByLabelText('画像アップロード')
    expect(fileInput).toBeInTheDocument()
    const submitButton = screen.getByRole('button', { name: '投稿する' })
    expect(submitButton).toBeInTheDocument()
    const closeButton = screen.getByRole('button', { name: '閉じる' })
    expect(closeButton).toBeInTheDocument()
    const cancelFileButton = screen.getByRole('button', { name: '画像リセット' })
    expect(cancelFileButton).toBeInTheDocument()
  })
})

describe('Form title', () => {

  it('タイトルが空の場合、エラーメッセージを表示', async() => {
    renderForm()
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '投稿する' })

    userEvent.type(contentInput,'テスト文章')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('タイトルを入力してください')).toBeInTheDocument()
    })
  })

  it('タイトルが31文字以上の場合、エラーメッセージを表示', async() => {
    renderForm()
    const titleInput = screen.getByPlaceholderText('Type title here')
    const submitButton = screen.getByRole('button', { name: '投稿する' })

    userEvent.type(titleInput,'あ'.repeat(31))
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('30文字以内で入力してください')).toBeInTheDocument()
    })
  })
})

describe('Form contents', () => {
  jest.setTimeout(10000)

  it('本文が空の場合、エラーメッセージを表示', async() => {
    renderForm()
    const titleInput = screen.getByPlaceholderText('Type title here')
    const submitButton = screen.getByRole('button', { name: '投稿する' })

    userEvent.type(titleInput,'テストタイトル')
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('本文を入力してください')).toBeInTheDocument()
    })
  })

  it('本文が3001文字以上の場合、エラーメッセージを表示', async() => {
    renderForm()
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '投稿する' })

    userEvent.type(contentInput,'あ'.repeat(3001))
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('3000文字以内で入力してください')).toBeInTheDocument()
    })
  })
})

describe('Form post', () => {

  it('投稿が成功する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.createPost.mockResolvedValue({ status: 200 } as AxiosResponse)
    renderForm()
    
    const titleInput = screen.getByPlaceholderText('Type title here')
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '投稿する' })

    userEvent.type(titleInput,'テストタイトル')
    userEvent.type(contentInput,'テスト文章')
    userEvent.click(submitButton)

    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('投稿します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // createPostが起動することを確認
    await waitFor(() => {
      expect(mockedApi.createPost).toHaveBeenCalled()
      expect(mockedUseAlertReturn.success.mock.calls[0][0]).toBe('投稿に成功しました') 
    })
  })

  it('投稿が失敗する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.createPost.mockResolvedValue({ status: 404, data: {message: 'エラー'} } as AxiosResponse)
    console.log = jest.fn()
    renderForm()

    const titleInput = screen.getByPlaceholderText('Type title here')
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '投稿する' })

    userEvent.type(titleInput,'テストタイトル')
    userEvent.type(contentInput,'テスト文章')
    userEvent.click(submitButton)

    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('投稿します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // createPostが起動することを確認
    await waitFor(() => {
      expect(mockedApi.createPost).toHaveBeenCalled()
      expect(mockedUseAlertReturn.error.mock.calls[0][0]).toBe('投稿に失敗しました。入力内容の形式に不備があります') 
    })
  })
})