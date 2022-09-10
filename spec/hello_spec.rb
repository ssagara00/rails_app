require 'spec_helper' # 設定ファイルrails_helper.rbを読み込むコードが全テストにあります

RSpec.describe Hello do
  it "message return hello" do
    expect(Hello.new.message).to eq "hello"
  end
end
