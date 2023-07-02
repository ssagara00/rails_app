import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AxiosResponse } from 'axios'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { Post } from '../../interfaces/interface'
import { Update } from './Update'
import { mockedUseAlertReturn } from '../../__mocks__/react-alert'
import * as ApiActions from '../../api/api_actions'

jest.mock('../../api/api_actions')

const renderUpdate = () => {
  const day = new Date(2023, 2, 1, 0, 0, 0)// 2023-03-01 0:00:00
  const update = true
  const setUpdate = jest.fn()
  const post: Post = {id: 1, user_id: 1, title: 'テストタイトル', contents: 'テストコンテンツ', created_at: day } 
  const setPosts = jest.fn()
  render(<Update update={update} setUpdate={setUpdate} post={post} setPosts={setPosts}/>)
}

describe('Update', () => {

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

  it('タイトルが空の場合、エラーメッセージを表示', async() => {
    renderUpdate()
    const titleInput = screen.getByPlaceholderText('Type title here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.clear(titleInput)
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('タイトルを入力してください')).toBeInTheDocument()
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
      expect(screen.getByText('30文字以内で入力してください')).toBeInTheDocument()
    })
  })
})

describe('Update contents', () => {
  jest.setTimeout(10000)

  it('本文が空の場合、エラーメッセージを表示', async() => {
    renderUpdate()
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.clear(contentInput)
    userEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('本文を入力してください')).toBeInTheDocument()
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
      expect(screen.getByText('3000文字以内で入力してください')).toBeInTheDocument()
    })
  })
})

describe('Update post', () => {

  it('更新が成功する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.updatePost.mockResolvedValue({ status: 200 } as AxiosResponse)
    renderUpdate()
    
    const titleInput = screen.getByPlaceholderText('Type title here')
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.type(titleInput,'テストタイトル')
    userEvent.type(contentInput,'テスト文章')
    userEvent.click(submitButton)

    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('更新します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // updatePostが起動することを確認
    await waitFor(() => {
      expect(mockedApi.updatePost).toHaveBeenCalled()
      expect(mockedUseAlertReturn.success.mock.calls[0][0]).toBe('更新に成功しました') 
    })
  })

  it('更新が失敗する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.updatePost.mockResolvedValue({ status: 404, data: {message: 'エラー'} } as AxiosResponse)
    console.log = jest.fn()
    renderUpdate()

    const titleInput = screen.getByPlaceholderText('Type title here')
    const contentInput = screen.getByPlaceholderText('Type contents here')
    const submitButton = screen.getByRole('button', { name: '更新する' })

    userEvent.type(titleInput,'テストタイトル')
    userEvent.type(contentInput,'テスト文章')
    userEvent.click(submitButton)

    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('更新します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // updatePostが起動することを確認
    await waitFor(() => {
      expect(mockedApi.updatePost).toHaveBeenCalled()
      expect(mockedUseAlertReturn.error.mock.calls[0][0]).toBe('更新に失敗しました。入力内容の形式に不備があります') 
    })
  })
})