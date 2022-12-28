class CreatePosts < ActiveRecord::Migration[6.1]
  def change
    create_table :posts do |t|
      t.integer :user_id, null:false
      t.text :title, null:false
      t.text :contents, null:false
      t.string :image
      t.text :reply_flg
      t.integer :reply_from_id

      t.timestamps
    end
  end
end
