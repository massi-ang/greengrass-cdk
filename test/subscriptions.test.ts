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
import { Core, Group, Subscriptions, CloudDestination, LocalShadowDestination, Function } from '../lib';
import * as iot from '@aws-cdk/aws-iot';
import { Size, Duration } from '@aws-cdk/core';
import { SynthUtils } from '@aws-cdk/assert';
import * as lambda from '@aws-cdk/aws-lambda';


var stack: cdk.Stack;
var t: iot.CfnThing;
var c: Core;
var f: lambda.Function;
var alias: lambda.Alias;

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

  f = new lambda.Function(stack, 'a function', {
    code: lambda.Code.fromInline('print("Hello")'),
    runtime: lambda.Runtime.PYTHON_3_7,
    handler: 'handler'
  })
  let v = new lambda.Version(stack, 'v1', {
    lambda: f
  })
  alias = new lambda.Alias(stack, 'prod', {
    version: v,
    aliasName: 'prod'
  })
})

afterEach(() => {
  console.log(JSON.stringify(SynthUtils.toCloudFormation(stack), undefined, 2))
});


test('Subscriptions cloud and localshadow destinations', () => {
  let s = new Subscriptions(stack, 'subs');
  s.add(new CloudDestination(), '#', new LocalShadowDestination())
  new Group(stack, 'group', {
    core: c,
    subscriptions: s
  })
  expect(stack).toHaveResourceLike('AWS::Greengrass::SubscriptionDefinition', {
    InitialVersion: {
      Subscriptions: [
        {
          "Id": "0",
          "Source": "cloud",
          "Subject": "#",
          "Target": "GGShadowService"
        }
      ]
    }
  });
})


test('Subscriptions functions', () => {
  let s = new Subscriptions(stack, 'subs');
  

  let gf = new Function(stack, 'gg-function', {
    alias: alias,
    function: f,
    memorySize: Size.mebibytes(128),
    pinned: false,
    timeout: Duration.seconds(3),
  })

  s.add(gf, 'iot/topic', new CloudDestination())

  new Group(stack, 'group', {
    core: c,
    subscriptions: s
  })
  expect(stack).toHaveResourceLike('AWS::Greengrass::SubscriptionDefinition', {
    InitialVersion: {
      Subscriptions: [
        {
          "Source": {
            "Fn::Join": [
              "",
              [
                {
                  "Fn::GetAtt": [
                    
                  ]
                },
                ":prod"
              ]
            ]
          },
          "Subject": "iot/topic",
          "Target": "cloud"
        }
      ]
    }
  });
})



