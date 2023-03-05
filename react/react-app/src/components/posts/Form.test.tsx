import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Form from './Form';
import { Post } from '../../interfaces/interface';

describe('Form', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const setupForm = () => {
    const form = true;
    const setForm = jest.fn();
    const posts: Post[] = [];
    const setPosts = jest.fn();
    const resetoffset = false;
    const setResetoffset = jest.fn();
    render(<Form form={form} setForm={setForm} posts={posts} setPosts={setPosts} resetoffset={resetoffset} setResetoffset={setResetoffset} />);
  }

  it('renders input form', () => {
    setupForm();

    const contentsinput = screen.getByPlaceholderText('Type contents here');
    expect(contentsinput).toBeInTheDocument();
    const titleinput = screen.getByPlaceholderText('Type title here');
    expect(titleinput).toBeInTheDocument();
    const fileinput = screen.getByLabelText('file uploade!!');
    expect(fileinput).toBeInTheDocument();
  });

  it('validation check', async() => {
    setupForm();

    const submitbutton = screen.getByRole('button', { name: 'POST!' });
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('本文を入力してください。')).toBeInTheDocument()
      expect(screen.getByText('タイトルを入力してください。')).toBeInTheDocument()
    })
  });
});
