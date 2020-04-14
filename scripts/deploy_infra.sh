#!/bin/bash
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
#color

ENV=dev
AWS_PROFILE=droptek_sandbox
SOURCE="$(pwd)"
FUNCTIONS="$(pwd)/functions/*"
UUID=$$
BUCKET=andreani
PROJECT=example-apigateway
STACK=$ENV-Infra-$PROJECT


cd $SOURCE
echo -e "${YELLOW} Validating local SAM Template..."
echo -e " ================================${NC}"
sam validate --template "$SOURCE/cloudformations/template.yaml"  --profile $AWS_PROFILE 
echo -e "${YELLOW} Building local SAM App..."
echo -e " =========================${NC}"
sam build  --profile $AWS_PROFILE -t "${SOURCE}/cloudformations/template.yaml"
echo -e "${YELLOW} Packaing SAM  cloudformation..."
echo -e " =========================${NC}"
sam package --profile $AWS_PROFILE  --template-file "$SOURCE/.aws-sam/build/template.yaml" --output-template-file "$SOURCE/.aws-sam/build/package.yaml" --s3-bucket $BUCKET
echo -e "${YELLOW} Deploy SAM  cloudformation..."
echo -e " =============================== ${NC}"
sam deploy --profile $AWS_PROFILE  --template-file "$SOURCE/.aws-sam/build/package.yaml" --stack-name $STACK --tags Project=$PROJECT --capabilities CAPABILITY_NAMED_IAM --parameter-overrides UUID=$UUID Environment=$ENV DeployBucket=$BUCKET Project=$PROJECT



