FactoryBot.define do
  factory :user do
    name { 'test_user' }
    sequence(:email) { |n| "test_#{n}@example.com"}
    password { 'test_password' }
  end
end
