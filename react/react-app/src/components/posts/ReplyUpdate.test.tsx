import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { Reply } from '../../interfaces/interface'
import { ReplyUpdate } from './ReplyUpdate'

jest.mock('react-alert')

const renderReplyUpdate = () => {
  const day = new Date(2023, 2, 1, 0, 0, 0)// 2023-03-01 0:00:00
  const replyupdate = true
  const setReplyUpdate = jest.fn()
  const reply: Reply = {id: 1, user_id: 1, title: 'Re:テストタイトル', contents: 'テストコンテンツ', created_at: day } 
  const setReplies = jest.fn()
  render(<ReplyUpdate replyupdate={replyupdate} setReplyUpdate={setReplyUpdate} reply={reply} setReplies={setReplies}/>)
}

describe('ReplyUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('画面表示が適切', () => {
    renderReplyUpdate()

    const titleLabel = screen.getByText('Title')
    expect(titleLabel).toBeInTheDocument()
    const contentLabel = screen.getByText('Contents')
    expect(contentLabel).toBeInTheDocument()

    const titleInput = screen.getByPlaceholderText('Type title here')
    expect(titleInput).toBeInTheDocument()
    expect(titleInput).toHaveValue('Re:テストタイトル')
    const contentInput = screen.getByPlaceholderText('Type contents here')
    expect(contentInput).toBeInTheDocument()
    expect(contentInput).toHaveValue('テストコンテンツ')
    
    const submitButton = screen.getByRole('button', { name: 'REPLY!' })
    expect(submitButton).toBeInTheDocument()
    const closeButton = screen.getByRole('button', { name: 'Close Modal' })
    expect(closeButton).toBeInTheDocument()
  })
})

describe('ReplyUpdate title', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('タイトルが空の場合、エラーメッセージを表示', async() => {
    renderReplyUpdate()
    const titleInput = screen.getByPlaceholderText('Type title here')
    const submitButton = screen.getByRole('button', { name: 'REPLY!' })

    userEvent.clear(titleInput)
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('タイトルを入力してください。')).toBeInTheDocument()
    })
  })

  it('タイトルが31文字以上の場合、エラーメッセージを表示', async() => {
    renderReplyUpdate()
    const titleInput = screen.getByPlaceholderText('Type title here')
    const submitButton = screen.getByRole('button', { name: 'REPLY!' })

    userEvent.clear(titleInput)
    userEvent.type(titleInput,'あ'.repeat(31))
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('30文字以内で入力してください。')).toBeInTheDocument()
    })
  })
})

describe('Form contents', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  jest.setTimeout(10000)

  it('本文が空の場合、エラーメッセージを表示', async() => {
    renderReplyUpdate()
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: 'REPLY!' })

    userEvent.clear(contentInput)
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('本文を入力してください。')).toBeInTheDocument()
    })
  })

  it('本文が3001文字以上の場合、エラーメッセージを表示', async() => {
    renderReplyUpdate()
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: 'REPLY!' })

    userEvent.clear(contentInput)
    userEvent.type(contentInput,'あ'.repeat(3001))
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('3000文字以内で入力してください。')).toBeInTheDocument()
    })
  })
})