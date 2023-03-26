require 'rails_helper'

RSpec.describe "Posts", type: :request do
  describe "GET /index" do
    it '全ての投稿データを取得する' do
      FactoryBot.create_list(:post, 10)

      get '/posts'
      json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(json.length).to eq(10)
      # pending "add some examples (or delete) #{__FILE__}"
    end
  end

  describe "GET /limit_index" do
    it '特定の範囲の投稿データを取得する' do
      FactoryBot.create_list(:post, 10)

      get "/posts/limit_index/#{5}/#{5}"
      json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(json.length).to eq(5)
      expect(json[0]['id'] - json[4]['id']).to eq(4)
    end
  end

  describe "GET /my_posts" do
    it '自分の投稿データを取得する' do
      user = FactoryBot.create(:user, id:11)
      user = FactoryBot.create(:user, id:22)
      user = FactoryBot.create(:user, id:33)
      post = FactoryBot.create(:post, user_id: 11)
      post = FactoryBot.create(:post, user_id: 22)
      post = FactoryBot.create(:post, user_id: 11)
      post = FactoryBot.create(:post, user_id: 11)
      post = FactoryBot.create(:post, user_id: 33)

      get "/posts/my_posts/#{11}/#{3}/#{0}"
      json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(json.length).to eq(3)
      expect(json[0]['user_id']).to eq(11)
    end
  end

  describe "GET /show" do
    it '特定のデータのみ取得する' do
      post = FactoryBot.create(:post, title: 'posts_show_test-title')

      get "/posts/#{post.id}"
      json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(json['title']).to eq(post.title)
    end
  end

  describe "POST /create" do
    it '新しい投稿を作成する' do
      user = FactoryBot.create(:user)
      create_params = { user_id: user.id, title: 'create_title', contents: 'create_contents', image: 'create_test.jpg'}

      expect { post '/posts', params: { post: create_params } }.to change(Post, :count).by(+1)
      expect(response.status).to eq(200)
    end
  end

  describe "PUT /update" do
    it '編集を行う' do
      post = FactoryBot.create(:post, title: 'old_test-title')

      put "/posts/#{post.id}", params: { post: { title: 'new_test-title' } }
      json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(json['title']).to eq('new_test-title')
    end
  end

  describe "DELETE /delete" do
    it '削除を行う' do
      post = FactoryBot.create(:post)

      expect { delete "/posts/#{post.id}" }.to change(Post, :count).by(-1)
      expect(response.status).to eq(200)
    end
  end

end
