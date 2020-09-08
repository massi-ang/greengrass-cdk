"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
require("@aws-cdk/assert/jest");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
const iot = require("@aws-cdk/aws-iot");
const core_1 = require("@aws-cdk/core");
//import { SynthUtils } from '@aws-cdk/assert';
const lambda = require("@aws-cdk/aws-lambda");
var stack;
var t;
var c;
beforeEach(() => {
    stack = new cdk.Stack;
    t = new iot.CfnThing(stack, 'a_thing', {
        thingName: 'testThing'
    });
    c = new lib_1.Core(stack, 'MyCore', {
        certificateArn: 'AAA',
        syncShadow: true,
        thing: t
    });
});
afterEach(() => {
    // console.log(JSON.stringify(SynthUtils.toCloudFormation(stack), undefined, 2))
});
test('functions with resources', () => {
    let f = new lambda.Function(stack, 'a function', {
        code: lambda.Code.fromInline('print("Hello")'),
        runtime: lambda.Runtime.PYTHON_3_7,
        handler: 'handler'
    });
    let v = new lambda.Version(stack, 'v1', {
        lambda: f
    });
    let alias = new lambda.Alias(stack, 'prod', {
        version: v,
        aliasName: 'prod'
    });
    let r = new lib_1.LocalDeviceResource(stack, 'local', {
        sourcePath: '/dev',
        name: '/dev',
        groupOwnerSetting: {
            autoAddGroupOwner: true
        }
    });
    let gf = new lib_1.Function(stack, 'gg-function', {
        alias: alias,
        function: f,
        memorySize: core_1.Size.mebibytes(128),
        pinned: false,
        timeout: core_1.Duration.seconds(3),
        variables: {
            "TEST": "1"
        }
    });
    gf.addResource(r, lib_1.Functions.ResourceAccessPermission.READ_ONLY);
    new lib_1.Group(stack, 'a group', {
        core: c,
        functions: [gf],
        resources: [r]
    });
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
});
test('local volume resources', () => {
    let r = new lib_1.LocalVolumeResource(stack, 'a resource', {
        destinationPath: '/tmp',
        groupOwnerSetting: {
            autoAddGroupOwner: true
        },
        name: 'tst',
        sourcePath: '/tmp'
    });
    new lib_1.Group(stack, 'a group', {
        core: c,
        resources: [r]
    });
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
});
test('local device resources', () => {
    let r = new lib_1.LocalDeviceResource(stack, 'a resource', {
        groupOwnerSetting: {
            autoAddGroupOwner: true
        },
        name: 'tst',
        sourcePath: '/tmp'
    });
    new lib_1.Group(stack, 'a group', {
        core: c,
        resources: [r]
    });
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
});
test('s3 resources', () => {
    let r = new lib_1.S3MachineLearningModelResource(stack, 'a resource', {
        destinationPath: '/tmp',
        ownerSettings: {
            groupOwner: "me",
            groupPermission: lib_1.Permission.READ_ONLY
        },
        name: "s3",
        s3Uri: "https://"
    });
    new lib_1.Group(stack, 'a group', {
        core: c,
        resources: [r]
    });
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
});
test('sage maker resource', () => {
    let r = new lib_1.SageMakerMachineLearningModelResource(stack, 'a resource', {
        destinationPath: '/tmp',
        ownerSettings: {
            groupOwner: "me",
            groupPermission: lib_1.Permission.READ_ONLY
        },
        name: "s3",
        sageMakerJobArn: "arn::xxx"
    });
    new lib_1.Group(stack, 'a group', {
        core: c,
        resources: [r]
    });
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNvdXJjZXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7O0FBRUgsZ0NBQThCO0FBQzlCLHFDQUFxQztBQUNyQyxnQ0FBdUw7QUFDdkwsd0NBQXdDO0FBQ3hDLHdDQUErQztBQUMvQywrQ0FBK0M7QUFDL0MsOENBQThDO0FBRzlDLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLENBQWUsQ0FBQztBQUNwQixJQUFJLENBQU8sQ0FBQztBQUVaLFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUNyQyxTQUFTLEVBQUUsV0FBVztLQUN2QixDQUFDLENBQUE7SUFDRixDQUFDLEdBQUcsSUFBSSxVQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUM1QixjQUFjLEVBQUUsS0FBSztRQUNyQixVQUFVLEVBQUUsSUFBSTtRQUNoQixLQUFLLEVBQUUsQ0FBQztLQUNULENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFBO0FBRUYsU0FBUyxDQUFDLEdBQUcsRUFBRTtJQUNiLGdGQUFnRjtBQUNsRixDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7SUFDcEMsSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7UUFDL0MsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO1FBQzlDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7UUFDbEMsT0FBTyxFQUFFLFNBQVM7S0FDbkIsQ0FBQyxDQUFBO0lBQ0YsSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7UUFDdEMsTUFBTSxFQUFFLENBQUM7S0FDVixDQUFDLENBQUE7SUFDRixJQUFJLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUMxQyxPQUFPLEVBQUUsQ0FBQztRQUNWLFNBQVMsRUFBRSxNQUFNO0tBQ2xCLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxHQUFHLElBQUkseUJBQW1CLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUM5QyxVQUFVLEVBQUUsTUFBTTtRQUNsQixJQUFJLEVBQUUsTUFBTTtRQUNaLGlCQUFpQixFQUFFO1lBQ2pCLGlCQUFpQixFQUFFLElBQUk7U0FDeEI7S0FDRixDQUFDLENBQUE7SUFFRixJQUFJLEVBQUUsR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1FBQzFDLEtBQUssRUFBRSxLQUFLO1FBQ1osUUFBUSxFQUFFLENBQUM7UUFDWCxVQUFVLEVBQUUsV0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7UUFDL0IsTUFBTSxFQUFFLEtBQUs7UUFDYixPQUFPLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDNUIsU0FBUyxFQUFFO1lBQ1QsTUFBTSxFQUFFLEdBQUc7U0FDWjtLQUNGLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLGVBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUUvRCxJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzFCLElBQUksRUFBRSxDQUFDO1FBQ1AsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ2YsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2YsQ0FBQyxDQUFBO0lBQ0YsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLGtCQUFrQixDQUFDLHFDQUFxQyxFQUFFO1FBQ3RFLGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSx1QkFBdUIsRUFBRTt3QkFDdkIsYUFBYSxFQUFFOzRCQUNiLFdBQVcsRUFBRSxFQUFFOzRCQUNmLHdCQUF3QixFQUFFO2dDQUN4QjtvQ0FDRSxZQUFZLEVBQUUsSUFBSTtvQ0FDbEIsWUFBWSxFQUFFLE9BQU87aUNBQ3RCOzZCQUNGOzRCQUNELFdBQVcsRUFBRTtnQ0FDWCxNQUFNLEVBQUUsR0FBRzs2QkFDWjt5QkFDRjt3QkFDRCxZQUFZLEVBQUUsTUFBTTt3QkFDcEIsUUFBUSxFQUFFLEtBQUs7d0JBQ2YsU0FBUyxFQUFFLENBQUM7cUJBQ2I7b0JBQ0QsSUFBSSxFQUFFLGFBQWE7aUJBQ3BCO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxxQ0FBcUMsRUFBRTtRQUN0RSxjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUU7Z0JBQ1I7b0JBQ0MsSUFBSSxFQUFFLE9BQU87b0JBQ2IsTUFBTSxFQUFFLE1BQU07b0JBQ2QsdUJBQXVCLEVBQUU7d0JBQ3ZCLHlCQUF5QixFQUFFOzRCQUN6QixtQkFBbUIsRUFBRTtnQ0FDbkIsbUJBQW1CLEVBQUUsSUFBSTs2QkFDMUI7NEJBQ0QsWUFBWSxFQUFFLE1BQU07eUJBQ3JCO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFBO0FBR0YsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtJQUNsQyxJQUFJLENBQUMsR0FBRyxJQUFJLHlCQUFtQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7UUFDbkQsZUFBZSxFQUFFLE1BQU07UUFDdkIsaUJBQWlCLEVBQUU7WUFDakIsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QjtRQUNELElBQUksRUFBRSxLQUFLO1FBQ1gsVUFBVSxFQUFFLE1BQU07S0FDbkIsQ0FBQyxDQUFDO0lBRUgsSUFBSSxXQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUMxQixJQUFJLEVBQUUsQ0FBQztRQUNQLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNmLENBQUMsQ0FBQTtJQUVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxxQ0FBcUMsRUFBRTtRQUN0RSxjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsSUFBSSxFQUFFLFlBQVk7b0JBQ2xCLE1BQU0sRUFBRSxZQUFZO29CQUNwQix1QkFBdUIsRUFBRTt3QkFDdkIseUJBQXlCLEVBQUU7NEJBQ3pCLGlCQUFpQixFQUFFLE1BQU07NEJBQ3pCLG1CQUFtQixFQUFFO2dDQUNuQixtQkFBbUIsRUFBRSxJQUFJOzZCQUMxQjs0QkFDRCxZQUFZLEVBQUUsTUFBTTt5QkFDckI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUE7QUFFRixJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLElBQUksQ0FBQyxHQUFHLElBQUkseUJBQW1CLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtRQUNuRCxpQkFBaUIsRUFBRTtZQUNqQixpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCO1FBQ0QsSUFBSSxFQUFFLEtBQUs7UUFDWCxVQUFVLEVBQUUsTUFBTTtLQUNuQixDQUFDLENBQUM7SUFFSCxJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzFCLElBQUksRUFBRSxDQUFDO1FBQ1AsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2YsQ0FBQyxDQUFBO0lBRUYsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLGtCQUFrQixDQUFDLHFDQUFxQyxFQUFFO1FBQ3RFLGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxJQUFJLEVBQUUsWUFBWTtvQkFDbEIsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsdUJBQXVCLEVBQUU7d0JBQ3ZCLHlCQUF5QixFQUFFOzRCQUN6QixtQkFBbUIsRUFBRTtnQ0FDbkIsbUJBQW1CLEVBQUUsSUFBSTs2QkFDMUI7NEJBQ0QsWUFBWSxFQUFFLE1BQU07eUJBQ3JCO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxvQ0FBOEIsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1FBQzlELGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLGFBQWEsRUFBRTtZQUNiLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLGVBQWUsRUFBRSxnQkFBVSxDQUFDLFNBQVM7U0FDdEM7UUFDRCxJQUFJLEVBQUUsSUFBSTtRQUNWLEtBQUssRUFBRSxVQUFVO0tBQ2xCLENBQUMsQ0FBQztJQUVILElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDMUIsSUFBSSxFQUFFLENBQUM7UUFDUCxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDZixDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMscUNBQXFDLEVBQUU7UUFDdEUsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLElBQUksRUFBRSxZQUFZO29CQUNsQixNQUFNLEVBQUUsSUFBSTtvQkFDWix1QkFBdUIsRUFBRTt3QkFDdkIsb0NBQW9DLEVBQUU7NEJBQ3BDLGlCQUFpQixFQUFFLE1BQU07NEJBQ3pCLGNBQWMsRUFBRTtnQ0FDZCxZQUFZLEVBQUUsSUFBSTtnQ0FDbEIsaUJBQWlCLEVBQUUsSUFBSTs2QkFDeEI7NEJBQ0QsT0FBTyxFQUFFLFVBQVU7eUJBQ3BCO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtJQUMvQixJQUFJLENBQUMsR0FBRyxJQUFJLDJDQUFxQyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7UUFDckUsZUFBZSxFQUFFLE1BQU07UUFDdkIsYUFBYSxFQUFFO1lBQ2IsVUFBVSxFQUFFLElBQUk7WUFDaEIsZUFBZSxFQUFFLGdCQUFVLENBQUMsU0FBUztTQUN0QztRQUNELElBQUksRUFBRSxJQUFJO1FBQ1YsZUFBZSxFQUFFLFVBQVU7S0FDNUIsQ0FBQyxDQUFDO0lBRUgsSUFBSSxXQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUMxQixJQUFJLEVBQUUsQ0FBQztRQUNQLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNmLENBQUMsQ0FBQTtJQUVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxxQ0FBcUMsRUFBRTtRQUN0RSxjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsSUFBSSxFQUFFLFlBQVk7b0JBQ2xCLE1BQU0sRUFBRSxZQUFZO29CQUNwQix1QkFBdUIsRUFBRTt3QkFDdkIsMkNBQTJDLEVBQUU7NEJBQzNDLGlCQUFpQixFQUFFLE1BQU07NEJBQ3pCLGNBQWMsRUFBRTtnQ0FDZCxZQUFZLEVBQUUsSUFBSTtnQ0FDbEIsaUJBQWlCLEVBQUUsSUFBSTs2QkFDeEI7NEJBQ0QsaUJBQWlCLEVBQUUsVUFBVTt5QkFDOUI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICdAYXdzLWNkay9hc3NlcnQvamVzdCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb3JlLCBHcm91cCwgRnVuY3Rpb24sIExvY2FsVm9sdW1lUmVzb3VyY2UsIExvY2FsRGV2aWNlUmVzb3VyY2UsIFMzTWFjaGluZUxlYXJuaW5nTW9kZWxSZXNvdXJjZSwgUGVybWlzc2lvbiwgU2FnZU1ha2VyTWFjaGluZUxlYXJuaW5nTW9kZWxSZXNvdXJjZSwgRnVuY3Rpb25zIH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCAqIGFzIGlvdCBmcm9tICdAYXdzLWNkay9hd3MtaW90JztcbmltcG9ydCB7IFNpemUsIER1cmF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG4vL2ltcG9ydCB7IFN5bnRoVXRpbHMgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuXG5cbnZhciBzdGFjazogY2RrLlN0YWNrO1xudmFyIHQ6IGlvdC5DZm5UaGluZztcbnZhciBjOiBDb3JlO1xuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrO1xuICB0ID0gbmV3IGlvdC5DZm5UaGluZyhzdGFjaywgJ2FfdGhpbmcnLCB7XG4gICAgdGhpbmdOYW1lOiAndGVzdFRoaW5nJ1xuICB9KVxuICBjID0gbmV3IENvcmUoc3RhY2ssICdNeUNvcmUnLCB7XG4gICAgY2VydGlmaWNhdGVBcm46ICdBQUEnLFxuICAgIHN5bmNTaGFkb3c6IHRydWUsXG4gICAgdGhpbmc6IHRcbiAgfSk7XG59KVxuXG5hZnRlckVhY2goKCkgPT4ge1xuICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShTeW50aFV0aWxzLnRvQ2xvdWRGb3JtYXRpb24oc3RhY2spLCB1bmRlZmluZWQsIDIpKVxufSk7XG5cbnRlc3QoJ2Z1bmN0aW9ucyB3aXRoIHJlc291cmNlcycsICgpID0+IHtcbiAgbGV0IGYgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnYSBmdW5jdGlvbicsIHtcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdwcmludChcIkhlbGxvXCIpJyksXG4gICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfNyxcbiAgICBoYW5kbGVyOiAnaGFuZGxlcidcbiAgfSlcbiAgbGV0IHYgPSBuZXcgbGFtYmRhLlZlcnNpb24oc3RhY2ssICd2MScsIHtcbiAgICBsYW1iZGE6IGZcbiAgfSlcbiAgbGV0IGFsaWFzID0gbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ3Byb2QnLCB7XG4gICAgdmVyc2lvbjogdixcbiAgICBhbGlhc05hbWU6ICdwcm9kJ1xuICB9KVxuXG4gIGxldCByID0gbmV3IExvY2FsRGV2aWNlUmVzb3VyY2Uoc3RhY2ssICdsb2NhbCcsIHtcbiAgICBzb3VyY2VQYXRoOiAnL2RldicsXG4gICAgbmFtZTogJy9kZXYnLFxuICAgIGdyb3VwT3duZXJTZXR0aW5nOiB7XG4gICAgICBhdXRvQWRkR3JvdXBPd25lcjogdHJ1ZVxuICAgIH1cbiAgfSlcblxuICBsZXQgZ2YgPSBuZXcgRnVuY3Rpb24oc3RhY2ssICdnZy1mdW5jdGlvbicsIHtcbiAgICBhbGlhczogYWxpYXMsIFxuICAgIGZ1bmN0aW9uOiBmLFxuICAgIG1lbW9yeVNpemU6IFNpemUubWViaWJ5dGVzKDEyOCksXG4gICAgcGlubmVkOiBmYWxzZSxcbiAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMpLFxuICAgIHZhcmlhYmxlczoge1xuICAgICAgXCJURVNUXCI6IFwiMVwiXG4gICAgfVxuICB9KSBcblxuICBnZi5hZGRSZXNvdXJjZShyLCBGdW5jdGlvbnMuUmVzb3VyY2VBY2Nlc3NQZXJtaXNzaW9uLlJFQURfT05MWSlcblxuICBuZXcgR3JvdXAoc3RhY2ssICdhIGdyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgZnVuY3Rpb25zOiBbZ2ZdLFxuICAgIHJlc291cmNlczogW3JdXG4gIH0pXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OkZ1bmN0aW9uRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgRnVuY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIkZ1bmN0aW9uQ29uZmlndXJhdGlvblwiOiB7XG4gICAgICAgICAgICBcIkVudmlyb25tZW50XCI6IHtcbiAgICAgICAgICAgICAgXCJFeGVjdXRpb25cIjoge30sXG4gICAgICAgICAgICAgIFwiUmVzb3VyY2VBY2Nlc3NQb2xpY2llc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJQZXJtaXNzaW9uXCI6IFwicm9cIixcbiAgICAgICAgICAgICAgICAgIFwiUmVzb3VyY2VJZFwiOiBcImxvY2FsXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIFwiVmFyaWFibGVzXCI6IHtcbiAgICAgICAgICAgICAgICBcIlRFU1RcIjogXCIxXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiTWVtb3J5U2l6ZVwiOiAxMzEwNzIsXG4gICAgICAgICAgICBcIlBpbm5lZFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwiZ2ctZnVuY3Rpb25cIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6UmVzb3VyY2VEZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBSZXNvdXJjZXM6IFtcbiAgICAgICAgIHtcbiAgICAgICAgICBcIklkXCI6IFwibG9jYWxcIixcbiAgICAgICAgICBcIk5hbWVcIjogXCIvZGV2XCIsXG4gICAgICAgICAgXCJSZXNvdXJjZURhdGFDb250YWluZXJcIjoge1xuICAgICAgICAgICAgXCJMb2NhbERldmljZVJlc291cmNlRGF0YVwiOiB7XG4gICAgICAgICAgICAgIFwiR3JvdXBPd25lclNldHRpbmdcIjoge1xuICAgICAgICAgICAgICAgIFwiQXV0b0FkZEdyb3VwT3duZXJcIjogdHJ1ZVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIlNvdXJjZVBhdGhcIjogXCIvZGV2XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xuXG59KVxuXG5cbnRlc3QoJ2xvY2FsIHZvbHVtZSByZXNvdXJjZXMnLCAoKSA9PiB7XG4gIGxldCByID0gbmV3IExvY2FsVm9sdW1lUmVzb3VyY2Uoc3RhY2ssICdhIHJlc291cmNlJywge1xuICAgIGRlc3RpbmF0aW9uUGF0aDogJy90bXAnLFxuICAgIGdyb3VwT3duZXJTZXR0aW5nOiB7XG4gICAgICBhdXRvQWRkR3JvdXBPd25lcjogdHJ1ZVxuICAgIH0sXG4gICAgbmFtZTogJ3RzdCcsXG4gICAgc291cmNlUGF0aDogJy90bXAnXG4gIH0pO1xuXG4gIG5ldyBHcm91cChzdGFjaywgJ2EgZ3JvdXAnLCB7XG4gICAgY29yZTogYyxcbiAgICByZXNvdXJjZXM6IFtyXVxuICB9KVxuXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OlJlc291cmNlRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgUmVzb3VyY2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIklkXCI6IFwiYSByZXNvdXJjZVwiLFxuICAgICAgICAgIFwiTmFtZVwiOiBcImEgcmVzb3VyY2VcIixcbiAgICAgICAgICBcIlJlc291cmNlRGF0YUNvbnRhaW5lclwiOiB7XG4gICAgICAgICAgICBcIkxvY2FsVm9sdW1lUmVzb3VyY2VEYXRhXCI6IHtcbiAgICAgICAgICAgICAgXCJEZXN0aW5hdGlvblBhdGhcIjogXCIvdG1wXCIsXG4gICAgICAgICAgICAgIFwiR3JvdXBPd25lclNldHRpbmdcIjoge1xuICAgICAgICAgICAgICAgIFwiQXV0b0FkZEdyb3VwT3duZXJcIjogdHJ1ZVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIlNvdXJjZVBhdGhcIjogXCIvdG1wXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xuXG59KVxuXG50ZXN0KCdsb2NhbCBkZXZpY2UgcmVzb3VyY2VzJywgKCkgPT4ge1xuICBsZXQgciA9IG5ldyBMb2NhbERldmljZVJlc291cmNlKHN0YWNrLCAnYSByZXNvdXJjZScsIHtcbiAgICBncm91cE93bmVyU2V0dGluZzoge1xuICAgICAgYXV0b0FkZEdyb3VwT3duZXI6IHRydWVcbiAgICB9LFxuICAgIG5hbWU6ICd0c3QnLFxuICAgIHNvdXJjZVBhdGg6ICcvdG1wJ1xuICB9KTtcblxuICBuZXcgR3JvdXAoc3RhY2ssICdhIGdyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgcmVzb3VyY2VzOiBbcl1cbiAgfSlcblxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpSZXNvdXJjZURlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIFJlc291cmNlczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJJZFwiOiBcImEgcmVzb3VyY2VcIixcbiAgICAgICAgICBcIk5hbWVcIjogXCJ0c3RcIixcbiAgICAgICAgICBcIlJlc291cmNlRGF0YUNvbnRhaW5lclwiOiB7XG4gICAgICAgICAgICBcIkxvY2FsRGV2aWNlUmVzb3VyY2VEYXRhXCI6IHtcbiAgICAgICAgICAgICAgXCJHcm91cE93bmVyU2V0dGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgXCJBdXRvQWRkR3JvdXBPd25lclwiOiB0cnVlXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiU291cmNlUGF0aFwiOiBcIi90bXBcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG5cbn0pXG5cbnRlc3QoJ3MzIHJlc291cmNlcycsICgpID0+IHtcbiAgbGV0IHIgPSBuZXcgUzNNYWNoaW5lTGVhcm5pbmdNb2RlbFJlc291cmNlKHN0YWNrLCAnYSByZXNvdXJjZScsIHtcbiAgICBkZXN0aW5hdGlvblBhdGg6ICcvdG1wJyxcbiAgICBvd25lclNldHRpbmdzOiB7XG4gICAgICBncm91cE93bmVyOiBcIm1lXCIsXG4gICAgICBncm91cFBlcm1pc3Npb246IFBlcm1pc3Npb24uUkVBRF9PTkxZXG4gICAgfSxcbiAgICBuYW1lOiBcInMzXCIsXG4gICAgczNVcmk6IFwiaHR0cHM6Ly9cIlxuICB9KTtcblxuICBuZXcgR3JvdXAoc3RhY2ssICdhIGdyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgcmVzb3VyY2VzOiBbcl1cbiAgfSlcblxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpSZXNvdXJjZURlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIFJlc291cmNlczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJJZFwiOiBcImEgcmVzb3VyY2VcIixcbiAgICAgICAgICBcIk5hbWVcIjogXCJzM1wiLFxuICAgICAgICAgIFwiUmVzb3VyY2VEYXRhQ29udGFpbmVyXCI6IHtcbiAgICAgICAgICAgIFwiUzNNYWNoaW5lTGVhcm5pbmdNb2RlbFJlc291cmNlRGF0YVwiOiB7XG4gICAgICAgICAgICAgIFwiRGVzdGluYXRpb25QYXRoXCI6IFwiL3RtcFwiLFxuICAgICAgICAgICAgICBcIk93bmVyU2V0dGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgXCJHcm91cE93bmVyXCI6IFwibWVcIixcbiAgICAgICAgICAgICAgICBcIkdyb3VwUGVybWlzc2lvblwiOiBcInJvXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJTM1VyaVwiOiBcImh0dHBzOi8vXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xuXG59KVxuXG50ZXN0KCdzYWdlIG1ha2VyIHJlc291cmNlJywgKCkgPT4ge1xuICBsZXQgciA9IG5ldyBTYWdlTWFrZXJNYWNoaW5lTGVhcm5pbmdNb2RlbFJlc291cmNlKHN0YWNrLCAnYSByZXNvdXJjZScsIHtcbiAgICBkZXN0aW5hdGlvblBhdGg6ICcvdG1wJyxcbiAgICBvd25lclNldHRpbmdzOiB7XG4gICAgICBncm91cE93bmVyOiBcIm1lXCIsXG4gICAgICBncm91cFBlcm1pc3Npb246IFBlcm1pc3Npb24uUkVBRF9PTkxZXG4gICAgfSxcbiAgICBuYW1lOiBcInMzXCIsXG4gICAgc2FnZU1ha2VySm9iQXJuOiBcImFybjo6eHh4XCJcbiAgfSk7XG5cbiAgbmV3IEdyb3VwKHN0YWNrLCAnYSBncm91cCcsIHtcbiAgICBjb3JlOiBjLFxuICAgIHJlc291cmNlczogW3JdXG4gIH0pXG5cbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6UmVzb3VyY2VEZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBSZXNvdXJjZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiSWRcIjogXCJhIHJlc291cmNlXCIsXG4gICAgICAgICAgXCJOYW1lXCI6IFwiYSByZXNvdXJjZVwiLFxuICAgICAgICAgIFwiUmVzb3VyY2VEYXRhQ29udGFpbmVyXCI6IHtcbiAgICAgICAgICAgIFwiU2FnZU1ha2VyTWFjaGluZUxlYXJuaW5nTW9kZWxSZXNvdXJjZURhdGFcIjoge1xuICAgICAgICAgICAgICBcIkRlc3RpbmF0aW9uUGF0aFwiOiBcIi90bXBcIixcbiAgICAgICAgICAgICAgXCJPd25lclNldHRpbmdcIjoge1xuICAgICAgICAgICAgICAgIFwiR3JvdXBPd25lclwiOiBcIm1lXCIsXG4gICAgICAgICAgICAgICAgXCJHcm91cFBlcm1pc3Npb25cIjogXCJyb1wiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiU2FnZU1ha2VySm9iQXJuXCI6IFwiYXJuOjp4eHhcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG5cbn0pXG5cblxuIl19