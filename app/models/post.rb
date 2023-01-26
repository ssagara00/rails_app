class Post < ApplicationRecord
  mount_uploader :image, ImageUploader

  has_many :replies, dependent: :destroy, foreign_key: 'reply_from_id'
  has_many :likes

  validates :title,
    presence: true
end
