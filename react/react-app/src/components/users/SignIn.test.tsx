import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import SignIn from './SignIn';

jest.mock('react-alert');

const setupSignin = () => {
  const signin = true;
  const setSignin = jest.fn();
  render(<SignIn signin={signin} setSignin={setSignin} />);
}

describe('SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('画面表示が適切', () => {
    setupSignin();

    const emailLabel = screen.queryByText('Email');
    expect(emailLabel).toBeInTheDocument();
    const passwordlabel = screen.queryByText('Password');
    expect(passwordlabel).toBeInTheDocument();

    const emailinput = screen.getByPlaceholderText('Type email here');
    expect(emailinput).toBeInTheDocument();
    const passwordinput = screen.getByPlaceholderText('Type password here');
    expect(passwordinput).toBeInTheDocument();

    const submitbutton = screen.getByRole('button', { name: 'SignIN' });
    expect(submitbutton).toBeInTheDocument();
    const closebutton = screen.getByRole('button', { name: 'Close Modal' });
    expect(closebutton).toBeInTheDocument();
  });
})

describe('SignIn email', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('メールアドレスが空の場合、エラーメッセージを表示', async() => {
    setupSignin();
    const passwordinput = screen.getByPlaceholderText('Type password here');
    const submitbutton = screen.getByRole('button', { name: 'SignIN' });

    userEvent.type(passwordinput,'xxxx1111');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('メールアドレスを入力してください。')).toBeInTheDocument()
    })
  });

  it('メールアドレスの形式が不正の場合、エラーメッセージを表示', async() => {
    setupSignin();
    const emailinput = screen.getByPlaceholderText('Type email here');
    const submitbutton = screen.getByRole('button', { name: 'SignIN' });

    userEvent.type(emailinput,'xxxx1111');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('メールアドレスの形式が不正です。')).toBeInTheDocument()
    })
  });
})

describe('SignIn password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('パスワードが空の場合、エラーメッセージを表示', async() => {
    setupSignin();
    const emailinput = screen.getByPlaceholderText('Type email here');
    const submitbutton = screen.getByRole('button', { name: 'SignIN' });

    userEvent.type(emailinput,'test@example.com');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('パスワードを入力してください。')).toBeInTheDocument()
    })
  });

  it('パスワード5文字以内の場合、エラーメッセージを表示', async() => {
    setupSignin();
    const passwordinput = screen.getByPlaceholderText('Type password here');
    const submitbutton = screen.getByRole('button', { name: 'SignIN' });

    userEvent.type(passwordinput,'aaaaa');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('6文字以上入力してください。')).toBeInTheDocument()
    })
  });

  it('パスワードが129文字以上の場合、エラーメッセージを表示', async() => {
    setupSignin();
    const passwordinput = screen.getByPlaceholderText('Type password here');
    const submitbutton = screen.getByRole('button', { name: 'SignIN' });

    userEvent.type(passwordinput,'a'.repeat(129));
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('128文字以内で入力してください。')).toBeInTheDocument()
    })
  });

  it('パスワードが半角英数字以外の場合、エラーメッセージを表示', async() => {
    setupSignin();
    const passwordinput = screen.getByPlaceholderText('Type password here');
    const submitbutton = screen.getByRole('button', { name: 'SignIN' });

    userEvent.type(passwordinput,'ああああああああ');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('パスワードは半角英数字のみ有効です。')).toBeInTheDocument()
    })
  });
})