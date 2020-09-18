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
        var _a, _b, _c, _d, _e;
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
                        environment: this.streamManagerEnvironment,
                        memorySize: ((_c = props.streamManager.memorySize) === null || _c === void 0 ? void 0 : _c.toKibibytes()) || core_1.Size.mebibytes(128).toKibibytes()
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
                                "GG_CONFIG_STORAGE_TYPE": (_d = props.cloudSpooler.storage) === null || _d === void 0 ? void 0 : _d.type,
                                "GG_CONFIG_MAX_SIZE_BYTES": (_e = props.cloudSpooler.storage) === null || _e === void 0 ? void 0 : _e.maxSize.toKibibytes(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7OztBQUVILHFDQUFxQztBQUVyQyxpREFBOEM7QUFNOUMsbUNBQStCO0FBQy9CLDhDQUE2QztBQUU3Qyx3Q0FBcUM7QUFpQnJDLElBQVksdUJBR1g7QUFIRCxXQUFZLHVCQUF1QjtJQUMvQiw0Q0FBaUIsQ0FBQTtJQUNqQixxREFBMEIsQ0FBQTtBQUM5QixDQUFDLEVBSFcsdUJBQXVCLEdBQXZCLCtCQUF1QixLQUF2QiwrQkFBdUIsUUFHbEM7QUFnQ0QsTUFBYSxhQUFjLFNBQVEsR0FBRyxDQUFDLFNBQVM7SUFHNUMsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUF5Qjs7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUVoQixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFFMUMsSUFBSSxlQUFlLEdBQWdELEVBQUUsQ0FBQztRQUN0RSxJQUFJLE9BQUEsS0FBSyxDQUFDLGFBQWEsMENBQUUsbUJBQW1CLEtBQUksS0FBSyxDQUFDLDBCQUEwQixJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFDcEcsVUFBSSxLQUFLLENBQUMsYUFBYSwwQ0FBRSxtQkFBbUIsRUFBRTtnQkFDMUMsSUFBSSxLQUFLLENBQUMsYUFBYyxDQUFDLG1CQUFtQixFQUFFO29CQUMxQyxJQUFJLENBQUMsd0JBQXdCLEdBQUc7d0JBQzVCLFNBQVMsRUFBRTs0QkFDUCxvQ0FBb0MsRUFBRSxPQUFPO3lCQUNoRDtxQkFDSixDQUFBO2lCQUNKO2dCQUVELGVBQWUsQ0FBQyxJQUFJLENBQUM7b0JBQ2pCLEVBQUUsRUFBRSxnQkFBZ0I7b0JBQ3BCLFdBQVcsRUFBRSw2Q0FBNkM7b0JBQzFELHFCQUFxQixFQUFFO3dCQUNuQixZQUFZLEVBQUUsUUFBUTt3QkFD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QUFFO29CQUNaLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7aUJBQ3ZDO2FBQ0osQ0FBQyxDQUFBO1lBQ0YsSUFBSSxDQUFDLDBCQUEwQixHQUFHLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDO1NBQzNFO0lBQ0wsQ0FBQztJQUVELFdBQVcsQ0FBQyxFQUFVLEVBQUUsT0FBMEI7UUFDOUMsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLFNBQVMsRUFBRTtZQUNuQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksNEJBQWEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQzVEO1FBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUE7UUFDOUQsT0FBTyxJQUFJLGFBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtZQUNsQixhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDbEMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO1lBQ3hCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJO1NBQ2xDLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FVSjtBQWhLRCxzQ0FnS0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRnVuY3Rpb24gLCBGdW5jdGlvbnMgfSBmcm9tICcuL2Z1bmN0aW9ucyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25zIH0gZnJvbSAnLi9zdWJzY3JpcHRpb24nXG5pbXBvcnQgeyBMb2dnZXJCYXNlIH0gZnJvbSAnLi9sb2dnZXInXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2UnXG5pbXBvcnQgeyBDb25uZWN0b3IgfSBmcm9tICcuL2Nvbm5lY3RvcnMnXG5pbXBvcnQgeyBDb3JlIH0gZnJvbSAnLi9jb3JlJ1xuaW1wb3J0IHsgRGV2aWNlIH0gZnJvbSAnLi9kZXZpY2UnXG5pbXBvcnQgeyBHcm91cCB9IGZyb20gJy4vZ3JvdXAnXG5pbXBvcnQgKiBhcyBnZyBmcm9tICdAYXdzLWNkay9hd3MtZ3JlZW5ncmFzcydcbmltcG9ydCB7IFJvbGUgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IFNpemUgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcblxuXG5leHBvcnQgaW50ZXJmYWNlIFN0cmVhbU1hbmFnZXJQcm9wcyB7XG4gICAgcmVhZG9ubHkgZW5hYmxlU3RyZWFtTWFuYWdlcjogYm9vbGVhbjtcbiAgICByZWFkb25seSBhbGxvd0luc2VjdXJlQWNjZXNzPzogYm9vbGVhbjtcbiAgICByZWFkb25seSBzdG9yZVJvb3REaXI/OiBib29sZWFuO1xuICAgIHJlYWRvbmx5IHNlcnZlclBvcnQ/OiBudW1iZXI7XG4gICAgcmVhZG9ubHkgZXhwb3J0ZXJNYXhpbXVtQmFuZHdpZHRoPzogbnVtYmVyO1xuICAgIHJlYWRvbmx5IHRocmVhZFBvb2xTaXplPzogbnVtYmVyO1xuICAgIHJlYWRvbmx5IGp2bUFyZ3M/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgcmVhZE9ubHlEaXJzPzogc3RyaW5nW107XG4gICAgcmVhZG9ubHkgbWluU2l6ZU11bHRpcGFydFVwbG9hZD86IFNpemU7XG4gICAgcmVhZG9ubHkgbWVtb3J5U2l6ZT86IFNpemU7XG5cbn1cblxuZXhwb3J0IGVudW0gQ2xvdWRTcG9vbGVyU3RvcmFnZVR5cGUge1xuICAgIE1FTU9SWSA9ICdNZW1vcnknLFxuICAgIEZJTEVfU1lTVEVNID0gJ0ZpbGVTeXN0ZW0nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvdWRTcG9vbGVyU3RvcmFnZVByb3BzIHtcbiAgICByZWFkb25seSB0eXBlOiBDbG91ZFNwb29sZXJTdG9yYWdlVHlwZTtcbiAgICByZWFkb25seSBtYXhTaXplOiBjZGsuU2l6ZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbG91ZFNwb29sZXJQcm9wcyB7XG4gICAgcmVhZG9ubHkgc3RvcmFnZT86IENsb3VkU3Bvb2xlclN0b3JhZ2VQcm9wcztcbiAgICByZWFkb25seSBlbmFibGVQZXJzaXN0ZW50U2Vzc2lvbnM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwT3B0aW9uc1Byb3BzIHtcbiAgICByZWFkb25seSBjb3JlOiBDb3JlO1xuICAgIHJlYWRvbmx5IGRldmljZXM/OiBEZXZpY2VbXTtcbiAgICByZWFkb25seSBkZXZpY2VTcGVjaWZpY1N1YnNjcmlwdGlvbnM/OiBTdWJzY3JpcHRpb25zO1xuICAgIHJlYWRvbmx5IHJvbGU/OiBSb2xlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwVGVtcGxhdGVQcm9wcyB7XG4gICAgcmVhZG9ubHkgZGVmYXVsdEZ1bmN0aW9uRXhlY3V0aW9uPzogRnVuY3Rpb25zLkV4ZWN1dGlvblxuICAgIHJlYWRvbmx5IGZ1bmN0aW9ucz86IEZ1bmN0aW9uW107XG4gICAgcmVhZG9ubHkgc3Vic2NyaXB0aW9ucz86IFN1YnNjcmlwdGlvbnM7XG4gICAgcmVhZG9ubHkgbG9nZ2Vycz86IExvZ2dlckJhc2VbXTtcbiAgICByZWFkb25seSByZXNvdXJjZXM/OiBSZXNvdXJjZVtdO1xuICAgIHJlYWRvbmx5IGNvbm5lY3RvcnM/OiBDb25uZWN0b3JbXTtcbiAgICByZWFkb25seSBzdHJlYW1NYW5hZ2VyPzogU3RyZWFtTWFuYWdlclByb3BzLFxuICAgIHJlYWRvbmx5IGVuYWJsZUF1dG9tYXRpY0lwRGlzY292ZXJ5PzogYm9vbGVhbjtcbiAgICByZWFkb25seSByb2xlPzogUm9sZTtcbiAgICByZWFkb25seSBjbG91ZFNwb29sZXI/OiBDbG91ZFNwb29sZXJQcm9wcztcbn1cblxuZXhwb3J0IGNsYXNzIEdyb3VwVGVtcGxhdGUgZXh0ZW5kcyBjZGsuQ29uc3RydWN0IHtcbiAgICBwcml2YXRlIF9zdWJzY3JpcHRpb25zPzogU3Vic2NyaXB0aW9ucztcblxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogR3JvdXBUZW1wbGF0ZVByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZClcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBwcm9wcy5zdWJzY3JpcHRpb25zO1xuXG4gICAgICAgIGxldCBzeXN0ZW1GdW5jdGlvbnM6IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbi5GdW5jdGlvblByb3BlcnR5W10gPSBbXTtcbiAgICAgICAgaWYgKHByb3BzLnN0cmVhbU1hbmFnZXI/LmVuYWJsZVN0cmVhbU1hbmFnZXIgfHwgcHJvcHMuZW5hYmxlQXV0b21hdGljSXBEaXNjb3ZlcnkgfHwgcHJvcHMuY2xvdWRTcG9vbGVyKSB7XG4gICAgICAgICAgICBpZiAocHJvcHMuc3RyZWFtTWFuYWdlcj8uZW5hYmxlU3RyZWFtTWFuYWdlcikge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wcy5zdHJlYW1NYW5hZ2VyIS5hbGxvd0luc2VjdXJlQWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtTWFuYWdlckVudmlyb25tZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJTVFJFQU1fTUFOQUdFUl9BVVRIRU5USUNBVEVfQ0xJRU5UXCI6IFwiZmFsc2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHN5c3RlbUZ1bmN0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdzdHJlYW1fbWFuYWdlcicsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uQXJuOiBcImFybjphd3M6bGFtYmRhOjo6ZnVuY3Rpb246R0dTdHJlYW1NYW5hZ2VyOjFcIixcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25Db25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmNvZGluZ1R5cGU6ICdiaW5hcnknLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlubmVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50OiB0aGlzLnN0cmVhbU1hbmFnZXJFbnZpcm9ubWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeVNpemU6IHByb3BzLnN0cmVhbU1hbmFnZXIubWVtb3J5U2l6ZT8udG9LaWJpYnl0ZXMoKSB8fCBTaXplLm1lYmlieXRlcygxMjgpLnRvS2liaWJ5dGVzKClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvcHMuZW5hYmxlQXV0b21hdGljSXBEaXNjb3ZlcnkpIHtcbiAgICAgICAgICAgICAgICBzeXN0ZW1GdW5jdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAnYXV0b19pcCcsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uQXJuOiBcImFybjphd3M6bGFtYmRhOjo6ZnVuY3Rpb246R0dJUERldGVjdG9yOjFcIixcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25Db25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5uZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnlTaXplOiAzMjc2OCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvcHMuY2xvdWRTcG9vbGVyKSB7XG4gICAgICAgICAgICAgICAgc3lzdGVtRnVuY3Rpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpZDogJ3Nwb29sZXInLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkFybjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHQ2xvdWRTcG9vbGVyOjFcIixcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25Db25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGVjdXRhYmxlOiBcInNwb29sZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpbm5lZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeVNpemU6IDMyNzY4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX1NUT1JBR0VfVFlQRVwiOiBwcm9wcy5jbG91ZFNwb29sZXIuc3RvcmFnZT8udHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHR19DT05GSUdfTUFYX1NJWkVfQllURVNcIjogcHJvcHMuY2xvdWRTcG9vbGVyLnN0b3JhZ2U/Lm1heFNpemUudG9LaWJpYnl0ZXMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHR19DT05GSUdfU1VCU0NSSVBUSU9OX1FVQUxJVFlcIjogcHJvcHMuY2xvdWRTcG9vbGVyLmVuYWJsZVBlcnNpc3RlbnRTZXNzaW9ucyA/ICdBdExlYXN0T25jZVBlcnNpc3RlbnQnIDogJ0F0TW9zdE9uY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcHMuZnVuY3Rpb25zICE9PSB1bmRlZmluZWQgfHwgc3lzdGVtRnVuY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbnZlcnQoeDogRnVuY3Rpb24pOiBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24uRnVuY3Rpb25Qcm9wZXJ0eSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHgucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGZ1bmN0aW9uRGVmaW5pdGlvbjogZ2cuQ2ZuRnVuY3Rpb25EZWZpbml0aW9uO1xuICAgICAgICAgICAgaWYgKHByb3BzLmZ1bmN0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvcHMuZGVmYXVsdEZ1bmN0aW9uRXhlY3V0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWN1dGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnByb3BzLmRlZmF1bHRGdW5jdGlvbkV4ZWN1dGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24odGhpcywgaWQgKyAnX2Z1bmN0aW9ucycsIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogaWQsXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q29uZmlnOiB0aGlzLmRlZmF1bHRDb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbnM6IFsuLi5wcm9wcy5mdW5jdGlvbnMhLm1hcChjb252ZXJ0KSwgLi4uc3lzdGVtRnVuY3Rpb25zXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb25EZWZpbml0aW9uID0gbmV3IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbih0aGlzLCBpZCArICdfZnVuY3Rpb25zJywge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uczogc3lzdGVtRnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuID0gZnVuY3Rpb25EZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuO1xuICAgICAgICB9XG5cblxuICAgICAgICBpZiAocHJvcHMucmVzb3VyY2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbnZlcnQoeDogUmVzb3VyY2UpOiBnZy5DZm5SZXNvdXJjZURlZmluaXRpb24uUmVzb3VyY2VJbnN0YW5jZVByb3BlcnR5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcmVzb3VyY2VEZWZpbml0aW9uID0gbmV3IGdnLkNmblJlc291cmNlRGVmaW5pdGlvbih0aGlzLCBpZCArICdfcmVzb3VyY2VzJywge1xuICAgICAgICAgICAgICAgIG5hbWU6IGlkLFxuICAgICAgICAgICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlczogcHJvcHMucmVzb3VyY2VzIS5tYXAoY29udmVydClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuID0gcmVzb3VyY2VEZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BzLmNvbm5lY3RvcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY29udmVydCh4OiBDb25uZWN0b3IpOiBnZy5DZm5Db25uZWN0b3JEZWZpbml0aW9uLkNvbm5lY3RvclByb3BlcnR5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgY29ubmVjdG9yRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5Db25uZWN0b3JEZWZpbml0aW9uKHRoaXMsIGlkICsgJ19jb25uZWN0b3JzJywge1xuICAgICAgICAgICAgICAgIG5hbWU6IGlkLFxuICAgICAgICAgICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3RvcnM6IHByb3BzLmNvbm5lY3RvcnMhLm1hcChjb252ZXJ0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RvckRlZmluaXRpb25WZXJzaW9uQXJuID0gY29ubmVjdG9yRGVmaW5pdGlvbi5hdHRyTGF0ZXN0VmVyc2lvbkFybjtcbiAgICAgICAgfVxuXG4gICAgICAgXG5cbiAgICAgICAgaWYgKHByb3BzLmxvZ2dlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY29udmVydCh4OiBMb2dnZXJCYXNlKTogZ2cuQ2ZuTG9nZ2VyRGVmaW5pdGlvbi5Mb2dnZXJQcm9wZXJ0eSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHgucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGxvZ2dlckRlZmluaXRpb24gPSBuZXcgZ2cuQ2ZuTG9nZ2VyRGVmaW5pdGlvbih0aGlzLCBpZCArICdfbG9nZ2VycycsIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgICAgICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXJzOiBwcm9wcy5sb2dnZXJzIS5tYXAoY29udmVydClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5sb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybiA9IGxvZ2dlckRlZmluaXRpb24uYXR0ckxhdGVzdFZlcnNpb25Bcm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVHcm91cChpZDogc3RyaW5nLCBvcHRpb25zOiBHcm91cE9wdGlvbnNQcm9wcyk6IEdyb3VwIHtcbiAgICAgICAgaWYgKHRoaXMuX3N1YnNjcmlwdGlvbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IG5ldyBTdWJzY3JpcHRpb25zKHRoaXMsIGlkKydfc3VicycpXG4gICAgICAgIH0gXG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMubWVyZ2Uob3B0aW9ucy5kZXZpY2VTcGVjaWZpY1N1YnNjcmlwdGlvbnMpXG4gICAgICAgIHJldHVybiBuZXcgR3JvdXAodGhpcywgaWQsIHtcbiAgICAgICAgICAgIGNvcmU6IG9wdGlvbnMuY29yZSxcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbnM6IHRoaXMuX3N1YnNjcmlwdGlvbnMsXG4gICAgICAgICAgICBkZXZpY2VzOiBvcHRpb25zLmRldmljZXMsXG4gICAgICAgICAgICBpbml0aWFsVmVyc2lvbjogdGhpcyxcbiAgICAgICAgICAgIHJvbGU6IG9wdGlvbnMucm9sZSB8fCB0aGlzLnJvbGVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0cmVhbU1hbmFnZXJFbnZpcm9ubWVudD86IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbi5FbnZpcm9ubWVudFByb3BlcnR5O1xuICAgIHByaXZhdGUgZGVmYXVsdENvbmZpZz86IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbi5EZWZhdWx0Q29uZmlnUHJvcGVydHk7XG4gICAgcmVhZG9ubHkgc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmdcbiAgICByZWFkb25seSBmdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgY29ubmVjdG9yRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgcm9sZT86IFJvbGU7XG59Il19