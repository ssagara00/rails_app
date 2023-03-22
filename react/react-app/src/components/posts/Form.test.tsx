import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { AxiosResponse } from 'axios'
import Form from './Form'
import { Post } from '../../interfaces/interface'
import { mockedUseAlertReturn } from '../../../__mocks__/react-alert'
import * as PostApi from '../../api/posts'

jest.mock('../../api/posts')

describe('Form', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderForm = () => {
    const form = true
    const setForm = jest.fn()
    const posts: Post[] = []
    const setPosts = jest.fn()
    const resetoffset = false
    const setResetoffset = jest.fn()
    render(
      <Form
        form={form}
        setForm={setForm}
        posts={posts}
        setPosts={setPosts}
        resetoffset={resetoffset}
        setResetoffset={setResetoffset}
      />
    )
  }

  it('renders input form', () => {
    renderForm()

    const contentsinput = screen.getByPlaceholderText('Type contents here')
    expect(contentsinput).toBeInTheDocument()
    const titleinput = screen.getByPlaceholderText('Type title here')
    expect(titleinput).toBeInTheDocument()
    const fileinput = screen.getByLabelText('file uploade!!')
    expect(fileinput).toBeInTheDocument()
  })

  it('success', async () => {
    // API呼び出しをモック化
    const mockedPostApi = PostApi as jest.Mocked<typeof PostApi>
    // `as AxiosResponse` のような型アサーションは基本的にバッドプラクティスだが
    // テストにおいては柔軟にしてもいい（すべてのプロパティをモックするのは無駄なので）。
    mockedPostApi.createPost.mockResolvedValue({ status: 200 } as AxiosResponse)
    mockedPostApi.getIndexPosts.mockResolvedValue({ status: 200 } as AxiosResponse)

    renderForm()

    const submitbutton = screen.getByRole('button', { name: 'POST!' })
    const contentsInput = screen.getByPlaceholderText('Type contents here')
    const titleInput = screen.getByPlaceholderText('Type title here')
    await act(async () => {
      userEvent.type(contentsInput, 'Content')
      userEvent.type(titleInput, 'Title')
      userEvent.click(submitbutton)
    })
    // `alert.success()` が呼ばれていることを確認
    expect(mockedUseAlertReturn.success.mock.calls[0][0]).toBe('投稿に成功しました')
  })

  it('error', async () => {
    // API呼び出しをモック化
    // `status: 400` にすることで失敗をシミュレート
    const mockedPostApi = PostApi as jest.Mocked<typeof PostApi>
    mockedPostApi.createPost.mockResolvedValue({
      status: 400,
      data: { message: 'mocked error message' },
    } as AxiosResponse)
    mockedPostApi.getIndexPosts.mockResolvedValue({ status: 400 } as AxiosResponse)

    renderForm()

    const submitbutton = screen.getByRole('button', { name: 'POST!' })
    const contentsInput = screen.getByPlaceholderText('Type contents here')
    const titleInput = screen.getByPlaceholderText('Type title here')
    await act(async () => {
      userEvent.type(contentsInput, 'Content')
      userEvent.type(titleInput, 'Title')
      userEvent.click(submitbutton)
    })
    // `alert.error()` が呼ばれていることを確認
    expect(mockedUseAlertReturn.error.mock.calls[0][0]).toBe('投稿に失敗しました')
  })

  it('validation check', async () => {
    renderForm()

    const submitbutton = screen.getByRole('button', { name: 'POST!' })
    userEvent.click(submitbutton)
    await waitFor(() => {
      expect(screen.getByText('本文を入力してください。')).toBeInTheDocument()
      expect(screen.getByText('タイトルを入力してください。')).toBeInTheDocument()
    })
  })
})
