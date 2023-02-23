require 'rails_helper'

RSpec.describe Reply, type: :model do
  #pending "add some examples to (or delete) #{__FILE__}"
  describe "validation reply test" do

    context "バリデーションエラーがないとき" do
      it '正常に登録される' do
        reply = FactoryBot.create(:reply)
        expect(reply).to be_valid
      end
    end

    context "バリデーションエラーがあるとき" do
      it 'titleが空の場合、無効である' do
        reply = FactoryBot.build(:reply, title: nil)

        reply.valid?
        expect(reply.errors[:title]).to include("can't be blank")
      end

      it 'titleが31字以上の場合、無効である' do
        reply = FactoryBot.build(:reply, title: 'a' * 31)

        reply.valid?
        expect(reply.errors[:title]).to include("is too long (maximum is 30 characters)")
      end

      it 'contentsが空の場合、無効である' do
        reply = FactoryBot.build(:reply, contents: nil)

        reply.valid?
        expect(reply.errors[:contents]).to include("can't be blank")
      end

      it 'contentsが3001字以上の場合、無効である' do
        reply = FactoryBot.build(:reply, contents: 'a' * 3001)

        reply.valid?
        expect(reply.errors[:contents]).to include("is too long (maximum is 3000 characters)")
      end
    end
  
  end

  describe "association reply test" do

    context "postとの関係" do
      it 'N:1' do
        expect(Reply.reflect_on_association(:post).macro).to eq :belongs_to
      end
    end

  end

end
