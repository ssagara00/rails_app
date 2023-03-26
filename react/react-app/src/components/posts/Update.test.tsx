import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Update from './Update'

jest.mock('react-alert')

const setupUpdate = () => {
  const update = true
  const setUpdate = jest.fn()
  const modalid = 1
  const idtitle = 'testreplytitle'
  const idcontents = 'testreplycontents'
  const post: any = []
  const setPosts = jest.fn()
  render(<Update update={update} setUpdate={setUpdate} modalid={modalid} idtitle={idtitle} idcontents={idcontents} post={post} setPosts={setPosts}/>);
}

describe('Update', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('画面表示が適切', () => {
    setupUpdate()

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
    const submitbutton = screen.getByRole('button', { name: 'Update!' })
    expect(submitbutton).toBeInTheDocument()
    const closebutton = screen.getByRole('button', { name: 'Close Modal' })
    expect(closebutton).toBeInTheDocument()
  });
});

describe('ReplyUpdate title', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('タイトルが空の場合、エラーメッセージを表示', async() => {
    setupUpdate()
    const titleinput = screen.getByPlaceholderText('Type title here')
    userEvent.clear(titleinput)
    const submitbutton = screen.getByRole('button', { name: 'Update!' })

    userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('タイトルを入力してください。')).toBeInTheDocument();
    })
  })

  it('タイトルが31文字以上の場合、エラーメッセージを表示', async() => {
    setupUpdate()
    const titleinput = screen.getByPlaceholderText('Type title here')
    userEvent.clear(titleinput)
    const submitbutton = screen.getByRole('button', { name: 'Update!' })

    userEvent.type(titleinput,'あ'.repeat(31));
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('30文字以内で入力してください。')).toBeInTheDocument();
    })
  })
})

describe('Form contents', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  jest.setTimeout(10000);

  it('本文が空の場合、エラーメッセージを表示', async() => {
    setupUpdate()
    const contentsinput = screen.getByPlaceholderText('Type contents here')
    const submitbutton = screen.getByRole('button', { name: 'Update!' })
    userEvent.clear(contentsinput)

    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('本文を入力してください。')).toBeInTheDocument();
    })
  });

  it('本文が3001文字以上の場合、エラーメッセージを表示', async() => {
    setupUpdate()
    const contentsinput = screen.getByPlaceholderText('Type contents here')
    const submitbutton = screen.getByRole('button', { name: 'Update!' })
    userEvent.clear(contentsinput)

    userEvent.type(contentsinput,'あ'.repeat(3001))
    await userEvent.click(submitbutton)
    await waitFor(() => {
      expect(screen.getByText('3000文字以内で入力してください。')).toBeInTheDocument();
    })
  });
})