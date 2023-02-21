require 'rails_helper'

RSpec.describe Like, type: :model do
  #pending "add some examples to (or delete) #{__FILE__}"
  describe "validation like test" do

    context "バリデーションエラーがないとき" do
      it '正常に登録される' do
        like = FactoryBot.create(:like)
        expect(like).to be_valid
      end
    end

    context "バリデーションエラーがあるとき" do
      it 'user_idが空の場合、無効である' do
        like = FactoryBot.build(:like, user_id: nil)

        like.valid?
        expect(like.errors[:user_id]).to include("is not a number")
      end

      it 'user_idが数字以外の場合、無効である' do
        like = FactoryBot.build(:like, user_id: "user_id")

        like.valid?
        expect(like.errors[:user_id]).to include("is not a number")
      end

      it 'post_idが空の場合、無効である' do
        like = FactoryBot.build(:like, post_id: nil)

        like.valid?
        expect(like.errors[:post_id]).to include("is not a number")
      end

      it 'post_idが数字以外の場合、無効である' do
        like = FactoryBot.build(:like, post_id: "post_id")

        like.valid?
        expect(like.errors[:post_id]).to include("is not a number")
      end

      it 'post_idとuser_idの組み合わせが重複の場合、無効である' do
        like1 = FactoryBot.create(:like, user_id:"99", post_id: "99")
        like2 = FactoryBot.build(:like, user_id:"99", post_id: "99")

        like2.valid?
        expect(like2.errors[:post_id]).to include("has already been taken")
      end

    end

  end

  describe "association like test" do

    context "postとの関係" do
      it 'N:1' do
        expect(Like.reflect_on_association(:post).macro).to eq :belongs_to
      end
    end

    context "userとの関係" do
      it 'N:1' do
        expect(Like.reflect_on_association(:user).macro).to eq :belongs_to
      end
    end

  end
end
