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
import { Core, Group, CloudSpoolerStorageType} from '../lib';
import * as iot from '@aws-cdk/aws-iot';
import { Size } from '@aws-cdk/core';
//import { SynthUtils } from '@aws-cdk/assert';



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
  //console.log(JSON.stringify(SynthUtils.toCloudFormation(stack), undefined, 2))
});



test('AutoIp', () => {

  new Group(stack, 'group', {
    core: c,
    enableAutomaticIpDiscovery: true,
  })

  expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
    InitialVersion: {
      Functions: [
        {
          "FunctionArn": "arn:aws:lambda:::function:GGIPDetector:1",
          "FunctionConfiguration": {
            "MemorySize": 32768,
            "Pinned": true,
            "Timeout": 3
          },
          "Id": "auto_ip"
        },
      ]
    }
  });
});

test('Stream Manager', () => {

  new Group(stack, 'group', {
    core: c,
    streamManager: {
      enableStreamManager: true,
      allowInsecureAccess: true
    }
  })

  expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
    InitialVersion: {
      Functions: [
        {
          "FunctionArn": "arn:aws:lambda:::function:GGStreamManager:1",
          "FunctionConfiguration": {
            "EncodingType": "binary",
            "Environment": {
              "Variables": {
                "STREAM_MANAGER_AUTHENTICATE_CLIENT": "false"
              }
            },
            "Pinned": true,
            "Timeout": 3,
            "MemorySize": 131072
          },
          "Id": "stream_manager"
        },
      ]
    }
  });
});

test('Stream Manager Props', () => {

  new Group(stack, 'group', {
    core: c,
    streamManager: {
      enableStreamManager: true,
      exporterMaximumBandwidth: 2000,
      jvmArgs: '-D100',
      memorySize: Size.mebibytes(64),
      minSizeMultipartUpload: Size.kibibytes(122),
      readOnlyDirs: ["/tmp", "/opt"],
      serverPort: 8082,
      storeRootDir: "/data",
      threadPoolSize: 10
    }
  })

  expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
    InitialVersion: {
      Functions: [
        {
          "FunctionArn": "arn:aws:lambda:::function:GGStreamManager:1",
          "FunctionConfiguration": {
            "EncodingType": "binary",
            "Environment": {
              "Variables": {
                        "STREAM_MANAGER_STORE_ROOT_DIR": "/data",
              "STREAM_MANAGER_SERVER_PORT": 8082,
              "STREAM_MANAGER_EXPORTER_MAX_BANDWIDTH": 2000,
              "STREAM_MANAGER_EXPORTER_THREAD_POOL_SIZE": 10,
              "JVM_ARGS": "-D100",
              "STREAM_MANAGER_READ_ONLY_DIRS": "/tmp,/opt",
              "STREAM_MANAGER_EXPORTER_S3_DESTINATION_MULTIPART_UPLOAD_MIN_PART_SIZE_BYTES": 122000
            }
          },
          "MemorySize": 65536,
            "Pinned": true,
            "Timeout": 3
          },
          "Id": "stream_manager"
        },
      ]
    }
  });
});



test('Cloud Spooler', () => {

  new Group(stack, 'group', {
    core: c,
    cloudSpooler: {
      storage: {
        type: CloudSpoolerStorageType.FILE_SYSTEM,
        maxSize: Size.mebibytes(3)
      },
      enablePersistentSessions: true
    },
  })

  expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
    InitialVersion: {
      Functions: [
        {
          "FunctionArn": "arn:aws:lambda:::function:GGCloudSpooler:1",
          "FunctionConfiguration": {
            "Environment": {
              "Variables": {
                "GG_CONFIG_STORAGE_TYPE": "FileSystem",
                "GG_CONFIG_MAX_SIZE_BYTES": 3072,
                "GG_CONFIG_SUBSCRIPTION_QUALITY": "AtLeastOncePersistent"
              }
            },
            "Executable": "spooler",
            "MemorySize": 32768,
            "Pinned": true,
            "Timeout": 3
          },
          "Id": "spooler"
        }
      ]
    }
  });
});




test('Cloud Spooler - QoS0', () => {

  new Group(stack, 'group', {
    core: c,
    cloudSpooler: {
      storage: {
        type: CloudSpoolerStorageType.FILE_SYSTEM,
        maxSize: Size.mebibytes(3)
      }
    },
  })

  expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
    InitialVersion: {
      Functions: [
        {
          "FunctionArn": "arn:aws:lambda:::function:GGCloudSpooler:1",
          "FunctionConfiguration": {
            "Environment": {
              "Variables": {
                "GG_CONFIG_STORAGE_TYPE": "FileSystem",
                "GG_CONFIG_MAX_SIZE_BYTES": 3072,
                "GG_CONFIG_SUBSCRIPTION_QUALITY": "AtMostOnce"
              }
            },
            "Executable": "spooler",
            "MemorySize": 32768,
            "Pinned": true,
            "Timeout": 3
          },
          "Id": "spooler"
        }
      ]
    }
  });
});