require 'rails_helper'

RSpec.describe 'Auth::Registrations', type: :request do
  describe 'POST /auth' do
    subject { post('/auth', params:) }

    context '値が正しく入力されているとき' do
      let(:params) { attributes_for(:user) }

      it 'ユーザー登録できる' do
        subject
        res = JSON.parse(response.body)
        expect(res['status']).to eq('success')
        expect(res['data']['id']).to eq(User.last.id)
        expect(res['data']['email']).to eq(User.last.email)
        expect(response.status).to eq(200)
      end
    end

    context 'password_confirmationの値がpasswordと異なるとき' do
      let(:params) { attributes_for(:user, password_confirmation: 'unmatchpass') }

      it 'ユーザー登録できない' do
        subject
        res = JSON.parse(response.body)
        expect(res['status']).to eq('error')
        expect(res['errors']['full_messages']).to include("Password confirmation doesn't match Password")
        expect(response.status).to eq(422)
      end
    end
  end
end
