import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ReplyCreate from './ReplyCreate';

describe('Reply-Create', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const setupReplyCreate = () => {
    const reply = true;
    const setReply = jest.fn();
    const modalid = 99;
    const idtitle = 'test_title';
    render(<ReplyCreate reply={reply} setReply={setReply} modalid={modalid} idtitle={idtitle} />);
  }

  it('renders input form', () => {
    setupReplyCreate();

    const contentsinput = screen.getByPlaceholderText('Type contents here');
    expect(contentsinput).toBeInTheDocument();
    const titleinput = screen.getByPlaceholderText('Type title here');
    expect(titleinput).toBeInTheDocument();
  });

  it('validation check', async() => {
    setupReplyCreate();

    const submitbutton = screen.getByRole('button', { name: 'Reply!' });
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('本文を入力してください。')).toBeInTheDocument()
    })
  });

  it('title validation check', async() => {
    setupReplyCreate();

    const submitbutton = screen.getByRole('button', { name: 'Reply!' });
    const titleinput = screen.getByPlaceholderText('Type title here');
    userEvent.clear(titleinput);
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('タイトルを入力してください。')).toBeInTheDocument()
    })
  });

});
