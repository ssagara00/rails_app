import React from "react"
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { Reply } from '../../interfaces/interface'
import { ReplyForm } from './ReplyForm'

jest.mock('react-alert')

const renderReplyForm = () => {
  const day = new Date(2023, 2, 1, 0, 0, 0)// 2023-03-01 0:00:00
  const replyForm = true
  const setReplyForm = jest.fn()
  const post = {id: 1, user_id: 1, title: 'テストタイトル', contents: 'テストコンテンツ', created_at: day } 
  const replies: Reply[] = [] 
  const setReplies = jest.fn()
  render(<ReplyForm replyForm={replyForm} setReplyForm={setReplyForm} post={post} replies={replies} setReplies={setReplies} />)
}

describe('ReplyForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

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
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('タイトルが空の場合、エラーメッセージを表示', async() => {
    renderReplyForm()
    const titleInput = screen.getByPlaceholderText('Type title here')
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '返信する' })

    userEvent.clear(titleInput)
    userEvent.type(contentInput,'テスト文章')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('タイトルを入力してください。')).toBeInTheDocument()
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
      expect(screen.getByText('30文字以内で入力してください。')).toBeInTheDocument()
    })
  })
})

describe('ReplyCreate contents', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  jest.setTimeout(10000)

  it('本文が空の場合、エラーメッセージを表示', async() => {
    renderReplyForm()
    const submitButton = screen.getByRole('button', { name: '返信する' })

    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('本文を入力してください。')).toBeInTheDocument()
    })
  })

  it('本文が3001文字以上の場合、エラーメッセージを表示', async() => {
    renderReplyForm()
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '返信する' })

    userEvent.type(contentInput,'あ'.repeat(3001))
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('3000文字以内で入力してください。')).toBeInTheDocument()
    })
  })
})