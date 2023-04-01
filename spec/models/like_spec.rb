require 'rails_helper'

RSpec.describe Like, type: :model do
  # pending "add some examples to (or delete) #{__FILE__}"
  describe 'validation like test' do
    context 'バリデーションエラーがないとき' do
      it '正常に登録される' do
        like = create(:like)
        expect(like).to be_valid
      end
    end
  end

  describe 'association like test' do
    context 'postとの関係' do
      it 'N:1' do
        expect(described_class.reflect_on_association(:post).macro).to eq :belongs_to
      end
    end

    context 'userとの関係' do
      it 'N:1' do
        expect(described_class.reflect_on_association(:user).macro).to eq :belongs_to
      end
    end
  end
end
