class RepliesController < ApplicationController
  before_action :set_reply, only: %i[show]
  before_action :set_change_reply, only: %i[update destroy]

  def index
    replies = Reply.all.order(created_at: 'DESC')
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
    if @change_reply.update(reply_params)
      render json: @change_reply
    else
      render json: @change_reply.errors
    end
  end

  def destroy
    if @change_reply.destroy
      render json: @change_reply
    else
      render json: @change_reply.errors
    end
  end

  private

  def set_reply
    @reply = Reply.where(reply_from_id: params[:id])
  end

  def set_change_reply
    @change_reply = Reply.find(params[:id])
  end

  def reply_params
    params.require(:reply).permit(:user_id, :title, :contents, :image, :reply_from_id)
  end
end
