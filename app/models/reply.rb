class Reply < ApplicationRecord
  belongs_to :post, foreign_key: 'reply_from_id'

  validates :title,
    presence: true,
    length: { maximum: 30 }

  validates :contents,
    presence: true,
    length: { maximum: 3000 }

end
