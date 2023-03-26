import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import ReplyCreate from './ReplyCreate';
jest.mock('react-alert');


const setupReplyCreate = () => {
  const reply = true;
  const setReply = jest.fn();
  const modalid = 99;
  const idtitle = 'test_title';
  render(<ReplyCreate reply={reply} setReply={setReply} modalid={modalid} idtitle={idtitle} />);
};

describe('ReplyCreate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('画面表示が適切', () => {
    setupReplyCreate();

    const titleLabel = screen.queryByText('Title');
    expect(titleLabel).toBeInTheDocument();
    const contentsLabel = screen.queryByText('Contents');
    expect(contentsLabel).toBeInTheDocument();

    const titleinput = screen.getByPlaceholderText('Type title here');
    expect(titleinput).toBeInTheDocument();
    const contentsinput = screen.getByPlaceholderText('Type contents here');
    expect(contentsinput).toBeInTheDocument();

    const submitbutton = screen.getByRole('button', { name: 'REPLY!' });
    expect(submitbutton).toBeInTheDocument();
    const closebutton = screen.getByRole('button', { name: 'Close Modal' });
    expect(closebutton).toBeInTheDocument();
  });
});

describe('ReplyCreate title', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('タイトルが空の場合、エラーメッセージを表示', async() => {
    setupReplyCreate();
    const titleinput = screen.getByPlaceholderText('Type title here');
    const contentsinput = screen.getByPlaceholderText('Type contents here');
    const submitbutton = screen.getByRole('button', { name: 'REPLY!' });

    userEvent.clear(titleinput);
    userEvent.type(contentsinput,'テスト文章');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('タイトルを入力してください。')).toBeInTheDocument();
    })
  });

  it('タイトルが31文字以上の場合、エラーメッセージを表示', async() => {
    setupReplyCreate();
    const titleinput = screen.getByPlaceholderText('Type title here');
    const submitbutton = screen.getByRole('button', { name: 'REPLY!' });

    userEvent.type(titleinput,'あ'.repeat(31));
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('30文字以内で入力してください。')).toBeInTheDocument();
    })
  });
});

describe('ReplyCreate contents', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  jest.setTimeout(10000);

  it('本文が空の場合、エラーメッセージを表示', async() => {
    setupReplyCreate();
    const titleinput = screen.getByPlaceholderText('Type title here');
    const submitbutton = screen.getByRole('button', { name: 'REPLY!' });

    userEvent.type(titleinput,'テストタイトル');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('本文を入力してください。')).toBeInTheDocument();
    })
  });

  it('本文が3001文字以上の場合、エラーメッセージを表示', async() => {
    setupReplyCreate();
    const contentsinput = screen.getByPlaceholderText('Type contents here');
    const submitbutton = screen.getByRole('button', { name: 'REPLY!' });

    userEvent.type(contentsinput,'あ'.repeat(3001));
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('3000文字以内で入力してください。')).toBeInTheDocument();
    })
  });
});