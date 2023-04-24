CarrierWave.configure do |config|
  if Rails.env.production?
    config.storage :fog
    config.fog_provider = 'fog/aws'
    config.fog_directory  = ENV['AWS_BUCKET_NAME']
    config.fog_credentials = {
      provider: 'AWS',
      aws_access_key_id: ENV['BUCKET_AWS_ACCESS_KEY_ID'],
      aws_secret_access_key: ENV['BUCKET_AWS_SECRET_ACCESS_KEY'],
      region: ENV['AWS_REGION'],
      path_style: true
    }
  else
    config.asset_host = 'http://localhost'
    config.storage = :file
    config.cache_storage = :file
  end
end
