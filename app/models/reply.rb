class Reply < ApplicationRecord
  belongs_to :post, foreign_key: 'reply_from_id'

  validates :user_id,
    numericality: { only_integer: true }

  validates :title,
    presence: true,
    length: { maximum: 30 }

  validates :contents,
    presence: true,
    length: { maximum: 3000 }

  validates :reply_from_id,
    numericality: { only_integer: true }

end
