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
const assert_1 = require("@aws-cdk/assert");
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
test('Devices', () => {
    let d = new lib_1.Device(stack, 'a device', {
        certificateArn: 'arn::xxx',
        syncShadow: true,
        thing: t
    });
    new lib_1.Group(stack, 'group', {
        core: c,
        devices: [d]
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::DeviceDefinition', {
        InitialVersion: {
            "Devices": [
                {
                    "CertificateArn": "arn::xxx",
                    "Id": "a device",
                    "SyncShadow": true,
                    "ThingArn": {
                        "Fn::GetAtt": [
                            "athing",
                            "arn"
                        ]
                    }
                }
            ]
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2aWNlcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGV2aWNlcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUE4QztBQUM5Qyx3Q0FBd0M7QUFDeEMsNENBQTZDO0FBSTdDLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLENBQWUsQ0FBQztBQUNwQixJQUFJLENBQU8sQ0FBQztBQUdaLFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUNyQyxTQUFTLEVBQUUsV0FBVztLQUN2QixDQUFDLENBQUE7SUFDRixDQUFDLEdBQUcsSUFBSSxVQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUM1QixjQUFjLEVBQUUsS0FBSztRQUNyQixVQUFVLEVBQUUsSUFBSTtRQUNoQixLQUFLLEVBQUUsQ0FBQztLQUNULENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFBO0FBRUYsU0FBUyxDQUFDLEdBQUcsRUFBRTtJQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBVSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9FLENBQUMsQ0FBQyxDQUFDO0FBR0gsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFDbkIsSUFBSSxDQUFDLEdBQUcsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtRQUNwQyxjQUFjLEVBQUUsVUFBVTtRQUMxQixVQUFVLEVBQUUsSUFBSTtRQUNoQixLQUFLLEVBQUUsQ0FBQztLQUNULENBQUMsQ0FBQTtJQUNGLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDeEIsSUFBSSxFQUFFLENBQUM7UUFDUCxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDYixDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMsbUNBQW1DLEVBQUU7UUFDcEUsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLGdCQUFnQixFQUFFLFVBQVU7b0JBQzVCLElBQUksRUFBRSxVQUFVO29CQUNoQixZQUFZLEVBQUUsSUFBSTtvQkFDbEIsVUFBVSxFQUFFO3dCQUNWLFlBQVksRUFBRTs0QkFDWixRQUFROzRCQUNSLEtBQUs7eUJBQ047cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICdAYXdzLWNkay9hc3NlcnQvamVzdCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb3JlLCBHcm91cCwgIERldmljZSB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgKiBhcyBpb3QgZnJvbSAnQGF3cy1jZGsvYXdzLWlvdCc7XG5pbXBvcnQgeyBTeW50aFV0aWxzIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0JztcblxuXG5cbnZhciBzdGFjazogY2RrLlN0YWNrO1xudmFyIHQ6IGlvdC5DZm5UaGluZztcbnZhciBjOiBDb3JlO1xuXG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBjZGsuU3RhY2s7XG4gIHQgPSBuZXcgaW90LkNmblRoaW5nKHN0YWNrLCAnYV90aGluZycsIHtcbiAgICB0aGluZ05hbWU6ICd0ZXN0VGhpbmcnXG4gIH0pXG4gIGMgPSBuZXcgQ29yZShzdGFjaywgJ015Q29yZScsIHtcbiAgICBjZXJ0aWZpY2F0ZUFybjogJ0FBQScsXG4gICAgc3luY1NoYWRvdzogdHJ1ZSxcbiAgICB0aGluZzogdFxuICB9KTtcblxufSlcblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoU3ludGhVdGlscy50b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSwgdW5kZWZpbmVkLCAyKSlcbn0pO1xuXG5cbnRlc3QoJ0RldmljZXMnLCAoKSA9PiB7XG4gIGxldCBkID0gbmV3IERldmljZShzdGFjaywgJ2EgZGV2aWNlJywge1xuICAgIGNlcnRpZmljYXRlQXJuOiAnYXJuOjp4eHgnLFxuICAgIHN5bmNTaGFkb3c6IHRydWUsXG4gICAgdGhpbmc6IHRcbiAgfSlcbiAgbmV3IEdyb3VwKHN0YWNrLCAnZ3JvdXAnLCB7XG4gICAgY29yZTogYyxcbiAgICBkZXZpY2VzOiBbZF1cbiAgfSlcblxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpEZXZpY2VEZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBcIkRldmljZXNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJDZXJ0aWZpY2F0ZUFyblwiOiBcImFybjo6eHh4XCIsXG4gICAgICAgICAgXCJJZFwiOiBcImEgZGV2aWNlXCIsXG4gICAgICAgICAgXCJTeW5jU2hhZG93XCI6IHRydWUsXG4gICAgICAgICAgXCJUaGluZ0FyblwiOiB7XG4gICAgICAgICAgICBcIkZuOjpHZXRBdHRcIjogW1xuICAgICAgICAgICAgICBcImF0aGluZ1wiLFxuICAgICAgICAgICAgICBcImFyblwiXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcbn0pXG5cblxuXG5cblxuXG4iXX0=