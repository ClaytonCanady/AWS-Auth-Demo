import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function
    const handler = new lambda.Function(this, 'BackendHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda-build'),
      handler: 'index.handler',
      environment: {
        // Add your environment variables here
      }
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'BackendApi', {
      restApiName: 'Backend Service',
      description: 'API Gateway for the backend service'
    });

    // Create API Gateway integration
    const integration = new apigateway.LambdaIntegration(handler);

    // Add routes
    api.root.addMethod('ANY', integration);
    api.root.addProxy({
      defaultIntegration: integration,
      anyMethod: true
    });
  }
} 