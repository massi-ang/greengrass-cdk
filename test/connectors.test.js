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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdG9ycy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29ubmVjdG9ycy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMsNENBQTZDO0FBSTdDLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLENBQWUsQ0FBQztBQUNwQixJQUFJLENBQU8sQ0FBQztBQUdaLFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUNyQyxTQUFTLEVBQUUsV0FBVztLQUN2QixDQUFDLENBQUE7SUFDRixDQUFDLEdBQUcsSUFBSSxVQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUM1QixjQUFjLEVBQUUsS0FBSztRQUNyQixVQUFVLEVBQUUsSUFBSTtRQUNoQixLQUFLLEVBQUUsQ0FBQztLQUNULENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFBO0FBRUYsU0FBUyxDQUFDLEdBQUcsRUFBRTtJQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBVSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9FLENBQUMsQ0FBQyxDQUFDO0FBR0gsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7SUFDdEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxhQUFPLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtRQUN4QyxJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsQ0FBQztRQUNWLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxJQUFJO1NBQ1g7S0FDRixDQUFDLENBQUE7SUFDRixJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1FBQ3hCLElBQUksRUFBRSxDQUFDO1FBQ1AsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2hCLENBQUMsQ0FBQTtJQUVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxzQ0FBc0MsRUFBRTtRQUN2RSxjQUFjLEVBQUU7WUFDZCxZQUFZLEVBQUU7Z0JBQ1o7b0JBQ0UsY0FBYyxFQUFFLGdFQUFnRTtvQkFDaEYsSUFBSSxFQUFFLGFBQWE7b0JBQ25CLFlBQVksRUFBRTt3QkFDWixJQUFJLEVBQUUsSUFBSTtxQkFDWDtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qIFxuICogIENvcHlyaWdodCAyMDIwIEFtYXpvbi5jb20gb3IgaXRzIGFmZmlsaWF0ZXNcbiAqICBcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqICBcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqICBcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgJ0Bhd3MtY2RrL2Fzc2VydC9qZXN0JztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvcmUsIEdyb3VwLCAgR2VuZXJpYyB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgKiBhcyBpb3QgZnJvbSAnQGF3cy1jZGsvYXdzLWlvdCc7XG5pbXBvcnQgeyBTeW50aFV0aWxzIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0JztcblxuXG5cbnZhciBzdGFjazogY2RrLlN0YWNrO1xudmFyIHQ6IGlvdC5DZm5UaGluZztcbnZhciBjOiBDb3JlO1xuXG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBjZGsuU3RhY2s7XG4gIHQgPSBuZXcgaW90LkNmblRoaW5nKHN0YWNrLCAnYV90aGluZycsIHtcbiAgICB0aGluZ05hbWU6ICd0ZXN0VGhpbmcnXG4gIH0pXG4gIGMgPSBuZXcgQ29yZShzdGFjaywgJ015Q29yZScsIHtcbiAgICBjZXJ0aWZpY2F0ZUFybjogJ0FBQScsXG4gICAgc3luY1NoYWRvdzogdHJ1ZSxcbiAgICB0aGluZzogdFxuICB9KTtcblxufSlcblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoU3ludGhVdGlscy50b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSwgdW5kZWZpbmVkLCAyKSlcbn0pO1xuXG5cbnRlc3QoJ0Nvbm5lY3RvcnMnLCAoKSA9PiB7XG4gIGxldCBnID0gbmV3IEdlbmVyaWMoc3RhY2ssICdhIGNvbm5lY3RvcicsIHtcbiAgICBuYW1lOiAnSW9UQW5hbHl0aWNzJyxcbiAgICB2ZXJzaW9uOiA0LFxuICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgIFwicDFcIjogXCJ2MVwiXG4gICAgfVxuICB9KVxuICBuZXcgR3JvdXAoc3RhY2ssICdncm91cCcsIHtcbiAgICBjb3JlOiBjLFxuICAgIGNvbm5lY3RvcnM6IFtnXVxuICB9KVxuXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OkNvbm5lY3RvckRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIFwiQ29ubmVjdG9yc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIkNvbm5lY3RvckFyblwiOiBcImFybjphd3M6Z3JlZW5ncmFzczpyZWdpb246Oi9jb25uZWN0b3JzL0lvVEFuYWx5dGljcy92ZXJzaW9ucy80XCIsXG4gICAgICAgICAgXCJJZFwiOiBcImEgY29ubmVjdG9yXCIsXG4gICAgICAgICAgXCJQYXJhbWV0ZXJzXCI6IHtcbiAgICAgICAgICAgIFwicDFcIjogXCJ2MVwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcbn0pXG5cblxuXG5cblxuXG4iXX0=