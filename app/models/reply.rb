class Reply < ApplicationRecord
  belongs_to :post, foreign_key: 'reply_from_id'
end
