import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { Form } from './Form'

jest.mock('react-alert')

const renderForm = () => {
  const form = true
  const setForm = jest.fn()
  render(<Form form={form} setForm={setForm} />)
}

describe('Form', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('画面表示が適切', () => {
    renderForm()

    const titleLabel = screen.getByText('Title')
    expect(titleLabel).toBeInTheDocument()
    const contentLabel = screen.getByText('Contents')
    expect(contentLabel).toBeInTheDocument()
    const imageLabel = screen.getByText('Image Uploade')
    expect(imageLabel).toBeInTheDocument()

    const titleInput = screen.getByPlaceholderText('Type title here')
    expect(titleInput).toBeInTheDocument()
    const contentInput = screen.getByPlaceholderText('Type contents here')
    expect(contentInput).toBeInTheDocument()
    
    const fileInput = screen.getByLabelText('file uploade!!')
    expect(fileInput).toBeInTheDocument()
    const submitButton = screen.getByRole('button', { name: 'POST!' })
    expect(submitButton).toBeInTheDocument()
    const closeButton = screen.getByRole('button', { name: 'Close Modal' })
    expect(closeButton).toBeInTheDocument()
    const cancelFileButton = screen.getByRole('button', { name: 'Cancel File' })
    expect(cancelFileButton).toBeInTheDocument()
  })
})

describe('Form title', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('タイトルが空の場合、エラーメッセージを表示', async() => {
    renderForm()
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: 'POST!' })

    userEvent.type(contentInput,'テスト文章')
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('タイトルを入力してください。')).toBeInTheDocument()
    })
  })

  it('タイトルが31文字以上の場合、エラーメッセージを表示', async() => {
    renderForm()
    const titleInput = screen.getByPlaceholderText('Type title here')
    const submitbutton = screen.getByRole('button', { name: 'POST!' })

    userEvent.type(titleInput,'あ'.repeat(31))
    userEvent.click(submitbutton)
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
    renderForm()
    const titleInput = screen.getByPlaceholderText('Type title here')
    const submitbutton = screen.getByRole('button', { name: 'POST!' })

    userEvent.type(titleInput,'テストタイトル')
    userEvent.click(submitbutton)
    await waitFor(() => {
      expect(screen.getByText('本文を入力してください。')).toBeInTheDocument()
    })
  })

  it('本文が3001文字以上の場合、エラーメッセージを表示', async() => {
    renderForm()
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: 'POST!' })

    userEvent.type(contentInput,'あ'.repeat(3001))
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('3000文字以内で入力してください。')).toBeInTheDocument()
    })
  })
})
