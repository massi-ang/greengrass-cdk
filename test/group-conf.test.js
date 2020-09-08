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
                                "GG_CONFIG_SUBSCRIPTION_QUALITY": true
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtY29uZi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ3JvdXAtY29uZi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUE2RDtBQUM3RCx3Q0FBd0M7QUFDeEMsd0NBQXFDO0FBQ3JDLCtDQUErQztBQUkvQyxJQUFJLEtBQWdCLENBQUM7QUFDckIsSUFBSSxDQUFlLENBQUM7QUFDcEIsSUFBSSxDQUFPLENBQUM7QUFFWixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDckMsU0FBUyxFQUFFLFdBQVc7S0FDdkIsQ0FBQyxDQUFBO0lBQ0YsQ0FBQyxHQUFHLElBQUksVUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDNUIsY0FBYyxFQUFFLEtBQUs7UUFDckIsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQTtBQUVGLFNBQVMsQ0FBQyxHQUFHLEVBQUU7SUFDYiwrRUFBK0U7QUFDakYsQ0FBQyxDQUFDLENBQUM7QUFJSCxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUVsQixJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1FBQ3hCLElBQUksRUFBRSxDQUFDO1FBQ1AsMEJBQTBCLEVBQUUsSUFBSTtLQUNqQyxDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMscUNBQXFDLEVBQUU7UUFDdEUsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLGFBQWEsRUFBRSwwQ0FBMEM7b0JBQ3pELHVCQUF1QixFQUFFO3dCQUN2QixZQUFZLEVBQUUsS0FBSzt3QkFDbkIsUUFBUSxFQUFFLElBQUk7d0JBQ2QsU0FBUyxFQUFFLENBQUM7cUJBQ2I7b0JBQ0QsSUFBSSxFQUFFLFNBQVM7aUJBQ2hCO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtJQUUxQixJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1FBQ3hCLElBQUksRUFBRSxDQUFDO1FBQ1AsYUFBYSxFQUFFO1lBQ2IsbUJBQW1CLEVBQUUsSUFBSTtZQUN6QixtQkFBbUIsRUFBRSxJQUFJO1NBQzFCO0tBQ0YsQ0FBQyxDQUFBO0lBRUYsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLGtCQUFrQixDQUFDLHFDQUFxQyxFQUFFO1FBQ3RFLGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxhQUFhLEVBQUUsNkNBQTZDO29CQUM1RCx1QkFBdUIsRUFBRTt3QkFDdkIsY0FBYyxFQUFFLFFBQVE7d0JBQ3hCLGFBQWEsRUFBRTs0QkFDYixXQUFXLEVBQUU7Z0NBQ1gsb0NBQW9DLEVBQUUsT0FBTzs2QkFDOUM7eUJBQ0Y7d0JBQ0QsUUFBUSxFQUFFLElBQUk7d0JBQ2QsU0FBUyxFQUFFLENBQUM7cUJBQ2I7b0JBQ0QsSUFBSSxFQUFFLGdCQUFnQjtpQkFDdkI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFJSCxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUV6QixJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1FBQ3hCLElBQUksRUFBRSxDQUFDO1FBQ1AsWUFBWSxFQUFFO1lBQ1osT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRSw2QkFBdUIsQ0FBQyxXQUFXO2dCQUN6QyxPQUFPLEVBQUUsV0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFDM0I7WUFDRCx3QkFBd0IsRUFBRSxJQUFJO1NBQy9CO0tBQ0YsQ0FBQyxDQUFBO0lBRUYsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLGtCQUFrQixDQUFDLHFDQUFxQyxFQUFFO1FBQ3RFLGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxhQUFhLEVBQUUsNENBQTRDO29CQUMzRCx1QkFBdUIsRUFBRTt3QkFDdkIsYUFBYSxFQUFFOzRCQUNiLFdBQVcsRUFBRTtnQ0FDWCx3QkFBd0IsRUFBRSxZQUFZO2dDQUN0QywwQkFBMEIsRUFBRSxJQUFJO2dDQUNoQyxnQ0FBZ0MsRUFBRSxJQUFJOzZCQUN2Qzt5QkFDRjt3QkFDRCxZQUFZLEVBQUUsU0FBUzt3QkFDdkIsWUFBWSxFQUFFLEtBQUs7d0JBQ25CLFFBQVEsRUFBRSxJQUFJO3dCQUNkLFNBQVMsRUFBRSxDQUFDO3FCQUNiO29CQUNELElBQUksRUFBRSxTQUFTO2lCQUNoQjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIFxuICogIENvcHlyaWdodCAyMDIwIEFtYXpvbi5jb20gb3IgaXRzIGFmZmlsaWF0ZXNcbiAqICBcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqICBcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqICBcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgJ0Bhd3MtY2RrL2Fzc2VydC9qZXN0JztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvcmUsIEdyb3VwLCBDbG91ZFNwb29sZXJTdG9yYWdlVHlwZX0gZnJvbSAnLi4vbGliJztcbmltcG9ydCAqIGFzIGlvdCBmcm9tICdAYXdzLWNkay9hd3MtaW90JztcbmltcG9ydCB7IFNpemUgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbi8vaW1wb3J0IHsgU3ludGhVdGlscyB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydCc7XG5cblxuXG52YXIgc3RhY2s6IGNkay5TdGFjaztcbnZhciB0OiBpb3QuQ2ZuVGhpbmc7XG52YXIgYzogQ29yZTtcblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHN0YWNrID0gbmV3IGNkay5TdGFjaztcbiAgdCA9IG5ldyBpb3QuQ2ZuVGhpbmcoc3RhY2ssICdhX3RoaW5nJywge1xuICAgIHRoaW5nTmFtZTogJ3Rlc3RUaGluZydcbiAgfSlcbiAgYyA9IG5ldyBDb3JlKHN0YWNrLCAnTXlDb3JlJywge1xuICAgIGNlcnRpZmljYXRlQXJuOiAnQUFBJyxcbiAgICBzeW5jU2hhZG93OiB0cnVlLFxuICAgIHRoaW5nOiB0XG4gIH0pO1xufSlcblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShTeW50aFV0aWxzLnRvQ2xvdWRGb3JtYXRpb24oc3RhY2spLCB1bmRlZmluZWQsIDIpKVxufSk7XG5cblxuXG50ZXN0KCdBdXRvSXAnLCAoKSA9PiB7XG5cbiAgbmV3IEdyb3VwKHN0YWNrLCAnZ3JvdXAnLCB7XG4gICAgY29yZTogYyxcbiAgICBlbmFibGVBdXRvbWF0aWNJcERpc2NvdmVyeTogdHJ1ZSxcbiAgfSlcblxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpGdW5jdGlvbkRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIEZ1bmN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJGdW5jdGlvbkFyblwiOiBcImFybjphd3M6bGFtYmRhOjo6ZnVuY3Rpb246R0dJUERldGVjdG9yOjFcIixcbiAgICAgICAgICBcIkZ1bmN0aW9uQ29uZmlndXJhdGlvblwiOiB7XG4gICAgICAgICAgICBcIk1lbW9yeVNpemVcIjogMzI3NjgsXG4gICAgICAgICAgICBcIlBpbm5lZFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJUaW1lb3V0XCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiSWRcIjogXCJhdXRvX2lwXCJcbiAgICAgICAgfSxcbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSk7XG5cbnRlc3QoJ1N0cmVhbSBNYW5hZ2VyJywgKCkgPT4ge1xuXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgc3RyZWFtTWFuYWdlcjoge1xuICAgICAgZW5hYmxlU3RyZWFtTWFuYWdlcjogdHJ1ZSxcbiAgICAgIGFsbG93SW5zZWN1cmVBY2Nlc3M6IHRydWVcbiAgICB9XG4gIH0pXG5cbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6RnVuY3Rpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBGdW5jdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiRnVuY3Rpb25Bcm5cIjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHU3RyZWFtTWFuYWdlcjoxXCIsXG4gICAgICAgICAgXCJGdW5jdGlvbkNvbmZpZ3VyYXRpb25cIjoge1xuICAgICAgICAgICAgXCJFbmNvZGluZ1R5cGVcIjogXCJiaW5hcnlcIixcbiAgICAgICAgICAgIFwiRW52aXJvbm1lbnRcIjoge1xuICAgICAgICAgICAgICBcIlZhcmlhYmxlc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJTVFJFQU1fTUFOQUdFUl9BVVRIRU5USUNBVEVfQ0xJRU5UXCI6IFwiZmFsc2VcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJQaW5uZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwic3RyZWFtX21hbmFnZXJcIlxuICAgICAgICB9LFxuICAgICAgXVxuICAgIH1cbiAgfSk7XG59KTtcblxuXG5cbnRlc3QoJ0Nsb3VkIFNwb29sZXInLCAoKSA9PiB7XG5cbiAgbmV3IEdyb3VwKHN0YWNrLCAnZ3JvdXAnLCB7XG4gICAgY29yZTogYyxcbiAgICBjbG91ZFNwb29sZXI6IHtcbiAgICAgIHN0b3JhZ2U6IHtcbiAgICAgICAgdHlwZTogQ2xvdWRTcG9vbGVyU3RvcmFnZVR5cGUuRklMRV9TWVNURU0sXG4gICAgICAgIG1heFNpemU6IFNpemUubWViaWJ5dGVzKDMpXG4gICAgICB9LFxuICAgICAgZW5hYmxlUGVyc2lzdGVudFNlc3Npb25zOiB0cnVlXG4gICAgfSxcbiAgfSlcblxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpGdW5jdGlvbkRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIEZ1bmN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJGdW5jdGlvbkFyblwiOiBcImFybjphd3M6bGFtYmRhOjo6ZnVuY3Rpb246R0dDbG91ZFNwb29sZXI6MVwiLFxuICAgICAgICAgIFwiRnVuY3Rpb25Db25maWd1cmF0aW9uXCI6IHtcbiAgICAgICAgICAgIFwiRW52aXJvbm1lbnRcIjoge1xuICAgICAgICAgICAgICBcIlZhcmlhYmxlc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJHR19DT05GSUdfU1RPUkFHRV9UWVBFXCI6IFwiRmlsZVN5c3RlbVwiLFxuICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX01BWF9TSVpFX0JZVEVTXCI6IDMwNzIsXG4gICAgICAgICAgICAgICAgXCJHR19DT05GSUdfU1VCU0NSSVBUSU9OX1FVQUxJVFlcIjogdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJFeGVjdXRhYmxlXCI6IFwic3Bvb2xlclwiLFxuICAgICAgICAgICAgXCJNZW1vcnlTaXplXCI6IDMyNzY4LFxuICAgICAgICAgICAgXCJQaW5uZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwic3Bvb2xlclwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSk7Il19