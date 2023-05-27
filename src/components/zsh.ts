sok-aws-env() {
  if [ "$1" = "prod" ]; then
    AWS_PROFILE=sokaws-herkku-webshop-prod
  else
    AWS_PROFILE=sokaws-herkku-webshop-test
  fi
  echo "AWS credentials for profile $AWS_PROFILE exported"
  export AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id --profile $AWS_PROFILE)
  export AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key --profile $AWS_PROFILE)
  export AWS_DEFAULT_REGION=$(aws configure get region --profile $AWS_PROFILE)
  export AWS_SESSION_TOKEN=$(aws configure get aws_session_token --profile $AWS_PROFILE)
  export AWS_PROFILE=$AWS_PROFILE
}
sok-aws-login () {
  if [ "$1" = "prod" ]; then
    AWS_PROFILE=sokaws-herkku-webshop-prod
  else
    AWS_PROFILE=sokaws-herkku-webshop-test
  fi
  aws-azure-login --no-prompt --mode=debug --profile $AWS_PROFILE
}
eval "sok-aws-env" # valinnainen, lataa testi envin env muuttujiin aina kun terminaali loadataan