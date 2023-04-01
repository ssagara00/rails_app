class Reply < ApplicationRecord
  belongs_to :post, foreign_key: 'reply_from_id'
  belongs_to :user

  validates :title,
            presence: true,
            length: { maximum: 30 }

  validates :contents,
            presence: true,
            length: { maximum: 3000 }
end
