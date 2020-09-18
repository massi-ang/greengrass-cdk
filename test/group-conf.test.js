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
                        "Timeout": 3,
                        "MemorySize": 128000
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtY29uZi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ3JvdXAtY29uZi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUE2RDtBQUM3RCx3Q0FBd0M7QUFDeEMsd0NBQXFDO0FBQ3JDLCtDQUErQztBQUkvQyxJQUFJLEtBQWdCLENBQUM7QUFDckIsSUFBSSxDQUFlLENBQUM7QUFDcEIsSUFBSSxDQUFPLENBQUM7QUFFWixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDckMsU0FBUyxFQUFFLFdBQVc7S0FDdkIsQ0FBQyxDQUFBO0lBQ0YsQ0FBQyxHQUFHLElBQUksVUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDNUIsY0FBYyxFQUFFLEtBQUs7UUFDckIsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQTtBQUVGLFNBQVMsQ0FBQyxHQUFHLEVBQUU7SUFDYiwrRUFBK0U7QUFDakYsQ0FBQyxDQUFDLENBQUM7QUFJSCxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUVsQixJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1FBQ3hCLElBQUksRUFBRSxDQUFDO1FBQ1AsMEJBQTBCLEVBQUUsSUFBSTtLQUNqQyxDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMscUNBQXFDLEVBQUU7UUFDdEUsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLGFBQWEsRUFBRSwwQ0FBMEM7b0JB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LFlBQVk7Z0NBQ3RDLDBCQUEwQixFQUFFLElBQUk7Z0NBQ2hDLGdDQUFnQyxFQUFFLFlBQVk7NkJBQy9DO3lCQUNGO3dCQUNELFlBQVksRUFBRSxTQUFTO3dCQUN2QixZQUFZLEVBQUUsS0FBSzt3QkFDbkIsUUFBUSxFQUFFLElBQUk7d0JBQ2QsU0FBUyxFQUFFLENBQUM7cUJBQ2I7b0JBQ0QsSUFBSSxFQUFFLFNBQVM7aUJBQ2hCO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAnQGF3cy1jZGsvYXNzZXJ0L2plc3QnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29yZSwgR3JvdXAsIENsb3VkU3Bvb2xlclN0b3JhZ2VUeXBlfSBmcm9tICcuLi9saWInO1xuaW1wb3J0ICogYXMgaW90IGZyb20gJ0Bhd3MtY2RrL2F3cy1pb3QnO1xuaW1wb3J0IHsgU2l6ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuLy9pbXBvcnQgeyBTeW50aFV0aWxzIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0JztcblxuXG5cbnZhciBzdGFjazogY2RrLlN0YWNrO1xudmFyIHQ6IGlvdC5DZm5UaGluZztcbnZhciBjOiBDb3JlO1xuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrO1xuICB0ID0gbmV3IGlvdC5DZm5UaGluZyhzdGFjaywgJ2FfdGhpbmcnLCB7XG4gICAgdGhpbmdOYW1lOiAndGVzdFRoaW5nJ1xuICB9KVxuICBjID0gbmV3IENvcmUoc3RhY2ssICdNeUNvcmUnLCB7XG4gICAgY2VydGlmaWNhdGVBcm46ICdBQUEnLFxuICAgIHN5bmNTaGFkb3c6IHRydWUsXG4gICAgdGhpbmc6IHRcbiAgfSk7XG59KVxuXG5hZnRlckVhY2goKCkgPT4ge1xuICAvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KFN5bnRoVXRpbHMudG9DbG91ZEZvcm1hdGlvbihzdGFjayksIHVuZGVmaW5lZCwgMikpXG59KTtcblxuXG5cbnRlc3QoJ0F1dG9JcCcsICgpID0+IHtcblxuICBuZXcgR3JvdXAoc3RhY2ssICdncm91cCcsIHtcbiAgICBjb3JlOiBjLFxuICAgIGVuYWJsZUF1dG9tYXRpY0lwRGlzY292ZXJ5OiB0cnVlLFxuICB9KVxuXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OkZ1bmN0aW9uRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgRnVuY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIkZ1bmN0aW9uQXJuXCI6IFwiYXJuOmF3czpsYW1iZGE6OjpmdW5jdGlvbjpHR0lQRGV0ZWN0b3I6MVwiLFxuICAgICAgICAgIFwiRnVuY3Rpb25Db25maWd1cmF0aW9uXCI6IHtcbiAgICAgICAgICAgIFwiTWVtb3J5U2l6ZVwiOiAzMjc2OCxcbiAgICAgICAgICAgIFwiUGlubmVkXCI6IHRydWUsXG4gICAgICAgICAgICBcIlRpbWVvdXRcIjogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJJZFwiOiBcImF1dG9faXBcIlxuICAgICAgICB9LFxuICAgICAgXVxuICAgIH1cbiAgfSk7XG59KTtcblxudGVzdCgnU3RyZWFtIE1hbmFnZXInLCAoKSA9PiB7XG5cbiAgbmV3IEdyb3VwKHN0YWNrLCAnZ3JvdXAnLCB7XG4gICAgY29yZTogYyxcbiAgICBzdHJlYW1NYW5hZ2VyOiB7XG4gICAgICBlbmFibGVTdHJlYW1NYW5hZ2VyOiB0cnVlLFxuICAgICAgYWxsb3dJbnNlY3VyZUFjY2VzczogdHJ1ZVxuICAgIH1cbiAgfSlcblxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpGdW5jdGlvbkRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIEZ1bmN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJGdW5jdGlvbkFyblwiOiBcImFybjphd3M6bGFtYmRhOjo6ZnVuY3Rpb246R0dTdHJlYW1NYW5hZ2VyOjFcIixcbiAgICAgICAgICBcIkZ1bmN0aW9uQ29uZmlndXJhdGlvblwiOiB7XG4gICAgICAgICAgICBcIkVuY29kaW5nVHlwZVwiOiBcImJpbmFyeVwiLFxuICAgICAgICAgICAgXCJFbnZpcm9ubWVudFwiOiB7XG4gICAgICAgICAgICAgIFwiVmFyaWFibGVzXCI6IHtcbiAgICAgICAgICAgICAgICBcIlNUUkVBTV9NQU5BR0VSX0FVVEhFTlRJQ0FURV9DTElFTlRcIjogXCJmYWxzZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIlBpbm5lZFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJUaW1lb3V0XCI6IDMsXG4gICAgICAgICAgICBcIk1lbW9yeVNpemVcIjogMTI4MDAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwic3RyZWFtX21hbmFnZXJcIlxuICAgICAgICB9LFxuICAgICAgXVxuICAgIH1cbiAgfSk7XG59KTtcblxuXG5cbnRlc3QoJ0Nsb3VkIFNwb29sZXInLCAoKSA9PiB7XG5cbiAgbmV3IEdyb3VwKHN0YWNrLCAnZ3JvdXAnLCB7XG4gICAgY29yZTogYyxcbiAgICBjbG91ZFNwb29sZXI6IHtcbiAgICAgIHN0b3JhZ2U6IHtcbiAgICAgICAgdHlwZTogQ2xvdWRTcG9vbGVyU3RvcmFnZVR5cGUuRklMRV9TWVNURU0sXG4gICAgICAgIG1heFNpemU6IFNpemUubWViaWJ5dGVzKDMpXG4gICAgICB9LFxuICAgICAgZW5hYmxlUGVyc2lzdGVudFNlc3Npb25zOiB0cnVlXG4gICAgfSxcbiAgfSlcblxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpGdW5jdGlvbkRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIEZ1bmN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJGdW5jdGlvbkFyblwiOiBcImFybjphd3M6bGFtYmRhOjo6ZnVuY3Rpb246R0dDbG91ZFNwb29sZXI6MVwiLFxuICAgICAgICAgIFwiRnVuY3Rpb25Db25maWd1cmF0aW9uXCI6IHtcbiAgICAgICAgICAgIFwiRW52aXJvbm1lbnRcIjoge1xuICAgICAgICAgICAgICBcIlZhcmlhYmxlc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJHR19DT05GSUdfU1RPUkFHRV9UWVBFXCI6IFwiRmlsZVN5c3RlbVwiLFxuICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX01BWF9TSVpFX0JZVEVTXCI6IDMwNzIsXG4gICAgICAgICAgICAgICAgXCJHR19DT05GSUdfU1VCU0NSSVBUSU9OX1FVQUxJVFlcIjogXCJBdExlYXN0T25jZVBlcnNpc3RlbnRcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJFeGVjdXRhYmxlXCI6IFwic3Bvb2xlclwiLFxuICAgICAgICAgICAgXCJNZW1vcnlTaXplXCI6IDMyNzY4LFxuICAgICAgICAgICAgXCJQaW5uZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwic3Bvb2xlclwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSk7XG5cbnRlc3QoJ0Nsb3VkIFNwb29sZXIgLSBRb1MwJywgKCkgPT4ge1xuXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgY2xvdWRTcG9vbGVyOiB7XG4gICAgICBzdG9yYWdlOiB7XG4gICAgICAgIHR5cGU6IENsb3VkU3Bvb2xlclN0b3JhZ2VUeXBlLkZJTEVfU1lTVEVNLFxuICAgICAgICBtYXhTaXplOiBTaXplLm1lYmlieXRlcygzKVxuICAgICAgfVxuICAgIH0sXG4gIH0pXG5cbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6RnVuY3Rpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBGdW5jdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiRnVuY3Rpb25Bcm5cIjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHQ2xvdWRTcG9vbGVyOjFcIixcbiAgICAgICAgICBcIkZ1bmN0aW9uQ29uZmlndXJhdGlvblwiOiB7XG4gICAgICAgICAgICBcIkVudmlyb25tZW50XCI6IHtcbiAgICAgICAgICAgICAgXCJWYXJpYWJsZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX1NUT1JBR0VfVFlQRVwiOiBcIkZpbGVTeXN0ZW1cIixcbiAgICAgICAgICAgICAgICBcIkdHX0NPTkZJR19NQVhfU0laRV9CWVRFU1wiOiAzMDcyLFxuICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX1NVQlNDUklQVElPTl9RVUFMSVRZXCI6IFwiQXRNb3N0T25jZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIkV4ZWN1dGFibGVcIjogXCJzcG9vbGVyXCIsXG4gICAgICAgICAgICBcIk1lbW9yeVNpemVcIjogMzI3NjgsXG4gICAgICAgICAgICBcIlBpbm5lZFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJUaW1lb3V0XCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiSWRcIjogXCJzcG9vbGVyXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG59KTsiXX0=