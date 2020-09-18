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
exports.GroupTemplate = exports.CloudSpoolerStorageType = void 0;
const cdk = require("@aws-cdk/core");
const subscription_1 = require("./subscription");
const group_1 = require("./group");
const gg = require("@aws-cdk/aws-greengrass");
const core_1 = require("@aws-cdk/core");
var CloudSpoolerStorageType;
(function (CloudSpoolerStorageType) {
    CloudSpoolerStorageType["MEMORY"] = "Memory";
    CloudSpoolerStorageType["FILE_SYSTEM"] = "FileSystem";
})(CloudSpoolerStorageType = exports.CloudSpoolerStorageType || (exports.CloudSpoolerStorageType = {}));
class GroupTemplate extends cdk.Construct {
    constructor(scope, id, props) {
        var _a, _b, _c, _d, _e, _f;
        super(scope, id);
        this._subscriptions = props.subscriptions;
        let systemFunctions = [];
        if (((_a = props.streamManager) === null || _a === void 0 ? void 0 : _a.enableStreamManager) || props.enableAutomaticIpDiscovery || props.cloudSpooler) {
            if ((_b = props.streamManager) === null || _b === void 0 ? void 0 : _b.enableStreamManager) {
                this.streamManagerEnvironment = { variables: {} };
                if (props.streamManager.allowInsecureAccess) {
                    this.streamManagerEnvironment.variables.STREAM_MANAGER_AUTHENTICATE_CLIENT = "false";
                }
                this.streamManagerEnvironment.variables["STREAM_MANAGER_STORE_ROOT_DIR"] = props.streamManager.storeRootDir;
                this.streamManagerEnvironment.variables["STREAM_MANAGER_SERVER_PORT"] = props.streamManager.serverPort;
                this.streamManagerEnvironment.variables["STREAM_MANAGER_EXPORTER_MAX_BANDWIDTH"] = props.streamManager.exporterMaximumBandwidth;
                this.streamManagerEnvironment.variables["STREAM_MANAGER_EXPORTER_THREAD_POOL_SIZE"] = props.streamManager.threadPoolSize;
                this.streamManagerEnvironment.variables["JVM_ARGS"] = props.streamManager.jvmArgs;
                this.streamManagerEnvironment.variables["STREAM_MANAGER_READ_ONLY_DIRS"] = (_c = props.streamManager.readOnlyDirs) === null || _c === void 0 ? void 0 : _c.join(",");
                if (props.streamManager.minSizeMultipartUpload) {
                    this.streamManagerEnvironment.variables["STREAM_MANAGER_EXPORTER_S3_DESTINATION_MULTIPART_UPLOAD_MIN_PART_SIZE_BYTES"] = props.streamManager.minSizeMultipartUpload.toKibibytes() * 1000;
                }
                systemFunctions.push({
                    id: 'stream_manager',
                    functionArn: "arn:aws:lambda:::function:GGStreamManager:1",
                    functionConfiguration: {
                        encodingType: 'binary',
                        pinned: true,
                        timeout: 3,
                        environment: this.streamManagerEnvironment,
                        memorySize: ((_d = props.streamManager.memorySize) === null || _d === void 0 ? void 0 : _d.toKibibytes()) || core_1.Size.mebibytes(128).toKibibytes()
                    }
                });
            }
            if (props.enableAutomaticIpDiscovery) {
                systemFunctions.push({
                    id: 'auto_ip',
                    functionArn: "arn:aws:lambda:::function:GGIPDetector:1",
                    functionConfiguration: {
                        pinned: true,
                        memorySize: 32768,
                        timeout: 3
                    }
                });
            }
            if (props.cloudSpooler) {
                systemFunctions.push({
                    id: 'spooler',
                    functionArn: "arn:aws:lambda:::function:GGCloudSpooler:1",
                    functionConfiguration: {
                        executable: "spooler",
                        pinned: true,
                        memorySize: 32768,
                        timeout: 3,
                        environment: {
                            variables: {
                                "GG_CONFIG_STORAGE_TYPE": (_e = props.cloudSpooler.storage) === null || _e === void 0 ? void 0 : _e.type,
                                "GG_CONFIG_MAX_SIZE_BYTES": (_f = props.cloudSpooler.storage) === null || _f === void 0 ? void 0 : _f.maxSize.toKibibytes(),
                                "GG_CONFIG_SUBSCRIPTION_QUALITY": props.cloudSpooler.enablePersistentSessions ? 'AtLeastOncePersistent' : 'AtMostOnce',
                            }
                        }
                    }
                });
            }
        }
        if (props.functions !== undefined || systemFunctions.length > 0) {
            function convert(x) {
                return x.resolve();
            }
            var functionDefinition;
            if (props.functions !== undefined) {
                if (props.defaultFunctionExecution) {
                    this.defaultConfig = {
                        execution: {
                            ...props.defaultFunctionExecution
                        }
                    };
                }
                functionDefinition = new gg.CfnFunctionDefinition(this, id + '_functions', {
                    name: id,
                    initialVersion: {
                        defaultConfig: this.defaultConfig,
                        functions: [...props.functions.map(convert), ...systemFunctions]
                    }
                });
            }
            else {
                functionDefinition = new gg.CfnFunctionDefinition(this, id + '_functions', {
                    name: id,
                    initialVersion: {
                        functions: systemFunctions
                    }
                });
            }
            this.functionDefinitionVersionArn = functionDefinition.attrLatestVersionArn;
        }
        if (props.resources !== undefined) {
            function convert(x) {
                return x.resolve();
            }
            let resourceDefinition = new gg.CfnResourceDefinition(this, id + '_resources', {
                name: id,
                initialVersion: {
                    resources: props.resources.map(convert)
                }
            });
            this.resourceDefinitionVersionArn = resourceDefinition.attrLatestVersionArn;
        }
        if (props.connectors !== undefined) {
            function convert(x) {
                return x.resolve();
            }
            let connectorDefinition = new gg.CfnConnectorDefinition(this, id + '_connectors', {
                name: id,
                initialVersion: {
                    connectors: props.connectors.map(convert)
                }
            });
            this.connectorDefinitionVersionArn = connectorDefinition.attrLatestVersionArn;
        }
        if (props.loggers !== undefined) {
            function convert(x) {
                return x.resolve();
            }
            let loggerDefinition = new gg.CfnLoggerDefinition(this, id + '_loggers', {
                name: id,
                initialVersion: {
                    loggers: props.loggers.map(convert)
                }
            });
            this.loggerDefinitionVersionArn = loggerDefinition.attrLatestVersionArn;
        }
    }
    createGroup(id, options) {
        if (this._subscriptions === undefined) {
            this._subscriptions = new subscription_1.Subscriptions(this, id + '_subs');
        }
        this._subscriptions.merge(options.deviceSpecificSubscriptions);
        return new group_1.Group(this, id, {
            core: options.core,
            subscriptions: this._subscriptions,
            devices: options.devices,
            initialVersion: this,
            role: options.role || this.role
        });
    }
}
exports.GroupTemplate = GroupTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7OztBQUVILHFDQUFxQztBQUVyQyxpREFBOEM7QUFNOUMsbUNBQStCO0FBQy9CLDhDQUE2QztBQUU3Qyx3Q0FBcUM7QUFpQnJDLElBQVksdUJBR1g7QUFIRCxXQUFZLHVCQUF1QjtJQUMvQiw0Q0FBaUIsQ0FBQTtJQUNqQixxREFBMEIsQ0FBQTtBQUM5QixDQUFDLEVBSFcsdUJBQXVCLEdBQXZCLCtCQUF1QixLQUF2QiwrQkFBdUIsUUFHbEM7QUFnQ0QsTUFBYSxhQUFjLFNBQVEsR0FBRyxDQUFDLFNBQVM7SUFHNUMsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUF5Qjs7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUVoQixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFFMUMsSUFBSSxlQUFlLEdBQWdELEVBQUUsQ0FBQztRQUN0RSxJQUFJLE9BQUEsS0FBSyxDQUFDLGFBQWEsMENBQUUsbUJBQW1CLEtBQUksS0FBSyxDQUFDLDBCQUEwQixJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFDcEcsVUFBSSxLQUFLLENBQUMsYUFBYSwwQ0FBRSxtQkFBbUIsRUFBRTtnQkFDMUMsSUFBSSxDQUFDLHdCQUF3QixHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFBO2dCQUNqRCxJQUFJLEtBQUssQ0FBQyxhQUFjLENBQUMsbUJBQW1CLEVBQUU7b0JBQzFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsa0NBQWtDLEdBQUcsT0FBTyxDQUFDO2lCQUN4RjtnQkFDRCxJQUFJLENBQUMsd0JBQXdCLENBQUMsU0FBUyxDQUFDLCtCQUErQixDQUFDLEdBQUcsS0FBSyxDQUFDLGFBQWMsQ0FBQyxZQUFZLENBQUM7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QUMsRUFBVSxFQUFFLE9BQTBCO1FBQzlDLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxTQUFTLEVBQUU7WUFDbkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLDRCQUFhLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBQyxPQUFPLENBQUMsQ0FBQTtTQUM1RDtRQUNELElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO1FBQzlELE9BQU8sSUFBSSxhQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUN2QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7WUFDbEIsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjO1lBQ2xDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztZQUN4QixjQUFjLEVBQUUsSUFBSTtZQUNwQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSTtTQUNsQyxDQUFDLENBQUE7SUFDTixDQUFDO0NBVUo7QUF0S0Qsc0NBc0tDIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEZ1bmN0aW9uICwgRnVuY3Rpb25zIH0gZnJvbSAnLi9mdW5jdGlvbnMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9ucyB9IGZyb20gJy4vc3Vic2NyaXB0aW9uJ1xuaW1wb3J0IHsgTG9nZ2VyQmFzZSB9IGZyb20gJy4vbG9nZ2VyJ1xuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlJ1xuaW1wb3J0IHsgQ29ubmVjdG9yIH0gZnJvbSAnLi9jb25uZWN0b3JzJ1xuaW1wb3J0IHsgQ29yZSB9IGZyb20gJy4vY29yZSdcbmltcG9ydCB7IERldmljZSB9IGZyb20gJy4vZGV2aWNlJ1xuaW1wb3J0IHsgR3JvdXAgfSBmcm9tICcuL2dyb3VwJ1xuaW1wb3J0ICogYXMgZ2cgZnJvbSAnQGF3cy1jZGsvYXdzLWdyZWVuZ3Jhc3MnXG5pbXBvcnQgeyBSb2xlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBTaXplIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBTdHJlYW1NYW5hZ2VyUHJvcHMge1xuICAgIHJlYWRvbmx5IGVuYWJsZVN0cmVhbU1hbmFnZXI6IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgYWxsb3dJbnNlY3VyZUFjY2Vzcz86IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgc3RvcmVSb290RGlyPzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHNlcnZlclBvcnQ/OiBudW1iZXI7XG4gICAgcmVhZG9ubHkgZXhwb3J0ZXJNYXhpbXVtQmFuZHdpZHRoPzogbnVtYmVyO1xuICAgIHJlYWRvbmx5IHRocmVhZFBvb2xTaXplPzogbnVtYmVyO1xuICAgIHJlYWRvbmx5IGp2bUFyZ3M/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgcmVhZE9ubHlEaXJzPzogc3RyaW5nW107XG4gICAgcmVhZG9ubHkgbWluU2l6ZU11bHRpcGFydFVwbG9hZD86IFNpemU7XG4gICAgcmVhZG9ubHkgbWVtb3J5U2l6ZT86IFNpemU7XG5cbn1cblxuZXhwb3J0IGVudW0gQ2xvdWRTcG9vbGVyU3RvcmFnZVR5cGUge1xuICAgIE1FTU9SWSA9ICdNZW1vcnknLFxuICAgIEZJTEVfU1lTVEVNID0gJ0ZpbGVTeXN0ZW0nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvdWRTcG9vbGVyU3RvcmFnZVByb3BzIHtcbiAgICByZWFkb25seSB0eXBlOiBDbG91ZFNwb29sZXJTdG9yYWdlVHlwZTtcbiAgICByZWFkb25seSBtYXhTaXplOiBjZGsuU2l6ZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbG91ZFNwb29sZXJQcm9wcyB7XG4gICAgcmVhZG9ubHkgc3RvcmFnZT86IENsb3VkU3Bvb2xlclN0b3JhZ2VQcm9wcztcbiAgICByZWFkb25seSBlbmFibGVQZXJzaXN0ZW50U2Vzc2lvbnM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwT3B0aW9uc1Byb3BzIHtcbiAgICByZWFkb25seSBjb3JlOiBDb3JlO1xuICAgIHJlYWRvbmx5IGRldmljZXM/OiBEZXZpY2VbXTtcbiAgICByZWFkb25seSBkZXZpY2VTcGVjaWZpY1N1YnNjcmlwdGlvbnM/OiBTdWJzY3JpcHRpb25zO1xuICAgIHJlYWRvbmx5IHJvbGU/OiBSb2xlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwVGVtcGxhdGVQcm9wcyB7XG4gICAgcmVhZG9ubHkgZGVmYXVsdEZ1bmN0aW9uRXhlY3V0aW9uPzogRnVuY3Rpb25zLkV4ZWN1dGlvblxuICAgIHJlYWRvbmx5IGZ1bmN0aW9ucz86IEZ1bmN0aW9uW107XG4gICAgcmVhZG9ubHkgc3Vic2NyaXB0aW9ucz86IFN1YnNjcmlwdGlvbnM7XG4gICAgcmVhZG9ubHkgbG9nZ2Vycz86IExvZ2dlckJhc2VbXTtcbiAgICByZWFkb25seSByZXNvdXJjZXM/OiBSZXNvdXJjZVtdO1xuICAgIHJlYWRvbmx5IGNvbm5lY3RvcnM/OiBDb25uZWN0b3JbXTtcbiAgICByZWFkb25seSBzdHJlYW1NYW5hZ2VyPzogU3RyZWFtTWFuYWdlclByb3BzLFxuICAgIHJlYWRvbmx5IGVuYWJsZUF1dG9tYXRpY0lwRGlzY292ZXJ5PzogYm9vbGVhbjtcbiAgICByZWFkb25seSByb2xlPzogUm9sZTtcbiAgICByZWFkb25seSBjbG91ZFNwb29sZXI/OiBDbG91ZFNwb29sZXJQcm9wcztcbn1cblxuZXhwb3J0IGNsYXNzIEdyb3VwVGVtcGxhdGUgZXh0ZW5kcyBjZGsuQ29uc3RydWN0IHtcbiAgICBwcml2YXRlIF9zdWJzY3JpcHRpb25zPzogU3Vic2NyaXB0aW9ucztcblxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogR3JvdXBUZW1wbGF0ZVByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZClcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBwcm9wcy5zdWJzY3JpcHRpb25zO1xuXG4gICAgICAgIGxldCBzeXN0ZW1GdW5jdGlvbnM6IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbi5GdW5jdGlvblByb3BlcnR5W10gPSBbXTtcbiAgICAgICAgaWYgKHByb3BzLnN0cmVhbU1hbmFnZXI/LmVuYWJsZVN0cmVhbU1hbmFnZXIgfHwgcHJvcHMuZW5hYmxlQXV0b21hdGljSXBEaXNjb3ZlcnkgfHwgcHJvcHMuY2xvdWRTcG9vbGVyKSB7XG4gICAgICAgICAgICBpZiAocHJvcHMuc3RyZWFtTWFuYWdlcj8uZW5hYmxlU3RyZWFtTWFuYWdlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtTWFuYWdlckVudmlyb25tZW50ID0geyB2YXJpYWJsZXM6IHt9IH1cbiAgICAgICAgICAgICAgICBpZiAocHJvcHMuc3RyZWFtTWFuYWdlciEuYWxsb3dJbnNlY3VyZUFjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbU1hbmFnZXJFbnZpcm9ubWVudC52YXJpYWJsZXMuU1RSRUFNX01BTkFHRVJfQVVUSEVOVElDQVRFX0NMSUVOVCA9IFwiZmFsc2VcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW1NYW5hZ2VyRW52aXJvbm1lbnQudmFyaWFibGVzW1wiU1RSRUFNX01BTkFHRVJfU1RPUkVfUk9PVF9ESVJcIl0gPSBwcm9wcy5zdHJlYW1NYW5hZ2VyIS5zdG9yZVJvb3REaXI7XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW1NYW5hZ2VyRW52aXJvbm1lbnQudmFyaWFibGVzW1wiU1RSRUFNX01BTkFHRVJfU0VSVkVSX1BPUlRcIl0gPSBwcm9wcy5zdHJlYW1NYW5hZ2VyIS5zZXJ2ZXJQb3J0O1xuICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtTWFuYWdlckVudmlyb25tZW50LnZhcmlhYmxlc1tcIlNUUkVBTV9NQU5BR0VSX0VYUE9SVEVSX01BWF9CQU5EV0lEVEhcIl0gPSBwcm9wcy5zdHJlYW1NYW5hZ2VyIS5leHBvcnRlck1heGltdW1CYW5kd2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW1NYW5hZ2VyRW52aXJvbm1lbnQudmFyaWFibGVzW1wiU1RSRUFNX01BTkFHRVJfRVhQT1JURVJfVEhSRUFEX1BPT0xfU0laRVwiXSA9IHByb3BzLnN0cmVhbU1hbmFnZXIhLnRocmVhZFBvb2xTaXplO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtTWFuYWdlckVudmlyb25tZW50LnZhcmlhYmxlc1tcIkpWTV9BUkdTXCJdID0gcHJvcHMuc3RyZWFtTWFuYWdlciEuanZtQXJncztcbiAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbU1hbmFnZXJFbnZpcm9ubWVudC52YXJpYWJsZXNbXCJTVFJFQU1fTUFOQUdFUl9SRUFEX09OTFlfRElSU1wiXSA9IHByb3BzLnN0cmVhbU1hbmFnZXIhLnJlYWRPbmx5RGlycz8uam9pbihcIixcIik7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BzLnN0cmVhbU1hbmFnZXIubWluU2l6ZU11bHRpcGFydFVwbG9hZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbU1hbmFnZXJFbnZpcm9ubWVudC52YXJpYWJsZXNbXCJTVFJFQU1fTUFOQUdFUl9FWFBPUlRFUl9TM19ERVNUSU5BVElPTl9NVUxUSVBBUlRfVVBMT0FEX01JTl9QQVJUX1NJWkVfQllURVNcIl0gPSBwcm9wcy5zdHJlYW1NYW5hZ2VyLm1pblNpemVNdWx0aXBhcnRVcGxvYWQhLnRvS2liaWJ5dGVzKCkgKiAxMDAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzeXN0ZW1GdW5jdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAnc3RyZWFtX21hbmFnZXInLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkFybjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHU3RyZWFtTWFuYWdlcjoxXCIsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5jb2RpbmdUeXBlOiAnYmluYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpbm5lZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudDogdGhpcy5zdHJlYW1NYW5hZ2VyRW52aXJvbm1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnlTaXplOiBwcm9wcy5zdHJlYW1NYW5hZ2VyLm1lbW9yeVNpemU/LnRvS2liaWJ5dGVzKCkgfHwgU2l6ZS5tZWJpYnl0ZXMoMTI4KS50b0tpYmlieXRlcygpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb3BzLmVuYWJsZUF1dG9tYXRpY0lwRGlzY292ZXJ5KSB7XG4gICAgICAgICAgICAgICAgc3lzdGVtRnVuY3Rpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpZDogJ2F1dG9faXAnLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkFybjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHSVBEZXRlY3RvcjoxXCIsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlubmVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVtb3J5U2l6ZTogMzI3NjgsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiAzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb3BzLmNsb3VkU3Bvb2xlcikge1xuICAgICAgICAgICAgICAgIHN5c3RlbUZ1bmN0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdzcG9vbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25Bcm46IFwiYXJuOmF3czpsYW1iZGE6OjpmdW5jdGlvbjpHR0Nsb3VkU3Bvb2xlcjoxXCIsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhlY3V0YWJsZTogXCJzcG9vbGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5uZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnlTaXplOiAzMjc2OCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkdHX0NPTkZJR19TVE9SQUdFX1RZUEVcIjogcHJvcHMuY2xvdWRTcG9vbGVyLnN0b3JhZ2U/LnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX01BWF9TSVpFX0JZVEVTXCI6IHByb3BzLmNsb3VkU3Bvb2xlci5zdG9yYWdlPy5tYXhTaXplLnRvS2liaWJ5dGVzKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX1NVQlNDUklQVElPTl9RVUFMSVRZXCI6IHByb3BzLmNsb3VkU3Bvb2xlci5lbmFibGVQZXJzaXN0ZW50U2Vzc2lvbnMgPyAnQXRMZWFzdE9uY2VQZXJzaXN0ZW50JyA6ICdBdE1vc3RPbmNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BzLmZ1bmN0aW9ucyAhPT0gdW5kZWZpbmVkIHx8IHN5c3RlbUZ1bmN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBjb252ZXJ0KHg6IEZ1bmN0aW9uKTogZ2cuQ2ZuRnVuY3Rpb25EZWZpbml0aW9uLkZ1bmN0aW9uUHJvcGVydHkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4LnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBmdW5jdGlvbkRlZmluaXRpb246IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbjtcbiAgICAgICAgICAgIGlmIChwcm9wcy5mdW5jdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHByb3BzLmRlZmF1bHRGdW5jdGlvbkV4ZWN1dGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRDb25maWcgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGVjdXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5wcm9wcy5kZWZhdWx0RnVuY3Rpb25FeGVjdXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmdW5jdGlvbkRlZmluaXRpb24gPSBuZXcgZ2cuQ2ZuRnVuY3Rpb25EZWZpbml0aW9uKHRoaXMsIGlkICsgJ19mdW5jdGlvbnMnLCB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGlkLFxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENvbmZpZzogdGhpcy5kZWZhdWx0Q29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25zOiBbLi4ucHJvcHMuZnVuY3Rpb25zIS5tYXAoY29udmVydCksIC4uLnN5c3RlbUZ1bmN0aW9uc11cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24odGhpcywgaWQgKyAnX2Z1bmN0aW9ucycsIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogaWQsXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbnM6IHN5c3RlbUZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybiA9IGZ1bmN0aW9uRGVmaW5pdGlvbi5hdHRyTGF0ZXN0VmVyc2lvbkFybjtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKHByb3BzLnJlc291cmNlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBjb252ZXJ0KHg6IFJlc291cmNlKTogZ2cuQ2ZuUmVzb3VyY2VEZWZpbml0aW9uLlJlc291cmNlSW5zdGFuY2VQcm9wZXJ0eSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHgucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHJlc291cmNlRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5SZXNvdXJjZURlZmluaXRpb24odGhpcywgaWQgKyAnX3Jlc291cmNlcycsIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgICAgICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZXM6IHByb3BzLnJlc291cmNlcyEubWFwKGNvbnZlcnQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybiA9IHJlc291cmNlRGVmaW5pdGlvbi5hdHRyTGF0ZXN0VmVyc2lvbkFybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wcy5jb25uZWN0b3JzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbnZlcnQoeDogQ29ubmVjdG9yKTogZ2cuQ2ZuQ29ubmVjdG9yRGVmaW5pdGlvbi5Db25uZWN0b3JQcm9wZXJ0eSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHgucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGNvbm5lY3RvckRlZmluaXRpb24gPSBuZXcgZ2cuQ2ZuQ29ubmVjdG9yRGVmaW5pdGlvbih0aGlzLCBpZCArICdfY29ubmVjdG9ycycsIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgICAgICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICAgICAgICAgICAgICBjb25uZWN0b3JzOiBwcm9wcy5jb25uZWN0b3JzIS5tYXAoY29udmVydClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5jb25uZWN0b3JEZWZpbml0aW9uVmVyc2lvbkFybiA9IGNvbm5lY3RvckRlZmluaXRpb24uYXR0ckxhdGVzdFZlcnNpb25Bcm47XG4gICAgICAgIH1cblxuICAgICAgIFxuXG4gICAgICAgIGlmIChwcm9wcy5sb2dnZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbnZlcnQoeDogTG9nZ2VyQmFzZSk6IGdnLkNmbkxvZ2dlckRlZmluaXRpb24uTG9nZ2VyUHJvcGVydHkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4LnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBsb2dnZXJEZWZpbml0aW9uID0gbmV3IGdnLkNmbkxvZ2dlckRlZmluaXRpb24odGhpcywgaWQgKyAnX2xvZ2dlcnMnLCB7XG4gICAgICAgICAgICAgICAgbmFtZTogaWQsXG4gICAgICAgICAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyczogcHJvcHMubG9nZ2VycyEubWFwKGNvbnZlcnQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm4gPSBsb2dnZXJEZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlR3JvdXAoaWQ6IHN0cmluZywgb3B0aW9uczogR3JvdXBPcHRpb25zUHJvcHMpOiBHcm91cCB7XG4gICAgICAgIGlmICh0aGlzLl9zdWJzY3JpcHRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBuZXcgU3Vic2NyaXB0aW9ucyh0aGlzLCBpZCsnX3N1YnMnKVxuICAgICAgICB9IFxuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLm1lcmdlKG9wdGlvbnMuZGV2aWNlU3BlY2lmaWNTdWJzY3JpcHRpb25zKVxuICAgICAgICByZXR1cm4gbmV3IEdyb3VwKHRoaXMsIGlkLCB7XG4gICAgICAgICAgICBjb3JlOiBvcHRpb25zLmNvcmUsXG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zOiB0aGlzLl9zdWJzY3JpcHRpb25zLFxuICAgICAgICAgICAgZGV2aWNlczogb3B0aW9ucy5kZXZpY2VzLFxuICAgICAgICAgICAgaW5pdGlhbFZlcnNpb246IHRoaXMsXG4gICAgICAgICAgICByb2xlOiBvcHRpb25zLnJvbGUgfHwgdGhpcy5yb2xlXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdHJlYW1NYW5hZ2VyRW52aXJvbm1lbnQ/OiBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24uRW52aXJvbm1lbnRQcm9wZXJ0eTtcbiAgICBwcml2YXRlIGRlZmF1bHRDb25maWc/OiBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24uRGVmYXVsdENvbmZpZ1Byb3BlcnR5O1xuICAgIHJlYWRvbmx5IHN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nXG4gICAgcmVhZG9ubHkgZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybj86IHN0cmluZztcbiAgICByZWFkb25seSBsb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybj86IHN0cmluZztcbiAgICByZWFkb25seSByZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGNvbm5lY3RvckRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHJvbGU/OiBSb2xlO1xufSJdfQ==