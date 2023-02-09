class LikesController < ApplicationController

  before_action :set_like, only: %i[show]
  before_action :set_del_like, only: %i[destroy]
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
    
    if @delLike.destroy
      render json: @delLike
    else
      render json: @delLike.errors
    end

  end

  def is_my_liked
    my_liked = Like.exists?(user_id: params[:user_id], post_id: params[:post_id])
    render json: my_liked
  end

  private

  def set_like
    #@like = Like.find(params[:id])
    @like = Like.where(post_id: params[:id])
  end

  def set_del_like
    @delLike = Like.find_by(user_id: params[:user_id], post_id: params[:post_id])
  end

  def param_nil_judge
    if @delLike.nil?
      render json: { "message"=> "error"}
    end
  end

  def like_params
    params.permit(:user_id, :post_id)
  end

end
