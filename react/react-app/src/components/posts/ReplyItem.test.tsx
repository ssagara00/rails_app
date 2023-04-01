import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AxiosResponse } from 'axios'
import '@testing-library/jest-dom'

import { AuthContext } from '../../Context'
import { Reply } from '../../interfaces/interface'
import { ReplyItem } from './ReplyItem'
import { mockedUseAlertReturn } from '../../__mocks__/react-alert'
import * as ApiActions from '../../api/api_actions'

jest.mock('react-alert')
jest.mock('../../api/api_actions')

const renderReplyItem = () => {
  const day = new Date(2023, 2, 1, 0, 0, 0)// 2023-03-01 0:00:00
  const reply: Reply ={ id:1, user_id:1, title:'Re:testTitle', contents:'replytestContents', created_at: day }
  const setReplies = jest.fn()
  render(
   <ReplyItem  reply={reply} setReplies={setReplies} />
  )
}

const renderLoginReplyItem = () => {
  const day = new Date(2023, 2, 1, 0, 0, 0)// 2023-03-01 0:00:00
  const reply: Reply ={ id:1, user_id:1, title:'Re:testTitle', contents:'replytestContents', created_at: day }
  const setReplies = jest.fn()
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
    <ReplyItem  reply={reply} setReplies={setReplies} />
   </AuthContext.Provider>
  )
}

describe('ReplyItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('非ログイン状態で画面表示が適切', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.showUser.mockResolvedValue({ status: 200, data:{ id: 1, name: 'テストユーザー' } } as AxiosResponse)
    renderReplyItem()

    const title = screen.getByText('Re:testTitle')
    expect(title).toBeInTheDocument()
    const content = screen.getByText('replytestContents')
    expect(content).toBeInTheDocument()
    const day = screen.getByText(/2023-03-01/i)
    expect(day).toBeInTheDocument()
    // 非ログイン時は返信ボタンと更新ボタンと削除ボタンなし
    const returnButton = screen.queryByRole('button', { name: '更新' })
    expect(returnButton).toBeNull()
    const deleteButton = screen.queryByRole('button', { name: '削除' })
    expect(deleteButton).toBeNull()
    
    await waitFor(() => {
      const userName = screen.getByText(/テストユーザー/i)
      expect(userName).toBeInTheDocument()
    })
  })

  it('ログイン状態で画面表示が適切', async() => {
    renderLoginReplyItem()

    // 2つのボタン全てが表示される
    const updateButton = screen.getByRole('button', { name: '更新' })
    expect(updateButton).toBeInTheDocument()
    const deleteButton = screen.getByRole('button', { name: '削除' })
    expect(deleteButton).toBeInTheDocument()

    // エラー避けのため、ログ出力終わるまで待つ
    await waitFor(() => {
    })
  })

  it('ログイン状態で画面表示が適切（他者の投稿）', async() => {
    const day = new Date(2023, 2, 1, 0, 0, 0)// 2023-03-01 0:00:00
    const reply: Reply ={ id:1, user_id:2, title:'Re:testTitle', contents:'replytestContents', created_at: day }
    const setReplies = jest.fn()
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
      <ReplyItem  reply={reply} setReplies={setReplies} />
    </AuthContext.Provider>
    )

    // ログイン時、他者投稿は更新ボタンと削除ボタンなし
    const updateButton = screen.queryByRole('button', { name: '更新' })
    expect(updateButton).toBeNull()
    const deleteButton = screen.queryByRole('button', { name: '削除' })
    expect(deleteButton).toBeNull()

    // エラー避けのため、ログ出力終わるまで待つ
    await waitFor(() => {
    })
  })
})