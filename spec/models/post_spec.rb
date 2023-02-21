require 'rails_helper'

RSpec.describe Post, type: :model do
  #pending "add some examples to (or delete) #{__FILE__}"
  describe "validation post test" do

    context "バリデーションエラーがないとき" do
      it '正常に登録される' do
        post = FactoryBot.build(:post)
        expect(post).to be_valid
      end
    end

    context "バリデーションエラーがあるとき" do
      it 'user_idが空の場合、無効である' do
        post = FactoryBot.build(:post, user_id: nil)

        post.valid?
        expect(post.errors[:user_id]).to include("is not a number")
      end

      it 'user_idが数字以外の場合、無効である' do
        post = FactoryBot.build(:post, user_id: "user_id")

        post.valid?
        expect(post.errors[:user_id]).to include("is not a number")
      end

      it 'titleが空の場合、無効である' do
        post = FactoryBot.build(:post, title: nil)

        post.valid?
        expect(post.errors[:title]).to include("can't be blank")
      end

      it 'titleが31字以上の場合、無効である' do
        post = FactoryBot.build(:post, title: 'a' * 31)

        post.valid?
        expect(post.errors[:title]).to include("is too long (maximum is 30 characters)")
      end

      it 'contentsが空の場合、無効である' do
        post = FactoryBot.build(:post, contents: nil)

        post.valid?
        expect(post.errors[:contents]).to include("can't be blank")
      end

      it 'contentsが3001字以上の場合、無効である' do
        post = FactoryBot.build(:post, contents: 'a' * 3001)

        post.valid?
        expect(post.errors[:contents]).to include("is too long (maximum is 3000 characters)")
      end

    end
  end

  describe "association post test" do

    context "userとの関係" do
      it 'N:1' do
        expect(Post.reflect_on_association(:user).macro).to eq :belongs_to
      end
    end

    context "repliesとの関係" do
      it '1:N' do
        expect(Post.reflect_on_association(:replies).macro).to eq :has_many
      end
    end

    context "likesとの関係" do
      it '1:N' do
        expect(Post.reflect_on_association(:likes).macro).to eq :has_many
      end
    end

  end

end
