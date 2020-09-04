/* 
 *  Copyright 2020 Amazon.com or its affiliates
 *  
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as cdk from '@aws-cdk/core';
import { MyStack } from '../lib/stack';

const app = new cdk.App();
new MyStack(app, 'CdkStack', { certificateArn: 'arn:aws:iot:eu-west-1:416075262792:cert/f6c20026a4f847f2aa6839544df191808dade0e9a5e173da695d136eeb3c7aba' });

