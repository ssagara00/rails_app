import React from "react"
import { act,render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { AxiosResponse } from 'axios'
import Item from './Item'
import { AuthContext } from '../../App'
import { Post } from '../../interfaces/interface'
import * as ApiActions from '../../api/api_actions'
import { mockedUseAlertReturn } from "../../__mocks__/react-alert"

jest.mock('../../api/api_actions')

const setupItem = () => {

  const post: Post ={ id:1, user_id:1, title:'testTitle', contents:'testContents', image:{url
    :'http://localhost:3000/uploads'} };
  const setPosts = jest.fn();
  render(
   <Item post={post} setPosts={setPosts} />
  );
}

const renderItem = () => {

  const post: Post ={ id:1, user_id:1, title:'testTitle', contents:'testContents' };
  const setPosts = jest.fn();
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
    mockedApi.showUser.mockResolvedValue({ status: 200, data:{ id: 1, name: 'テスト' } } as AxiosResponse)
    mockedApi.showLike.mockResolvedValue({ status: 200, data:{ 0:{ id: 1, user_id: 1, post_id: 1 }, 1:{ id: 2, user_id: 2, post_id: 1 }} } as AxiosResponse)
    setupItem()

    const title = await screen.findByText('testTitle')
    const content = await screen.findByText('testContents')
    const image = screen.getByAltText('post_image')
    const detailbutton = screen.getByRole('button', { name: '詳細' })
    const unlikebutton = screen.getByAltText('heartoff')
    const userName = await screen.findByText(/テスト/i)
    const likeNum = await screen.findByText(/2/i)
    
    await waitFor(() => {
      expect(title).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(image).toBeInTheDocument()
      expect(detailbutton).toBeInTheDocument()
      expect(userName).toBeInTheDocument()
      expect(likeNum).toBeInTheDocument()
      expect(unlikebutton).toBeInTheDocument()
    })
  })
})

describe('Item', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('ログイン状態で画面表示が適切', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.showUser.mockResolvedValue({ status: 200, data:{ id: 1, name: 'テスト' } } as AxiosResponse)
    mockedApi.showLike.mockResolvedValue({ status: 200, data:{ 0:{ id: 1, user_id: 1, post_id: 1 }, 1:{ id: 2, user_id: 2, post_id: 1 }} } as AxiosResponse)
    mockedApi.searchLike.mockResolvedValue({ status: 200, data: true } as AxiosResponse)
    
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
    
    const image = screen.getByAltText('Shoes')
    const returnbutton = screen.getByRole('button', { name: '返信' })
    const deletebutton = screen.getByRole('button', { name: '削除' })
    const updatebutton = screen.getByRole('button', { name: '更新' })

    await waitFor(() => {
      
      const likebutton = screen.getByAltText('hearton')

      expect(image).toBeInTheDocument()
      expect(returnbutton).toBeInTheDocument()
      expect(deletebutton).toBeInTheDocument()
      expect(updatebutton).toBeInTheDocument()
      expect(likebutton).toBeInTheDocument()
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

  it('いいねをクリックする', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.createLike.mockResolvedValue({ status: 200 } as AxiosResponse)
    mockedApi.showLike.mockResolvedValue({ status: 200, data:{ 0:{ id: 1, user_id: 2, post_id: 1 }, 1:{ id: 2, user_id: 3, post_id: 1 }, 2:{ id: 3, user_id: 1, post_id: 1 } } } as AxiosResponse)

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

    const unlikebutton = screen.getByTestId('tolike')
    userEvent.click(unlikebutton)

    await waitFor(() => {
      const likebutton = screen.getByTestId('tounlike')
      expect(likebutton).toBeInTheDocument()
    })
  })

  it('いいね済をクリックする', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.deleteLike.mockResolvedValue({ status: 200 } as AxiosResponse)
    mockedApi.showLike.mockResolvedValue({ status: 200, data:{ 0:{ id: 1, user_id: 2, post_id: 1 }} } as AxiosResponse)
    mockedApi.searchLike.mockResolvedValue({ status: 200, data: true } as AxiosResponse)

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

    await waitFor(() => {
      const likebutton = screen.getByTestId('tounlike')
      userEvent.click(likebutton)
    })

    await waitFor(() => {
      const unlikebutton = screen.getByTestId('tolike')
      expect(unlikebutton).toBeInTheDocument()
    })
  })
})