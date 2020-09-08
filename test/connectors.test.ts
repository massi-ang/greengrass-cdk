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

import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import { Core, Group,  Generic } from '../lib';
import * as iot from '@aws-cdk/aws-iot';
import { SynthUtils } from '@aws-cdk/assert';



var stack: cdk.Stack;
var t: iot.CfnThing;
var c: Core;


beforeEach(() => {
  stack = new cdk.Stack;
  t = new iot.CfnThing(stack, 'a_thing', {
    thingName: 'testThing'
  })
  c = new Core(stack, 'MyCore', {
    certificateArn: 'AAA',
    syncShadow: true,
    thing: t
  });

})

afterEach(() => {
  console.log(JSON.stringify(SynthUtils.toCloudFormation(stack), undefined, 2))
});


test('Connectors', () => {
  let g = new Generic(stack, 'a connector', {
    name: 'IoTAnalytics',
    version: 4,
    parameters: {
      "p1": "v1"
    }
  })
  new Group(stack, 'group', {
    core: c,
    connectors: [g]
  })

  expect(stack).toHaveResourceLike('AWS::Greengrass::ConnectorDefinition', {
    InitialVersion: {
      "Connectors": [
        {
          "ConnectorArn": "arn:aws:greengrass:region::/connectors/IoTAnalytics/versions/4",
          "Id": "a connector",
          "Parameters": {
            "p1": "v1"
          }
        }
      ]
    }
  });
})






