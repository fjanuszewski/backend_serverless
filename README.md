# Description

This repository has a backend implemented in AWS cloudformation. In the template.yaml file you will find the following resources:
- Lambda: For trigger in Cognito. This lambda make puts in DynamoDB for every new user.
- Cognito: A simple template with federation with Google.
- ApiGateway: A simple scheme with swagger
- DynamoDB: The storage of the proyect

## Before starting
Must have installed AWS CLI and SAM. After install AWS CLI configure the AWS CLI to execute the commands in your AWS account.

NodeJs is required for Build the lambda trigger.

### Installing AWS CLI & SAM
- [AWS CLI Installer](https://docs.aws.amazon.com/es_es/cli/latest/userguide/cli-chap-install.html)
- [SAM Installer](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

### Installing NodeJs
- [NodeJs & NPM Installer](https://nodejs.org/en/)

# Usage
You can either implement the tamplate with your favorite SAM command, or run the **deploy.sh** file. Note that you should replace the variables within the file.

### Environments
- **ENV**: This work fine if we use SAM in local. In Pipeline is not needed
- **BUCKET**: Bucket is required for [SAM Package](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-package.html)
- **STACK**: Name of stack in CloudFormation, is reference for the name of objects in template
- **PROJECT**: Tag for all resources
- **CLIENTID**: We can find this in [google console](https://developers.google.com/adwords/api/docs/guides/authentication)
- **CLIENT_SECRET**: We can find this in [google console](https://developers.google.com/adwords/api/docs/guides/authentication)
- **POOL_DOMAIN**: The name of the domain for the Cognito pool.
- **CALLBACKURL**: The domain of redirect in login success
- **LOGOUTURL**: The domain of redirect in logout success

