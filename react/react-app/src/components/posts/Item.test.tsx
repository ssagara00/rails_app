import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AxiosResponse } from 'axios'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { AuthContext } from '../../Context'
import { Post } from '../../interfaces/interface'
import { Item } from './Item'
import { mockedUseAlertReturn } from "../../__mocks__/react-alert"
import * as ApiActions from '../../api/api_actions'

jest.mock('react-alert')
jest.mock('../../api/api_actions')

const renderItem = () => {
  const day = new Date(2023, 2, 1, 0, 0, 0)// 2023-03-01 0:00:00
  const post: Post ={ id:1, user_id:1, title:'testTitle', contents:'testContents', image:{url
    :'http://localhost:3000/uploads' }, created_at: day }
  const setPosts = jest.fn()
  render(
    <Item post={post} setPosts={setPosts} />
  )
}

const renderLoginItem = () => {
  const day = new Date(2023, 2, 1, 0, 0, 0)// 2023-03-01 0:00:00
  const post: Post ={ id:1, user_id:1, title:'testTitle', contents:'testContents', created_at: day }
  const setPosts = jest.fn()
  render(
    <AuthContext.Provider
        value={
          {
            isSignedIn: true,
            currentUser: {
              id: 1,
            },
          } as any
        }
      >
      <Item post={post} setPosts={setPosts} />
    </AuthContext.Provider>
  )
}

describe('Item', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('非ログイン状態で画面表示が適切', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.showUser.mockResolvedValue({ status: 200, data:{ id: 1, name: 'テストユーザー' } } as AxiosResponse)
    mockedApi.showLike.mockResolvedValue({ status: 200, data:{ 0:{ id: 1, user_id: 1, post_id: 1 }, 1:{ id: 2, user_id: 2, post_id: 1 }} } as AxiosResponse)
    renderItem()

    const title = screen.getByText('testTitle')
    expect(title).toBeInTheDocument()
    const content = screen.getByText('testContents')
    expect(content).toBeInTheDocument()
    // 画像が投稿されている場合、投稿された画像が表示される
    const image = screen.getByAltText('user_content')
    expect(image).toBeInTheDocument()
    const detailButton = screen.getByRole('button', { name: '詳細' })
    expect(detailButton).toBeInTheDocument()
    // 非ログイン時は返信ボタンと更新ボタンと削除ボタンなし
    const returnButton = screen.queryByRole('button', { name: '返信' })
    expect(returnButton).toBeNull()
    const updateButton = screen.queryByRole('button', { name: '更新' })
    expect(updateButton).toBeNull()
    const deleteButton = screen.queryByRole('button', { name: '削除' })
    expect(deleteButton).toBeNull()
    const unlikeButton = screen.getByAltText('heartoff')
    expect(unlikeButton).toBeInTheDocument()

    await waitFor(() => {
      const userName = screen.getByText(/テストユーザー/i)
      expect(userName).toBeInTheDocument()
      const likeNum = screen.getByText(/2/i)
      expect(likeNum).toBeInTheDocument()
    })
  })

  it('ログイン状態で画面表示が適切', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.showUser.mockResolvedValue({ status: 200, data:{ id: 1, name: 'テスト' } } as AxiosResponse)
    mockedApi.showLike.mockResolvedValue({ status: 200, data:{ 0:{ id: 1, user_id: 1, post_id: 1 }, 1:{ id: 2, user_id: 2, post_id: 1 }} } as AxiosResponse)
    mockedApi.searchLike.mockResolvedValue({ status: 200, data: true } as AxiosResponse)
    renderLoginItem()

    // 画像なしの場合はデフォルト画像が表示される
    const image = screen.getByAltText('default')
    expect(image).toBeInTheDocument()
    // ３つのボタン全てが表示される
    const returnButton = screen.getByRole('button', { name: '返信' })
    expect(returnButton).toBeInTheDocument()
    const updateButton = screen.getByRole('button', { name: '更新' })
    expect(updateButton).toBeInTheDocument()
    const deleteButton = screen.getByRole('button', { name: '削除' })
    expect(deleteButton).toBeInTheDocument()

    await waitFor(() => {
      // いいね済の場合は、いいね済用のハートアイコン表示
      const likeButton = screen.getByAltText('hearton')
      expect(likeButton).toBeInTheDocument()
    })
  })

  it('ログイン状態で画面表示が適切（他者の投稿）', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.searchLike.mockResolvedValue({ status: 200, data: false } as AxiosResponse)
    const day = new Date(2023, 2, 1, 0, 0, 0)// 2023-03-01 0:00:00
    const post: Post ={ id:1, user_id:2, title:'testTitle', contents:'testContents', created_at: day }
    const setPosts = jest.fn()
    render(
      <AuthContext.Provider
          value={
            {
              isSignedIn: true,
              currentUser: {
                id: 1,
              },
            } as any
          }
        >
      <Item post={post} setPosts={setPosts} />
    </AuthContext.Provider>
    )

    const returnButton = screen.getByRole('button', { name: '返信' })
    expect(returnButton).toBeInTheDocument()
    // ログイン時、他者投稿は更新ボタンと削除ボタンなし
    const updateButton = screen.queryByRole('button', { name: '更新' })
    expect(updateButton).toBeNull()
    const deleteButton = screen.queryByRole('button', { name: '削除' })
    expect(deleteButton).toBeNull()

    await waitFor(() => {
      // いいねしてない場合は、未いいね用のハートアイコン表示
      const likeButton = screen.getByAltText('heartoff')
      expect(likeButton).toBeInTheDocument()
    })
  })
})

/*
describe('Item delete', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('削除処理が成功する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.deletePost.mockResolvedValue({ status: 200 } as AxiosResponse)
    
    render(
      <AuthContext.Provider
        value={
          {
            isSignedIn: true,
            currentUser: {
              id: 1,
            },
          } as any
        }
      >
        <Item
          post={{
            contents: 'testContents',
            title: 'testTitle',
            user_id: 1,
            id: 1,
          }}
          setPosts={(p: Post) => {}}
        />
      </AuthContext.Provider>
    )

    const deletebutton = screen.getByRole('button', { name: '削除' })
    // 削除ボタンをクリック
    userEvent.click(deletebutton)
    
    await waitFor(() => {
      // ここで、確認ダイアログが表示される。ユーザーが「はい」を選択すると、deletePostが起動する。
    })

    expect(mockedUseAlertReturn.success.mock.calls[0][0]).toBe('削除に成功しました')
  })
})
*/

describe('Item like', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('いいねする', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.createLike.mockResolvedValue({ status: 200 } as AxiosResponse)
    mockedApi.showLike.mockResolvedValue({ status: 200, data:{ 0:{ id: 1, user_id: 2, post_id: 1 }, 1:{ id: 2, user_id: 3, post_id: 1 }, 2:{ id: 3, user_id: 1, post_id: 1 } } } as AxiosResponse)
    mockedApi.searchLike.mockResolvedValue({ status: 200, data: false } as AxiosResponse)
    renderLoginItem()

    const unlikeButton = screen.getByTestId('tolike')
    userEvent.click(unlikeButton)
    await waitFor(() => {
      const likeButton = screen.getByTestId('tounlike')
      expect(likeButton).toBeInTheDocument()
      const likeNum = screen.getByText(/3/i)
      expect(likeNum).toBeInTheDocument()
    })
  })

  it('いいね解除する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.deleteLike.mockResolvedValue({ status: 200 } as AxiosResponse)
    mockedApi.showLike.mockResolvedValue({ status: 200, data:{ 0:{ id: 1, user_id: 2, post_id: 1 }} } as AxiosResponse)
    mockedApi.searchLike.mockResolvedValue({ status: 200, data: true } as AxiosResponse)
    renderLoginItem()

    const likeButton = await screen.findByTestId('tounlike')
    userEvent.click(likeButton)
    await waitFor(() => {
      const unlikeButton = screen.getByTestId('tolike')
      expect(unlikeButton).toBeInTheDocument()
      const likeNum = screen.getByText(/1/i)
      expect(likeNum).toBeInTheDocument()
    })
  })
})