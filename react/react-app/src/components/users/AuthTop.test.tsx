import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AxiosResponse } from 'axios'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { AuthContext } from '../../Context'
import { AuthTop } from './AuthTop'
import { mockedUseAlertReturn } from '../../__mocks__/react-alert'
import * as ApiActions from '../../api/api_actions'

jest.mock('../../api/api_actions')

// useNavigateをモック化
const mockedNavigator = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}))

const renderAuthTop = () => {
  const setIsSignedIn = jest.fn()
  const setLoading = jest.fn()

  render(
    <AuthContext.Provider
        value={
          {
            isSignedIn: true,
            setIsSignedIn,
            setLoading,
            currentUser: {
              id: 1,
            },
          } as any
        }
      >
        <AuthTop />
    </AuthContext.Provider>
  )
}

describe('AuthTop', () => {

  it('画面表示が適切', () => {
    renderAuthTop()

    const edituserimage = screen.getByAltText('user_edit')
    expect(edituserimage).toBeInTheDocument()
    const deliteimage = screen.getByAltText('deleteaccount')
    expect(deliteimage).toBeInTheDocument()
    const contentsimage = screen.getByAltText('contents')    
    expect(contentsimage).toBeInTheDocument()
  })
})

describe('User delete', () => {
  
  it('退会処理が成功する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.deleteUser.mockResolvedValue({ status: 200 } as AxiosResponse)
    renderAuthTop()
    
    await waitFor(() => {
      const deletebutton = screen.getByTestId('userDelete')
      userEvent.click(deletebutton)
    })
    
    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('退会します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // deleteUserが起動することを確認
    await waitFor(() => {
      expect(mockedApi.deleteUser).toHaveBeenCalled()
      // 以下のメッセージはPostsTop遷移後に表示するため、テストしない。
      // expect(mockedUseAlertReturn.success.mock.calls[0][0]).toBe('会員情報の削除に成功しました')
    })
  })

  it('退会処理が失敗する', async() => {
    const mockedApi = ApiActions as jest.Mocked<typeof ApiActions>
    mockedApi.deleteUser.mockResolvedValue({ status: 404, data: {message: 'エラー'} } as AxiosResponse)
    console.log = jest.fn()
    renderAuthTop()

    await waitFor(() => {
      const deletebutton = screen.getByTestId('userDelete')
      userEvent.click(deletebutton)
    })
    
    await waitFor(() => {
      // 確認ダイアログが表示されることを確認
      const dialog = screen.getByText('退会します。よろしいですか?')
      expect(dialog).toBeInTheDocument()
      // ユーザーが「はい」を選択する
      const confirmButton = screen.getByRole('button', { name: 'はい' })
      userEvent.click(confirmButton)
    })

    // deleteUserが起動することを確認
    await waitFor(() => {
      expect(mockedApi.deleteUser).toHaveBeenCalled()
      expect(mockedUseAlertReturn.error.mock.calls[0][0]).toBe('会員情報の削除に失敗しました。会員情報が見つかりません。しばらくしてからもう一度お試しください')
    })
  })
})