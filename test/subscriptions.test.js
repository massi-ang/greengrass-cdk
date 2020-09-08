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
    console.log(JSON.stringify(assert_1.SynthUtils.toCloudFormation(stack), undefined, 2));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3Vic2NyaXB0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUF3RztBQUN4Ryx3Q0FBd0M7QUFDeEMsd0NBQStDO0FBQy9DLDRDQUE2QztBQUM3Qyw4Q0FBOEM7QUFHOUMsSUFBSSxLQUFnQixDQUFDO0FBQ3JCLElBQUksQ0FBZSxDQUFDO0FBQ3BCLElBQUksQ0FBTyxDQUFDO0FBQ1osSUFBSSxDQUFrQixDQUFDO0FBQ3ZCLElBQUksS0FBbUIsQ0FBQztBQUV4QixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDckMsU0FBUyxFQUFFLFdBQVc7S0FDdkIsQ0FBQyxDQUFBO0lBQ0YsQ0FBQyxHQUFHLElBQUksVUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDNUIsY0FBYyxFQUFFLEtBQUs7UUFDckIsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDLENBQUM7SUFFSCxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7UUFDM0MsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO1FBQzlDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7UUFDbEMsT0FBTyxFQUFFLFNBQVM7S0FDbkIsQ0FBQyxDQUFBO0lBQ0YsSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7UUFDdEMsTUFBTSxFQUFFLENBQUM7S0FDVixDQUFDLENBQUE7SUFDRixLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDdEMsT0FBTyxFQUFFLENBQUM7UUFDVixTQUFTLEVBQUUsTUFBTTtLQUNsQixDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLFNBQVMsQ0FBQyxHQUFHLEVBQUU7SUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMvRSxDQUFDLENBQUMsQ0FBQztBQUdILElBQUksQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7SUFDNUQsSUFBSSxDQUFDLEdBQUcsSUFBSSxtQkFBYSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksc0JBQWdCLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSw0QkFBc0IsRUFBRSxDQUFDLENBQUE7SUFDaEUsSUFBSSxXQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUN4QixJQUFJLEVBQUUsQ0FBQztRQUNQLGFBQWEsRUFBRSxDQUFDO0tBQ2pCLENBQUMsQ0FBQTtJQUNGLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyx5Q0FBeUMsRUFBRTtRQUMxRSxjQUFjLEVBQUU7WUFDZCxhQUFhLEVBQUU7Z0JBQ2I7b0JBQ0UsSUFBSSxFQUFFLEdBQUc7b0JBQ1QsUUFBUSxFQUFFLE9BQU87b0JBQ2pCLFNBQVMsRUFBRSxHQUFHO29CQUNkLFFBQVEsRUFBRSxpQkFBaUI7aUJBQzVCO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFBO0FBR0YsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtJQUNuQyxJQUFJLENBQUMsR0FBRyxJQUFJLG1CQUFhLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBR3pDLElBQUksRUFBRSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7UUFDMUMsS0FBSyxFQUFFLEtBQUs7UUFDWixRQUFRLEVBQUUsQ0FBQztRQUNYLFVBQVUsRUFBRSxXQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztRQUMvQixNQUFNLEVBQUUsS0FBSztRQUNiLE9BQU8sRUFBRSxlQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUM3QixDQUFDLENBQUE7SUFFRixDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxzQkFBZ0IsRUFBRSxDQUFDLENBQUE7SUFFOUMsSUFBSSxXQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUN4QixJQUFJLEVBQUUsQ0FBQztRQUNQLGFBQWEsRUFBRSxDQUFDO0tBQ2pCLENBQUMsQ0FBQTtJQUNGLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyx5Q0FBeUMsRUFBRTtRQUMxRSxjQUFjLEVBQUU7WUFDZCxhQUFhLEVBQUU7Z0JBQ2I7b0JBQ0UsUUFBUSxFQUFFO3dCQUNSLFVBQVUsRUFBRTs0QkFDVixFQUFFOzRCQUNGO2dDQUNFO29DQUNFLFlBQVksRUFBRSxFQUViO2lDQUNGO2dDQUNELE9BQU87NkJBQ1I7eUJBQ0Y7cUJBQ0Y7b0JBQ0QsU0FBUyxFQUFFLFdBQVc7b0JBQ3RCLFFBQVEsRUFBRSxPQUFPO2lCQUNsQjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qIFxuICogIENvcHlyaWdodCAyMDIwIEFtYXpvbi5jb20gb3IgaXRzIGFmZmlsaWF0ZXNcbiAqICBcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqICBcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqICBcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgJ0Bhd3MtY2RrL2Fzc2VydC9qZXN0JztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvcmUsIEdyb3VwLCBTdWJzY3JpcHRpb25zLCBDbG91ZERlc3RpbmF0aW9uLCBMb2NhbFNoYWRvd0Rlc3RpbmF0aW9uLCBGdW5jdGlvbiB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgKiBhcyBpb3QgZnJvbSAnQGF3cy1jZGsvYXdzLWlvdCc7XG5pbXBvcnQgeyBTaXplLCBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgU3ludGhVdGlscyB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydCc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5cblxudmFyIHN0YWNrOiBjZGsuU3RhY2s7XG52YXIgdDogaW90LkNmblRoaW5nO1xudmFyIGM6IENvcmU7XG52YXIgZjogbGFtYmRhLkZ1bmN0aW9uO1xudmFyIGFsaWFzOiBsYW1iZGEuQWxpYXM7XG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBjZGsuU3RhY2s7XG4gIHQgPSBuZXcgaW90LkNmblRoaW5nKHN0YWNrLCAnYV90aGluZycsIHtcbiAgICB0aGluZ05hbWU6ICd0ZXN0VGhpbmcnXG4gIH0pXG4gIGMgPSBuZXcgQ29yZShzdGFjaywgJ015Q29yZScsIHtcbiAgICBjZXJ0aWZpY2F0ZUFybjogJ0FBQScsXG4gICAgc3luY1NoYWRvdzogdHJ1ZSxcbiAgICB0aGluZzogdFxuICB9KTtcblxuICBmID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ2EgZnVuY3Rpb24nLCB7XG4gICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgncHJpbnQoXCJIZWxsb1wiKScpLFxuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzcsXG4gICAgaGFuZGxlcjogJ2hhbmRsZXInXG4gIH0pXG4gIGxldCB2ID0gbmV3IGxhbWJkYS5WZXJzaW9uKHN0YWNrLCAndjEnLCB7XG4gICAgbGFtYmRhOiBmXG4gIH0pXG4gIGFsaWFzID0gbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ3Byb2QnLCB7XG4gICAgdmVyc2lvbjogdixcbiAgICBhbGlhc05hbWU6ICdwcm9kJ1xuICB9KVxufSlcblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoU3ludGhVdGlscy50b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSwgdW5kZWZpbmVkLCAyKSlcbn0pO1xuXG5cbnRlc3QoJ1N1YnNjcmlwdGlvbnMgY2xvdWQgYW5kIGxvY2Fsc2hhZG93IGRlc3RpbmF0aW9ucycsICgpID0+IHtcbiAgbGV0IHMgPSBuZXcgU3Vic2NyaXB0aW9ucyhzdGFjaywgJ3N1YnMnKTtcbiAgcy5hZGQobmV3IENsb3VkRGVzdGluYXRpb24oKSwgJyMnLCBuZXcgTG9jYWxTaGFkb3dEZXN0aW5hdGlvbigpKVxuICBuZXcgR3JvdXAoc3RhY2ssICdncm91cCcsIHtcbiAgICBjb3JlOiBjLFxuICAgIHN1YnNjcmlwdGlvbnM6IHNcbiAgfSlcbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6U3Vic2NyaXB0aW9uRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgU3Vic2NyaXB0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJJZFwiOiBcIjBcIixcbiAgICAgICAgICBcIlNvdXJjZVwiOiBcImNsb3VkXCIsXG4gICAgICAgICAgXCJTdWJqZWN0XCI6IFwiI1wiLFxuICAgICAgICAgIFwiVGFyZ2V0XCI6IFwiR0dTaGFkb3dTZXJ2aWNlXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG59KVxuXG5cbnRlc3QoJ1N1YnNjcmlwdGlvbnMgZnVuY3Rpb25zJywgKCkgPT4ge1xuICBsZXQgcyA9IG5ldyBTdWJzY3JpcHRpb25zKHN0YWNrLCAnc3VicycpO1xuICBcblxuICBsZXQgZ2YgPSBuZXcgRnVuY3Rpb24oc3RhY2ssICdnZy1mdW5jdGlvbicsIHtcbiAgICBhbGlhczogYWxpYXMsXG4gICAgZnVuY3Rpb246IGYsXG4gICAgbWVtb3J5U2l6ZTogU2l6ZS5tZWJpYnl0ZXMoMTI4KSxcbiAgICBwaW5uZWQ6IGZhbHNlLFxuICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMyksXG4gIH0pXG5cbiAgcy5hZGQoZ2YsICdpb3QvdG9waWMnLCBuZXcgQ2xvdWREZXN0aW5hdGlvbigpKVxuXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgc3Vic2NyaXB0aW9uczogc1xuICB9KVxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpTdWJzY3JpcHRpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBTdWJzY3JpcHRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIlNvdXJjZVwiOiB7XG4gICAgICAgICAgICBcIkZuOjpKb2luXCI6IFtcbiAgICAgICAgICAgICAgXCJcIixcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwiRm46OkdldEF0dFwiOiBbXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCI6cHJvZFwiXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiU3ViamVjdFwiOiBcImlvdC90b3BpY1wiLFxuICAgICAgICAgIFwiVGFyZ2V0XCI6IFwiY2xvdWRcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcbn0pXG5cblxuXG4iXX0=