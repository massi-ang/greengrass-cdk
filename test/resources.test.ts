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
import { Core, Group, Function, LocalVolumeResource, LocalDeviceResource, S3MachineLearningModelResource, Permission, SageMakerMachineLearningModelResource, Functions } from '../lib';
import * as iot from '@aws-cdk/aws-iot';
import { Size, Duration } from '@aws-cdk/core';
//import { SynthUtils } from '@aws-cdk/assert';
import * as lambda from '@aws-cdk/aws-lambda';


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
  // console.log(JSON.stringify(SynthUtils.toCloudFormation(stack), undefined, 2))
});

test('functions with resources', () => {
  let f = new lambda.Function(stack, 'a function', {
    code: lambda.Code.fromInline('print("Hello")'),
    runtime: lambda.Runtime.PYTHON_3_7,
    handler: 'handler'
  })
  let v = new lambda.Version(stack, 'v1', {
    lambda: f
  })
  let alias = new lambda.Alias(stack, 'prod', {
    version: v,
    aliasName: 'prod'
  })

  let r = new LocalDeviceResource(stack, 'local', {
    sourcePath: '/dev',
    name: '/dev',
    groupOwnerSetting: {
      autoAddGroupOwner: true
    }
  })

  let gf = new Function(stack, 'gg-function', {
    alias: alias, 
    function: f,
    memorySize: Size.mebibytes(128),
    pinned: false,
    timeout: Duration.seconds(3),
    variables: {
      "TEST": "1"
    }
  }) 

  gf.addResource(r, Functions.ResourceAccessPermission.READ_ONLY)

  new Group(stack, 'a group', {
    core: c,
    functions: [gf],
    resources: [r]
  })
  expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
    InitialVersion: {
      Functions: [
        {
          "FunctionConfiguration": {
            "Environment": {
              "Execution": {},
              "ResourceAccessPolicies": [
                {
                  "Permission": "ro",
                  "ResourceId": "local"
                }
              ],
              "Variables": {
                "TEST": "1"
              }
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
  expect(stack).toHaveResourceLike('AWS::Greengrass::ResourceDefinition', {
    InitialVersion: {
      Resources: [
         {
          "Id": "local",
          "Name": "/dev",
          "ResourceDataContainer": {
            "LocalDeviceResourceData": {
              "GroupOwnerSetting": {
                "AutoAddGroupOwner": true
              },
              "SourcePath": "/dev"
            }
          }
        }
      ]
    }
  });

})


test('local volume resources', () => {
  let r = new LocalVolumeResource(stack, 'a resource', {
    destinationPath: '/tmp',
    groupOwnerSetting: {
      autoAddGroupOwner: true
    },
    name: 'tst',
    sourcePath: '/tmp'
  });

  new Group(stack, 'a group', {
    core: c,
    resources: [r]
  })

  expect(stack).toHaveResourceLike('AWS::Greengrass::ResourceDefinition', {
    InitialVersion: {
      Resources: [
        {
          "Id": "a resource",
          "Name": "a resource",
          "ResourceDataContainer": {
            "LocalVolumeResourceData": {
              "DestinationPath": "/tmp",
              "GroupOwnerSetting": {
                "AutoAddGroupOwner": true
              },
              "SourcePath": "/tmp"
            }
          }
        }
      ]
    }
  });

})

test('local device resources', () => {
  let r = new LocalDeviceResource(stack, 'a resource', {
    groupOwnerSetting: {
      autoAddGroupOwner: true
    },
    name: 'tst',
    sourcePath: '/tmp'
  });

  new Group(stack, 'a group', {
    core: c,
    resources: [r]
  })

  expect(stack).toHaveResourceLike('AWS::Greengrass::ResourceDefinition', {
    InitialVersion: {
      Resources: [
        {
          "Id": "a resource",
          "Name": "tst",
          "ResourceDataContainer": {
            "LocalDeviceResourceData": {
              "GroupOwnerSetting": {
                "AutoAddGroupOwner": true
              },
              "SourcePath": "/tmp"
            }
          }
        }
      ]
    }
  });

})

test('s3 resources', () => {
  let r = new S3MachineLearningModelResource(stack, 'a resource', {
    destinationPath: '/tmp',
    ownerSettings: {
      groupOwner: "me",
      groupPermission: Permission.READ_ONLY
    },
    name: "s3",
    s3Uri: "https://"
  });

  new Group(stack, 'a group', {
    core: c,
    resources: [r]
  })

  expect(stack).toHaveResourceLike('AWS::Greengrass::ResourceDefinition', {
    InitialVersion: {
      Resources: [
        {
          "Id": "a resource",
          "Name": "s3",
          "ResourceDataContainer": {
            "S3MachineLearningModelResourceData": {
              "DestinationPath": "/tmp",
              "OwnerSetting": {
                "GroupOwner": "me",
                "GroupPermission": "ro"
              },
              "S3Uri": "https://"
            }
          }
        }
      ]
    }
  });

})

test('sage maker resource', () => {
  let r = new SageMakerMachineLearningModelResource(stack, 'a resource', {
    destinationPath: '/tmp',
    ownerSettings: {
      groupOwner: "me",
      groupPermission: Permission.READ_ONLY
    },
    name: "s3",
    sageMakerJobArn: "arn::xxx"
  });

  new Group(stack, 'a group', {
    core: c,
    resources: [r]
  })

  expect(stack).toHaveResourceLike('AWS::Greengrass::ResourceDefinition', {
    InitialVersion: {
      Resources: [
        {
          "Id": "a resource",
          "Name": "a resource",
          "ResourceDataContainer": {
            "SageMakerMachineLearningModelResourceData": {
              "DestinationPath": "/tmp",
              "OwnerSetting": {
                "GroupOwner": "me",
                "GroupPermission": "ro"
              },
              "SageMakerJobArn": "arn::xxx"
            }
          }
        }
      ]
    }
  });

})


