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
test('AutoIp', () => {
    new lib_1.Group(stack, 'group', {
        core: c,
        enableAutomaticIpDiscovery: true,
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
        InitialVersion: {
            Functions: [
                {
                    "FunctionArn": "arn:aws:lambda:::function:GGIPDetector:1",
                    "FunctionConfiguration": {
                        "MemorySize": 32768,
                        "Pinned": true,
                        "Timeout": 3
                    },
                    "Id": "auto_ip"
                },
            ]
        }
    });
});
test('Stream Manager', () => {
    new lib_1.Group(stack, 'group', {
        core: c,
        streamManager: {
            enableStreamManager: true,
            allowInsecureAccess: true
        }
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
        InitialVersion: {
            Functions: [
                {
                    "FunctionArn": "arn:aws:lambda:::function:GGStreamManager:1",
                    "FunctionConfiguration": {
                        "EncodingType": "binary",
                        "Environment": {
                            "Variables": {
                                "STREAM_MANAGER_AUTHENTICATE_CLIENT": "false"
                            }
                        },
                        "Pinned": true,
                        "Timeout": 3
                    },
                    "Id": "stream_manager"
                },
            ]
        }
    });
});
test('Cloud Spooler', () => {
    new lib_1.Group(stack, 'group', {
        core: c,
        cloudSpooler: {
            storage: {
                type: lib_1.CloudSpoolerStorageType.FILE_SYSTEM,
                maxSize: core_1.Size.mebibytes(3)
            },
            enablePersistentSessions: true
        },
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
        InitialVersion: {
            Functions: [
                {
                    "FunctionArn": "arn:aws:lambda:::function:GGCloudSpooler:1",
                    "FunctionConfiguration": {
                        "Environment": {
                            "Variables": {
                                "GG_CONFIG_STORAGE_TYPE": "FileSystem",
                                "GG_CONFIG_MAX_SIZE_BYTES": 3072,
                                "GG_CONFIG_SUBSCRIPTION_QUALITY": "AtLeastOncePersistent"
                            }
                        },
                        "Executable": "spooler",
                        "MemorySize": 32768,
                        "Pinned": true,
                        "Timeout": 3
                    },
                    "Id": "spooler"
                }
            ]
        }
    });
});
test('Cloud Spooler - QoS0', () => {
    new lib_1.Group(stack, 'group', {
        core: c,
        cloudSpooler: {
            storage: {
                type: lib_1.CloudSpoolerStorageType.FILE_SYSTEM,
                maxSize: core_1.Size.mebibytes(3)
            }
        },
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::FunctionDefinition', {
        InitialVersion: {
            Functions: [
                {
                    "FunctionArn": "arn:aws:lambda:::function:GGCloudSpooler:1",
                    "FunctionConfiguration": {
                        "Environment": {
                            "Variables": {
                                "GG_CONFIG_STORAGE_TYPE": "FileSystem",
                                "GG_CONFIG_MAX_SIZE_BYTES": 3072,
                                "GG_CONFIG_SUBSCRIPTION_QUALITY": "AtMostOnce"
                            }
                        },
                        "Executable": "spooler",
                        "MemorySize": 32768,
                        "Pinned": true,
                        "Timeout": 3
                    },
                    "Id": "spooler"
                }
            ]
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtY29uZi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ3JvdXAtY29uZi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUE2RDtBQUM3RCx3Q0FBd0M7QUFDeEMsd0NBQXFDO0FBQ3JDLCtDQUErQztBQUkvQyxJQUFJLEtBQWdCLENBQUM7QUFDckIsSUFBSSxDQUFlLENBQUM7QUFDcEIsSUFBSSxDQUFPLENBQUM7QUFFWixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDckMsU0FBUyxFQUFFLFdBQVc7S0FDdkIsQ0FBQyxDQUFBO0lBQ0YsQ0FBQyxHQUFHLElBQUksVUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDNUIsY0FBYyxFQUFFLEtBQUs7UUFDckIsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQTtBQUVGLFNBQVMsQ0FBQyxHQUFHLEVBQUU7SUFDYiwrRUFBK0U7QUFDakYsQ0FBQyxDQUFDLENBQUM7QUFJSCxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUVsQixJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1FBQ3hCLElBQUksRUFBRSxDQUFDO1FBQ1AsMEJBQTBCLEVBQUUsSUFBSTtLQUNqQyxDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMscUNBQXFDLEVBQUU7UUFDdEUsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLGFBQWEsRUFBRSwwQ0FBMEM7b0JB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QUUsSUFBSTtnQ0FDaEMsZ0NBQWdDLEVBQUUsWUFBWTs2QkFDL0M7eUJBQ0Y7d0JBQ0QsWUFBWSxFQUFFLFNBQVM7d0JBQ3ZCLFlBQVksRUFBRSxLQUFLO3dCQUNuQixRQUFRLEVBQUUsSUFBSTt3QkFDZCxTQUFTLEVBQUUsQ0FBQztxQkFDYjtvQkFDRCxJQUFJLEVBQUUsU0FBUztpQkFDaEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICdAYXdzLWNkay9hc3NlcnQvamVzdCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb3JlLCBHcm91cCwgQ2xvdWRTcG9vbGVyU3RvcmFnZVR5cGV9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgKiBhcyBpb3QgZnJvbSAnQGF3cy1jZGsvYXdzLWlvdCc7XG5pbXBvcnQgeyBTaXplIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG4vL2ltcG9ydCB7IFN5bnRoVXRpbHMgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuXG5cblxudmFyIHN0YWNrOiBjZGsuU3RhY2s7XG52YXIgdDogaW90LkNmblRoaW5nO1xudmFyIGM6IENvcmU7XG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBjZGsuU3RhY2s7XG4gIHQgPSBuZXcgaW90LkNmblRoaW5nKHN0YWNrLCAnYV90aGluZycsIHtcbiAgICB0aGluZ05hbWU6ICd0ZXN0VGhpbmcnXG4gIH0pXG4gIGMgPSBuZXcgQ29yZShzdGFjaywgJ015Q29yZScsIHtcbiAgICBjZXJ0aWZpY2F0ZUFybjogJ0FBQScsXG4gICAgc3luY1NoYWRvdzogdHJ1ZSxcbiAgICB0aGluZzogdFxuICB9KTtcbn0pXG5cbmFmdGVyRWFjaCgoKSA9PiB7XG4gIC8vY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoU3ludGhVdGlscy50b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSwgdW5kZWZpbmVkLCAyKSlcbn0pO1xuXG5cblxudGVzdCgnQXV0b0lwJywgKCkgPT4ge1xuXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgZW5hYmxlQXV0b21hdGljSXBEaXNjb3Zlcnk6IHRydWUsXG4gIH0pXG5cbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6RnVuY3Rpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBGdW5jdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiRnVuY3Rpb25Bcm5cIjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHSVBEZXRlY3RvcjoxXCIsXG4gICAgICAgICAgXCJGdW5jdGlvbkNvbmZpZ3VyYXRpb25cIjoge1xuICAgICAgICAgICAgXCJNZW1vcnlTaXplXCI6IDMyNzY4LFxuICAgICAgICAgICAgXCJQaW5uZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwiYXV0b19pcFwiXG4gICAgICAgIH0sXG4gICAgICBdXG4gICAgfVxuICB9KTtcbn0pO1xuXG50ZXN0KCdTdHJlYW0gTWFuYWdlcicsICgpID0+IHtcblxuICBuZXcgR3JvdXAoc3RhY2ssICdncm91cCcsIHtcbiAgICBjb3JlOiBjLFxuICAgIHN0cmVhbU1hbmFnZXI6IHtcbiAgICAgIGVuYWJsZVN0cmVhbU1hbmFnZXI6IHRydWUsXG4gICAgICBhbGxvd0luc2VjdXJlQWNjZXNzOiB0cnVlXG4gICAgfVxuICB9KVxuXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OkZ1bmN0aW9uRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgRnVuY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIkZ1bmN0aW9uQXJuXCI6IFwiYXJuOmF3czpsYW1iZGE6OjpmdW5jdGlvbjpHR1N0cmVhbU1hbmFnZXI6MVwiLFxuICAgICAgICAgIFwiRnVuY3Rpb25Db25maWd1cmF0aW9uXCI6IHtcbiAgICAgICAgICAgIFwiRW5jb2RpbmdUeXBlXCI6IFwiYmluYXJ5XCIsXG4gICAgICAgICAgICBcIkVudmlyb25tZW50XCI6IHtcbiAgICAgICAgICAgICAgXCJWYXJpYWJsZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiU1RSRUFNX01BTkFHRVJfQVVUSEVOVElDQVRFX0NMSUVOVFwiOiBcImZhbHNlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiUGlubmVkXCI6IHRydWUsXG4gICAgICAgICAgICBcIlRpbWVvdXRcIjogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJJZFwiOiBcInN0cmVhbV9tYW5hZ2VyXCJcbiAgICAgICAgfSxcbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSk7XG5cblxuXG50ZXN0KCdDbG91ZCBTcG9vbGVyJywgKCkgPT4ge1xuXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgY2xvdWRTcG9vbGVyOiB7XG4gICAgICBzdG9yYWdlOiB7XG4gICAgICAgIHR5cGU6IENsb3VkU3Bvb2xlclN0b3JhZ2VUeXBlLkZJTEVfU1lTVEVNLFxuICAgICAgICBtYXhTaXplOiBTaXplLm1lYmlieXRlcygzKVxuICAgICAgfSxcbiAgICAgIGVuYWJsZVBlcnNpc3RlbnRTZXNzaW9uczogdHJ1ZVxuICAgIH0sXG4gIH0pXG5cbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6RnVuY3Rpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBGdW5jdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiRnVuY3Rpb25Bcm5cIjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHQ2xvdWRTcG9vbGVyOjFcIixcbiAgICAgICAgICBcIkZ1bmN0aW9uQ29uZmlndXJhdGlvblwiOiB7XG4gICAgICAgICAgICBcIkVudmlyb25tZW50XCI6IHtcbiAgICAgICAgICAgICAgXCJWYXJpYWJsZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX1NUT1JBR0VfVFlQRVwiOiBcIkZpbGVTeXN0ZW1cIixcbiAgICAgICAgICAgICAgICBcIkdHX0NPTkZJR19NQVhfU0laRV9CWVRFU1wiOiAzMDcyLFxuICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX1NVQlNDUklQVElPTl9RVUFMSVRZXCI6IFwiQXRMZWFzdE9uY2VQZXJzaXN0ZW50XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiRXhlY3V0YWJsZVwiOiBcInNwb29sZXJcIixcbiAgICAgICAgICAgIFwiTWVtb3J5U2l6ZVwiOiAzMjc2OCxcbiAgICAgICAgICAgIFwiUGlubmVkXCI6IHRydWUsXG4gICAgICAgICAgICBcIlRpbWVvdXRcIjogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJJZFwiOiBcInNwb29sZXJcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcbn0pO1xuXG50ZXN0KCdDbG91ZCBTcG9vbGVyIC0gUW9TMCcsICgpID0+IHtcblxuICBuZXcgR3JvdXAoc3RhY2ssICdncm91cCcsIHtcbiAgICBjb3JlOiBjLFxuICAgIGNsb3VkU3Bvb2xlcjoge1xuICAgICAgc3RvcmFnZToge1xuICAgICAgICB0eXBlOiBDbG91ZFNwb29sZXJTdG9yYWdlVHlwZS5GSUxFX1NZU1RFTSxcbiAgICAgICAgbWF4U2l6ZTogU2l6ZS5tZWJpYnl0ZXMoMylcbiAgICAgIH1cbiAgICB9LFxuICB9KVxuXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OkZ1bmN0aW9uRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgRnVuY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIkZ1bmN0aW9uQXJuXCI6IFwiYXJuOmF3czpsYW1iZGE6OjpmdW5jdGlvbjpHR0Nsb3VkU3Bvb2xlcjoxXCIsXG4gICAgICAgICAgXCJGdW5jdGlvbkNvbmZpZ3VyYXRpb25cIjoge1xuICAgICAgICAgICAgXCJFbnZpcm9ubWVudFwiOiB7XG4gICAgICAgICAgICAgIFwiVmFyaWFibGVzXCI6IHtcbiAgICAgICAgICAgICAgICBcIkdHX0NPTkZJR19TVE9SQUdFX1RZUEVcIjogXCJGaWxlU3lzdGVtXCIsXG4gICAgICAgICAgICAgICAgXCJHR19DT05GSUdfTUFYX1NJWkVfQllURVNcIjogMzA3MixcbiAgICAgICAgICAgICAgICBcIkdHX0NPTkZJR19TVUJTQ1JJUFRJT05fUVVBTElUWVwiOiBcIkF0TW9zdE9uY2VcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJFeGVjdXRhYmxlXCI6IFwic3Bvb2xlclwiLFxuICAgICAgICAgICAgXCJNZW1vcnlTaXplXCI6IDMyNzY4LFxuICAgICAgICAgICAgXCJQaW5uZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwic3Bvb2xlclwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSk7Il19