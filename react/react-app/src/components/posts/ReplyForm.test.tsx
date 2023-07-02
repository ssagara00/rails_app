import React from "react"
import { render, screen, waitFor } from '@testing-library/react'
import { AxiosResponse } from 'axios'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { AuthContext } from '../../Context'
import { Reply } from '../../interfaces/interface'
import { ReplyForm } from './ReplyForm'
import { mockedUseAlertReturn } from '../../__mocks__/react-alert'
import * as ApiActions from '../../api/api_actions'

jest.mock('../../api/api_actions')

const renderReplyForm = () => {
  const day = new Date(2023, 2, 1, 0, 0, 0)// 2023-03-01 0:00:00
  const replyForm = true
  const setReplyForm = jest.fn()
  const post = {id: 1, user_id: 1, title: 'テストタイトル', contents: 'テストコンテンツ', created_at: day } 
  const replies: Reply[] = [] 
  const setReplies = jest.fn()
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
      <ReplyForm replyForm={replyForm} setReplyForm={setReplyForm} post={post} replies={replies} setReplies={setReplies} />
    </AuthContext.Provider>
  )
}

describe('ReplyForm', () => {

  it('画面表示が適切', () => {
    renderReplyForm()

    const titleLabel = screen.getByText('タイトル')
    expect(titleLabel).toBeInTheDocument()
    const contentLabel = screen.getByText('本文')
    expect(contentLabel).toBeInTheDocument()

    const titleInput = screen.getByPlaceholderText('Type title here')
    expect(titleInput).toBeInTheDocument()
    expect(titleInput).toHaveValue('Re:テストタイトル')
    const contentInput = screen.getByPlaceholderText('Type contents here')
    expect(contentInput).toBeInTheDocument()

    const submitButton = screen.getByRole('button', { name: '返信する' })
    expect(submitButton).toBeInTheDocument()
    const closeButton = screen.getByRole('button', { name: '閉じる' })
    expect(closeButton).toBeInTheDocument()
  })
})

describe('ReplyForm title', () => {

  it('タイトルが空の場合、エラーメッセージを表示', async() => {
    renderReplyForm()
    const titleInput = screen.getByPlaceholderText('Type title here')
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '返信する' })

    userEvent.clear(titleInput)
    userEvent.type(contentInput,'テスト文章')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('タイトルを入力してください')).toBeInTheDocument()
    })
  })

  it('タイトルが31文字以上の場合、エラーメッセージを表示', async() => {
    renderReplyForm()
    const titleInput = screen.getByPlaceholderText('Type title here')
    const submitButton = screen.getByRole('button', { name: '返信する' })

    userEvent.clear(titleInput)
    userEvent.type(titleInput,'あ'.repeat(31))
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('30文字以内で入力してください')).toBeInTheDocument()
    })
  })
})

describe('ReplyForm contents', () => {
  jest.setTimeout(10000)

  it('本文が空の場合、エラーメッセージを表示', async() => {
    renderReplyForm()
    const submitButton = screen.getByRole('button', { name: '返信する' })

    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('本文を入力してください')).toBeInTheDocument()
    })
  })

  it('本文が3001文字以上の場合、エラーメッセージを表示', async() => {
    renderReplyForm()
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '返信する' })

    userEvent.type(contentInput,'あ'.repeat(3001))
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('3000文字以内で入力してください')).toBeInTheDocument()
    })
  })
})

describe('ReplyForm post', () => {

  it('返信が成功する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.createReply.mockResolvedValue({ status: 200 } as AxiosResponse)
    renderReplyForm()
    
    const titleInput = screen.getByPlaceholderText('Type title here')
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '返信する' })

    userEvent.type(titleInput,'テストタイトル')
    userEvent.type(contentInput,'テスト文章')
    userEvent.click(submitButton)

    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('返信します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // createReplyが起動することを確認
    await waitFor(() => {
      expect(mockedApi.createReply).toHaveBeenCalled()
      expect(mockedUseAlertReturn.success.mock.calls[0][0]).toBe('返信に成功しました') 
    })
  })

  it('返信が失敗する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.createReply.mockResolvedValue({ status: 404, data: {message: 'エラー'} } as AxiosResponse)
    console.log = jest.fn()
    renderReplyForm()

    const titleInput = screen.getByPlaceholderText('Type title here')
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '返信する' })

    userEvent.type(titleInput,'テストタイトル')
    userEvent.type(contentInput,'テスト文章')
    userEvent.click(submitButton)

    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('返信します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // createReplyが起動することを確認
    await waitFor(() => {
      expect(mockedApi.createReply).toHaveBeenCalled()
      expect(mockedUseAlertReturn.error.mock.calls[0][0]).toBe('返信に失敗しました。入力内容の形式に不備があります') 
    })
  })
})