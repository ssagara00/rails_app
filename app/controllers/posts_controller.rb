class PostsController < ApplicationController

  before_action :set_post, only: %i[show update destroy]
  before_action :limit_param, only: %i[limit_index]
  before_action :myId_posts, only: %i[my_posts]

  def index
    posts = Post.all.order(created_at: "DESC")
    render json: posts
  end

  def limit_index
    posts = Post.order(created_at: "DESC").limit(@limit_params).offset(@offset_params)
    render json: posts
  end

  def my_posts
    render json: @myposts
  end

  def show
    render json: @post
  end

  def create
    post = Post.new(post_params)
    if post.save
      render json: post
    else
      render json: post.errors
    end
  end

  def update
    if @post.update(post_params)
      render json: @post
    else
      render json: @post.errors
    end
  end

  def destroy
    if @post.destroy
      render json: @post
    else
      render json: @post.errors
    end
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def limit_param
    @limit_params = params[:limit]&.to_i
    @offset_params = params[:offset]&.to_i
  end

  def myId_posts
    @myposts = Post.where(user_id: params[:user_id]).order(created_at: "DESC").limit(params[:limit]).offset(params[:offset])
  end

  def post_params
    params.require(:post).permit(:user_id, :title, :contents, :image)
  end

end
