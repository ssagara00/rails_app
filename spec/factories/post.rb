FactoryBot.define do
  factory :post do
    user_id { 'test_user' }
    title { 'testtitle' }
    contents { 'test_contents' }
    image { 'test.jpg' }
  end
end
