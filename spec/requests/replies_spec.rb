require 'rails_helper'

RSpec.describe "Replies", type: :request do

  describe "GET /index" do
    it '全ての返信データを取得する' do
      FactoryBot.create_list(:reply, 10)

      get '/replies'
      json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(json.length).to eq(10)
      # pending "add some examples (or delete) #{__FILE__}"
    end
  end

  describe "GET /show" do
    it '特定のデータのみ取得する' do
      reply = FactoryBot.create(:reply, title: 'replies_show_test-title')

      get "/replies/#{reply.reply_from_id}"
      json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(json[0]['title']).to eq(reply.title)
    end
  end

  describe "POST /create" do
    it '新しい返信を作成する' do
      post = FactoryBot.create(:post)
      create_params = { user_id: 99, title: 'Re_create_title', contents: 'Re_create_contents', image: 'Re_create_test.jpg', reply_from_id: post.id }

      expect { post '/replies', params: { reply: create_params } }.to change(Reply, :count).by(+1)
      expect(response.status).to eq(200)
    end
  end

  describe "PUT /update" do
    it '編集を行う' do
      reply = FactoryBot.create(:reply, title: 'Re_old_test-title')

      put "/replies/#{reply.id}", params: { reply: {title: 'Re_new_test-title' } }
      json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(json['title']).to eq('Re_new_test-title')
    end
  end

  describe "DELETE /delete" do
    it '削除を行う' do
      reply = FactoryBot.create(:reply)

      expect { delete "/replies/#{reply.id}" }.to change(Reply, :count).by(-1)
      expect(response.status).to eq(200)
    end
  end
end
