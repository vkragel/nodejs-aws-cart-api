import * as cdk from 'aws-cdk-lib';
import { CartApiStack } from './stack';

const app = new cdk.App();

new CartApiStack(app, 'CartApiStack');
