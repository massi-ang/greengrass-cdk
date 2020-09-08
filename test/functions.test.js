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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25zLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmdW5jdGlvbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7O0FBRUgsZ0NBQThCO0FBQzlCLHFDQUFxQztBQUNyQyxnQ0FBMEQ7QUFDMUQsd0NBQXdDO0FBQ3hDLHdDQUErQztBQUMvQywrQ0FBK0M7QUFDL0MsOENBQThDO0FBRzlDLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLENBQWUsQ0FBQztBQUNwQixJQUFJLENBQU8sQ0FBQztBQUNaLElBQUksQ0FBa0IsQ0FBQztBQUN2QixJQUFJLEtBQW1CLENBQUM7QUFFeEIsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQ3JDLFNBQVMsRUFBRSxXQUFXO0tBQ3ZCLENBQUMsQ0FBQTtJQUNGLENBQUMsR0FBRyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQzVCLGNBQWMsRUFBRSxLQUFLO1FBQ3JCLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLEtBQUssRUFBRSxDQUFDO0tBQ1QsQ0FBQyxDQUFDO0lBRUgsQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1FBQzNDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUM5QyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1FBQ2xDLE9BQU8sRUFBRSxTQUFTO0tBQ25CLENBQUMsQ0FBQTtJQUNGLElBQUksQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO1FBQ3RDLE1BQU0sRUFBRSxDQUFDO0tBQ1YsQ0FBQyxDQUFBO0lBQ0YsS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1FBQ3RDLE9BQU8sRUFBRSxDQUFDO1FBQ1YsU0FBUyxFQUFFLE1BQU07S0FDbEIsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixTQUFTLENBQUMsR0FBRyxFQUFFO0lBQ2IsK0VBQStFO0FBQ2pGLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtJQUVwQyxJQUFJLEVBQUUsR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1FBQzFDLEtBQUssRUFBRSxLQUFLO1FBQ1osUUFBUSxFQUFFLENBQUM7UUFDWCxVQUFVLEVBQUUsV0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7UUFDL0IsTUFBTSxFQUFFLEtBQUs7UUFDYixPQUFPLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDN0IsQ0FBQyxDQUFBO0lBRUYsSUFBSSxXQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUMxQixJQUFJLEVBQUUsQ0FBQztRQUNQLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQztLQUNoQixDQUFDLENBQUE7SUFDRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMscUNBQXFDLEVBQUU7UUFDdEUsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLHVCQUF1QixFQUFFO3dCQUV2QixhQUFhLEVBQUU7NEJBRWIsV0FBVyxFQUFFLEVBRVo7eUJBRUY7d0JBRUQsWUFBWSxFQUFFLE1BQU07d0JBQ3BCLFFBQVEsRUFBRSxLQUFLO3dCQUNmLFNBQVMsRUFBRSxDQUFDO3FCQUNiO29CQUNELElBQUksRUFBRSxhQUFhO2lCQUNwQjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQTtBQUlGLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7SUFFakMsSUFBSSxFQUFFLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtRQUMxQyxLQUFLLEVBQUUsS0FBSztRQUNaLFFBQVEsRUFBRSxDQUFDO1FBQ1gsVUFBVSxFQUFFLFdBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQy9CLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQzdCLENBQUMsQ0FBQTtJQUVGLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDMUIsSUFBSSxFQUFFLENBQUM7UUFDUCxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDZix3QkFBd0IsRUFBRTtZQUN4QixhQUFhLEVBQUUsZUFBUyxDQUFDLGFBQWEsQ0FBQyxjQUFjO1lBQ3JELEtBQUssRUFBRTtnQkFDTCxHQUFHLEVBQUUsSUFBSTtnQkFDVCxHQUFHLEVBQUUsSUFBSTthQUNWO1NBQ0Y7S0FDRixDQUFDLENBQUE7SUFDRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMscUNBQXFDLEVBQUU7UUFDdEUsY0FBYyxFQUFFO1lBQ2QsZUFBZSxFQUFFO2dCQUNmLFdBQVcsRUFBRTtvQkFDWCxlQUFlLEVBQUUscUJBQXFCO29CQUN0QyxPQUFPLEVBQUU7d0JBQ1AsS0FBSyxFQUFFLElBQUk7d0JBQ1gsS0FBSyxFQUFFLElBQUk7cUJBQ1o7aUJBQ0Y7YUFDRjtZQUNELFNBQVMsRUFBRTtnQkFDVDtvQkFDRSx1QkFBdUIsRUFBRTt3QkFFdkIsYUFBYSxFQUFFOzRCQUViLFdBQVcsRUFBRSxFQUVaO3lCQUVGO3dCQUVELFlBQVksRUFBRSxNQUFNO3dCQUNwQixRQUFRLEVBQUUsS0FBSzt3QkFDZixTQUFTLEVBQUUsQ0FBQztxQkFDYjtvQkFDRCxJQUFJLEVBQUUsYUFBYTtpQkFDcEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUE7QUFHRixJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO0lBRWpDLElBQUksRUFBRSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7UUFDMUMsS0FBSyxFQUFFLEtBQUs7UUFDWixRQUFRLEVBQUUsQ0FBQztRQUNYLFVBQVUsRUFBRSxXQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztRQUMvQixNQUFNLEVBQUUsS0FBSztRQUNiLE9BQU8sRUFBRSxlQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUM1QixXQUFXLEVBQUUsSUFBSTtRQUNqQixZQUFZLEVBQUUsZUFBUyxDQUFDLFlBQVksQ0FBQyxNQUFNO1FBQzNDLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFVBQVUsRUFBRSxNQUFNO1FBQ2xCLGFBQWEsRUFBRSxlQUFTLENBQUMsYUFBYSxDQUFDLGlCQUFpQjtRQUN4RCxLQUFLLEVBQUU7WUFDTCxHQUFHLEVBQUUsR0FBRztZQUNSLEdBQUcsRUFBRSxHQUFHO1NBQ1Q7UUFDRCxTQUFTLEVBQUU7WUFDVCxNQUFNLEVBQUUsR0FBRztTQUNaO0tBQ0YsQ0FBQyxDQUFBO0lBRUYsSUFBSSxXQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUMxQixJQUFJLEVBQUUsQ0FBQztRQUNQLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQztLQUNoQixDQUFDLENBQUE7SUFDRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMscUNBQXFDLEVBQUU7UUFDdEUsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLHVCQUF1QixFQUFFO3dCQUN2QixjQUFjLEVBQUUsUUFBUTt3QkFDeEIsYUFBYSxFQUFFOzRCQUNiLGFBQWEsRUFBRSxJQUFJOzRCQUNuQixXQUFXLEVBQUU7Z0NBQ1gsZUFBZSxFQUFFLGFBQWE7Z0NBQzlCLE9BQU8sRUFBRTtvQ0FDUCxLQUFLLEVBQUUsR0FBRztvQ0FDVixLQUFLLEVBQUUsR0FBRztpQ0FDWDs2QkFDRjs0QkFDRCxXQUFXLEVBQUU7Z0NBQ1gsTUFBTSxFQUFFLEdBQUc7NkJBQ1o7eUJBQ0Y7d0JBQ0QsVUFBVSxFQUFFLFFBQVE7d0JBQ3BCLFlBQVksRUFBRSxNQUFNO3dCQUNwQixZQUFZLEVBQUUsTUFBTTt3QkFDcEIsUUFBUSxFQUFFLEtBQUs7d0JBQ2YsU0FBUyxFQUFFLENBQUM7cUJBQ2I7b0JBQ0QsSUFBSSxFQUFFLGFBQWE7aUJBQ3BCO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAnQGF3cy1jZGsvYXNzZXJ0L2plc3QnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29yZSwgR3JvdXAsIEZ1bmN0aW9uLCBGdW5jdGlvbnMgfSBmcm9tICcuLi9saWInO1xuaW1wb3J0ICogYXMgaW90IGZyb20gJ0Bhd3MtY2RrL2F3cy1pb3QnO1xuaW1wb3J0IHsgU2l6ZSwgRHVyYXRpb24gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbi8vaW1wb3J0IHsgU3ludGhVdGlscyB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydCc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5cblxudmFyIHN0YWNrOiBjZGsuU3RhY2s7XG52YXIgdDogaW90LkNmblRoaW5nO1xudmFyIGM6IENvcmU7XG52YXIgZjogbGFtYmRhLkZ1bmN0aW9uO1xudmFyIGFsaWFzOiBsYW1iZGEuQWxpYXM7XG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBjZGsuU3RhY2s7XG4gIHQgPSBuZXcgaW90LkNmblRoaW5nKHN0YWNrLCAnYV90aGluZycsIHtcbiAgICB0aGluZ05hbWU6ICd0ZXN0VGhpbmcnXG4gIH0pXG4gIGMgPSBuZXcgQ29yZShzdGFjaywgJ015Q29yZScsIHtcbiAgICBjZXJ0aWZpY2F0ZUFybjogJ0FBQScsXG4gICAgc3luY1NoYWRvdzogdHJ1ZSxcbiAgICB0aGluZzogdFxuICB9KTtcblxuICBmID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ2EgZnVuY3Rpb24nLCB7XG4gICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgncHJpbnQoXCJIZWxsb1wiKScpLFxuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzcsXG4gICAgaGFuZGxlcjogJ2hhbmRsZXInXG4gIH0pXG4gIGxldCB2ID0gbmV3IGxhbWJkYS5WZXJzaW9uKHN0YWNrLCAndjEnLCB7XG4gICAgbGFtYmRhOiBmXG4gIH0pXG4gIGFsaWFzID0gbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ3Byb2QnLCB7XG4gICAgdmVyc2lvbjogdixcbiAgICBhbGlhc05hbWU6ICdwcm9kJ1xuICB9KVxufSlcblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShTeW50aFV0aWxzLnRvQ2xvdWRGb3JtYXRpb24oc3RhY2spLCB1bmRlZmluZWQsIDIpKVxufSk7XG5cbnRlc3QoJ2Z1bmN0aW9ucyBhbGwgY29tcHVsc29yeScsICgpID0+IHtcblxuICBsZXQgZ2YgPSBuZXcgRnVuY3Rpb24oc3RhY2ssICdnZy1mdW5jdGlvbicsIHtcbiAgICBhbGlhczogYWxpYXMsXG4gICAgZnVuY3Rpb246IGYsXG4gICAgbWVtb3J5U2l6ZTogU2l6ZS5tZWJpYnl0ZXMoMTI4KSxcbiAgICBwaW5uZWQ6IGZhbHNlLFxuICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMyksXG4gIH0pXG5cbiAgbmV3IEdyb3VwKHN0YWNrLCAnYSBncm91cCcsIHtcbiAgICBjb3JlOiBjLFxuICAgIGZ1bmN0aW9uczogW2dmXVxuICB9KVxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpGdW5jdGlvbkRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIEZ1bmN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJGdW5jdGlvbkNvbmZpZ3VyYXRpb25cIjoge1xuXG4gICAgICAgICAgICBcIkVudmlyb25tZW50XCI6IHtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIFwiRXhlY3V0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFwiTWVtb3J5U2l6ZVwiOiAxMzEwNzIsXG4gICAgICAgICAgICBcIlBpbm5lZFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwiZ2ctZnVuY3Rpb25cIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcbn0pXG5cblxuXG50ZXN0KCdmdW5jdGlvbnMgZGVmYXVsdCBlbnYnLCAoKSA9PiB7XG5cbiAgbGV0IGdmID0gbmV3IEZ1bmN0aW9uKHN0YWNrLCAnZ2ctZnVuY3Rpb24nLCB7XG4gICAgYWxpYXM6IGFsaWFzLFxuICAgIGZ1bmN0aW9uOiBmLFxuICAgIG1lbW9yeVNpemU6IFNpemUubWViaWJ5dGVzKDEyOCksXG4gICAgcGlubmVkOiBmYWxzZSxcbiAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMpLFxuICB9KVxuXG4gIG5ldyBHcm91cChzdGFjaywgJ2EgZ3JvdXAnLCB7XG4gICAgY29yZTogYyxcbiAgICBmdW5jdGlvbnM6IFtnZl0sXG4gICAgZGVmYXVsdEZ1bmN0aW9uRXhlY3V0aW9uOiB7XG4gICAgICBpc29sYXRpb25Nb2RlOiBGdW5jdGlvbnMuSXNvbGF0aW9uTW9kZS5DT05UQUlORVJfTU9ERSxcbiAgICAgIHJ1bkFzOiB7XG4gICAgICAgIGdpZDogMTAwMSxcbiAgICAgICAgdWlkOiAxMDAxXG4gICAgICB9XG4gICAgfVxuICB9KVxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpGdW5jdGlvbkRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIFwiRGVmYXVsdENvbmZpZ1wiOiB7XG4gICAgICAgIFwiRXhlY3V0aW9uXCI6IHtcbiAgICAgICAgICBcIklzb2xhdGlvbk1vZGVcIjogXCJHcmVlbmdyYXNzQ29udGFpbmVyXCIsXG4gICAgICAgICAgXCJSdW5Bc1wiOiB7XG4gICAgICAgICAgICBcIkdpZFwiOiAxMDAxLFxuICAgICAgICAgICAgXCJVaWRcIjogMTAwMVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIEZ1bmN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJGdW5jdGlvbkNvbmZpZ3VyYXRpb25cIjoge1xuXG4gICAgICAgICAgICBcIkVudmlyb25tZW50XCI6IHtcblxuICAgICAgICAgICAgICBcIkV4ZWN1dGlvblwiOiB7XG5cbiAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgXCJNZW1vcnlTaXplXCI6IDEzMTA3MixcbiAgICAgICAgICAgIFwiUGlubmVkXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJUaW1lb3V0XCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiSWRcIjogXCJnZy1mdW5jdGlvblwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSlcblxuXG50ZXN0KCdmdW5jdGlvbnMgYWxsIG9wdGlvbnMnLCAoKSA9PiB7XG5cbiAgbGV0IGdmID0gbmV3IEZ1bmN0aW9uKHN0YWNrLCAnZ2ctZnVuY3Rpb24nLCB7XG4gICAgYWxpYXM6IGFsaWFzLFxuICAgIGZ1bmN0aW9uOiBmLFxuICAgIG1lbW9yeVNpemU6IFNpemUubWViaWJ5dGVzKDEyOCksXG4gICAgcGlubmVkOiBmYWxzZSxcbiAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMpLFxuICAgIGFjY2Vzc1N5c0ZzOiB0cnVlLFxuICAgIGVuY29kaW5nVHlwZTogRnVuY3Rpb25zLkVuY29kaW5nVHlwZS5CSU5BUlksXG4gICAgZXhlY0FyZ3M6IFwiLS1oZWxwXCIsXG4gICAgZXhlY3V0YWJsZTogXCJoZWxwXCIsXG4gICAgaXNvbGF0aW9uTW9kZTogRnVuY3Rpb25zLklzb2xhdGlvbk1vZGUuTk9fQ09OVEFJTkVSX01PREUsXG4gICAgcnVuQXM6IHtcbiAgICAgIGdpZDogNTAxLFxuICAgICAgdWlkOiA1MDFcbiAgICB9LFxuICAgIHZhcmlhYmxlczoge1xuICAgICAgXCJURVNUXCI6IFwiMVwiXG4gICAgfSxcbiAgfSlcblxuICBuZXcgR3JvdXAoc3RhY2ssICdhIGdyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgZnVuY3Rpb25zOiBbZ2ZdXG4gIH0pXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OkZ1bmN0aW9uRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgRnVuY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIkZ1bmN0aW9uQ29uZmlndXJhdGlvblwiOiB7XG4gICAgICAgICAgICBcIkVuY29kaW5nVHlwZVwiOiBcImJpbmFyeVwiLFxuICAgICAgICAgICAgXCJFbnZpcm9ubWVudFwiOiB7XG4gICAgICAgICAgICAgIFwiQWNjZXNzU3lzZnNcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgXCJFeGVjdXRpb25cIjoge1xuICAgICAgICAgICAgICAgIFwiSXNvbGF0aW9uTW9kZVwiOiBcIk5vQ29udGFpbmVyXCIsXG4gICAgICAgICAgICAgICAgXCJSdW5Bc1wiOiB7XG4gICAgICAgICAgICAgICAgICBcIkdpZFwiOiA1MDEsXG4gICAgICAgICAgICAgICAgICBcIlVpZFwiOiA1MDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiVmFyaWFibGVzXCI6IHtcbiAgICAgICAgICAgICAgICBcIlRFU1RcIjogXCIxXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiRXhlY0FyZ3NcIjogXCItLWhlbHBcIixcbiAgICAgICAgICAgIFwiRXhlY3V0YWJsZVwiOiBcImhlbHBcIixcbiAgICAgICAgICAgIFwiTWVtb3J5U2l6ZVwiOiAxMzEwNzIsXG4gICAgICAgICAgICBcIlBpbm5lZFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwiZ2ctZnVuY3Rpb25cIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcblxufSkiXX0=