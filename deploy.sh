#!/bin/bash

YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# VARIABLES STANDAR
ENV=XXXXX #THIS WORK FINE IF WE USE SAM IN LOCAL. IN PIPELINE IS NOT NEED
BUCKET=XXXXX #BUCKET IS REQUIRED FOR SAM PACKAGE

STACK=XXXXX-bakend-$ENV #NAME OF STACK, IS IMPORTANT FOR THE NAME OF ALL OBJECTS IN TEMPLATE
PROJECT=XXXXX #PROJECT NAME FOR THE TAGS

AWS_PROFILE=XXXXX

REGION_1=us-east-1

echo "================== Create Bucket =================="
aws s3api create-bucket --bucket $BUCKET

echo "${YELLOW} Validating local SAM Template..."
echo " ================================${NC}"
sam validate --profile $AWS_PROFILE --template "template.yaml"

echo "${YELLOW} Building local SAM App..."
echo " =========================${NC}"
sam build --cached

echo "${YELLOW} Deploy"
echo " ================================================= ${NC}"
sam deploy --profile $AWS_PROFILE --s3-bucket $BUCKET --region $REGION_1 --capabilities CAPABILITY_NAMED_IAM --stack-name $STACK --tags Project=$PROJECT --parameter-overrides Project=$PROJECT Environment=$ENV

