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
test('Subscriptions cloud and localshadow destinations', () => {
    let s = new lib_1.Subscriptions(stack, 'subs');
    s.add(new lib_1.AWSIoTCloud(), '#', new lib_1.LocalShadow());
    s.add(new lib_1.LocalShadow(), 'iot', new lib_1.AWSIoTCloud());
    new lib_1.Group(stack, 'group', {
        core: c,
        subscriptions: s
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::SubscriptionDefinition', {
        InitialVersion: {
            Subscriptions: [
                {
                    "Id": "0",
                    "Source": "cloud",
                    "Subject": "#",
                    "Target": "GGShadowService"
                },
                {
                    "Id": "1",
                    "Target": "cloud",
                    "Subject": "iot",
                    "Source": "GGShadowService"
                }
            ]
        }
    });
});
test('Subscriptions functions', () => {
    let s = new lib_1.Subscriptions(stack, 'subs');
    let gf = new lib_1.Function(stack, 'gg-function', {
        alias: alias,
        function: f,
        memorySize: core_1.Size.mebibytes(128),
        pinned: false,
        timeout: core_1.Duration.seconds(3),
    });
    s.add(gf, 'iot/topic', new lib_1.AWSIoTCloud());
    s.add(new lib_1.AWSIoTCloud(), '#', gf);
    new lib_1.Group(stack, 'group', {
        core: c,
        subscriptions: s
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::SubscriptionDefinition', {
        InitialVersion: {
            Subscriptions: [
                {
                    "Source": {
                        "Fn::Join": [
                            "",
                            [
                                {
                                    "Fn::GetAtt": []
                                },
                                ":prod"
                            ]
                        ]
                    },
                    "Subject": "iot/topic",
                    "Target": "cloud"
                },
                {
                    "Target": {
                        "Fn::Join": [
                            "",
                            [
                                {
                                    "Fn::GetAtt": []
                                },
                                ":prod"
                            ]
                        ]
                    },
                    "Subject": "#",
                    "Source": "cloud"
                }
            ]
        }
    });
});
test('Subscriptions devices', () => {
    let s = new lib_1.Subscriptions(stack, 'subs');
    let d = new lib_1.Device(stack, 'a device', {
        certificateArn: 'arn:xxx',
        syncShadow: false,
        thing: t
    });
    s.add(d, 'iot/topic', new lib_1.AWSIoTCloud());
    s.add(new lib_1.AWSIoTCloud(), '#', d);
    new lib_1.Group(stack, 'group', {
        core: c,
        subscriptions: s
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::SubscriptionDefinition', {
        InitialVersion: {
            Subscriptions: [
                {
                    "Source": {
                        "Fn::GetAtt": [
                            "athing",
                            "arn"
                        ]
                    },
                    "Subject": "iot/topic",
                    "Target": "cloud"
                },
                {
                    "Target": {
                        "Fn::GetAtt": [
                            "athing",
                            "arn"
                        ]
                    },
                    "Subject": "#",
                    "Source": "cloud"
                }
            ]
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3Vic2NyaXB0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUFnRztBQUNoRyx3Q0FBd0M7QUFDeEMsd0NBQStDO0FBQy9DLCtDQUErQztBQUMvQyw4Q0FBOEM7QUFHOUMsSUFBSSxLQUFnQixDQUFDO0FBQ3JCLElBQUksQ0FBZSxDQUFDO0FBQ3BCLElBQUksQ0FBTyxDQUFDO0FBQ1osSUFBSSxDQUFrQixDQUFDO0FBQ3ZCLElBQUksS0FBbUIsQ0FBQztBQUV4QixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDckMsU0FBUyxFQUFFLFdBQVc7S0FDdkIsQ0FBQyxDQUFBO0lBQ0YsQ0FBQyxHQUFHLElBQUksVUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDNUIsY0FBYyxFQUFFLEtBQUs7UUFDckIsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDLENBQUM7SUFFSCxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7UUFDM0MsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO1FBQzlDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7UUFDbEMsT0FBTyxFQUFFLFNBQVM7S0FDbkIsQ0FBQyxDQUFBO0lBQ0YsSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7UUFDdEMs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QkFDRCxTQUFTLEVBQUUsR0FBRztvQkFDZCxRQUFRLEVBQUUsT0FBTztpQkFDbEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICdAYXdzLWNkay9hc3NlcnQvamVzdCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb3JlLCBHcm91cCwgU3Vic2NyaXB0aW9ucywgQVdTSW9UQ2xvdWQsIExvY2FsU2hhZG93LCBGdW5jdGlvbiwgRGV2aWNlIH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCAqIGFzIGlvdCBmcm9tICdAYXdzLWNkay9hd3MtaW90JztcbmltcG9ydCB7IFNpemUsIER1cmF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG4vL2ltcG9ydCB7IFN5bnRoVXRpbHMgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuXG5cbnZhciBzdGFjazogY2RrLlN0YWNrO1xudmFyIHQ6IGlvdC5DZm5UaGluZztcbnZhciBjOiBDb3JlO1xudmFyIGY6IGxhbWJkYS5GdW5jdGlvbjtcbnZhciBhbGlhczogbGFtYmRhLkFsaWFzO1xuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrO1xuICB0ID0gbmV3IGlvdC5DZm5UaGluZyhzdGFjaywgJ2FfdGhpbmcnLCB7XG4gICAgdGhpbmdOYW1lOiAndGVzdFRoaW5nJ1xuICB9KVxuICBjID0gbmV3IENvcmUoc3RhY2ssICdNeUNvcmUnLCB7XG4gICAgY2VydGlmaWNhdGVBcm46ICdBQUEnLFxuICAgIHN5bmNTaGFkb3c6IHRydWUsXG4gICAgdGhpbmc6IHRcbiAgfSk7XG5cbiAgZiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdhIGZ1bmN0aW9uJywge1xuICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ3ByaW50KFwiSGVsbG9cIiknKSxcbiAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM183LFxuICAgIGhhbmRsZXI6ICdoYW5kbGVyJ1xuICB9KVxuICBsZXQgdiA9IG5ldyBsYW1iZGEuVmVyc2lvbihzdGFjaywgJ3YxJywge1xuICAgIGxhbWJkYTogZlxuICB9KVxuICBhbGlhcyA9IG5ldyBsYW1iZGEuQWxpYXMoc3RhY2ssICdwcm9kJywge1xuICAgIHZlcnNpb246IHYsXG4gICAgYWxpYXNOYW1lOiAncHJvZCdcbiAgfSlcbn0pXG5cbmFmdGVyRWFjaCgoKSA9PiB7XG4gIC8vY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoU3ludGhVdGlscy50b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSwgdW5kZWZpbmVkLCAyKSlcbn0pO1xuXG5cbnRlc3QoJ1N1YnNjcmlwdGlvbnMgY2xvdWQgYW5kIGxvY2Fsc2hhZG93IGRlc3RpbmF0aW9ucycsICgpID0+IHtcbiAgbGV0IHMgPSBuZXcgU3Vic2NyaXB0aW9ucyhzdGFjaywgJ3N1YnMnKTtcbiAgcy5hZGQobmV3IEFXU0lvVENsb3VkKCksICcjJywgbmV3IExvY2FsU2hhZG93KCkpXG4gIHMuYWRkKG5ldyBMb2NhbFNoYWRvdygpLCAnaW90JywgbmV3IEFXU0lvVENsb3VkKCkpXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgc3Vic2NyaXB0aW9uczogc1xuICB9KVxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpTdWJzY3JpcHRpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBTdWJzY3JpcHRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIklkXCI6IFwiMFwiLFxuICAgICAgICAgIFwiU291cmNlXCI6IFwiY2xvdWRcIixcbiAgICAgICAgICBcIlN1YmplY3RcIjogXCIjXCIsXG4gICAgICAgICAgXCJUYXJnZXRcIjogXCJHR1NoYWRvd1NlcnZpY2VcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJJZFwiOiBcIjFcIixcbiAgICAgICAgICBcIlRhcmdldFwiOiBcImNsb3VkXCIsXG4gICAgICAgICAgXCJTdWJqZWN0XCI6IFwiaW90XCIsXG4gICAgICAgICAgXCJTb3VyY2VcIjogXCJHR1NoYWRvd1NlcnZpY2VcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcbn0pXG5cblxudGVzdCgnU3Vic2NyaXB0aW9ucyBmdW5jdGlvbnMnLCAoKSA9PiB7XG4gIGxldCBzID0gbmV3IFN1YnNjcmlwdGlvbnMoc3RhY2ssICdzdWJzJyk7XG4gIFxuXG4gIGxldCBnZiA9IG5ldyBGdW5jdGlvbihzdGFjaywgJ2dnLWZ1bmN0aW9uJywge1xuICAgIGFsaWFzOiBhbGlhcyxcbiAgICBmdW5jdGlvbjogZixcbiAgICBtZW1vcnlTaXplOiBTaXplLm1lYmlieXRlcygxMjgpLFxuICAgIHBpbm5lZDogZmFsc2UsXG4gICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygzKSxcbiAgfSlcblxuICBzLmFkZChnZiwgJ2lvdC90b3BpYycsIG5ldyBBV1NJb1RDbG91ZCgpKVxuICBzLmFkZChuZXcgQVdTSW9UQ2xvdWQoKSwgJyMnLCBnZilcbiAgbmV3IEdyb3VwKHN0YWNrLCAnZ3JvdXAnLCB7XG4gICAgY29yZTogYyxcbiAgICBzdWJzY3JpcHRpb25zOiBzXG4gIH0pXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OlN1YnNjcmlwdGlvbkRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIFN1YnNjcmlwdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiU291cmNlXCI6IHtcbiAgICAgICAgICAgIFwiRm46OkpvaW5cIjogW1xuICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJGbjo6R2V0QXR0XCI6IFtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIjpwcm9kXCJcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJTdWJqZWN0XCI6IFwiaW90L3RvcGljXCIsXG4gICAgICAgICAgXCJUYXJnZXRcIjogXCJjbG91ZFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIlRhcmdldFwiOiB7XG4gICAgICAgICAgICBcIkZuOjpKb2luXCI6IFtcbiAgICAgICAgICAgICAgXCJcIixcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwiRm46OkdldEF0dFwiOiBbXG5cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiOnByb2RcIlxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIlN1YmplY3RcIjogXCIjXCIsXG4gICAgICAgICAgXCJTb3VyY2VcIjogXCJjbG91ZFwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSlcblxudGVzdCgnU3Vic2NyaXB0aW9ucyBkZXZpY2VzJywgKCkgPT4ge1xuICBsZXQgcyA9IG5ldyBTdWJzY3JpcHRpb25zKHN0YWNrLCAnc3VicycpO1xuXG4gIGxldCBkID0gbmV3IERldmljZShzdGFjaywgJ2EgZGV2aWNlJywge1xuICAgIGNlcnRpZmljYXRlQXJuOiAnYXJuOnh4eCcsXG4gICAgc3luY1NoYWRvdzogZmFsc2UsXG4gICAgdGhpbmc6IHRcbiAgfSk7XG5cbiAgcy5hZGQoZCwgJ2lvdC90b3BpYycsIG5ldyBBV1NJb1RDbG91ZCgpKTtcbiAgcy5hZGQobmV3IEFXU0lvVENsb3VkKCksICcjJywgZCk7XG4gICAgXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgc3Vic2NyaXB0aW9uczogc1xuICB9KVxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpTdWJzY3JpcHRpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBTdWJzY3JpcHRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIlNvdXJjZVwiOiB7XG4gICAgICAgICAgICBcIkZuOjpHZXRBdHRcIjogW1xuICAgICAgICAgICAgICBcImF0aGluZ1wiLFxuICAgICAgICAgICAgICBcImFyblwiXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIlN1YmplY3RcIjogXCJpb3QvdG9waWNcIixcbiAgICAgICAgICBcIlRhcmdldFwiOiBcImNsb3VkXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiVGFyZ2V0XCI6IHtcbiAgICAgICAgICAgIFwiRm46OkdldEF0dFwiOiBbXG4gICAgICAgICAgICAgIFwiYXRoaW5nXCIsXG4gICAgICAgICAgICAgIFwiYXJuXCJcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiU3ViamVjdFwiOiBcIiNcIixcbiAgICAgICAgICBcIlNvdXJjZVwiOiBcImNsb3VkXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG5cbn0pXG5cbiJdfQ==