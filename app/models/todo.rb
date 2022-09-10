class Todo < ApplicationRecord
  # バリデーション設定 title必須 最大140文字
  validates :title, presence: true, length: { maximum: 140 }
end
