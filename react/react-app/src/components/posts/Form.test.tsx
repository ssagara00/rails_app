import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Form from './Form'
import { Post } from '../../interfaces/interface'

jest.mock('react-alert')

const setupForm = () => {
  const form = true
  const setForm = jest.fn()
  const posts: Post[] = []
  const setPosts = jest.fn()
  const resetoffset = false
  const setResetoffset = jest.fn()
  render(<Form form={form} setForm={setForm} posts={posts} setPosts={setPosts} resetoffset={resetoffset} setResetoffset={setResetoffset} />)
}

describe('Form', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('画面表示が適切', () => {
    setupForm()

    const titleLabel = screen.queryByText('Title')
    expect(titleLabel).toBeInTheDocument()
    const contentsLabel = screen.queryByText('Contents')
    expect(contentsLabel).toBeInTheDocument()
    const imagelabel = screen.queryByText('Image Uploade')
    expect(imagelabel).toBeInTheDocument()

    const titleinput = screen.getByPlaceholderText('Type title here')
    expect(titleinput).toBeInTheDocument()
    const contentsinput = screen.getByPlaceholderText('Type contents here')
    expect(contentsinput).toBeInTheDocument()
    
    const fileinput = screen.getByLabelText('file uploade!!')
    expect(fileinput).toBeInTheDocument()
    const submitbutton = screen.getByRole('button', { name: 'POST!' })
    expect(submitbutton).toBeInTheDocument()
    const closebutton = screen.getByRole('button', { name: 'Close Modal' })
    expect(closebutton).toBeInTheDocument()
    const cancelfilebutton = screen.getByRole('button', { name: 'Cancel File' })
    expect(cancelfilebutton).toBeInTheDocument()
  });
});

describe('Form title', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('タイトルが空の場合、エラーメッセージを表示', async() => {
    setupForm()
    const contentsinput = screen.getByPlaceholderText('Type contents here')
    const submitbutton = screen.getByRole('button', { name: 'POST!' })

    userEvent.type(contentsinput,'テスト文章')
    await userEvent.click(submitbutton)
    await waitFor(() => {
      expect(screen.getByText('タイトルを入力してください。')).toBeInTheDocument()
    })
  });

  it('タイトルが31文字以上の場合、エラーメッセージを表示', async() => {
    setupForm()
    const titleinput = screen.getByPlaceholderText('Type title here')
    const submitbutton = screen.getByRole('button', { name: 'POST!' })

    userEvent.type(titleinput,'あ'.repeat(31))
    await userEvent.click(submitbutton)
    await waitFor(() => {
      expect(screen.getByText('30文字以内で入力してください。')).toBeInTheDocument()
    })
  });
});

describe('Form contents', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  jest.setTimeout(10000)

  it('本文が空の場合、エラーメッセージを表示', async() => {
    setupForm()
    const titleinput = screen.getByPlaceholderText('Type title here')
    const submitbutton = screen.getByRole('button', { name: 'POST!' })

    userEvent.type(titleinput,'テストタイトル')
    await userEvent.click(submitbutton)
    await waitFor(() => {
      expect(screen.getByText('本文を入力してください。')).toBeInTheDocument()
    })
  });

  it('本文が3001文字以上の場合、エラーメッセージを表示', async() => {
    setupForm()
    const contentsinput = screen.getByPlaceholderText('Type contents here')
    const submitbutton = screen.getByRole('button', { name: 'POST!' })

    userEvent.type(contentsinput,'あ'.repeat(3001))
    await userEvent.click(submitbutton)
    await waitFor(() => {
      expect(screen.getByText('3000文字以内で入力してください。')).toBeInTheDocument()
    })
  });
});
