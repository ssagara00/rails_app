# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  include DeviseTokenAuth::Concerns::User

  has_many :likes, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_many :replies, dependent: :destroy

  validates :name,
    presence: true,
    length: { maximum: 100 }

  VALID_EMAIL = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email,
    # default validation
    # presence: true,
    # uniqueness: true,
    format: { with: VALID_EMAIL }

  VALID_PASSWORD = /\A(?=.*?[a-z])(?=.*?\d)[a-z\d]+\z/i
  validates :password,
    # default validation
    # presence: true,
    # length: { in: 6..128},
    # confirmation: true,
    format: { with: VALID_PASSWORD },
    on: :create

end
