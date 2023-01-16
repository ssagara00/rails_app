class Post < ApplicationRecord
  has_many :replies, dependent: :destroy, foreign_key: 'reply_from_id'
end
