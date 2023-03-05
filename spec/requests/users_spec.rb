require 'rails_helper'

RSpec.describe "Users", type: :request do
  describe "GET /show" do
    it '特定のデータのみ取得する' do
      user = FactoryBot.create(:user, name: 'example')

      get "/users/#{user.id}"
      json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(json['name']).to eq(user.name)
    end
  end

  describe "PUT /update" do
    it '編集を行う' do
      user = FactoryBot.create(:user, email: 'old@example.com')

      put "/users/#{user.id}", params: { user: { email: 'new@example.com' } }
      json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(json['email']).to eq('new@example.com')
    end
  end

  describe "DELETE /delete" do
    it '削除を行う' do
      user = FactoryBot.create(:user)

      expect { delete "/users/#{user.id}" }.to change(User, :count).by(-1)
      expect(response.status).to eq(200)
    end
  end

end
