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
//import { SynthUtils } from '@aws-cdk/assert';
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
    //console.log(JSON.stringify(SynthUtils.toCloudFormation(stack), undefined, 2))
});
test('Connectors', () => {
    let g = new lib_1.Generic(stack, 'a connector', {
        name: 'IoTAnalytics',
        version: 4,
        parameters: {
            "p1": "v1"
        }
    });
    new lib_1.Group(stack, 'group', {
        core: c,
        connectors: [g]
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::ConnectorDefinition', {
        InitialVersion: {
            "Connectors": [
                {
                    "ConnectorArn": "arn:aws:greengrass:region::/connectors/IoTAnalytics/versions/4",
                    "Id": "a connector",
                    "Parameters": {
                        "p1": "v1"
                    }
                }
            ]
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdG9ycy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29ubmVjdG9ycy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMsK0NBQStDO0FBSS9DLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLENBQWUsQ0FBQztBQUNwQixJQUFJLENBQU8sQ0FBQztBQUdaLFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUNyQyxTQUFTLEVBQUUsV0FBVztLQUN2QixDQUFDLENBQUE7SUFDRixDQUFDLEdBQUcsSUFBSSxVQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUM1QixjQUFjLEVBQUUsS0FBSztRQUNyQixVQUFVLEVBQUUsSUFBSTtRQUNoQixLQUFLLEVBQUUsQ0FBQztLQUNULENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFBO0FBRUYsU0FBUyxDQUFDLEdBQUcsRUFBRTtJQUNiLCtFQUErRTtBQUNqRixDQUFDLENBQUMsQ0FBQztBQUdILElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLElBQUksQ0FBQyxHQUFHLElBQUksYUFBTyxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7UUFDeEMsSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLENBQUM7UUFDVixVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsSUFBSTtTQUNYO0tBQ0YsQ0FBQyxDQUFBO0lBQ0YsSUFBSSxXQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUN4QixJQUFJLEVBQUUsQ0FBQztRQUNQLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNoQixDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMsc0NBQXNDLEVBQUU7UUFDdkUsY0FBYyxFQUFFO1lBQ2QsWUFBWSxFQUFFO2dCQUNaO29CQUNFLGNBQWMsRUFBRSxnRUFBZ0U7b0JBQ2hGLElBQUksRUFBRSxhQUFhO29CQUNuQixZQUFZLEVBQUU7d0JBQ1osSUFBSSxFQUFFLElBQUk7cUJBQ1g7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICdAYXdzLWNkay9hc3NlcnQvamVzdCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb3JlLCBHcm91cCwgIEdlbmVyaWMgfSBmcm9tICcuLi9saWInO1xuaW1wb3J0ICogYXMgaW90IGZyb20gJ0Bhd3MtY2RrL2F3cy1pb3QnO1xuLy9pbXBvcnQgeyBTeW50aFV0aWxzIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0JztcblxuXG5cbnZhciBzdGFjazogY2RrLlN0YWNrO1xudmFyIHQ6IGlvdC5DZm5UaGluZztcbnZhciBjOiBDb3JlO1xuXG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBjZGsuU3RhY2s7XG4gIHQgPSBuZXcgaW90LkNmblRoaW5nKHN0YWNrLCAnYV90aGluZycsIHtcbiAgICB0aGluZ05hbWU6ICd0ZXN0VGhpbmcnXG4gIH0pXG4gIGMgPSBuZXcgQ29yZShzdGFjaywgJ015Q29yZScsIHtcbiAgICBjZXJ0aWZpY2F0ZUFybjogJ0FBQScsXG4gICAgc3luY1NoYWRvdzogdHJ1ZSxcbiAgICB0aGluZzogdFxuICB9KTtcblxufSlcblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShTeW50aFV0aWxzLnRvQ2xvdWRGb3JtYXRpb24oc3RhY2spLCB1bmRlZmluZWQsIDIpKVxufSk7XG5cblxudGVzdCgnQ29ubmVjdG9ycycsICgpID0+IHtcbiAgbGV0IGcgPSBuZXcgR2VuZXJpYyhzdGFjaywgJ2EgY29ubmVjdG9yJywge1xuICAgIG5hbWU6ICdJb1RBbmFseXRpY3MnLFxuICAgIHZlcnNpb246IDQsXG4gICAgcGFyYW1ldGVyczoge1xuICAgICAgXCJwMVwiOiBcInYxXCJcbiAgICB9XG4gIH0pXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgY29ubmVjdG9yczogW2ddXG4gIH0pXG5cbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6Q29ubmVjdG9yRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgXCJDb25uZWN0b3JzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiQ29ubmVjdG9yQXJuXCI6IFwiYXJuOmF3czpncmVlbmdyYXNzOnJlZ2lvbjo6L2Nvbm5lY3RvcnMvSW9UQW5hbHl0aWNzL3ZlcnNpb25zLzRcIixcbiAgICAgICAgICBcIklkXCI6IFwiYSBjb25uZWN0b3JcIixcbiAgICAgICAgICBcIlBhcmFtZXRlcnNcIjoge1xuICAgICAgICAgICAgXCJwMVwiOiBcInYxXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSlcblxuXG5cblxuXG5cbiJdfQ==