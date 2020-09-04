#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MyStack } from '../lib/stack';

const app = new cdk.App();
new MyStack(app, 'CdkStack', { certificateArn: 'arn:aws:iot:eu-west-1:416075262792:cert/f6c20026a4f847f2aa6839544df191808dade0e9a5e173da695d136eeb3c7aba' });

