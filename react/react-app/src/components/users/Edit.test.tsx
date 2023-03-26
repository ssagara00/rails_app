import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Edit from './Edit';

jest.mock('react-alert');

const setupSignup = () => {
  const edit = true;
  const setEdit = jest.fn();
  render(<Edit edit={edit} setEdit={setEdit} />);
}

describe('Edit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('画面表示が適切', () => {
    setupSignup();

    const nameLabel = screen.queryByText('Name');
    expect(nameLabel).toBeInTheDocument();
    const emailLabel = screen.queryByText('Email');
    expect(emailLabel).toBeInTheDocument();

    const nameinput = screen.getByPlaceholderText('Type name here');
    expect(nameinput).toBeInTheDocument();
    const emailinput = screen.getByPlaceholderText('Type email here');
    expect(emailinput).toBeInTheDocument();

    const submitbutton = screen.getByRole('button', { name: 'EDIT!' });
    expect(submitbutton).toBeInTheDocument();
    const closebutton = screen.getByRole('button', { name: 'Close Modal' });
    expect(closebutton).toBeInTheDocument();
  });
})

describe('Edit name', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('名前が空の場合、エラーメッセージを表示', async() => {
    setupSignup();
    const emailinput = screen.getByPlaceholderText('Type email here');
    const submitbutton = screen.getByRole('button', { name: 'EDIT!' });

    userEvent.type(emailinput,'test@example.com');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('名前を入力してください。')).toBeInTheDocument()
    })
  });

  it('名前が101文字以上の場合、エラーメッセージを表示', async() => {
    setupSignup();
    const nameinput = screen.getByPlaceholderText('Type name here');
    const submitbutton = screen.getByRole('button', { name: 'EDIT!' });

    userEvent.type(nameinput,'あ'.repeat(101));
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('100文字以内で入力してください。')).toBeInTheDocument()
    })
  });
})

describe('Edit email', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('メールアドレスが空の場合、エラーメッセージを表示', async() => {
    setupSignup();
    const nameinput = screen.getByPlaceholderText('Type name here');
    const submitbutton = screen.getByRole('button', { name: 'EDIT!' });

    userEvent.type(nameinput,'テスト');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('メールアドレスを入力してください。')).toBeInTheDocument()
    })
  });

  it('メールアドレスの形式が不正の場合、エラーメッセージを表示', async() => {
    setupSignup();
    const emailinput = screen.getByPlaceholderText('Type email here');
    const submitbutton = screen.getByRole('button', { name: 'EDIT!' });

    userEvent.type(emailinput,'xxxx1111');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('メールアドレスの形式が不正です。')).toBeInTheDocument()
    })
  });
})