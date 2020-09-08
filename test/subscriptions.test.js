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
    s.add(gf, 'iot/topic', new lib_1.AWSIoTCloud());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3Vic2NyaXB0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUF3RjtBQUN4Rix3Q0FBd0M7QUFDeEMsd0NBQStDO0FBQy9DLCtDQUErQztBQUMvQyw4Q0FBOEM7QUFHOUMsSUFBSSxLQUFnQixDQUFDO0FBQ3JCLElBQUksQ0FBZSxDQUFDO0FBQ3BCLElBQUksQ0FBTyxDQUFDO0FBQ1osSUFBSSxDQUFrQixDQUFDO0FBQ3ZCLElBQUksS0FBbUIsQ0FBQztBQUV4QixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDckMsU0FBUyxFQUFFLFdBQVc7S0FDdkIsQ0FBQyxDQUFBO0lBQ0YsQ0FBQyxHQUFHLElBQUksVUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDNUIsY0FBYyxFQUFFLEtBQUs7UUFDckIsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDLENBQUM7SUFFSCxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7UUFDM0MsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO1FBQzlDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7UUFDbEMsT0FBTyxFQUFFLFNBQVM7S0FDbkIsQ0FBQyxDQUFBO0lBQ0YsSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7UUFDdEMsTUFBTSxFQUFFLENBQUM7S0FDVixDQUFDLENBQUE7SUFDRixLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDdEMsT0FBTyxFQUFFLENBQUM7UUFDVixTQUFTLEVBQUUsTUFBTTtLQUNsQixDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLFNBQVMsQ0FBQyxHQUFHLEVBQUU7SUFDYiwrRUFBK0U7QUFDakYsQ0FBQyxDQUFDLENBQUM7QUFHSCxJQUFJLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO0lBQzVELElBQUksQ0FBQyxHQUFHLElBQUksbUJBQWEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLGlCQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxpQkFBVyxFQUFFLENBQUMsQ0FBQTtJQUNoRCxJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1FBQ3hCLElBQUksRUFBRSxDQUFDO1FBQ1AsYUFBYSxFQUFFLENBQUM7S0FDakIsQ0FBQyxDQUFBO0lBQ0YsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLGtCQUFrQixDQUFDLHlDQUF5QyxFQUFFO1FBQzFFLGNBQWMsRUFBRTtZQUNkLGFBQWEsRUFBRTtnQkFDYjtvQkFDRSxJQUFJLEVBQUUsR0FBRztvQkFDVCxRQUFRLEVBQUUsT0FBTztvQkFDakIsU0FBUyxFQUFFLEdBQUc7b0JBQ2QsUUFBUSxFQUFFLGlCQUFpQjtpQkFDNUI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUE7QUFHRixJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLElBQUksQ0FBQyxHQUFHLElBQUksbUJBQWEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFHekMsSUFBSSxFQUFFLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtRQUMxQyxLQUFLLEVBQUUsS0FBSztRQUNaLFFBQVEsRUFBRSxDQUFDO1FBQ1gsVUFBVSxFQUFFLFdBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQy9CLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQzdCLENBQUMsQ0FBQTtJQUVGLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLGlCQUFXLEVBQUUsQ0FBQyxDQUFBO0lBRXpDLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDeEIsSUFBSSxFQUFFLENBQUM7UUFDUCxhQUFhLEVBQUUsQ0FBQztLQUNqQixDQUFDLENBQUE7SUFDRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMseUNBQXlDLEVBQUU7UUFDMUUsY0FBYyxFQUFFO1lBQ2QsYUFBYSxFQUFFO2dCQUNiO29CQUNFLFFBQVEsRUFBRTt3QkFDUixVQUFVLEVBQUU7NEJBQ1YsRUFBRTs0QkFDRjtnQ0FDRTtvQ0FDRSxZQUFZLEVBQUUsRUFFYjtpQ0FDRjtnQ0FDRCxPQUFPOzZCQUNSO3lCQUNGO3FCQUNGO29CQUNELFNBQVMsRUFBRSxXQUFXO29CQUN0QixRQUFRLEVBQUUsT0FBTztpQkFDbEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICdAYXdzLWNkay9hc3NlcnQvamVzdCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb3JlLCBHcm91cCwgU3Vic2NyaXB0aW9ucywgQVdTSW9UQ2xvdWQsIExvY2FsU2hhZG93LCBGdW5jdGlvbiB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgKiBhcyBpb3QgZnJvbSAnQGF3cy1jZGsvYXdzLWlvdCc7XG5pbXBvcnQgeyBTaXplLCBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuLy9pbXBvcnQgeyBTeW50aFV0aWxzIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0JztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcblxuXG52YXIgc3RhY2s6IGNkay5TdGFjaztcbnZhciB0OiBpb3QuQ2ZuVGhpbmc7XG52YXIgYzogQ29yZTtcbnZhciBmOiBsYW1iZGEuRnVuY3Rpb247XG52YXIgYWxpYXM6IGxhbWJkYS5BbGlhcztcblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHN0YWNrID0gbmV3IGNkay5TdGFjaztcbiAgdCA9IG5ldyBpb3QuQ2ZuVGhpbmcoc3RhY2ssICdhX3RoaW5nJywge1xuICAgIHRoaW5nTmFtZTogJ3Rlc3RUaGluZydcbiAgfSlcbiAgYyA9IG5ldyBDb3JlKHN0YWNrLCAnTXlDb3JlJywge1xuICAgIGNlcnRpZmljYXRlQXJuOiAnQUFBJyxcbiAgICBzeW5jU2hhZG93OiB0cnVlLFxuICAgIHRoaW5nOiB0XG4gIH0pO1xuXG4gIGYgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnYSBmdW5jdGlvbicsIHtcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdwcmludChcIkhlbGxvXCIpJyksXG4gICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfNyxcbiAgICBoYW5kbGVyOiAnaGFuZGxlcidcbiAgfSlcbiAgbGV0IHYgPSBuZXcgbGFtYmRhLlZlcnNpb24oc3RhY2ssICd2MScsIHtcbiAgICBsYW1iZGE6IGZcbiAgfSlcbiAgYWxpYXMgPSBuZXcgbGFtYmRhLkFsaWFzKHN0YWNrLCAncHJvZCcsIHtcbiAgICB2ZXJzaW9uOiB2LFxuICAgIGFsaWFzTmFtZTogJ3Byb2QnXG4gIH0pXG59KVxuXG5hZnRlckVhY2goKCkgPT4ge1xuICAvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KFN5bnRoVXRpbHMudG9DbG91ZEZvcm1hdGlvbihzdGFjayksIHVuZGVmaW5lZCwgMikpXG59KTtcblxuXG50ZXN0KCdTdWJzY3JpcHRpb25zIGNsb3VkIGFuZCBsb2NhbHNoYWRvdyBkZXN0aW5hdGlvbnMnLCAoKSA9PiB7XG4gIGxldCBzID0gbmV3IFN1YnNjcmlwdGlvbnMoc3RhY2ssICdzdWJzJyk7XG4gIHMuYWRkKG5ldyBBV1NJb1RDbG91ZCgpLCAnIycsIG5ldyBMb2NhbFNoYWRvdygpKVxuICBuZXcgR3JvdXAoc3RhY2ssICdncm91cCcsIHtcbiAgICBjb3JlOiBjLFxuICAgIHN1YnNjcmlwdGlvbnM6IHNcbiAgfSlcbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6U3Vic2NyaXB0aW9uRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgU3Vic2NyaXB0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJJZFwiOiBcIjBcIixcbiAgICAgICAgICBcIlNvdXJjZVwiOiBcImNsb3VkXCIsXG4gICAgICAgICAgXCJTdWJqZWN0XCI6IFwiI1wiLFxuICAgICAgICAgIFwiVGFyZ2V0XCI6IFwiR0dTaGFkb3dTZXJ2aWNlXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG59KVxuXG5cbnRlc3QoJ1N1YnNjcmlwdGlvbnMgZnVuY3Rpb25zJywgKCkgPT4ge1xuICBsZXQgcyA9IG5ldyBTdWJzY3JpcHRpb25zKHN0YWNrLCAnc3VicycpO1xuICBcblxuICBsZXQgZ2YgPSBuZXcgRnVuY3Rpb24oc3RhY2ssICdnZy1mdW5jdGlvbicsIHtcbiAgICBhbGlhczogYWxpYXMsXG4gICAgZnVuY3Rpb246IGYsXG4gICAgbWVtb3J5U2l6ZTogU2l6ZS5tZWJpYnl0ZXMoMTI4KSxcbiAgICBwaW5uZWQ6IGZhbHNlLFxuICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMyksXG4gIH0pXG5cbiAgcy5hZGQoZ2YsICdpb3QvdG9waWMnLCBuZXcgQVdTSW9UQ2xvdWQoKSlcblxuICBuZXcgR3JvdXAoc3RhY2ssICdncm91cCcsIHtcbiAgICBjb3JlOiBjLFxuICAgIHN1YnNjcmlwdGlvbnM6IHNcbiAgfSlcbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6U3Vic2NyaXB0aW9uRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgU3Vic2NyaXB0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJTb3VyY2VcIjoge1xuICAgICAgICAgICAgXCJGbjo6Sm9pblwiOiBbXG4gICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcIkZuOjpHZXRBdHRcIjogW1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiOnByb2RcIlxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIlN1YmplY3RcIjogXCJpb3QvdG9waWNcIixcbiAgICAgICAgICBcIlRhcmdldFwiOiBcImNsb3VkXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG59KVxuXG5cblxuIl19