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
var CloudSpoolerStorageType;
(function (CloudSpoolerStorageType) {
    CloudSpoolerStorageType["MEMORY"] = "Memory";
    CloudSpoolerStorageType["FILE_SYSTEM"] = "FileSystem";
})(CloudSpoolerStorageType = exports.CloudSpoolerStorageType || (exports.CloudSpoolerStorageType = {}));
class GroupTemplate extends cdk.Construct {
    constructor(scope, id, props) {
        var _a, _b, _c, _d;
        super(scope, id);
        this._subscriptions = props.subscriptions;
        let systemFunctions = [];
        if (((_a = props.streamManager) === null || _a === void 0 ? void 0 : _a.enableStreamManager) || props.enableAutomaticIpDiscovery || props.cloudSpooler) {
            if ((_b = props.streamManager) === null || _b === void 0 ? void 0 : _b.enableStreamManager) {
                if (props.streamManager.allowInsecureAccess) {
                    this.streamManagerEnvironment = {
                        variables: {
                            "STREAM_MANAGER_AUTHENTICATE_CLIENT": "false"
                        }
                    };
                }
                systemFunctions.push({
                    id: 'stream_manager',
                    functionArn: "arn:aws:lambda:::function:GGStreamManager:1",
                    functionConfiguration: {
                        encodingType: 'binary',
                        pinned: true,
                        timeout: 3,
                        environment: this.streamManagerEnvironment
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
                                "GG_CONFIG_STORAGE_TYPE": (_c = props.cloudSpooler.storage) === null || _c === void 0 ? void 0 : _c.type,
                                "GG_CONFIG_MAX_SIZE_BYTES": (_d = props.cloudSpooler.storage) === null || _d === void 0 ? void 0 : _d.maxSize.toKibibytes(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7OztBQUVILHFDQUFxQztBQUVyQyxpREFBOEM7QUFNOUMsbUNBQStCO0FBQy9CLDhDQUE2QztBQVM3QyxJQUFZLHVCQUdYO0FBSEQsV0FBWSx1QkFBdUI7SUFDL0IsNENBQWlCLENBQUE7SUFDakIscURBQTBCLENBQUE7QUFDOUIsQ0FBQyxFQUhXLHVCQUF1QixHQUF2QiwrQkFBdUIsS0FBdkIsK0JBQXVCLFFBR2xDO0FBZ0NELE1BQWEsYUFBYyxTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBRzVDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7O1FBQ25FLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFFaEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO1FBRTFDLElBQUksZUFBZSxHQUFnRCxFQUFFLENBQUM7UUFDdEUsSUFBSSxPQUFBLEtBQUssQ0FBQyxhQUFhLDBDQUFFLG1CQUFtQixLQUFJLEtBQUssQ0FBQywwQkFBMEIsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFO1lBQ3BHLFVBQUksS0FBSyxDQUFDLGFBQWEsMENBQUUsbUJBQW1CLEVBQUU7Z0JBQzFDLElBQUksS0FBSyxDQUFDLGFBQWMsQ0FBQyxtQkFBbUIsRUFBRTtvQkFDMUMsSUFBSSxDQUFDLHdCQUF3QixHQUFHO3dCQUM1QixTQUFTLEVBQUU7NEJBQ1Asb0NBQW9DLEVBQUUsT0FBTzt5QkFDaEQ7cUJBQ0osQ0FBQTtpQkFDSjtnQkFDRCxlQUFlLENBQUMsSUFBSSxDQUFDO29CQUNqQixFQUFFLEVBQUUsZ0JBQWdCO29CQUNwQixXQUFXLEVBQUUsNkNBQTZDO29CQUMxRCxxQkFBcUIsRUFBRTt3QkFDbkIsWUFBWSxFQUFFLFFBQVE7d0JBQ3RCLE1BQU0sRUFBRSxJ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QkFBb0IsQ0FBQztTQUMzRTtJQUNMLENBQUM7SUFFRCxXQUFXLENBQUMsRUFBVSxFQUFFLE9BQTBCO1FBQzlDLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxTQUFTLEVBQUU7WUFDbkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLDRCQUFhLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBQyxPQUFPLENBQUMsQ0FBQTtTQUM1RDtRQUNELElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO1FBQzlELE9BQU8sSUFBSSxhQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUN2QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7WUFDbEIsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjO1lBQ2xDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztZQUN4QixjQUFjLEVBQUUsSUFBSTtZQUNwQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSTtTQUNsQyxDQUFDLENBQUE7SUFDTixDQUFDO0NBVUo7QUE5SkQsc0NBOEpDIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEZ1bmN0aW9uICwgRnVuY3Rpb25zIH0gZnJvbSAnLi9mdW5jdGlvbnMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9ucyB9IGZyb20gJy4vc3Vic2NyaXB0aW9uJ1xuaW1wb3J0IHsgTG9nZ2VyQmFzZSB9IGZyb20gJy4vbG9nZ2VyJ1xuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlJ1xuaW1wb3J0IHsgQ29ubmVjdG9yIH0gZnJvbSAnLi9jb25uZWN0b3JzJ1xuaW1wb3J0IHsgQ29yZSB9IGZyb20gJy4vY29yZSdcbmltcG9ydCB7IERldmljZSB9IGZyb20gJy4vZGV2aWNlJ1xuaW1wb3J0IHsgR3JvdXAgfSBmcm9tICcuL2dyb3VwJ1xuaW1wb3J0ICogYXMgZ2cgZnJvbSAnQGF3cy1jZGsvYXdzLWdyZWVuZ3Jhc3MnXG5pbXBvcnQgeyBSb2xlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBTdHJlYW1NYW5hZ2VyUHJvcHMge1xuICAgIHJlYWRvbmx5IGVuYWJsZVN0cmVhbU1hbmFnZXI6IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgYWxsb3dJbnNlY3VyZUFjY2Vzcz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBlbnVtIENsb3VkU3Bvb2xlclN0b3JhZ2VUeXBlIHtcbiAgICBNRU1PUlkgPSAnTWVtb3J5JyxcbiAgICBGSUxFX1NZU1RFTSA9ICdGaWxlU3lzdGVtJ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsb3VkU3Bvb2xlclN0b3JhZ2VQcm9wcyB7XG4gICAgcmVhZG9ubHkgdHlwZTogQ2xvdWRTcG9vbGVyU3RvcmFnZVR5cGU7XG4gICAgcmVhZG9ubHkgbWF4U2l6ZTogY2RrLlNpemU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvdWRTcG9vbGVyUHJvcHMge1xuICAgIHJlYWRvbmx5IHN0b3JhZ2U/OiBDbG91ZFNwb29sZXJTdG9yYWdlUHJvcHM7XG4gICAgcmVhZG9ubHkgZW5hYmxlUGVyc2lzdGVudFNlc3Npb25zPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHcm91cE9wdGlvbnNQcm9wcyB7XG4gICAgcmVhZG9ubHkgY29yZTogQ29yZTtcbiAgICByZWFkb25seSBkZXZpY2VzPzogRGV2aWNlW107XG4gICAgcmVhZG9ubHkgZGV2aWNlU3BlY2lmaWNTdWJzY3JpcHRpb25zPzogU3Vic2NyaXB0aW9ucztcbiAgICByZWFkb25seSByb2xlPzogUm9sZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHcm91cFRlbXBsYXRlUHJvcHMge1xuICAgIHJlYWRvbmx5IGRlZmF1bHRGdW5jdGlvbkV4ZWN1dGlvbj86IEZ1bmN0aW9ucy5FeGVjdXRpb25cbiAgICByZWFkb25seSBmdW5jdGlvbnM/OiBGdW5jdGlvbltdO1xuICAgIHJlYWRvbmx5IHN1YnNjcmlwdGlvbnM/OiBTdWJzY3JpcHRpb25zO1xuICAgIHJlYWRvbmx5IGxvZ2dlcnM/OiBMb2dnZXJCYXNlW107XG4gICAgcmVhZG9ubHkgcmVzb3VyY2VzPzogUmVzb3VyY2VbXTtcbiAgICByZWFkb25seSBjb25uZWN0b3JzPzogQ29ubmVjdG9yW107XG4gICAgcmVhZG9ubHkgc3RyZWFtTWFuYWdlcj86IFN0cmVhbU1hbmFnZXJQcm9wcyxcbiAgICByZWFkb25seSBlbmFibGVBdXRvbWF0aWNJcERpc2NvdmVyeT86IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgcm9sZT86IFJvbGU7XG4gICAgcmVhZG9ubHkgY2xvdWRTcG9vbGVyPzogQ2xvdWRTcG9vbGVyUHJvcHM7XG59XG5cbmV4cG9ydCBjbGFzcyBHcm91cFRlbXBsYXRlIGV4dGVuZHMgY2RrLkNvbnN0cnVjdCB7XG4gICAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9ucz86IFN1YnNjcmlwdGlvbnM7XG5cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEdyb3VwVGVtcGxhdGVQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpXG4gICAgICAgIFxuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0gcHJvcHMuc3Vic2NyaXB0aW9ucztcblxuICAgICAgICBsZXQgc3lzdGVtRnVuY3Rpb25zOiBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24uRnVuY3Rpb25Qcm9wZXJ0eVtdID0gW107XG4gICAgICAgIGlmIChwcm9wcy5zdHJlYW1NYW5hZ2VyPy5lbmFibGVTdHJlYW1NYW5hZ2VyIHx8IHByb3BzLmVuYWJsZUF1dG9tYXRpY0lwRGlzY292ZXJ5IHx8IHByb3BzLmNsb3VkU3Bvb2xlcikge1xuICAgICAgICAgICAgaWYgKHByb3BzLnN0cmVhbU1hbmFnZXI/LmVuYWJsZVN0cmVhbU1hbmFnZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcHMuc3RyZWFtTWFuYWdlciEuYWxsb3dJbnNlY3VyZUFjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbU1hbmFnZXJFbnZpcm9ubWVudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiU1RSRUFNX01BTkFHRVJfQVVUSEVOVElDQVRFX0NMSUVOVFwiOiBcImZhbHNlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzeXN0ZW1GdW5jdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAnc3RyZWFtX21hbmFnZXInLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkFybjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHU3RyZWFtTWFuYWdlcjoxXCIsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5jb2RpbmdUeXBlOiAnYmluYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpbm5lZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDMsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudDogdGhpcy5zdHJlYW1NYW5hZ2VyRW52aXJvbm1lbnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvcHMuZW5hYmxlQXV0b21hdGljSXBEaXNjb3ZlcnkpIHtcbiAgICAgICAgICAgICAgICBzeXN0ZW1GdW5jdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAnYXV0b19pcCcsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uQXJuOiBcImFybjphd3M6bGFtYmRhOjo6ZnVuY3Rpb246R0dJUERldGVjdG9yOjFcIixcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25Db25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5uZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnlTaXplOiAzMjc2OCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvcHMuY2xvdWRTcG9vbGVyKSB7XG4gICAgICAgICAgICAgICAgc3lzdGVtRnVuY3Rpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpZDogJ3Nwb29sZXInLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkFybjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHQ2xvdWRTcG9vbGVyOjFcIixcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25Db25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGVjdXRhYmxlOiBcInNwb29sZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpbm5lZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeVNpemU6IDMyNzY4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX1NUT1JBR0VfVFlQRVwiOiBwcm9wcy5jbG91ZFNwb29sZXIuc3RvcmFnZT8udHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHR19DT05GSUdfTUFYX1NJWkVfQllURVNcIjogcHJvcHMuY2xvdWRTcG9vbGVyLnN0b3JhZ2U/Lm1heFNpemUudG9LaWJpYnl0ZXMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHR19DT05GSUdfU1VCU0NSSVBUSU9OX1FVQUxJVFlcIjogcHJvcHMuY2xvdWRTcG9vbGVyLmVuYWJsZVBlcnNpc3RlbnRTZXNzaW9ucyA/ICdBdExlYXN0T25jZVBlcnNpc3RlbnQnIDogJ0F0TW9zdE9uY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcHMuZnVuY3Rpb25zICE9PSB1bmRlZmluZWQgfHwgc3lzdGVtRnVuY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbnZlcnQoeDogRnVuY3Rpb24pOiBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24uRnVuY3Rpb25Qcm9wZXJ0eSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHgucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGZ1bmN0aW9uRGVmaW5pdGlvbjogZ2cuQ2ZuRnVuY3Rpb25EZWZpbml0aW9uO1xuICAgICAgICAgICAgaWYgKHByb3BzLmZ1bmN0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvcHMuZGVmYXVsdEZ1bmN0aW9uRXhlY3V0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWN1dGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnByb3BzLmRlZmF1bHRGdW5jdGlvbkV4ZWN1dGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24odGhpcywgaWQgKyAnX2Z1bmN0aW9ucycsIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogaWQsXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q29uZmlnOiB0aGlzLmRlZmF1bHRDb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbnM6IFsuLi5wcm9wcy5mdW5jdGlvbnMhLm1hcChjb252ZXJ0KSwgLi4uc3lzdGVtRnVuY3Rpb25zXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb25EZWZpbml0aW9uID0gbmV3IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbih0aGlzLCBpZCArICdfZnVuY3Rpb25zJywge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uczogc3lzdGVtRnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuID0gZnVuY3Rpb25EZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuO1xuICAgICAgICB9XG5cblxuICAgICAgICBpZiAocHJvcHMucmVzb3VyY2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbnZlcnQoeDogUmVzb3VyY2UpOiBnZy5DZm5SZXNvdXJjZURlZmluaXRpb24uUmVzb3VyY2VJbnN0YW5jZVByb3BlcnR5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcmVzb3VyY2VEZWZpbml0aW9uID0gbmV3IGdnLkNmblJlc291cmNlRGVmaW5pdGlvbih0aGlzLCBpZCArICdfcmVzb3VyY2VzJywge1xuICAgICAgICAgICAgICAgIG5hbWU6IGlkLFxuICAgICAgICAgICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlczogcHJvcHMucmVzb3VyY2VzIS5tYXAoY29udmVydClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuID0gcmVzb3VyY2VEZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BzLmNvbm5lY3RvcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY29udmVydCh4OiBDb25uZWN0b3IpOiBnZy5DZm5Db25uZWN0b3JEZWZpbml0aW9uLkNvbm5lY3RvclByb3BlcnR5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgY29ubmVjdG9yRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5Db25uZWN0b3JEZWZpbml0aW9uKHRoaXMsIGlkICsgJ19jb25uZWN0b3JzJywge1xuICAgICAgICAgICAgICAgIG5hbWU6IGlkLFxuICAgICAgICAgICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3RvcnM6IHByb3BzLmNvbm5lY3RvcnMhLm1hcChjb252ZXJ0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RvckRlZmluaXRpb25WZXJzaW9uQXJuID0gY29ubmVjdG9yRGVmaW5pdGlvbi5hdHRyTGF0ZXN0VmVyc2lvbkFybjtcbiAgICAgICAgfVxuXG4gICAgICAgXG5cbiAgICAgICAgaWYgKHByb3BzLmxvZ2dlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY29udmVydCh4OiBMb2dnZXJCYXNlKTogZ2cuQ2ZuTG9nZ2VyRGVmaW5pdGlvbi5Mb2dnZXJQcm9wZXJ0eSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHgucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGxvZ2dlckRlZmluaXRpb24gPSBuZXcgZ2cuQ2ZuTG9nZ2VyRGVmaW5pdGlvbih0aGlzLCBpZCArICdfbG9nZ2VycycsIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgICAgICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXJzOiBwcm9wcy5sb2dnZXJzIS5tYXAoY29udmVydClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5sb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybiA9IGxvZ2dlckRlZmluaXRpb24uYXR0ckxhdGVzdFZlcnNpb25Bcm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVHcm91cChpZDogc3RyaW5nLCBvcHRpb25zOiBHcm91cE9wdGlvbnNQcm9wcyk6IEdyb3VwIHtcbiAgICAgICAgaWYgKHRoaXMuX3N1YnNjcmlwdGlvbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IG5ldyBTdWJzY3JpcHRpb25zKHRoaXMsIGlkKydfc3VicycpXG4gICAgICAgIH0gXG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMubWVyZ2Uob3B0aW9ucy5kZXZpY2VTcGVjaWZpY1N1YnNjcmlwdGlvbnMpXG4gICAgICAgIHJldHVybiBuZXcgR3JvdXAodGhpcywgaWQsIHtcbiAgICAgICAgICAgIGNvcmU6IG9wdGlvbnMuY29yZSxcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbnM6IHRoaXMuX3N1YnNjcmlwdGlvbnMsXG4gICAgICAgICAgICBkZXZpY2VzOiBvcHRpb25zLmRldmljZXMsXG4gICAgICAgICAgICBpbml0aWFsVmVyc2lvbjogdGhpcyxcbiAgICAgICAgICAgIHJvbGU6IG9wdGlvbnMucm9sZSB8fCB0aGlzLnJvbGVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0cmVhbU1hbmFnZXJFbnZpcm9ubWVudD86IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbi5FbnZpcm9ubWVudFByb3BlcnR5O1xuICAgIHByaXZhdGUgZGVmYXVsdENvbmZpZz86IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbi5EZWZhdWx0Q29uZmlnUHJvcGVydHk7XG4gICAgcmVhZG9ubHkgc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmdcbiAgICByZWFkb25seSBmdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgY29ubmVjdG9yRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgcm9sZT86IFJvbGU7XG59Il19