import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  FunctionUrlAuthType,
  HttpMethod,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from '../constants/credentials';
import * as path from 'path';

export class CartApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const server = new NodejsFunction(this, 'CartApiServerLambda', {
      entry: path.join(__dirname, '../src/main.lambda.ts'),
      handler: 'handler',
      timeout: Duration.seconds(30),
      runtime: Runtime.NODEJS_20_X,
      bundling: {
        externalModules: [
          'aws-cdk',
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
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [HttpMethod.GET, HttpMethod.DELETE, HttpMethod.PUT],
        allowedHeaders: ['*'],
      },
    });

    new CfnOutput(this, 'CartServiceUrl', { value: url });
  }
}
