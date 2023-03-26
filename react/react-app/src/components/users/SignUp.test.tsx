import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import SignUp from './SignUp';

jest.mock('react-alert');

const setupSignup = () => {
  const signup = true;
  const setSignup = jest.fn();
  render(<SignUp signup={signup} setSignup={setSignup} />);
}

describe('SignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('画面表示が適切', () => {
    setupSignup();

    const nameLabel = screen.queryByText('Name');
    expect(nameLabel).toBeInTheDocument();
    const emailLabel = screen.queryByText('Email');
    expect(emailLabel).toBeInTheDocument();
    const passwordlabel = screen.queryByText('Password');
    expect(passwordlabel).toBeInTheDocument();
    const passwordconfirmationlabel = screen.queryByText('PasswordConfirmation');
    expect(passwordconfirmationlabel).toBeInTheDocument();

    const nameinput = screen.getByPlaceholderText('Type name here');
    expect(nameinput).toBeInTheDocument();
    const emailinput = screen.getByPlaceholderText('Type email here');
    expect(emailinput).toBeInTheDocument();
    const passwordinput = screen.getByPlaceholderText('Type password here');
    expect(passwordinput).toBeInTheDocument();
    const passwordconfirmationinput = screen.getByPlaceholderText('Type passwordconfirmation here');
    expect(passwordconfirmationinput).toBeInTheDocument();

    const submitbutton = screen.getByRole('button', { name: 'SignUp' });
    expect(submitbutton).toBeInTheDocument();
    const closebutton = screen.getByRole('button', { name: 'Close Modal' });
    expect(closebutton).toBeInTheDocument();
  });
})

describe('SignUp name', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('名前が空の場合、エラーメッセージを表示', async() => {
    setupSignup();
    const emailinput = screen.getByPlaceholderText('Type email here');
    const passwordinput = screen.getByPlaceholderText('Type password here');
    const passwordconfirmationinput = screen.getByPlaceholderText('Type passwordconfirmation here');
    const submitbutton = screen.getByRole('button', { name: 'SignUp' });

    userEvent.type(emailinput,'test@example.com');
    userEvent.type(passwordinput,'xxxx1111');
    userEvent.type(passwordconfirmationinput,'xxxx1111');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('名前を入力してください。')).toBeInTheDocument()
    })
  });

  it('名前が101文字以上の場合、エラーメッセージを表示', async() => {
    setupSignup();
    const nameinput = screen.getByPlaceholderText('Type name here');
    const submitbutton = screen.getByRole('button', { name: 'SignUp' });

    userEvent.type(nameinput,'あ'.repeat(101));
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('100文字以内で入力してください。')).toBeInTheDocument()
    })
  });
})

describe('SignUp email', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('メールアドレスが空の場合、エラーメッセージを表示', async() => {
    setupSignup();
    const nameinput = screen.getByPlaceholderText('Type name here');
    const passwordinput = screen.getByPlaceholderText('Type password here');
    const passwordconfirmationinput = screen.getByPlaceholderText('Type passwordconfirmation here');
    const submitbutton = screen.getByRole('button', { name: 'SignUp' });

    userEvent.type(nameinput,'テスト');
    userEvent.type(passwordinput,'xxxx1111');
    userEvent.type(passwordconfirmationinput,'xxxx1111');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('メールアドレスを入力してください。')).toBeInTheDocument()
    })
  });

  it('メールアドレスの形式が不正の場合、エラーメッセージを表示', async() => {
    setupSignup();
    const emailinput = screen.getByPlaceholderText('Type email here');
    const submitbutton = screen.getByRole('button', { name: 'SignUp' });

    userEvent.type(emailinput,'xxxx1111');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('メールアドレスの形式が不正です。')).toBeInTheDocument()
    })
  });
})

describe('SignUp password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('パスワードが空の場合、エラーメッセージを表示', async() => {
    setupSignup();
    const nameinput = screen.getByPlaceholderText('Type name here');
    const emailinput = screen.getByPlaceholderText('Type email here');
    const passwordconfirmationinput = screen.getByPlaceholderText('Type passwordconfirmation here');
    const submitbutton = screen.getByRole('button', { name: 'SignUp' });

    userEvent.type(nameinput,'テスト');
    userEvent.type(emailinput,'test@example.com');
    userEvent.type(passwordconfirmationinput,'xxxx1111');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('パスワードを入力してください。')).toBeInTheDocument()
    })
  });

  it('パスワード5文字以内の場合、エラーメッセージを表示', async() => {
    setupSignup();
    const passwordinput = screen.getByPlaceholderText('Type password here');
    const submitbutton = screen.getByRole('button', { name: 'SignUp' });

    userEvent.type(passwordinput,'aaaaa');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('6文字以上入力してください。')).toBeInTheDocument()
    })
  });

  it('パスワードが129文字以上の場合、エラーメッセージを表示', async() => {
    setupSignup();
    const passwordinput = screen.getByPlaceholderText('Type password here');
    const submitbutton = screen.getByRole('button', { name: 'SignUp' });

    userEvent.type(passwordinput,'a'.repeat(129));
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('128文字以内で入力してください。')).toBeInTheDocument()
    })
  });

  it('パスワードが半角英数字以外の場合、エラーメッセージを表示', async() => {
    setupSignup();
    const passwordinput = screen.getByPlaceholderText('Type password here');
    const submitbutton = screen.getByRole('button', { name: 'SignUp' });

    userEvent.type(passwordinput,'ああああああああ');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('パスワードは半角英数字のみ有効です。')).toBeInTheDocument()
    })
  });
})

describe('SignUp passwordconfirmation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('確認パスワードが空の場合、エラーメッセージを表示', async() => {
    setupSignup();
    const nameinput = screen.getByPlaceholderText('Type name here');
    const emailinput = screen.getByPlaceholderText('Type email here');
    const passwordinput = screen.getByPlaceholderText('Type password here');
    const submitbutton = screen.getByRole('button', { name: 'SignUp' });

    userEvent.type(nameinput,'テスト');
    userEvent.type(emailinput,'test@example.com');
    userEvent.type(passwordinput,'xxxx1111');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('確認用パスワードを入力してください。')).toBeInTheDocument()
    })
  });

  it('パスワードが一致しない場合', async() => {
    setupSignup();
    const passwordinput = screen.getByPlaceholderText('Type password here');
    const passwordconfirmationinput = screen.getByPlaceholderText('Type passwordconfirmation here');
    const submitbutton = screen.getByRole('button', { name: 'SignUp' });

    userEvent.type(passwordinput,'xxxx1111');
    userEvent.type(passwordconfirmationinput,'xxxx1112');
    await userEvent.click(submitbutton);
    await waitFor(() => {
      expect(screen.getByText('パスワードが一致しません')).toBeInTheDocument()
    })
  });
})