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
    s.add(new lib_1.CloudDestination(), '#', new lib_1.LocalShadowDestination());
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
    s.add(gf, 'iot/topic', new lib_1.CloudDestination());
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
                }
            ]
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3Vic2NyaXB0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUF3RztBQUN4Ryx3Q0FBd0M7QUFDeEMsd0NBQStDO0FBQy9DLCtDQUErQztBQUMvQyw4Q0FBOEM7QUFHOUMsSUFBSSxLQUFnQixDQUFDO0FBQ3JCLElBQUksQ0FBZSxDQUFDO0FBQ3BCLElBQUksQ0FBTyxDQUFDO0FBQ1osSUFBSSxDQUFrQixDQUFDO0FBQ3ZCLElBQUksS0FBbUIsQ0FBQztBQUV4QixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDckMsU0FBUyxFQUFFLFdBQVc7S0FDdkIsQ0FBQyxDQUFBO0lBQ0YsQ0FBQyxHQUFHLElBQUksVUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDNUIsY0FBYyxFQUFFLEtBQUs7UUFDckIsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDLENBQUM7SUFFSCxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7UUFDM0MsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO1FBQzlDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7UUFDbEMsT0FBTyxFQUFFLFNBQVM7S0FDbkIsQ0FBQyxDQUFBO0lBQ0YsSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7UUFDdEMsTUFBTSxFQUFFLENBQUM7S0FDVixDQUFDLENBQUE7SUFDRixLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDdEMsT0FBTyxFQUFFLENBQUM7UUFDVixTQUFTLEVBQUUsTUFBTTtLQUNsQixDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLFNBQVMsQ0FBQyxHQUFHLEVBQUU7SUFDYiwrRUFBK0U7QUFDakYsQ0FBQyxDQUFDLENBQUM7QUFHSCxJQUFJLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO0lBQzVELElBQUksQ0FBQyxHQUFHLElBQUksbUJBQWEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLHNCQUFnQixFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksNEJBQXNCLEVBQUUsQ0FBQyxDQUFBO0lBQ2hFLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDeEIsSUFBSSxFQUFFLENBQUM7UUFDUCxhQUFhLEVBQUUsQ0FBQztLQUNqQixDQUFDLENBQUE7SUFDRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMseUNBQXlDLEVBQUU7UUFDMUUsY0FBYyxFQUFFO1lBQ2QsYUFBYSxFQUFFO2dCQUNiO29CQUNFLElBQUksRUFBRSxHQUFHO29CQUNULFFBQVEsRUFBRSxPQUFPO29CQUNqQixTQUFTLEVBQUUsR0FBRztvQkFDZCxRQUFRLEVBQUUsaUJBQWlCO2lCQUM1QjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQTtBQUdGLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsSUFBSSxDQUFDLEdBQUcsSUFBSSxtQkFBYSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUd6QyxJQUFJLEVBQUUsR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1FBQzFDLEtBQUssRUFBRSxLQUFLO1FBQ1osUUFBUSxFQUFFLENBQUM7UUFDWCxVQUFVLEVBQUUsV0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7UUFDL0IsTUFBTSxFQUFFLEtBQUs7UUFDYixPQUFPLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDN0IsQ0FBQyxDQUFBO0lBRUYsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksc0JBQWdCLEVBQUUsQ0FBQyxDQUFBO0lBRTlDLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDeEIsSUFBSSxFQUFFLENBQUM7UUFDUCxhQUFhLEVBQUUsQ0FBQztLQUNqQixDQUFDLENBQUE7SUFDRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMseUNBQXlDLEVBQUU7UUFDMUUsY0FBYyxFQUFFO1lBQ2QsYUFBYSxFQUFFO2dCQUNiO29CQUNFLFFBQVEsRUFBRTt3QkFDUixVQUFVLEVBQUU7NEJBQ1YsRUFBRTs0QkFDRjtnQ0FDRTtvQ0FDRSxZQUFZLEVBQUUsRUFFYjtpQ0FDRjtnQ0FDRCxPQUFPOzZCQUNSO3lCQUNGO3FCQUNGO29CQUNELFNBQVMsRUFBRSxXQUFXO29CQUN0QixRQUFRLEVBQUUsT0FBTztpQkFDbEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICdAYXdzLWNkay9hc3NlcnQvamVzdCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb3JlLCBHcm91cCwgU3Vic2NyaXB0aW9ucywgQ2xvdWREZXN0aW5hdGlvbiwgTG9jYWxTaGFkb3dEZXN0aW5hdGlvbiwgRnVuY3Rpb24gfSBmcm9tICcuLi9saWInO1xuaW1wb3J0ICogYXMgaW90IGZyb20gJ0Bhd3MtY2RrL2F3cy1pb3QnO1xuaW1wb3J0IHsgU2l6ZSwgRHVyYXRpb24gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbi8vaW1wb3J0IHsgU3ludGhVdGlscyB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydCc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5cblxudmFyIHN0YWNrOiBjZGsuU3RhY2s7XG52YXIgdDogaW90LkNmblRoaW5nO1xudmFyIGM6IENvcmU7XG52YXIgZjogbGFtYmRhLkZ1bmN0aW9uO1xudmFyIGFsaWFzOiBsYW1iZGEuQWxpYXM7XG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBjZGsuU3RhY2s7XG4gIHQgPSBuZXcgaW90LkNmblRoaW5nKHN0YWNrLCAnYV90aGluZycsIHtcbiAgICB0aGluZ05hbWU6ICd0ZXN0VGhpbmcnXG4gIH0pXG4gIGMgPSBuZXcgQ29yZShzdGFjaywgJ015Q29yZScsIHtcbiAgICBjZXJ0aWZpY2F0ZUFybjogJ0FBQScsXG4gICAgc3luY1NoYWRvdzogdHJ1ZSxcbiAgICB0aGluZzogdFxuICB9KTtcblxuICBmID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ2EgZnVuY3Rpb24nLCB7XG4gICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgncHJpbnQoXCJIZWxsb1wiKScpLFxuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzcsXG4gICAgaGFuZGxlcjogJ2hhbmRsZXInXG4gIH0pXG4gIGxldCB2ID0gbmV3IGxhbWJkYS5WZXJzaW9uKHN0YWNrLCAndjEnLCB7XG4gICAgbGFtYmRhOiBmXG4gIH0pXG4gIGFsaWFzID0gbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ3Byb2QnLCB7XG4gICAgdmVyc2lvbjogdixcbiAgICBhbGlhc05hbWU6ICdwcm9kJ1xuICB9KVxufSlcblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShTeW50aFV0aWxzLnRvQ2xvdWRGb3JtYXRpb24oc3RhY2spLCB1bmRlZmluZWQsIDIpKVxufSk7XG5cblxudGVzdCgnU3Vic2NyaXB0aW9ucyBjbG91ZCBhbmQgbG9jYWxzaGFkb3cgZGVzdGluYXRpb25zJywgKCkgPT4ge1xuICBsZXQgcyA9IG5ldyBTdWJzY3JpcHRpb25zKHN0YWNrLCAnc3VicycpO1xuICBzLmFkZChuZXcgQ2xvdWREZXN0aW5hdGlvbigpLCAnIycsIG5ldyBMb2NhbFNoYWRvd0Rlc3RpbmF0aW9uKCkpXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgc3Vic2NyaXB0aW9uczogc1xuICB9KVxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpTdWJzY3JpcHRpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBTdWJzY3JpcHRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIklkXCI6IFwiMFwiLFxuICAgICAgICAgIFwiU291cmNlXCI6IFwiY2xvdWRcIixcbiAgICAgICAgICBcIlN1YmplY3RcIjogXCIjXCIsXG4gICAgICAgICAgXCJUYXJnZXRcIjogXCJHR1NoYWRvd1NlcnZpY2VcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcbn0pXG5cblxudGVzdCgnU3Vic2NyaXB0aW9ucyBmdW5jdGlvbnMnLCAoKSA9PiB7XG4gIGxldCBzID0gbmV3IFN1YnNjcmlwdGlvbnMoc3RhY2ssICdzdWJzJyk7XG4gIFxuXG4gIGxldCBnZiA9IG5ldyBGdW5jdGlvbihzdGFjaywgJ2dnLWZ1bmN0aW9uJywge1xuICAgIGFsaWFzOiBhbGlhcyxcbiAgICBmdW5jdGlvbjogZixcbiAgICBtZW1vcnlTaXplOiBTaXplLm1lYmlieXRlcygxMjgpLFxuICAgIHBpbm5lZDogZmFsc2UsXG4gICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygzKSxcbiAgfSlcblxuICBzLmFkZChnZiwgJ2lvdC90b3BpYycsIG5ldyBDbG91ZERlc3RpbmF0aW9uKCkpXG5cbiAgbmV3IEdyb3VwKHN0YWNrLCAnZ3JvdXAnLCB7XG4gICAgY29yZTogYyxcbiAgICBzdWJzY3JpcHRpb25zOiBzXG4gIH0pXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OlN1YnNjcmlwdGlvbkRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIFN1YnNjcmlwdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiU291cmNlXCI6IHtcbiAgICAgICAgICAgIFwiRm46OkpvaW5cIjogW1xuICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJGbjo6R2V0QXR0XCI6IFtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIjpwcm9kXCJcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJTdWJqZWN0XCI6IFwiaW90L3RvcGljXCIsXG4gICAgICAgICAgXCJUYXJnZXRcIjogXCJjbG91ZFwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSlcblxuXG5cbiJdfQ==