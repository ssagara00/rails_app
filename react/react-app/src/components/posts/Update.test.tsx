import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { Post } from '../../interfaces/interface'
import { Update } from './Update'

jest.mock('react-alert')

const renderUpdate = () => {
  const day = new Date(2023, 2, 1, 0, 0, 0)// 2023-03-01 0:00:00
  const update = true
  const setUpdate = jest.fn()
  const post: Post = {id: 1, user_id: 1, title: 'テストタイトル', contents: 'テストコンテンツ', created_at: day } 
  const setPosts = jest.fn()
  render(<Update update={update} setUpdate={setUpdate} post={post} setPosts={setPosts}/>)
}

describe('Update', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('画面表示が適切', async() => {
    renderUpdate()

    const titleLabel = screen.getByText('タイトル')
    expect(titleLabel).toBeInTheDocument()
    const contentLabel = screen.getByText('本文')
    expect(contentLabel).toBeInTheDocument()
    const imageLabel = screen.getByText('画像')
    expect(imageLabel).toBeInTheDocument()

    const titleInput = screen.getByPlaceholderText('Type title here')
    expect(titleInput).toBeInTheDocument()
    expect(titleInput).toHaveValue('テストタイトル')
    const contentInput = screen.getByPlaceholderText('Type contents here')
    expect(contentInput).toBeInTheDocument()
    expect(contentInput).toHaveValue('テストコンテンツ')
    
    const fileInput = screen.getByLabelText('画像アップロード')
    expect(fileInput).toBeInTheDocument()
    const submitButton = screen.getByRole('button', { name: '更新する' })
    expect(submitButton).toBeInTheDocument()
    const closeButton = screen.getByRole('button', { name: '閉じる' })
    expect(closeButton).toBeInTheDocument()
    const cancelFileButton = screen.getByRole('button', { name: '画像リセット' })
    expect(cancelFileButton).toBeInTheDocument()
  })
})

describe('Update title', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('タイトルが空の場合、エラーメッセージを表示', async() => {
    renderUpdate()
    const titleInput = screen.getByPlaceholderText('Type title here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.clear(titleInput)
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('タイトルを入力してください。')).toBeInTheDocument()
    })
  })

  it('タイトルが31文字以上の場合、エラーメッセージを表示', async() => {
    renderUpdate()
    const titleInput = screen.getByPlaceholderText('Type title here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

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
    renderUpdate()
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.clear(contentInput)
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('本文を入力してください。')).toBeInTheDocument()
    })
  })

  it('本文が3001文字以上の場合、エラーメッセージを表示', async() => {
    renderUpdate()
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.clear(contentInput)
    userEvent.type(contentInput,'あ'.repeat(3001))
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('3000文字以内で入力してください。')).toBeInTheDocument()
    })
  })
})
