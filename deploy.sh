#!/bin/bash

YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# VARIABLES STANDAR
ENV=XXXXX #THIS WORK FINE IF WE USE SAM IN LOCAL. IN PIPELINE IS NOT NEED
BUCKET=XXXXX #BUCKET IS REQUIRED FOR SAM PACKAGE

STACK=XXXXX-bakend-$ENV #NAME OF STACK, IS IMPORTANT FOR THE NAME OF ALL OBJECTS IN TEMPLATE
PROJECT=XXXXX #PROJECT NAME FOR THE TAGS

AWS_PROFILE=XXXXX

echo "${YELLOW} Validating local SAM Template..."
echo " ================================${NC}"
sam validate --profile $AWS_PROFILE --template "template.yaml"

echo "${YELLOW} Building local SAM App..."
echo " =========================${NC}"
npm install -g npm
sam build --profile $AWS_PROFILE -t "template.yaml"

echo "${YELLOW} Package"
echo " ================================================= ${NC}"
sam package --profile $AWS_PROFILE --template-file .aws-sam/build/template.yaml --output-template-file .aws-sam/build/packaged-template.yaml --s3-bucket $BUCKET

echo "${YELLOW} Deploy"
echo " ================================================= ${NC}"
sam deploy --profile $AWS_PROFILE --region us-east-1 --template-file .aws-sam/build/packaged-template.yaml --stack-name $STACK --tags Project=$PROJECT --parameter-overrides Environment=$ENV --capabilities CAPABILITY_NAMED_IAM

