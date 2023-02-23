FactoryBot.define do
  factory :user do
    name { 'test_user' }
    sequence(:email) { |n| "test_#{n}@example.com"}
    password { 'testpass00' }
    password_confirmation { password }
  end
end
