Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  # 以下は追加分
  namespace :api do
    namespace :v1 do
      # resources :test, only: %i[index]
      resources :todos, only: [:index, :create, :destroy]
    end
  end
  # ここまでが追加分
  # 以下は新規アプリ用
  # resources :posts, only: [:index, :create, :destroy]
end
