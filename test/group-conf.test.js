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
                        "MemorySize": 131072
                    },
                    "Id": "stream_manager"
                },
            ]
        }
    });
});
test('Stream Manager Props', () => {
    new lib_1.Group(stack, 'group', {
        core: c,
        streamManager: {
            enableStreamManager: true,
            exporterMaximumBandwidth: 2000,
            jvmArgs: '-D100',
            memorySize: core_1.Size.mebibytes(64),
            minSizeMultipartUpload: core_1.Size.kibibytes(122),
            readOnlyDirs: ["/tmp", "/opt"],
            serverPort: 8082,
            storeRootDir: "/data",
            threadPoolSize: 10
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
                                "STREAM_MANAGER_STORE_ROOT_DIR": "/data",
                                "STREAM_MANAGER_SERVER_PORT": 8082,
                                "STREAM_MANAGER_EXPORTER_MAX_BANDWIDTH": 2000,
                                "STREAM_MANAGER_EXPORTER_THREAD_POOL_SIZE": 10,
                                "JVM_ARGS": "-D100",
                                "STREAM_MANAGER_READ_ONLY_DIRS": "/tmp,/opt",
                                "STREAM_MANAGER_EXPORTER_S3_DESTINATION_MULTIPART_UPLOAD_MIN_PART_SIZE_BYTES": 122000
                            }
                        },
                        "MemorySize": 65536,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtY29uZi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ3JvdXAtY29uZi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUE2RDtBQUM3RCx3Q0FBd0M7QUFDeEMsd0NBQXFDO0FBQ3JDLCtDQUErQztBQUkvQyxJQUFJLEtBQWdCLENBQUM7QUFDckIsSUFBSSxDQUFlLENBQUM7QUFDcEIsSUFBSSxDQUFPLENBQUM7QUFFWixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDckMsU0FBUyxFQUFFLFdBQVc7S0FDdkIsQ0FBQyxDQUFBO0lBQ0YsQ0FBQyxHQUFHLElBQUksVUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDNUIsY0FBYyxFQUFFLEtBQUs7UUFDckIsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQTtBQUVGLFNBQVMsQ0FBQyxHQUFHLEVBQUU7SUFDYiwrRUFBK0U7QUFDakYsQ0FBQyxDQUFDLENBQUM7QUFJSCxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUVsQixJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1FBQ3hCLElBQUksRUFBRSxDQUFDO1FBQ1AsMEJBQTBCLEVBQUUsSUFBSTtLQUNqQyxDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMscUNBQXFDLEVBQUU7UUFDdEUsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLGFBQWEsRUFBRSwwQ0FBMEM7b0JB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QkFBd0IsRUFBRSxZQUFZO2dDQUN0QywwQkFBMEIsRUFBRSxJQUFJO2dDQUNoQyxnQ0FBZ0MsRUFBRSxZQUFZOzZCQUMvQzt5QkFDRjt3QkFDRCxZQUFZLEVBQUUsU0FBUzt3QkFDdkIsWUFBWSxFQUFFLEtBQUs7d0JBQ25CLFFBQVEsRUFBRSxJQUFJO3dCQUNkLFNBQVMsRUFBRSxDQUFDO3FCQUNiO29CQUNELElBQUksRUFBRSxTQUFTO2lCQUNoQjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIFxuICogIENvcHlyaWdodCAyMDIwIEFtYXpvbi5jb20gb3IgaXRzIGFmZmlsaWF0ZXNcbiAqICBcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqICBcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqICBcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgJ0Bhd3MtY2RrL2Fzc2VydC9qZXN0JztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvcmUsIEdyb3VwLCBDbG91ZFNwb29sZXJTdG9yYWdlVHlwZX0gZnJvbSAnLi4vbGliJztcbmltcG9ydCAqIGFzIGlvdCBmcm9tICdAYXdzLWNkay9hd3MtaW90JztcbmltcG9ydCB7IFNpemUgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbi8vaW1wb3J0IHsgU3ludGhVdGlscyB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydCc7XG5cblxuXG52YXIgc3RhY2s6IGNkay5TdGFjaztcbnZhciB0OiBpb3QuQ2ZuVGhpbmc7XG52YXIgYzogQ29yZTtcblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHN0YWNrID0gbmV3IGNkay5TdGFjaztcbiAgdCA9IG5ldyBpb3QuQ2ZuVGhpbmcoc3RhY2ssICdhX3RoaW5nJywge1xuICAgIHRoaW5nTmFtZTogJ3Rlc3RUaGluZydcbiAgfSlcbiAgYyA9IG5ldyBDb3JlKHN0YWNrLCAnTXlDb3JlJywge1xuICAgIGNlcnRpZmljYXRlQXJuOiAnQUFBJyxcbiAgICBzeW5jU2hhZG93OiB0cnVlLFxuICAgIHRoaW5nOiB0XG4gIH0pO1xufSlcblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShTeW50aFV0aWxzLnRvQ2xvdWRGb3JtYXRpb24oc3RhY2spLCB1bmRlZmluZWQsIDIpKVxufSk7XG5cblxuXG50ZXN0KCdBdXRvSXAnLCAoKSA9PiB7XG5cbiAgbmV3IEdyb3VwKHN0YWNrLCAnZ3JvdXAnLCB7XG4gICAgY29yZTogYyxcbiAgICBlbmFibGVBdXRvbWF0aWNJcERpc2NvdmVyeTogdHJ1ZSxcbiAgfSlcblxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpGdW5jdGlvbkRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIEZ1bmN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJGdW5jdGlvbkFyblwiOiBcImFybjphd3M6bGFtYmRhOjo6ZnVuY3Rpb246R0dJUERldGVjdG9yOjFcIixcbiAgICAgICAgICBcIkZ1bmN0aW9uQ29uZmlndXJhdGlvblwiOiB7XG4gICAgICAgICAgICBcIk1lbW9yeVNpemVcIjogMzI3NjgsXG4gICAgICAgICAgICBcIlBpbm5lZFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJUaW1lb3V0XCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiSWRcIjogXCJhdXRvX2lwXCJcbiAgICAgICAgfSxcbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSk7XG5cbnRlc3QoJ1N0cmVhbSBNYW5hZ2VyJywgKCkgPT4ge1xuXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgc3RyZWFtTWFuYWdlcjoge1xuICAgICAgZW5hYmxlU3RyZWFtTWFuYWdlcjogdHJ1ZSxcbiAgICAgIGFsbG93SW5zZWN1cmVBY2Nlc3M6IHRydWVcbiAgICB9XG4gIH0pXG5cbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6RnVuY3Rpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBGdW5jdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiRnVuY3Rpb25Bcm5cIjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHU3RyZWFtTWFuYWdlcjoxXCIsXG4gICAgICAgICAgXCJGdW5jdGlvbkNvbmZpZ3VyYXRpb25cIjoge1xuICAgICAgICAgICAgXCJFbmNvZGluZ1R5cGVcIjogXCJiaW5hcnlcIixcbiAgICAgICAgICAgIFwiRW52aXJvbm1lbnRcIjoge1xuICAgICAgICAgICAgICBcIlZhcmlhYmxlc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJTVFJFQU1fTUFOQUdFUl9BVVRIRU5USUNBVEVfQ0xJRU5UXCI6IFwiZmFsc2VcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJQaW5uZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzLFxuICAgICAgICAgICAgXCJNZW1vcnlTaXplXCI6IDEzMTA3MlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJJZFwiOiBcInN0cmVhbV9tYW5hZ2VyXCJcbiAgICAgICAgfSxcbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSk7XG5cbnRlc3QoJ1N0cmVhbSBNYW5hZ2VyIFByb3BzJywgKCkgPT4ge1xuXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgc3RyZWFtTWFuYWdlcjoge1xuICAgICAgZW5hYmxlU3RyZWFtTWFuYWdlcjogdHJ1ZSxcbiAgICAgIGV4cG9ydGVyTWF4aW11bUJhbmR3aWR0aDogMjAwMCxcbiAgICAgIGp2bUFyZ3M6ICctRDEwMCcsXG4gICAgICBtZW1vcnlTaXplOiBTaXplLm1lYmlieXRlcyg2NCksXG4gICAgICBtaW5TaXplTXVsdGlwYXJ0VXBsb2FkOiBTaXplLmtpYmlieXRlcygxMjIpLFxuICAgICAgcmVhZE9ubHlEaXJzOiBbXCIvdG1wXCIsIFwiL29wdFwiXSxcbiAgICAgIHNlcnZlclBvcnQ6IDgwODIsXG4gICAgICBzdG9yZVJvb3REaXI6IFwiL2RhdGFcIixcbiAgICAgIHRocmVhZFBvb2xTaXplOiAxMFxuICAgIH1cbiAgfSlcblxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpGdW5jdGlvbkRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIEZ1bmN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJGdW5jdGlvbkFyblwiOiBcImFybjphd3M6bGFtYmRhOjo6ZnVuY3Rpb246R0dTdHJlYW1NYW5hZ2VyOjFcIixcbiAgICAgICAgICBcIkZ1bmN0aW9uQ29uZmlndXJhdGlvblwiOiB7XG4gICAgICAgICAgICBcIkVuY29kaW5nVHlwZVwiOiBcImJpbmFyeVwiLFxuICAgICAgICAgICAgXCJFbnZpcm9ubWVudFwiOiB7XG4gICAgICAgICAgICAgIFwiVmFyaWFibGVzXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU1RSRUFNX01BTkFHRVJfU1RPUkVfUk9PVF9ESVJcIjogXCIvZGF0YVwiLFxuICAgICAgICAgICAgICBcIlNUUkVBTV9NQU5BR0VSX1NFUlZFUl9QT1JUXCI6IDgwODIsXG4gICAgICAgICAgICAgIFwiU1RSRUFNX01BTkFHRVJfRVhQT1JURVJfTUFYX0JBTkRXSURUSFwiOiAyMDAwLFxuICAgICAgICAgICAgICBcIlNUUkVBTV9NQU5BR0VSX0VYUE9SVEVSX1RIUkVBRF9QT09MX1NJWkVcIjogMTAsXG4gICAgICAgICAgICAgIFwiSlZNX0FSR1NcIjogXCItRDEwMFwiLFxuICAgICAgICAgICAgICBcIlNUUkVBTV9NQU5BR0VSX1JFQURfT05MWV9ESVJTXCI6IFwiL3RtcCwvb3B0XCIsXG4gICAgICAgICAgICAgIFwiU1RSRUFNX01BTkFHRVJfRVhQT1JURVJfUzNfREVTVElOQVRJT05fTVVMVElQQVJUX1VQTE9BRF9NSU5fUEFSVF9TSVpFX0JZVEVTXCI6IDEyMjAwMFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJNZW1vcnlTaXplXCI6IDY1NTM2LFxuICAgICAgICAgICAgXCJQaW5uZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwic3RyZWFtX21hbmFnZXJcIlxuICAgICAgICB9LFxuICAgICAgXVxuICAgIH1cbiAgfSk7XG59KTtcblxuXG5cbnRlc3QoJ0Nsb3VkIFNwb29sZXInLCAoKSA9PiB7XG5cbiAgbmV3IEdyb3VwKHN0YWNrLCAnZ3JvdXAnLCB7XG4gICAgY29yZTogYyxcbiAgICBjbG91ZFNwb29sZXI6IHtcbiAgICAgIHN0b3JhZ2U6IHtcbiAgICAgICAgdHlwZTogQ2xvdWRTcG9vbGVyU3RvcmFnZVR5cGUuRklMRV9TWVNURU0sXG4gICAgICAgIG1heFNpemU6IFNpemUubWViaWJ5dGVzKDMpXG4gICAgICB9LFxuICAgICAgZW5hYmxlUGVyc2lzdGVudFNlc3Npb25zOiB0cnVlXG4gICAgfSxcbiAgfSlcblxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpGdW5jdGlvbkRlZmluaXRpb24nLCB7XG4gICAgSW5pdGlhbFZlcnNpb246IHtcbiAgICAgIEZ1bmN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJGdW5jdGlvbkFyblwiOiBcImFybjphd3M6bGFtYmRhOjo6ZnVuY3Rpb246R0dDbG91ZFNwb29sZXI6MVwiLFxuICAgICAgICAgIFwiRnVuY3Rpb25Db25maWd1cmF0aW9uXCI6IHtcbiAgICAgICAgICAgIFwiRW52aXJvbm1lbnRcIjoge1xuICAgICAgICAgICAgICBcIlZhcmlhYmxlc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJHR19DT05GSUdfU1RPUkFHRV9UWVBFXCI6IFwiRmlsZVN5c3RlbVwiLFxuICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX01BWF9TSVpFX0JZVEVTXCI6IDMwNzIsXG4gICAgICAgICAgICAgICAgXCJHR19DT05GSUdfU1VCU0NSSVBUSU9OX1FVQUxJVFlcIjogXCJBdExlYXN0T25jZVBlcnNpc3RlbnRcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJFeGVjdXRhYmxlXCI6IFwic3Bvb2xlclwiLFxuICAgICAgICAgICAgXCJNZW1vcnlTaXplXCI6IDMyNzY4LFxuICAgICAgICAgICAgXCJQaW5uZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiVGltZW91dFwiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIklkXCI6IFwic3Bvb2xlclwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xufSk7XG5cblxuXG5cbnRlc3QoJ0Nsb3VkIFNwb29sZXIgLSBRb1MwJywgKCkgPT4ge1xuXG4gIG5ldyBHcm91cChzdGFjaywgJ2dyb3VwJywge1xuICAgIGNvcmU6IGMsXG4gICAgY2xvdWRTcG9vbGVyOiB7XG4gICAgICBzdG9yYWdlOiB7XG4gICAgICAgIHR5cGU6IENsb3VkU3Bvb2xlclN0b3JhZ2VUeXBlLkZJTEVfU1lTVEVNLFxuICAgICAgICBtYXhTaXplOiBTaXplLm1lYmlieXRlcygzKVxuICAgICAgfVxuICAgIH0sXG4gIH0pXG5cbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6RnVuY3Rpb25EZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBGdW5jdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiRnVuY3Rpb25Bcm5cIjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHQ2xvdWRTcG9vbGVyOjFcIixcbiAgICAgICAgICBcIkZ1bmN0aW9uQ29uZmlndXJhdGlvblwiOiB7XG4gICAgICAgICAgICBcIkVudmlyb25tZW50XCI6IHtcbiAgICAgICAgICAgICAgXCJWYXJpYWJsZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX1NUT1JBR0VfVFlQRVwiOiBcIkZpbGVTeXN0ZW1cIixcbiAgICAgICAgICAgICAgICBcIkdHX0NPTkZJR19NQVhfU0laRV9CWVRFU1wiOiAzMDcyLFxuICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX1NVQlNDUklQVElPTl9RVUFMSVRZXCI6IFwiQXRNb3N0T25jZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIkV4ZWN1dGFibGVcIjogXCJzcG9vbGVyXCIsXG4gICAgICAgICAgICBcIk1lbW9yeVNpemVcIjogMzI3NjgsXG4gICAgICAgICAgICBcIlBpbm5lZFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJUaW1lb3V0XCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiSWRcIjogXCJzcG9vbGVyXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG59KTsiXX0=