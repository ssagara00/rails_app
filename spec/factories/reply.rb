FactoryBot.define do
  factory :reply do
    association :post
    association :user
    title { 'Re_testtitle' }
    contents { 'Re_test_contents' }
  end
end
