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
var f;
var alias;
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
    f = new lambda.Function(stack, 'a function', {
        code: lambda.Code.fromInline('print("Hello")'),
        runtime: lambda.Runtime.PYTHON_3_7,
        handler: 'handler'
    });
    let v = new lambda.Version(stack, 'v1', {
        lambda: f
    });
    alias = new lambda.Alias(stack, 'prod', {
        version: v,
        aliasName: 'prod'
    });
});
afterEach(() => {
    //console.log(JSON.stringify(SynthUtils.toCloudFormation(stack), undefined, 2))
});
test('functions all compulsory', () => {
    let gf = new lib_1.Function(stack, 'gg-function', {
        alias: alias,
        function: f,
        memorySize: core_1.Size.mebibytes(128),
        pinned: false,
        timeout: core_1.Duration.seconds(3),
    });
    new lib_1.Group(stack, 'a group', {
        core: c,
        functions: [gf]
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
        InitialVersion: {
            Functions: [
                {
                    "FunctionConfiguration": {
                        "Environment": {
                            "Execution": {},
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
});
test('functions wrong runtime', () => {
    let f1 = new lambda.Function(stack, 'a wrong function', {
        code: lambda.Code.fromInline('print("Hello")'),
        runtime: lambda.Runtime.PYTHON_2_7,
        handler: 'handler'
    });
    let v = new lambda.Version(stack, 'v2', {
        lambda: f1
    });
    let alias = new lambda.Alias(stack, 'prod1', {
        version: v,
        aliasName: 'prod'
    });
    let gf = new lib_1.Function(stack, 'gg-function', {
        alias: alias,
        function: f1,
        memorySize: core_1.Size.mebibytes(128),
        pinned: false,
        timeout: core_1.Duration.seconds(3),
    });
    expect(() => {
        return new lib_1.Group(stack, 'a group', {
            core: c,
            functions: [gf]
        });
    }).toThrow();
});
test('functions using versions', () => {
    let f1 = new lambda.Function(stack, 'a wrong function', {
        code: lambda.Code.fromInline('print("Hello")'),
        runtime: lambda.Runtime.PYTHON_3_7,
        handler: 'handler'
    });
    let v = new lambda.Version(stack, 'v2', {
        lambda: f1
    });
    let gf = new lib_1.Function(stack, 'gg-function', {
        version: v,
        function: f1,
        memorySize: core_1.Size.mebibytes(128),
        pinned: false,
        timeout: core_1.Duration.seconds(3),
    });
    new lib_1.Group(stack, 'a group', {
        core: c,
        functions: [gf]
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
        InitialVersion: {
            Functions: [
                {
                    "FunctionConfiguration": {
                        "Environment": {
                            "Execution": {},
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
});
test('functions default env', () => {
    let gf = new lib_1.Function(stack, 'gg-function', {
        alias: alias,
        function: f,
        memorySize: core_1.Size.mebibytes(128),
        pinned: false,
        timeout: core_1.Duration.seconds(3),
    });
    new lib_1.Group(stack, 'a group', {
        core: c,
        functions: [gf],
        defaultFunctionExecution: {
            isolationMode: lib_1.Functions.IsolationMode.CONTAINER_MODE,
            runAs: {
                gid: 1001,
                uid: 1001
            }
        }
    });
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
                            "Execution": {},
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
});
test('functions all options', () => {
    let gf = new lib_1.Function(stack, 'gg-function', {
        alias: alias,
        function: f,
        memorySize: core_1.Size.mebibytes(128),
        pinned: false,
        timeout: core_1.Duration.seconds(3),
        accessSysFs: true,
        encodingType: lib_1.Functions.EncodingType.BINARY,
        execArgs: "--help",
        executable: "help",
        isolationMode: lib_1.Functions.IsolationMode.NO_CONTAINER_MODE,
        runAs: {
            gid: 501,
            uid: 501
        },
        variables: {
            "TEST": "1"
        },
    });
    new lib_1.Group(stack, 'a group', {
        core: c,
        functions: [gf]
    });
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25zLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmdW5jdGlvbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7O0FBRUgsZ0NBQThCO0FBQzlCLHFDQUFxQztBQUNyQyxnQ0FBMEQ7QUFDMUQsd0NBQXdDO0FBQ3hDLHdDQUErQztBQUMvQywrQ0FBK0M7QUFDL0MsOENBQThDO0FBRzlDLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLENBQWUsQ0FBQztBQUNwQixJQUFJLENBQU8sQ0FBQztBQUNaLElBQUksQ0FBa0IsQ0FBQztBQUN2QixJQUFJLEtBQW1CLENBQUM7QUFFeEIsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQ3JDLFNBQVMsRUFBRSxXQUFXO0tBQ3ZCLENBQUMsQ0FBQTtJQUNGLENBQUMsR0FBRyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQzVCLGNBQWMsRUFBRSxLQUFLO1FBQ3JCLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLEtBQUssRUFBRSxDQUFDO0tBQ1QsQ0FBQyxDQUFDO0lBRUgsQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1FBQzNDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUM5QyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1FBQ2xDLE9BQU8sRUFBRSxTQUFTO0tBQ25CLENBQUMsQ0FBQTtJQUNGLElBQUksQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO1FBQ3RDLE1BQU0sRUFB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RSxHQUFHO29DQUNWLEtBQUssRUFBRSxHQUFHO2lDQUNYOzZCQUNGOzRCQUNELFdBQVcsRUFBRTtnQ0FDWCxNQUFNLEVBQUUsR0FBRzs2QkFDWjt5QkFDRjt3QkFDRCxVQUFVLEVBQUUsUUFBUTt3QkFDcEIsWUFBWSxFQUFFLE1BQU07d0JBQ3BCLFlBQVksRUFBRSxNQUFNO3dCQUNwQixRQUFRLEVBQUUsS0FBSzt3QkFDZixTQUFTLEVBQUUsQ0FBQztxQkFDYjtvQkFDRCxJQUFJLEVBQUUsYUFBYTtpQkFDcEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICdAYXdzLWNkay9hc3NlcnQvamVzdCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb3JlLCBHcm91cCwgRnVuY3Rpb24sIEZ1bmN0aW9ucyB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgKiBhcyBpb3QgZnJvbSAnQGF3cy1jZGsvYXdzLWlvdCc7XG5pbXBvcnQgeyBTaXplLCBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuLy9pbXBvcnQgeyBTeW50aFV0aWxzIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0JztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcblxuXG52YXIgc3RhY2s6IGNkay5TdGFjaztcbnZhciB0OiBpb3QuQ2ZuVGhpbmc7XG52YXIgYzogQ29yZTtcbnZhciBmOiBsYW1iZGEuRnVuY3Rpb247XG52YXIgYWxpYXM6IGxhbWJkYS5BbGlhcztcblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHN0YWNrID0gbmV3IGNkay5TdGFjaztcbiAgdCA9IG5ldyBpb3QuQ2ZuVGhpbmcoc3RhY2ssICdhX3RoaW5nJywge1xuICAgIHRoaW5nTmFtZTogJ3Rlc3RUaGluZydcbiAgfSlcbiAgYyA9IG5ldyBDb3JlKHN0YWNrLCAnTXlDb3JlJywge1xuICAgIGNlcnRpZmljYXRlQXJuOiAnQUFBJyxcbiAgICBzeW5jU2hhZG93OiB0cnVlLFxuICAgIHRoaW5nOiB0XG4gIH0pO1xuXG4gIGYgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnYSBmdW5jdGlvbicsIHtcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdwcmludChcIkhlbGxvXCIpJyksXG4gICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfNyxcbiAgICBoYW5kbGVyOiAnaGFuZGxlcidcbiAgfSlcbiAgbGV0IHYgPSBuZXcgbGFtYmRhLlZlcnNpb24oc3RhY2ssICd2MScsIHtcbiAgICBsYW1iZGE6IGZcbiAgfSlcbiAgYWxpYXMgPSBuZXcgbGFtYmRhLkFsaWFzKHN0YWNrLCAncHJvZCcsIHtcbiAgICB2ZXJzaW9uOiB2LFxuICAgIGFsaWFzTmFtZTogJ3Byb2QnXG4gIH0pXG59KVxuXG5hZnRlckVhY2goKCkgPT4ge1xuICAvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KFN5bnRoVXRpbHMudG9DbG91ZEZvcm1hdGlvbihzdGFjayksIHVuZGVmaW5lZCwgMikpXG59KTtcblxudGVzdCgnZnVuY3Rpb25zIGFsbCBjb21wdWxzb3J5JywgKCkgPT4ge1xuXG4gIGxldCBnZiA9IG5ldyBGdW5jdGlvbihzdGFjaywgJ2dnLWZ1bmN0aW9uJywge1xuICAgIGFsaWFzOiBhbGlhcyxcbiAgICBmdW5jdGlvbjogZixcbiAgICBtZW1vcnlTaXplOiBTaXplLm1lYmlieXRlcygxMjgpLFxuICAgIHBpbm5lZDogZmFsc2UsXG4gICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygzKSxcbiAgfSlcblxuICBuZXcgR3JvdXAoc3RhY2ssICdhIGdyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgZnVuY3Rpb25zOiBbZ2ZdXG4gIH0pXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OkZ1bmN0aW9uRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgRnVuY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIkZ1bmN0aW9uQ29uZmlndXJhdGlvblwiOiB7XG5cbiAgICAgICAgICAgIFwiRW52aXJvbm1lbnRcIjoge1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgXCJFeGVjdXRpb25cIjoge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXCJNZW1vcnlTaXplXCI6IDEzMTA3MixcbiAgICAgICAgICAgIFwiUGlubmVkXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJUaW1lb3V0XCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiSWRcIjogXCJnZy1mdW5jdGlvblwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSlcblxuXG50ZXN0KCdmdW5jdGlvbnMgd3JvbmcgcnVudGltZScsICgpID0+IHtcblxuICBsZXQgZjEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnYSB3cm9uZyBmdW5jdGlvbicsIHtcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdwcmludChcIkhlbGxvXCIpJyksXG4gICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzJfNyxcbiAgICBoYW5kbGVyOiAnaGFuZGxlcidcbiAgfSlcbiAgbGV0IHYgPSBuZXcgbGFtYmRhLlZlcnNpb24oc3RhY2ssICd2MicsIHtcbiAgICBsYW1iZGE6IGYxXG4gIH0pXG4gIGxldCBhbGlhcyA9IG5ldyBsYW1iZGEuQWxpYXMoc3RhY2ssICdwcm9kMScsIHtcbiAgICB2ZXJzaW9uOiB2LFxuICAgIGFsaWFzTmFtZTogJ3Byb2QnXG4gIH0pXG4gIGxldCBnZiA9IG5ldyBGdW5jdGlvbihzdGFjaywgJ2dnLWZ1bmN0aW9uJywge1xuICAgIGFsaWFzOiBhbGlhcyxcbiAgICBmdW5jdGlvbjogZjEsXG4gICAgbWVtb3J5U2l6ZTogU2l6ZS5tZWJpYnl0ZXMoMTI4KSxcbiAgICBwaW5uZWQ6IGZhbHNlLFxuICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMyksXG4gIH0pXG5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICByZXR1cm4gbmV3IEdyb3VwKHN0YWNrLCAnYSBncm91cCcsIHtcbiAgICAgIGNvcmU6IGMsXG4gICAgICBmdW5jdGlvbnM6IFtnZl1cbiAgICB9KVxuICB9KS50b1Rocm93KClcbn0pXG5cbnRlc3QoJ2Z1bmN0aW9ucyB1c2luZyB2ZXJzaW9ucycsICgpID0+IHtcblxuICBsZXQgZjEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnYSB3cm9uZyBmdW5jdGlvbicsIHtcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdwcmludChcIkhlbGxvXCIpJyksXG4gICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfNyxcbiAgICBoYW5kbGVyOiAnaGFuZGxlcidcbiAgfSlcbiAgbGV0IHYgPSBuZXcgbGFtYmRhLlZlcnNpb24oc3RhY2ssICd2MicsIHtcbiAgICBsYW1iZGE6IGYxXG4gIH0pXG4gIFxuICBsZXQgZ2YgPSBuZXcgRnVuY3Rpb24oc3RhY2ssICdnZy1mdW5jdGlvbicsIHtcbiAgICB2ZXJzaW9uOiB2LFxuICAgIGZ1bmN0aW9uOiBmMSxcbiAgICBtZW1vcnlTaXplOiBTaXplLm1lYmlieXRlcygxMjgpLFxuICAgIHBpbm5lZDogZmFsc2UsXG4gICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygzKSxcbiAgfSlcblxuICBuZXcgR3JvdXAoc3RhY2ssICdhIGdyb3VwJywge1xuICAgICAgY29yZTogYyxcbiAgICAgIGZ1bmN0aW9uczogW2dmXVxuICAgIH0pXG4gIFxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpGdW5jdGlvbkRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIEZ1bmN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJGdW5jdGlvbkNvbmZpZ3VyYXRpb25cIjoge1xuXG4gICAgICAgICAgICBcIkVudmlyb25tZW50XCI6IHtcblxuICAgICAgICAgICAgICBcIkV4ZWN1dGlvblwiOiB7XG5cbiAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgXCJNZW1vcnlTaXplXCI6IDEzMTA3MixcbiAgICAgICAgICAgIFwiUGlubmVkXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJUaW1lb3V0XCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiSWRcIjogXCJnZy1mdW5jdGlvblwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSlcblxudGVzdCgnZnVuY3Rpb25zIGRlZmF1bHQgZW52JywgKCkgPT4ge1xuXG4gIGxldCBnZiA9IG5ldyBGdW5jdGlvbihzdGFjaywgJ2dnLWZ1bmN0aW9uJywge1xuICAgIGFsaWFzOiBhbGlhcyxcbiAgICBmdW5jdGlvbjogZixcbiAgICBtZW1vcnlTaXplOiBTaXplLm1lYmlieXRlcygxMjgpLFxuICAgIHBpbm5lZDogZmFsc2UsXG4gICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygzKSxcbiAgfSlcblxuICBuZXcgR3JvdXAoc3RhY2ssICdhIGdyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgZnVuY3Rpb25zOiBbZ2ZdLFxuICAgIGRlZmF1bHRGdW5jdGlvbkV4ZWN1dGlvbjoge1xuICAgICAgaXNvbGF0aW9uTW9kZTogRnVuY3Rpb25zLklzb2xhdGlvbk1vZGUuQ09OVEFJTkVSX01PREUsXG4gICAgICBydW5Bczoge1xuICAgICAgICBnaWQ6IDEwMDEsXG4gICAgICAgIHVpZDogMTAwMVxuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6RnVuY3Rpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBcIkRlZmF1bHRDb25maWdcIjoge1xuICAgICAgICBcIkV4ZWN1dGlvblwiOiB7XG4gICAgICAgICAgXCJJc29sYXRpb25Nb2RlXCI6IFwiR3JlZW5ncmFzc0NvbnRhaW5lclwiLFxuICAgICAgICAgIFwiUnVuQXNcIjoge1xuICAgICAgICAgICAgXCJHaWRcIjogMTAwMSxcbiAgICAgICAgICAgIFwiVWlkXCI6IDEwMDFcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBGdW5jdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiRnVuY3Rpb25Db25maWd1cmF0aW9uXCI6IHtcblxuICAgICAgICAgICAgXCJFbnZpcm9ubWVudFwiOiB7XG5cbiAgICAgICAgICAgICAgXCJFeGVjdXRpb25cIjoge1xuXG4gICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIFwiTWVtb3J5U2l6ZVwiOiAxMzEwNzIsXG4gICAgICAgICAgICBcIlBpbm5lZFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwiZ2ctZnVuY3Rpb25cIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcbn0pXG5cblxudGVzdCgnZnVuY3Rpb25zIGFsbCBvcHRpb25zJywgKCkgPT4ge1xuXG4gIGxldCBnZiA9IG5ldyBGdW5jdGlvbihzdGFjaywgJ2dnLWZ1bmN0aW9uJywge1xuICAgIGFsaWFzOiBhbGlhcyxcbiAgICBmdW5jdGlvbjogZixcbiAgICBtZW1vcnlTaXplOiBTaXplLm1lYmlieXRlcygxMjgpLFxuICAgIHBpbm5lZDogZmFsc2UsXG4gICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygzKSxcbiAgICBhY2Nlc3NTeXNGczogdHJ1ZSxcbiAgICBlbmNvZGluZ1R5cGU6IEZ1bmN0aW9ucy5FbmNvZGluZ1R5cGUuQklOQVJZLFxuICAgIGV4ZWNBcmdzOiBcIi0taGVscFwiLFxuICAgIGV4ZWN1dGFibGU6IFwiaGVscFwiLFxuICAgIGlzb2xhdGlvbk1vZGU6IEZ1bmN0aW9ucy5Jc29sYXRpb25Nb2RlLk5PX0NPTlRBSU5FUl9NT0RFLFxuICAgIHJ1bkFzOiB7XG4gICAgICBnaWQ6IDUwMSxcbiAgICAgIHVpZDogNTAxXG4gICAgfSxcbiAgICB2YXJpYWJsZXM6IHtcbiAgICAgIFwiVEVTVFwiOiBcIjFcIlxuICAgIH0sXG4gIH0pXG5cbiAgbmV3IEdyb3VwKHN0YWNrLCAnYSBncm91cCcsIHtcbiAgICBjb3JlOiBjLFxuICAgIGZ1bmN0aW9uczogW2dmXVxuICB9KVxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpGdW5jdGlvbkRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIEZ1bmN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJGdW5jdGlvbkNvbmZpZ3VyYXRpb25cIjoge1xuICAgICAgICAgICAgXCJFbmNvZGluZ1R5cGVcIjogXCJiaW5hcnlcIixcbiAgICAgICAgICAgIFwiRW52aXJvbm1lbnRcIjoge1xuICAgICAgICAgICAgICBcIkFjY2Vzc1N5c2ZzXCI6IHRydWUsXG4gICAgICAgICAgICAgIFwiRXhlY3V0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICBcIklzb2xhdGlvbk1vZGVcIjogXCJOb0NvbnRhaW5lclwiLFxuICAgICAgICAgICAgICAgIFwiUnVuQXNcIjoge1xuICAgICAgICAgICAgICAgICAgXCJHaWRcIjogNTAxLFxuICAgICAgICAgICAgICAgICAgXCJVaWRcIjogNTAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIlZhcmlhYmxlc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJURVNUXCI6IFwiMVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIkV4ZWNBcmdzXCI6IFwiLS1oZWxwXCIsXG4gICAgICAgICAgICBcIkV4ZWN1dGFibGVcIjogXCJoZWxwXCIsXG4gICAgICAgICAgICBcIk1lbW9yeVNpemVcIjogMTMxMDcyLFxuICAgICAgICAgICAgXCJQaW5uZWRcIjogZmFsc2UsXG4gICAgICAgICAgICBcIlRpbWVvdXRcIjogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJJZFwiOiBcImdnLWZ1bmN0aW9uXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG5cbn0pIl19