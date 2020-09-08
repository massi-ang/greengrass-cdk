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

import { expect as expectCDK, matchTemplate, MatchStyle, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Sample from '../lib/simple_stack';
import {MyStack} from '../lib/stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Sample.SimpleGGStack(app, 'MyTestStack', { certificateArn: 'arn::1'});
    // THEN
  
  console.log(JSON.stringify(SynthUtils.toCloudFormation(stack), undefined, 2));
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});

test('The other stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new MyStack(app, 'MyTestStack', { certificateArn: 'arn::1' });
  console.log(JSON.stringify(SynthUtils.toCloudFormation(stack), undefined, 2));
})
