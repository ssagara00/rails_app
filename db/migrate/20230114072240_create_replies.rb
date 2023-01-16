class CreateReplies < ActiveRecord::Migration[6.1]
  def change
    create_table :replies do |t|
      t.integer :user_id
      t.text :title
      t.text :contents
      t.string :image
      t.integer :reply_from_id

      t.timestamps
    end
  end
end
