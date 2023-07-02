import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AxiosResponse } from 'axios'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { AuthContext } from '../../Context'
import { Post } from '../../interfaces/interface'
import { Detail } from './Detail'
import { mockedUseAlertReturn } from '../../__mocks__/react-alert'
import * as ApiActions from '../../api/api_actions'

jest.mock('../../api/api_actions')

const renderDetail = () => {
  const day = new Date(2023, 3, 1, 0, 0, 0)// 2023-04-01 0:00:00
  const detail = true
  const setDetail = jest.fn()
  const post: Post ={ id:1, user_id:1, title:'testTitle', contents:'testContents', image:{url
    :'http://localhost:3000/uploads' }, created_at: day }
  const setPosts = jest.fn()
  const is_liked = false
  const setIs_liked = jest.fn()
  const likes = [{ id: 1, user_id: 1, post_id: 1 }, { id: 2, user_id: 2, post_id: 1 }]
  const setLikes = jest.fn()

  render(
   <Detail detail={detail} setDetail={setDetail} post={post} setPosts={setPosts} 
    is_liked={is_liked} setIs_liked={setIs_liked} likes={likes} setLikes={setLikes}
   />
  )
}

const renderLoginDetail = () => {
  const day = new Date(2023, 3, 1, 0, 0, 0)// 2023-04-01 0:00:00
  const detail = true
  const setDetail = jest.fn()
  const post: Post ={ id:1, user_id:1, title:'testTitle', contents:'testContents', created_at: day }
  const setPosts = jest.fn()
  const is_liked = false
  const setIs_liked = jest.fn()
  const likes = [{ id: 1, user_id: 1, post_id: 1 }, { id: 2, user_id: 2, post_id: 1 }]
  const setLikes = jest.fn()

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
      <Detail detail={detail} setDetail={setDetail} post={post} setPosts={setPosts} 
        is_liked={is_liked} setIs_liked={setIs_liked} likes={likes} setLikes={setLikes}
      />
    </AuthContext.Provider>
  )
}

describe('Detail', () => {

  it('非ログイン状態で画面表示が適切', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.showUser.mockResolvedValue({ status: 200, data:{ id: 1, name: 'テストユーザー' } } as AxiosResponse)   
    mockedApi.showReply.mockResolvedValue({ status: 200, data: []} as AxiosResponse)
    renderDetail()

    const title = screen.getByText('testTitle')
    expect(title).toBeInTheDocument()
    const content = screen.getByText('testContents')
    expect(content).toBeInTheDocument()
    const formatday = screen.getByText(/2023-04-01/i)
    expect(formatday).toBeInTheDocument()
    // 画像が投稿されている場合、投稿された画像が表示される
    const image = screen.getByAltText('user_content')
    expect(image).toBeInTheDocument()
    // 返信がない場合は、メッセージ表示
    const reply = screen.getByText('まだ返信がありません。')
    expect(reply).toBeInTheDocument()
    const unlikeButton = screen.getByAltText('heartoff')
    expect(unlikeButton).toBeInTheDocument()
    const closeButton = screen.getByRole('button', { name: '閉じる' })
    expect(closeButton).toBeInTheDocument()

    await waitFor(() => {
      const userName = screen.getByText(/テストユーザー/i)
      expect(userName).toBeInTheDocument()
      const likeNum = screen.getByText(/いいね数：2/i)
      expect(likeNum).toBeInTheDocument()
    })
  })

  it('ログイン状態で画面表示が適切', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.showReply.mockResolvedValue({ status: 200, data: []} as AxiosResponse)
    renderLoginDetail()
    
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
      // いいねしてない場合は、未いいね用のハートアイコン表示
      const likeButton = screen.getByAltText('heartoff')
      expect(likeButton).toBeInTheDocument()
    })
  })

  it('ログイン状態で画面表示が適切（他者の投稿）', async() => {
    const day = new Date(2023, 2, 1, 0, 0, 0)// 2023-03-01 0:00:00
    const detail = true
    const setDetail = jest.fn()
    const post: Post ={ id:1, user_id:2, title:'testTitle', contents:'testContents', created_at: day }
    const setPosts = jest.fn()
    const is_liked = true
    const setIs_liked = jest.fn()
    const likes = [{ id: 1, user_id: 1, post_id: 1 }, { id: 2, user_id: 2, post_id: 1 }]
    const setLikes = jest.fn()
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.showReply.mockResolvedValue({ status: 200, data: []} as AxiosResponse)

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
        <Detail detail={detail} setDetail={setDetail} post={post} setPosts={setPosts} 
          is_liked={is_liked} setIs_liked={setIs_liked} likes={likes} setLikes={setLikes}
        />
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
      // いいね済の場合は、いいね済用のハートアイコン表示
      const likeButton = screen.getByAltText('hearton')
      expect(likeButton).toBeInTheDocument()
    })
  })
})

describe('Detail delete', () => {
  
  it('削除処理が成功する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.deletePost.mockResolvedValue({ status: 200 } as AxiosResponse)
    mockedApi.showReply.mockResolvedValue({ status: 200, data: []} as AxiosResponse)
    renderLoginDetail()

    await waitFor(() => {
      const deletebutton = screen.getByRole('button', { name: '削除' })
      userEvent.click(deletebutton)
    })

    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('削除します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // deletePostが起動することを確認
    await waitFor(() => {
      expect(mockedApi.deletePost).toHaveBeenCalled()
      expect(mockedUseAlertReturn.success.mock.calls[0][0]).toBe('削除に成功しました')    
    })
  })

  it('削除処理が失敗する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.deletePost.mockResolvedValue({ status: 404 } as AxiosResponse)
    mockedApi.showReply.mockResolvedValue({ status: 200, data: []} as AxiosResponse)
    console.log = jest.fn()
    renderLoginDetail()
    
    await waitFor(() => {
      const deletebutton = screen.getByRole('button', { name: '削除' })
      userEvent.click(deletebutton)
    })
    
    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('削除します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })
    
    // deletePostが起動することを確認
    await waitFor(() => {
      expect(mockedApi.deletePost).toHaveBeenCalled()
      expect(mockedUseAlertReturn.error.mock.calls[0][0]).toBe('削除に失敗しました。投稿が見つかりません。しばらくしてからもう一度お試しください')
    })
  })
})

/* いいね機能はItem.tsxでテスト済み */