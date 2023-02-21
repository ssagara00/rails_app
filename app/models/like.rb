class Like < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :post, optional: true

  validates_uniqueness_of :post_id, scope: :user_id

  validates :user_id,
    numericality: { only_integer: true }

  validates :post_id,
    numericality: { only_integer: true }

end
