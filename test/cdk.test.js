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
const assert_1 = require("@aws-cdk/assert");
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
    console.log(JSON.stringify(assert_1.SynthUtils.toCloudFormation(stack), undefined, 2));
});
test('Empty Stack', () => {
    new lib_1.Group(stack, 'group', {
        core: c
    });
    // THEN
    expect(stack).toHaveResourceLike('AWS::Greengrass::CoreDefinition', {
        InitialVersion: {
            Cores: [
                {
                    CertificateArn: 'AAA',
                    SyncShadow: true
                }
            ]
        }
    });
});
test('Subscriptions cloud and localshadow destinations', () => {
    let s = new lib_1.Subscriptions(stack, 'subs');
    s.add(new lib_1.CloudDestination(), '#', new lib_1.LocalShadowDestination());
    new lib_1.Group(stack, 'group', {
        core: c,
        subscriptions: s
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::SubscriptionDefinition', {
        InitialVersion: {
            Subscriptions: [
                {
                    "Id": "cloud.#.GGShadowService",
                    "Source": "cloud",
                    "Subject": "#",
                    "Target": "GGShadowService"
                }
            ]
        }
    });
});
test('functions', () => {
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGsudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7O0FBRUgsZ0NBQThCO0FBQzlCLHFDQUFxQztBQUNyQyxnQ0FBd0c7QUFDeEcsd0NBQXdDO0FBQ3hDLHdDQUErQztBQUMvQyw0Q0FBNkM7QUFDN0MsOENBQThDO0FBRzlDLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLENBQWUsQ0FBQztBQUNwQixJQUFJLENBQU8sQ0FBQztBQUVaLFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUNyQyxTQUFTLEVBQUUsV0FBVztLQUN2QixDQUFDLENBQUE7SUFDRixDQUFDLEdBQUcsSUFBSSxVQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUM1QixjQUFjLEVBQUUsS0FBSztRQUNyQixVQUFVLEVBQUUsSUFBSTtRQUNoQixLQUFLLEVBQUUsQ0FBQztLQUNULENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFBO0FBRUYsU0FBUyxDQUFDLEdBQUcsRUFBRTtJQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBVSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFDdkIsSUFBSSxXQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUN4QixJQUFJLEVBQUUsQ0FBQztLQUNSLENBQUMsQ0FBQTtJQUNGLE9BQU87SUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMs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U0FDRjtLQUNGLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAnQGF3cy1jZGsvYXNzZXJ0L2plc3QnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29yZSwgR3JvdXAsIFN1YnNjcmlwdGlvbnMsIENsb3VkRGVzdGluYXRpb24sIExvY2FsU2hhZG93RGVzdGluYXRpb24sIEZ1bmN0aW9uIH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCAqIGFzIGlvdCBmcm9tICdAYXdzLWNkay9hd3MtaW90JztcbmltcG9ydCB7IFNpemUsIER1cmF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBTeW50aFV0aWxzIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0JztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcblxuXG52YXIgc3RhY2s6IGNkay5TdGFjaztcbnZhciB0OiBpb3QuQ2ZuVGhpbmc7XG52YXIgYzogQ29yZTtcblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHN0YWNrID0gbmV3IGNkay5TdGFjaztcbiAgdCA9IG5ldyBpb3QuQ2ZuVGhpbmcoc3RhY2ssICdhX3RoaW5nJywge1xuICAgIHRoaW5nTmFtZTogJ3Rlc3RUaGluZydcbiAgfSlcbiAgYyA9IG5ldyBDb3JlKHN0YWNrLCAnTXlDb3JlJywge1xuICAgIGNlcnRpZmljYXRlQXJuOiAnQUFBJyxcbiAgICBzeW5jU2hhZG93OiB0cnVlLFxuICAgIHRoaW5nOiB0XG4gIH0pO1xufSlcblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoU3ludGhVdGlscy50b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSwgdW5kZWZpbmVkLCAyKSlcbn0pO1xuXG50ZXN0KCdFbXB0eSBTdGFjaycsICgpID0+IHtcbiAgbmV3IEdyb3VwKHN0YWNrLCAnZ3JvdXAnLCB7XG4gICAgY29yZTogY1xuICB9KVxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OkNvcmVEZWZpbml0aW9uJywge1xuXG4gICAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgICBDb3JlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENlcnRpZmljYXRlQXJuOiAnQUFBJyxcbiAgICAgICAgICAgIFN5bmNTaGFkb3c6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgfSk7XG59KTtcblxudGVzdCgnU3Vic2NyaXB0aW9ucyBjbG91ZCBhbmQgbG9jYWxzaGFkb3cgZGVzdGluYXRpb25zJywgKCkgPT4ge1xuICBsZXQgcyA9IG5ldyBTdWJzY3JpcHRpb25zKHN0YWNrLCAnc3VicycpO1xuICBzLmFkZChuZXcgQ2xvdWREZXN0aW5hdGlvbigpLCAnIycsIG5ldyBMb2NhbFNoYWRvd0Rlc3RpbmF0aW9uKCkpXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgc3Vic2NyaXB0aW9uczogc1xuICB9KVxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpTdWJzY3JpcHRpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBTdWJzY3JpcHRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIklkXCI6IFwiY2xvdWQuIy5HR1NoYWRvd1NlcnZpY2VcIixcbiAgICAgICAgICBcIlNvdXJjZVwiOiBcImNsb3VkXCIsXG4gICAgICAgICAgXCJTdWJqZWN0XCI6IFwiI1wiLFxuICAgICAgICAgIFwiVGFyZ2V0XCI6IFwiR0dTaGFkb3dTZXJ2aWNlXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG59KVxuXG5cblxudGVzdCgnZnVuY3Rpb25zJywgKCkgPT4ge1xuICBsZXQgZiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdhIGZ1bmN0aW9uJywge1xuICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ3ByaW50KFwiSGVsbG9cIiknKSxcbiAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM183LFxuICAgIGhhbmRsZXI6ICdoYW5kbGVyJ1xuICB9KVxuICBsZXQgdiA9IG5ldyBsYW1iZGEuVmVyc2lvbihzdGFjaywgJ3YxJywge1xuICAgIGxhbWJkYTogZlxuICB9KVxuICBsZXQgYWxpYXMgPSBuZXcgbGFtYmRhLkFsaWFzKHN0YWNrLCAncHJvZCcsIHtcbiAgICB2ZXJzaW9uOiB2LFxuICAgIGFsaWFzTmFtZTogJ3Byb2QnXG4gIH0pXG5cbiAgbGV0IGdmID0gbmV3IEZ1bmN0aW9uKHN0YWNrLCAnZ2ctZnVuY3Rpb24nLCB7XG4gICAgYWxpYXM6IGFsaWFzLCBcbiAgICBmdW5jdGlvbjogZixcbiAgICBtZW1vcnlTaXplOiBTaXplLm1lYmlieXRlcygxMjgpLFxuICAgIHBpbm5lZDogZmFsc2UsXG4gICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygzKSxcbiAgICB2YXJpYWJsZXM6IHtcbiAgICAgIFwiVEVTVFwiOiBcIjFcIlxuICAgIH1cbiAgfSlcblxuICBuZXcgR3JvdXAoc3RhY2ssICdhIGdyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgZnVuY3Rpb25zOiBbZ2ZdXG4gIH0pXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OkZ1bmN0aW9uRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgRnVuY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIkZ1bmN0aW9uQ29uZmlndXJhdGlvblwiOiB7XG4gICAgICAgICAgICBcIkVudmlyb25tZW50XCI6IHtcbiAgICAgICAgICAgICAgXCJFeGVjdXRpb25cIjoge30sXG4gICAgICAgICAgICAgIFwiVmFyaWFibGVzXCI6IHtcbiAgICAgICAgICAgICAgICBcIlRFU1RcIjogXCIxXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiTWVtb3J5U2l6ZVwiOiAxMzEwNzIsXG4gICAgICAgICAgICBcIlBpbm5lZFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwiZ2ctZnVuY3Rpb25cIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcblxufSkiXX0=