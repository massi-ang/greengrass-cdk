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
                        "Fn::Join": [
                            "",
                            [
                                "arn:",
                                {
                                    "Ref": "AWS::Partition"
                                },
                                ":iot:",
                                {
                                    "Ref": "AWS::Region"
                                },
                                ":",
                                {
                                    "Ref": "AWS::AccountId"
                                },
                                ":thing/testThing"
                            ]
                        ]
                    }
                }
            ]
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2aWNlcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGV2aWNlcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUE4QztBQUM5Qyx3Q0FBd0M7QUFDeEMsK0NBQStDO0FBSS9DLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLENBQWUsQ0FBQztBQUNwQixJQUFJLENBQU8sQ0FBQztBQUdaLFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUNyQyxTQUFTLEVBQUUsV0FBVztLQUN2QixDQUFDLENBQUE7SUFDRixDQUFDLEdBQUcsSUFBSSxVQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUM1QixjQUFjLEVBQUUsS0FBSztRQUNyQixVQUFVLEVBQUUsSUFBSTtRQUNoQixLQUFLLEVBQUUsQ0FBQztLQUNULENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFBO0FBRUYsU0FBUyxDQUFDLEdBQUcsRUFBRTtJQUNiLCtFQUErRTtBQUNqRixDQUFDLENBQUMsQ0FBQztBQUdILElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO0lBQ25CLElBQUksQ0FBQyxHQUFHLElBQUksWUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7UUFDcEMsY0FBYyxFQUFFLFVBQVU7UUFDMUIsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDLENBQUE7SUFDRixJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1FBQ3hCLElBQUksRUFBRSxDQUFDO1FBQ1AsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2IsQ0FBQyxDQUFBO0lBRUYsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLGtCQUFrQixDQUFDLG1DQUFtQyxFQUFFO1FBQ3BFLGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxnQkFBZ0IsRUFBRSxVQUFVO29CQUM1QixJQUFJLEVBQUUsVUFBVTtvQkFDaEIsWUFBWSxFQUFFLElBQUk7b0JBQ2xCLFVBQVUsRUFBRTt3QkFDRixVQUFVLEVBQUU7NEJBQ3BCLEVBQUU7NEJBQ0Y7Z0NBQ0UsTUFBTTtnQ0FDTjtvQ0FDRSxLQUFLLEVBQUUsZ0JBQWdCO2lDQUN4QjtnQ0FDRCxPQUFPO2dDQUNQO29DQUNFLEtBQUssRUFBRSxhQUFhO2lDQUNyQjtnQ0FDRCxHQUFHO2dDQUNIO29DQUNFLEtBQUssRUFBRSxnQkFBZ0I7aUNBQ3hCO2dDQUNELGtCQUFrQjs2QkFDbkI7eUJBQ0Y7cUJBQ1E7aUJBQ1Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICdAYXdzLWNkay9hc3NlcnQvamVzdCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb3JlLCBHcm91cCwgIERldmljZSB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgKiBhcyBpb3QgZnJvbSAnQGF3cy1jZGsvYXdzLWlvdCc7XG4vL2ltcG9ydCB7IFN5bnRoVXRpbHMgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuXG5cblxudmFyIHN0YWNrOiBjZGsuU3RhY2s7XG52YXIgdDogaW90LkNmblRoaW5nO1xudmFyIGM6IENvcmU7XG5cblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHN0YWNrID0gbmV3IGNkay5TdGFjaztcbiAgdCA9IG5ldyBpb3QuQ2ZuVGhpbmcoc3RhY2ssICdhX3RoaW5nJywge1xuICAgIHRoaW5nTmFtZTogJ3Rlc3RUaGluZydcbiAgfSlcbiAgYyA9IG5ldyBDb3JlKHN0YWNrLCAnTXlDb3JlJywge1xuICAgIGNlcnRpZmljYXRlQXJuOiAnQUFBJyxcbiAgICBzeW5jU2hhZG93OiB0cnVlLFxuICAgIHRoaW5nOiB0XG4gIH0pO1xuXG59KVxuXG5hZnRlckVhY2goKCkgPT4ge1xuICAvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KFN5bnRoVXRpbHMudG9DbG91ZEZvcm1hdGlvbihzdGFjayksIHVuZGVmaW5lZCwgMikpXG59KTtcblxuXG50ZXN0KCdEZXZpY2VzJywgKCkgPT4ge1xuICBsZXQgZCA9IG5ldyBEZXZpY2Uoc3RhY2ssICdhIGRldmljZScsIHtcbiAgICBjZXJ0aWZpY2F0ZUFybjogJ2Fybjo6eHh4JyxcbiAgICBzeW5jU2hhZG93OiB0cnVlLFxuICAgIHRoaW5nOiB0XG4gIH0pXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgZGV2aWNlczogW2RdXG4gIH0pXG5cbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6RGV2aWNlRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgXCJEZXZpY2VzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiQ2VydGlmaWNhdGVBcm5cIjogXCJhcm46Onh4eFwiLFxuICAgICAgICAgIFwiSWRcIjogXCJhIGRldmljZVwiLFxuICAgICAgICAgIFwiU3luY1NoYWRvd1wiOiB0cnVlLFxuICAgICAgICAgIFwiVGhpbmdBcm5cIjoge1xuICAgICAgICAgICAgICAgICAgICBcIkZuOjpKb2luXCI6IFtcbiAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIFwiYXJuOlwiLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJSZWZcIjogXCJBV1M6OlBhcnRpdGlvblwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiOmlvdDpcIixcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiUmVmXCI6IFwiQVdTOjpSZWdpb25cIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIjpcIixcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiUmVmXCI6IFwiQVdTOjpBY2NvdW50SWRcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIjp0aGluZy90ZXN0VGhpbmdcIlxuICAgICAgICAgICAgXVxuICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG59KVxuXG5cblxuXG5cblxuIl19