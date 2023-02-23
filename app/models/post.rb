class Post < ApplicationRecord
  mount_uploader :image, ImageUploader

  has_many :replies, dependent: :destroy, foreign_key: 'reply_from_id'
  has_many :likes, dependent: :destroy
  belongs_to :user, optional: true

  validates :title,
    presence: true,
    length: { maximum: 30 }

  validates :contents,
    presence: true,
    length: { maximum: 3000 }

end
