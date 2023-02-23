FactoryBot.define do
  factory :reply do
    association :post
    user_id { '99' }
    title { 'Re_testtitle' }
    contents { 'Re_test_contents' }
  end
end
