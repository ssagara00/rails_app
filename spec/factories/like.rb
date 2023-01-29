FactoryBot.define do
  factory :like do
    association :post
    association :user
    sequence(:post_id) { |n| "test_#{n}_post"}
    sequence(:user_id) { |n| "test_#{n}_user"}
  end
end
