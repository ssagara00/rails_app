class RepliesController < ApplicationController

  before_action :set_reply, only: %i[show update destroy]

  def index
    replies = Reply.all.order(created_at: "DESC")
    render json: replies
  end

  def show
    render json: @reply
  end

  def create
    reply = Reply.new(reply_params)
    if reply.save
      render json: reply
    else
      render json: reply.errors
    end
  end

  def update
    if @reply.update(reply_params)
      render json: @reply
    else
      render json: @reply.errors
    end
  end

  def destroy
    if @reply.destroy
      render json: @reply
    else
      render json: @reply.errors
    end
  end

  private

  def set_reply
    #@reply = Reply.find(params[:id])
    @reply = Reply.where(reply_from_id: params[:id])
  end

  def reply_params
    replies.require(:reply).permit(:user_id, :title, :contents, :image, :reply_from_id)
  end

end
