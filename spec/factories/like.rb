FactoryBot.define do
  factory :like do
    association :post
    association :user
    sequence(:post_id) { |n| "#{n}" }
    sequence(:user_id) { |n| "#{n}" }
  end
end
