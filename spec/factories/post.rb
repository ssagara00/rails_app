FactoryBot.define do
  factory :post do
    user_id { '99' }
    title { 'testtitle' }
    contents { 'test_contents' }
    image { 'test.jpg' }
  end
end
