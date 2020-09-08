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
test('Empty Stack', () => {
    const stack = new cdk.Stack();
    // WHEN
    const t = new iot.CfnThing(stack, 'a_thing', {
        thingName: 'testThing'
    });
    let c = new lib_1.Core(stack, 'MyCore', {
        certificateArn: 'AAA',
        syncShadow: true,
        thing: t
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGsudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7O0FBRUgsZ0NBQThCO0FBQzlCLHFDQUFxQztBQUNyQyxnQ0FBcUM7QUFDckMsd0NBQXdDO0FBR3hDLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQ3ZCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzlCLE9BQU87SUFDUCxNQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUMzQyxTQUFTLEVBQUUsV0FBVztLQUN2QixDQUFDLENBQUE7SUFDRixJQUFJLENBQUMsR0FBRyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ2hDLGNBQWMsRUFBRSxLQUFLO1FBQ3JCLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLEtBQUssRUFBRSxDQUFDO0tBQ1QsQ0FBQyxDQUFDO0lBRUgsSUFBSSxXQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUN4QixJQUFJLEVBQUUsQ0FBQztLQUNSLENBQUMsQ0FBQTtJQUNGLE9BQU87SUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMsaUNBQWlDLEVBQUU7UUFFaEUsY0FBYyxFQUFFO1lBQ2QsS0FBSyxFQUFFO2dCQUNMO29CQUNFLGNBQWMsRUFBRSxLQUFLO29CQUNyQixVQUFVLEVBQUUsSUFBSTtpQkFDakI7YUFDRjtTQUNGO0tBQ0osQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICdAYXdzLWNkay9hc3NlcnQvamVzdCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb3JlLCBHcm91cCB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgKiBhcyBpb3QgZnJvbSAnQGF3cy1jZGsvYXdzLWlvdCc7XG5cblxudGVzdCgnRW1wdHkgU3RhY2snLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAvLyBXSEVOXG4gIGNvbnN0IHQgPSBuZXcgaW90LkNmblRoaW5nKHN0YWNrLCAnYV90aGluZycsIHtcbiAgICB0aGluZ05hbWU6ICd0ZXN0VGhpbmcnXG4gIH0pXG4gIGxldCBjID0gbmV3IENvcmUoc3RhY2ssICdNeUNvcmUnLCB7XG4gICAgY2VydGlmaWNhdGVBcm46ICdBQUEnLFxuICAgIHN5bmNTaGFkb3c6IHRydWUsXG4gICAgdGhpbmc6IHRcbiAgfSk7XG5cbiAgbmV3IEdyb3VwKHN0YWNrLCAnZ3JvdXAnLCB7XG4gICAgY29yZTogY1xuICB9KVxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OkNvcmVEZWZpbml0aW9uJywge1xuXG4gICAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgICBDb3JlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENlcnRpZmljYXRlQXJuOiAnQUFBJyxcbiAgICAgICAgICAgIFN5bmNTaGFkb3c6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==