const Environment = {
  API_KEY: process.env.ApiKey,
  SECRET_KEY_JWT: process.env.SecretKeyJWT,
  BUCKET_NAME: process.env.S3Bucket || '',
  S3_SOURCE_PATH: process.env.SourcePath || '',
  S3_ROOT_PATH: process.env.RootPath || '',
}

module.exports = { Environment };