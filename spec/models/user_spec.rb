require 'rails_helper'

RSpec.describe User, type: :model do
  #pending "add some examples to (or delete) #{__FILE__}"
  describe "validation user test" do

    context "バリデーションエラーがないとき" do
      it '正常に登録される' do
        user = FactoryBot.build(:user)
        expect(user).to be_valid
      end
    end

    context "バリデーションエラーがあるとき" do
      it 'nameが空の場合、無効である' do
        user = FactoryBot.build(:user, name: nil)

        user.valid?
        expect(user.errors[:name]).to include("can't be blank")
      end

      it 'nameが101字以上の場合、無効である' do
        user = FactoryBot.build(:user, name: 'a' * 101)

        user.valid?
        expect(user.errors[:name]).to include("is too long (maximum is 100 characters)")
      end

      it 'emailが空の場合、無効である' do
        user = FactoryBot.build(:user, email: nil)

        user.valid?
        expect(user.errors[:email]).to include("can't be blank")
      end

      it 'emailが重複の場合、無効である' do
        user1 = FactoryBot.create(:user, email: 'test@example.com')
        user2 = FactoryBot.build(:user, email: 'test@example.com')

        user2.valid?
        expect(user2.errors[:email]).to include("has already been taken")
      end

      it 'emailが不正な文字列の場合、無効である' do
        user = FactoryBot.build(:user, email: 'testexample.com')

        user.valid?
        expect(user.errors[:email]).to include("is not an email")
      end

      it 'passwordが空の場合、無効である' do
        user = FactoryBot.build(:user, password: nil)

        user.valid?
        expect(user.errors[:password]).to include("can't be blank")
      end

      it 'passwordが129字以上の場合、無効である' do
        user = FactoryBot.build(:user, password: 'a' * 129)

        user.valid?
        expect(user.errors[:password]).to include("is too long (maximum is 128 characters)")
      end

      it 'passwordが5字以内の場合、無効である' do
        user = FactoryBot.build(:user, password: 'a' * 5)

        user.valid?
        expect(user.errors[:password]).to include("is too short (minimum is 6 characters)")
      end

      it 'password_confirmationが一致しない場合、無効である' do
        user = FactoryBot.build(:user, password_confirmation: 'testpass0')

        user.valid?
        expect(user.errors[:password_confirmation]).to be_present
      end

      it 'passwordが不正な文字列の場合、無効である' do
        user = FactoryBot.build(:user, password: 'testpassword')

        user.valid?
        expect(user.errors[:password]).to be_present
      end

    end
  end

  describe "association post test" do

    context "postsとの関係" do
      it '1:N' do
        expect(User.reflect_on_association(:posts).macro).to eq :has_many
      end
    end

    context "likesとの関係" do
      it '1:N' do
        expect(User.reflect_on_association(:likes).macro).to eq :has_many
      end
    end

  end

end
