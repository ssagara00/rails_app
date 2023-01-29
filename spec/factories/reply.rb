FactoryBot.define do
  factory :reply do
    association :post
    user_id { 'Re_test_user' }
    title { 'Re_testtitle' }
    contents { 'Re_test_contents' }
    image { 'Re_test.jpg' }
  end
end
