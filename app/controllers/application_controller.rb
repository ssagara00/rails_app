class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  # トップページだけログイン確認しない場合、コメントアウトを解除
  # skip_before_action :verify_authenticity_token
  # viewでメソッド使いたい場合、コメントアウト解除
  # helper_method :current_user, :user_signed_in?
end
