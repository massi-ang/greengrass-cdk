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
import { Core, Group, Function, Functions } from '../lib';
import * as iot from '@aws-cdk/aws-iot';
import { Size, Duration } from '@aws-cdk/core';
//import { SynthUtils } from '@aws-cdk/assert';
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
  //console.log(JSON.stringify(SynthUtils.toCloudFormation(stack), undefined, 2))
});

test('functions all compulsory', () => {

  let gf = new Function(stack, 'gg-function', {
    alias: alias,
    function: f,
    memorySize: Size.mebibytes(128),
    pinned: false,
    timeout: Duration.seconds(3),
  })

  new Group(stack, 'a group', {
    core: c,
    functions: [gf]
  })
  expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
    InitialVersion: {
      Functions: [
        {
          "FunctionConfiguration": {

            "Environment": {
              
              "Execution": {
                
              },
             
            },
            
            "MemorySize": 131072,
            "Pinned": false,
            "Timeout": 3
          },
          "Id": "gg-function"
        }
      ]
    }
  });
})


test('functions wrong runtime', () => {

  let f1 = new lambda.Function(stack, 'a wrong function', {
    code: lambda.Code.fromInline('print("Hello")'),
    runtime: lambda.Runtime.PYTHON_2_7,
    handler: 'handler'
  })
  let v = new lambda.Version(stack, 'v2', {
    lambda: f1
  })
  let alias = new lambda.Alias(stack, 'prod1', {
    version: v,
    aliasName: 'prod'
  })
  let gf = new Function(stack, 'gg-function', {
    alias: alias,
    function: f1,
    memorySize: Size.mebibytes(128),
    pinned: false,
    timeout: Duration.seconds(3),
  })

  expect(() => {
    return new Group(stack, 'a group', {
      core: c,
      functions: [gf]
    })
  }).toThrow()
})

test('functions using versions', () => {

  let f1 = new lambda.Function(stack, 'a wrong function', {
    code: lambda.Code.fromInline('print("Hello")'),
    runtime: lambda.Runtime.PYTHON_3_7,
    handler: 'handler'
  })
  let v = new lambda.Version(stack, 'v2', {
    lambda: f1
  })
  
  let gf = new Function(stack, 'gg-function', {
    version: v,
    function: f1,
    memorySize: Size.mebibytes(128),
    pinned: false,
    timeout: Duration.seconds(3),
  })

  new Group(stack, 'a group', {
      core: c,
      functions: [gf]
    })
  
  expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
    InitialVersion: {
      Functions: [
        {
          "FunctionConfiguration": {

            "Environment": {

              "Execution": {

              },

            },

            "MemorySize": 131072,
            "Pinned": false,
            "Timeout": 3
          },
          "Id": "gg-function"
        }
      ]
    }
  });
})

test('functions default env', () => {

  let gf = new Function(stack, 'gg-function', {
    alias: alias,
    function: f,
    memorySize: Size.mebibytes(128),
    pinned: false,
    timeout: Duration.seconds(3),
  })

  new Group(stack, 'a group', {
    core: c,
    functions: [gf],
    defaultFunctionExecution: {
      isolationMode: Functions.IsolationMode.CONTAINER_MODE,
      runAs: {
        gid: 1001,
        uid: 1001
      }
    }
  })
  expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
    InitialVersion: {
      "DefaultConfig": {
        "Execution": {
          "IsolationMode": "GreengrassContainer",
          "RunAs": {
            "Gid": 1001,
            "Uid": 1001
          }
        }
      },
      Functions: [
        {
          "FunctionConfiguration": {

            "Environment": {

              "Execution": {

              },

            },

            "MemorySize": 131072,
            "Pinned": false,
            "Timeout": 3
          },
          "Id": "gg-function"
        }
      ]
    }
  });
})


test('functions all options', () => {

  let gf = new Function(stack, 'gg-function', {
    alias: alias,
    function: f,
    memorySize: Size.mebibytes(128),
    pinned: false,
    timeout: Duration.seconds(3),
    accessSysFs: true,
    encodingType: Functions.EncodingType.BINARY,
    execArgs: "--help",
    executable: "help",
    isolationMode: Functions.IsolationMode.NO_CONTAINER_MODE,
    runAs: {
      gid: 501,
      uid: 501
    },
    variables: {
      "TEST": "1"
    },
  })

  new Group(stack, 'a group', {
    core: c,
    functions: [gf]
  })
  expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
    InitialVersion: {
      Functions: [
        {
          "FunctionConfiguration": {
            "EncodingType": "binary",
            "Environment": {
              "AccessSysfs": true,
              "Execution": {
                "IsolationMode": "NoContainer",
                "RunAs": {
                  "Gid": 501,
                  "Uid": 501
                }
              },
              "Variables": {
                "TEST": "1"
              }
            },
            "ExecArgs": "--help",
            "Executable": "help",
            "MemorySize": 131072,
            "Pinned": false,
            "Timeout": 3
          },
          "Id": "gg-function"
        }
      ]
    }
  });

})