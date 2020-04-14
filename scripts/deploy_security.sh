#!/bin/bash

ENV=dev
AWS_PROFILE=droptek_sandbox
SOURCE="$(pwd)/cloudformations"
UUID=$$
BUCKET=demoandreani
PROJECT=example-apigateway
STACK=$ENV-Security-$PROJECT

echo 'Building SAM package and uploading cloudformation'
sam package --profile $AWS_PROFILE --template-file "${SOURCE}/security.yaml" --output-template-file "security_$UUID.yaml" --s3-bucket $BUCKET
sam deploy --profile $AWS_PROFILE --template-file "security_$UUID.yaml" --stack-name $STACK --tags Project=$PROJECT --capabilities CAPABILITY_NAMED_IAM --parameter-overrides Environment=$ENV Project=$PROJECT
rm "security_$UUID.yaml"
