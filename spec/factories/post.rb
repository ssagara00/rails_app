FactoryBot.define do
  factory :post do
    association :user
    title { 'testtitle' }
    contents { 'test_contents' }
    image { 'test.jpg' }
  end
end
