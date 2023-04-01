require 'rails_helper'

RSpec.describe 'Auth::Sessions', type: :request do
  describe 'POST /auth/sign_in' do
    subject { post('/auth/sign_in', params:) }

    context 'メールアドレス、パスワードが正しいとき' do
      let(:current_user) { create(:user) }
      let(:params) { { email: current_user.email, password: current_user.password } }

      it 'ログインできる' do
        subject
        expect(response.headers['uid']).to be_present
        expect(response.headers['access-token']).to be_present
        expect(response.headers['client']).to be_present
        expect(response.status).to eq(200)
      end
    end

    context 'メールアドレスが正しくないとき' do
      let(:current_user) { create(:user) }
      let(:params) { { email: 'test@example.com', password: current_user.password } }

      it 'ログインできない' do
        subject
        res = JSON.parse(response.body)
        expect(res['success']).to be_falsey
        expect(res['errors']).to include('Invalid login credentials. Please try again.')
        expect(response.headers['uid']).to be_blank
        expect(response.headers['access-token']).to be_blank
        expect(response.headers['client']).to be_blank
        expect(response.status).to eq(401)
      end
    end

    context 'パスワードが正しくないとき' do
      let(:current_user) { create(:user) }
      let(:params) { { email: current_user.email, password: 'password' } }

      it 'ログインできない' do
        subject
        res = JSON.parse(response.body)
        expect(res['success']).to be_falsey
        expect(res['errors']).to include('Invalid login credentials. Please try again.')
        expect(response.headers['uid']).to be_blank
        expect(response.headers['access-token']).to be_blank
        expect(response.headers['client']).to be_blank
        expect(response.status).to eq(401)
      end
    end
  end

  describe 'DELETE /api/v1/auth/sign_out' do
    subject { delete('/auth/sign_out', headers:) }

    context 'ユーザーがログインしているとき' do
      let(:current_user) { create(:user) }
      let(:headers) { current_user.create_new_auth_token }

      it 'ログアウトできる' do
        subject
        res = JSON.parse(response.body)
        expect(res['success']).to be_truthy
        expect(current_user.reload.tokens).to be_blank
        expect(response.status).to eq(200)
      end
    end
  end
end
