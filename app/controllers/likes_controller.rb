class LikesController < ApplicationController

  before_action :set_like, only: %i[show]
  before_action :set_delete_like, only: %i[destroy]
  before_action :param_nil_judge, only: %i[destroy]

  def index
    likes = Like.all.order(created_at: "DESC")
    render json: likes
  end

  def show
    render json: @like
  end

  def create
    like = Like.new(like_params)
    if like.save
      render json: like
    else
      render json: like.errors
    end
  end

  def destroy
    
    param_nil_judge && return
    
    if @delete_like.destroy
      render json: @delete_like
    else
      render json: @delete_like.errors
    end

  end

  def is_liked
    is_liked = Like.exists?(user_id: params[:user_id], post_id: params[:post_id])
    render json: is_liked
  end

  private

  def set_like
    #@like = Like.find(params[:id])
    @like = Like.where(post_id: params[:id])
  end

  def set_delete_like
    @delete_like = Like.find_by(user_id: params[:user_id], post_id: params[:post_id])
  end

  def param_nil_judge
    if @delete_like.nil?
      render json: { "message"=> "error"}
    end
  end

  def like_params
    params.permit(:user_id, :post_id)
  end

end
