class RemoveColumnPosts < ActiveRecord::Migration[6.1]
  def change
    remove_column :posts, :reply_flg, :text
    remove_column :posts, :reply_from_id, :integer
  end
end
