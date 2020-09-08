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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUE2RDtBQUM3RCx3Q0FBd0M7QUFDeEMsd0NBQXFDO0FBQ3JDLDRDQUE2QztBQUk3QyxJQUFJLEtBQWdCLENBQUM7QUFDckIsSUFBSSxDQUFlLENBQUM7QUFDcEIsSUFBSSxDQUFPLENBQUM7QUFFWixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDckMsU0FBUyxFQUFFLFdBQVc7S0FDdkIsQ0FBQyxDQUFBO0lBQ0YsQ0FBQyxHQUFHLElBQUksVUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDNUIsY0FBYyxFQUFFLEtBQUs7UUFDckIsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQTtBQUVGLFNBQVMsQ0FBQyxHQUFHLEVBQUU7SUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMvRSxDQUFDLENBQUMsQ0FBQztBQUlILElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBRWxCLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDeEIsSUFBSSxFQUFFLENBQUM7UUFDUCwwQkFBMEIsRUFBRSxJQUFJO0tBQ2pDLENBQUMsQ0FBQTtJQUVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxxQ0FBcUMsRUFBRTtRQUN0RSxjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsYUFBYSxFQUFFLDBDQUEwQztvQkFDekQsdUJBQXVCLEVBQUU7d0JBQ3ZCLFlBQVksRUFBRSxLQUFLO3dCQUNuQixRQUFRLEVBQUUsSUFBSTt3QkFDZCxTQUFTLEVBQUUsQ0FBQztxQkFDYjtvQkFDRCxJQUFJLEVBQUUsU0FBUztpQkFDaEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO0lBRTFCLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDeEIsSUFBSSxFQUFFLENBQUM7UUFDUCxhQUFhLEVBQUU7WUFDYixtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLG1CQUFtQixFQUFFLElBQUk7U0FDMUI7S0FDRixDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMscUNBQXFDLEVBQUU7UUFDdEUsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLGFBQWEsRUFBRSw2Q0FBNkM7b0JBQzVELHVCQUF1QixFQUFFO3dCQUN2QixjQUFjLEVBQUUsUUFBUTt3QkFDeEIsYUFBYSxFQUFFOzRCQUNiLFdBQVcsRUFBRTtnQ0FDWCxvQ0FBb0MsRUFBRSxPQUFPOzZCQUM5Qzt5QkFDRjt3QkFDRCxRQUFRLEVBQUUsSUFBSTt3QkFDZCxTQUFTLEVBQUUsQ0FBQztxQkFDYjtvQkFDRCxJQUFJLEVBQUUsZ0JBQWdCO2lCQUN2QjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUlILElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO0lBRXpCLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDeEIsSUFBSSxFQUFFLENBQUM7UUFDUCxZQUFZLEVBQUU7WUFDWixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxFQUFFLDZCQUF1QixDQUFDLFdBQVc7Z0JBQ3pDLE9BQU8sRUFBRSxXQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUMzQjtZQUNELHdCQUF3QixFQUFFLElBQUk7U0FDL0I7S0FDRixDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMscUNBQXFDLEVBQUU7UUFDdEUsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLGFBQWEsRUFBRSw0Q0FBNEM7b0JBQzNELHVCQUF1QixFQUFFO3dCQUN2QixhQUFhLEVBQUU7NEJBQ2IsV0FBVyxFQUFFO2dDQUNYLHdCQUF3QixFQUFFLFlBQVk7Z0NBQ3RDLDBCQUEwQixFQUFFLElBQUk7Z0NBQ2hDLGdDQUFnQyxFQUFFLElBQUk7NkJBQ3ZDO3lCQUNGO3dCQUNELFlBQVksRUFBRSxTQUFTO3dCQUN2QixZQUFZLEVBQUUsS0FBSzt3QkFDbkIsUUFBUSxFQUFFLElBQUk7d0JBQ2QsU0FBUyxFQUFFLENBQUM7cUJBQ2I7b0JBQ0QsSUFBSSxFQUFFLFNBQVM7aUJBQ2hCO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAnQGF3cy1jZGsvYXNzZXJ0L2plc3QnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29yZSwgR3JvdXAsIENsb3VkU3Bvb2xlclN0b3JhZ2VUeXBlfSBmcm9tICcuLi9saWInO1xuaW1wb3J0ICogYXMgaW90IGZyb20gJ0Bhd3MtY2RrL2F3cy1pb3QnO1xuaW1wb3J0IHsgU2l6ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgU3ludGhVdGlscyB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydCc7XG5cblxuXG52YXIgc3RhY2s6IGNkay5TdGFjaztcbnZhciB0OiBpb3QuQ2ZuVGhpbmc7XG52YXIgYzogQ29yZTtcblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHN0YWNrID0gbmV3IGNkay5TdGFjaztcbiAgdCA9IG5ldyBpb3QuQ2ZuVGhpbmcoc3RhY2ssICdhX3RoaW5nJywge1xuICAgIHRoaW5nTmFtZTogJ3Rlc3RUaGluZydcbiAgfSlcbiAgYyA9IG5ldyBDb3JlKHN0YWNrLCAnTXlDb3JlJywge1xuICAgIGNlcnRpZmljYXRlQXJuOiAnQUFBJyxcbiAgICBzeW5jU2hhZG93OiB0cnVlLFxuICAgIHRoaW5nOiB0XG4gIH0pO1xufSlcblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoU3ludGhVdGlscy50b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSwgdW5kZWZpbmVkLCAyKSlcbn0pO1xuXG5cblxudGVzdCgnQXV0b0lwJywgKCkgPT4ge1xuXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgZW5hYmxlQXV0b21hdGljSXBEaXNjb3Zlcnk6IHRydWUsXG4gIH0pXG5cbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6RnVuY3Rpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBGdW5jdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiRnVuY3Rpb25Bcm5cIjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHSVBEZXRlY3RvcjoxXCIsXG4gICAgICAgICAgXCJGdW5jdGlvbkNvbmZpZ3VyYXRpb25cIjoge1xuICAgICAgICAgICAgXCJNZW1vcnlTaXplXCI6IDMyNzY4LFxuICAgICAgICAgICAgXCJQaW5uZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwiYXV0b19pcFwiXG4gICAgICAgIH0sXG4gICAgICBdXG4gICAgfVxuICB9KTtcbn0pO1xuXG50ZXN0KCdTdHJlYW0gTWFuYWdlcicsICgpID0+IHtcblxuICBuZXcgR3JvdXAoc3RhY2ssICdncm91cCcsIHtcbiAgICBjb3JlOiBjLFxuICAgIHN0cmVhbU1hbmFnZXI6IHtcbiAgICAgIGVuYWJsZVN0cmVhbU1hbmFnZXI6IHRydWUsXG4gICAgICBhbGxvd0luc2VjdXJlQWNjZXNzOiB0cnVlXG4gICAgfVxuICB9KVxuXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkdyZWVuZ3Jhc3M6OkZ1bmN0aW9uRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgRnVuY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIkZ1bmN0aW9uQXJuXCI6IFwiYXJuOmF3czpsYW1iZGE6OjpmdW5jdGlvbjpHR1N0cmVhbU1hbmFnZXI6MVwiLFxuICAgICAgICAgIFwiRnVuY3Rpb25Db25maWd1cmF0aW9uXCI6IHtcbiAgICAgICAgICAgIFwiRW5jb2RpbmdUeXBlXCI6IFwiYmluYXJ5XCIsXG4gICAgICAgICAgICBcIkVudmlyb25tZW50XCI6IHtcbiAgICAgICAgICAgICAgXCJWYXJpYWJsZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiU1RSRUFNX01BTkFHRVJfQVVUSEVOVElDQVRFX0NMSUVOVFwiOiBcImZhbHNlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiUGlubmVkXCI6IHRydWUsXG4gICAgICAgICAgICBcIlRpbWVvdXRcIjogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJJZFwiOiBcInN0cmVhbV9tYW5hZ2VyXCJcbiAgICAgICAgfSxcbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSk7XG5cblxuXG50ZXN0KCdDbG91ZCBTcG9vbGVyJywgKCkgPT4ge1xuXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgY2xvdWRTcG9vbGVyOiB7XG4gICAgICBzdG9yYWdlOiB7XG4gICAgICAgIHR5cGU6IENsb3VkU3Bvb2xlclN0b3JhZ2VUeXBlLkZJTEVfU1lTVEVNLFxuICAgICAgICBtYXhTaXplOiBTaXplLm1lYmlieXRlcygzKVxuICAgICAgfSxcbiAgICAgIGVuYWJsZVBlcnNpc3RlbnRTZXNzaW9uczogdHJ1ZVxuICAgIH0sXG4gIH0pXG5cbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6RnVuY3Rpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBGdW5jdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiRnVuY3Rpb25Bcm5cIjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHQ2xvdWRTcG9vbGVyOjFcIixcbiAgICAgICAgICBcIkZ1bmN0aW9uQ29uZmlndXJhdGlvblwiOiB7XG4gICAgICAgICAgICBcIkVudmlyb25tZW50XCI6IHtcbiAgICAgICAgICAgICAgXCJWYXJpYWJsZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX1NUT1JBR0VfVFlQRVwiOiBcIkZpbGVTeXN0ZW1cIixcbiAgICAgICAgICAgICAgICBcIkdHX0NPTkZJR19NQVhfU0laRV9CWVRFU1wiOiAzMDcyLFxuICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX1NVQlNDUklQVElPTl9RVUFMSVRZXCI6IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiRXhlY3V0YWJsZVwiOiBcInNwb29sZXJcIixcbiAgICAgICAgICAgIFwiTWVtb3J5U2l6ZVwiOiAzMjc2OCxcbiAgICAgICAgICAgIFwiUGlubmVkXCI6IHRydWUsXG4gICAgICAgICAgICBcIlRpbWVvdXRcIjogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJJZFwiOiBcInNwb29sZXJcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcbn0pOyJdfQ==