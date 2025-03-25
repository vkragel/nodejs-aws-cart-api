import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from '../constants/credentials';

export class CartApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const server = new NodejsFunction(this, 'CartApiServerLambda', {
      entry: './src/main.lambda.ts',
      timeout: Duration.seconds(30),
      memorySize: 1024,
      runtime: Runtime.NODEJS_18_X,
      bundling: {
        externalModules: [
          '@nestjs/microservices',
          '@nestjs/websockets',
          'class-transformer',
          'class-validator',
        ],
      },
      environment: {
        DB_DATABASE,
        DB_HOST,
        DB_PASSWORD,
        DB_PORT,
        DB_USERNAME,
      },
    });

    const { url } = server.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: { allowedOrigins: ['*'] },
    });

    new CfnOutput(this, 'CartApiServerUrl', {
      value: url,
    });
  }
}
