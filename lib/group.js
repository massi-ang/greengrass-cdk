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
exports.Group = exports.CloudSpoolerStorageType = void 0;
const cdk = require("@aws-cdk/core");
const gg = require("@aws-cdk/aws-greengrass");
var CloudSpoolerStorageType;
(function (CloudSpoolerStorageType) {
    CloudSpoolerStorageType["MEMORY"] = "Memory";
    CloudSpoolerStorageType["FILE_SYSTEM"] = "FileSystem";
})(CloudSpoolerStorageType = exports.CloudSpoolerStorageType || (exports.CloudSpoolerStorageType = {}));
class Group extends cdk.Construct {
    constructor(scope, id, props) {
        var _a, _b, _c, _d, _e, _f;
        super(scope, id);
        const coreDefinition = new gg.CfnCoreDefinition(this, id + '_core', {
            name: id,
            initialVersion: {
                cores: [props.core.resolve()]
            }
        });
        if (props.initialVersion !== undefined) {
            let roleArn = ((_a = props.role) === null || _a === void 0 ? void 0 : _a.roleArn) || this.roleArn;
            let group = new gg.CfnGroup(this, id, {
                name: id,
                initialVersion: {
                    coreDefinitionVersionArn: coreDefinition.attrLatestVersionArn,
                    ...props.initialVersion
                },
                roleArn: roleArn
            });
            this.arn = group.attrArn;
            this.id = group.attrId;
            this.latestVersionArn = group.attrLatestVersionArn;
            this.roleArn = roleArn;
            return;
        }
        let systemFunctions = [];
        if (((_b = props.streamManager) === null || _b === void 0 ? void 0 : _b.enableStreamManager) || props.enableAutomaticIpDiscovery || props.cloudSpooler) {
            if ((_c = props.streamManager) === null || _c === void 0 ? void 0 : _c.enableStreamManager) {
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
        if (props.subscriptions !== undefined) {
            let subscriptionDefinition = new gg.CfnSubscriptionDefinition(this, id + '_subscriptions', {
                name: id,
                initialVersion: {
                    subscriptions: props.subscriptions.resolve()
                }
            });
            this.subscriptionDefinitionVersionArn = subscriptionDefinition.attrLatestVersionArn;
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
        if (props.devices !== undefined) {
            function convert(x) {
                return x.resolve();
            }
            let deviceDefinition = new gg.CfnDeviceDefinition(this, id + '_devices', {
                name: id,
                initialVersion: {
                    devices: props.devices.map(convert)
                }
            });
            this.deviceDefinitionVersionArn = deviceDefinition.attrLatestVersionArn;
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
        let group = new gg.CfnGroup(this, id, {
            name: id,
            initialVersion: {
                coreDefinitionVersionArn: coreDefinition.attrLatestVersionArn,
                functionDefinitionVersionArn: this.functionDefinitionVersionArn,
                subscriptionDefinitionVersionArn: this.subscriptionDefinitionVersionArn,
                loggerDefinitionVersionArn: this.loggerDefinitionVersionArn,
                resourceDefinitionVersionArn: this.resourceDefinitionVersionArn,
                deviceDefinitionVersionArn: this.deviceDefinitionVersionArn
            } // TODO: Devices and Connectors
        });
        this.arn = group.attrArn;
        this.id = group.attrId;
        this.latestVersionArn = group.attrLatestVersionArn;
        this.roleArn = (_f = props.role) === null || _f === void 0 ? void 0 : _f.roleArn;
    }
    cloneToNew(id, core) {
        return new Group(this, id, {
            initialVersion: {
                functionDefinitionVersionArn: this.functionDefinitionVersionArn,
                subscriptionDefinitionVersionArn: this.subscriptionDefinitionVersionArn,
                loggerDefinitionVersionArn: this.loggerDefinitionVersionArn,
                resourceDefinitionVersionArn: this.resourceDefinitionVersionArn
            },
            core: core
        });
    }
    static fromTemplate(scope, id, core, template) {
        return new Group(scope, id, {
            core: core,
            initialVersion: {
                functionDefinitionVersionArn: template.functionDefinitionVersionArn,
                subscriptionDefinitionVersionArn: template.subscriptionDefinitionVersionArn,
                loggerDefinitionVersionArn: template.loggerDefinitionVersionArn,
                resourceDefinitionVersionArn: template.resourceDefinitionVersionArn
            },
            role: template.role
        });
    }
}
exports.Group = Group;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7OztBQUVILHFDQUFxQztBQU9yQyw4Q0FBNkM7QUFZN0MsSUFBWSx1QkFHWDtBQUhELFdBQVksdUJBQXVCO0lBQ2pDLDRDQUFpQixDQUFBO0lBQ2pCLHFEQUEwQixDQUFBO0FBQzVCLENBQUMsRUFIVyx1QkFBdUIsR0FBdkIsK0JBQXVCLEtBQXZCLCtCQUF1QixRQUdsQztBQTZCRCxNQUFhLEtBQU0sU0FBUSxHQUFHLENBQUMsU0FBUztJQU10QyxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQWlCOztRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sY0FBYyxHQUFHLElBQUksRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsT0FBTyxFQUFFO1lBQ2xFLElBQUksRUFBRSxFQUFFO1lBQ1IsY0FBYyxFQUFFO2dCQUNkLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDOUI7U0FDRixDQUFDLENBQUE7UUFFRixJQUFJLEtBQUssQ0FBQyxjQUFjLEtBQUssU0FBUyxFQUFFO1lBQ3RDLElBQUksT0FBTyxHQUFHLE9BQUEsS0FBSyxDQUFDLElBQUksMENBQUUsT0FBTyxLQUFJLElBQUksQ0FBQyxPQUFPLENBQUE7WUFDakQsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBQ3BDLElBQUksRUFBRSxFQUFFO2dCQUNSLGNBQWMsRUFBRTtvQkFDZCx3QkFBd0IsRUFBRSxjQUFjLENBQUMsb0JBQW9CO29CQUM3RCxHQUFHLEtBQUssQ0FBQyxjQUFjO2lCQUN4QjtnQkFDRCxPQUFPLEVBQUUsT0FBTzthQUNqQixDQUFDLENBQUE7WUFDRixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDekIsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUE7WUFDbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7WUFDdEIsT0FBTTtTQUNQO1FBRUQsSUFBSSxlQUFlLEdBQWdELEVBQUUsQ0FBQztRQUN0RSxJQUFJLE9BQUEsS0FBSyxDQUFDLGFBQWEsMENBQUUsbUJBQW1CLEtBQUksS0FBSyxDQUFDLDBCQUEwQixJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFDdEcsVUFBSSxLQUFLLENBQUMsYUFBYSwwQ0FBRSxtQkFBbUIsRUFBRTtnQkFDNUMsSUFBSSxLQUFLLENBQUMsYUFBYyxDQUFDLG1CQUFtQixFQUFFO29CQUM1QyxJQUFJLENBQUMsd0JBQXdCLEdBQUc7d0JBQzlCLFNBQVMsRUFBRTs0QkFDVCxvQ0FBb0MsRUFBRSxPQUFPO3lCQUM5QztxQkFDRixDQUFBO2lCQUNGO2dCQUNELGVBQWUsQ0FBQyxJQUFJLENBQUM7b0JBQ25CLEVBQUUsRUFBRSxnQkFBZ0I7b0JBQ3BCLFdBQVcsRUFBRSw2Q0FBNkM7b0JBQzFELHFCQUFxQixFQUFFO3dCQUNyQixZQUFZLEVBQUUsUUFBUTt3QkFDdEIsTUFBTSxFQUFFLElBQUk7d0JBQ1osT0FBTyxFQUFFLENBQUM7d0JBQ1YsV0FBVyxFQUFFLElBQUksQ0FBQyx3QkFBd0I7cUJBQzNDO2lCQUNGLENBQUMsQ0FBQTthQUNIO1lBQ0QsSUFBSSxLQUFLLENBQUMsMEJBQTBCLEVBQUU7Z0JBQ3BDLGVBQWUsQ0FBQyxJQUFJLENBQUM7b0JBQ25CLEVBQUUsRUFBRSxTQUFTO29CQUNiLFdBQVcsRUFBRSwwQ0FBMEM7b0JBQ3ZELHFCQUFxQixFQUFFO3dCQUNyQixNQUFNLEVBQUUsSUFBSTt3QkFDWixVQUFVLEVBQUUsS0FBSzt3QkFDakIsT0FBTyxFQUFFLENBQUM7cUJBQ1g7aUJBQ0YsQ0FBQyxDQUFBO2FBQ0g7WUFDRCxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUU7Z0JBQ3RCLGVBQWUsQ0FBQyxJQUFJLENBQUM7b0JBQ25CLEVBQUUsRUFBRSxTQUFTO29CQUNiLFdBQVcsRUFBRSw0Q0FBNEM7b0JBQ3pELHFCQUFxQixFQUFFO3dCQUNyQixVQUFVLEVBQUUsU0FBUzt3QkFDckIsTUFBTSxFQUFFLElBQUk7d0JBQ1osVUFBVSxFQUFFLEtBQUs7d0JBQ2pCLE9BQU8sRUFBRSxDQUFDO3dCQUNWLFdBQVcsRUFBRTs0QkFDWCxTQUFTLEVBQUU7Z0NBQ1Qsd0JBQXdCLFFBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLDBDQUFFLElBQUk7Z0NBQzFELDBCQUEwQixRQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTywwQ0FBRSxPQUFPLENBQUMsV0FBVyxFQUFFO2dDQUM3RSxnQ0FBZ0MsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQSxDQUFDLENBQUMsWUFBWTs2QkFDdEg7eUJBQ0Y7cUJBQ0Y7aUJBQ0YsQ0FBQyxDQUFBO2FBQ0g7U0FDRjtRQUVELElBQUksS0FBSyxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDL0QsU0FBUyxPQUFPLENBQUMsQ0FBVztnQkFDMUIsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckIsQ0FBQztZQUNELElBQUksa0JBQTRDLENBQUM7WUFDakQsSUFBSSxLQUFLLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFFakMsSUFBSSxLQUFLLENBQUMsd0JBQXdCLEVBQUU7b0JBQ2xDLElBQUksQ0FBQyxhQUFhLEdBQUc7d0JBQ25CLFNBQVMsRUFBRTs0QkFDVCxHQUFHLEtBQUssQ0FBQyx3QkFBd0I7eUJBQ2xDO3FCQUNGLENBQUE7aUJBQ0Y7Z0JBQ0Qsa0JBQWtCLEdBQUcsSUFBSSxFQUFFLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxZQUFZLEVBQUU7b0JBQ3pFLElBQUksRUFBRSxFQUFFO29CQUNSLGNBQWMsRUFBRTt3QkFDZCxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7d0JBQ2pDLFNBQVMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxlQUFlLENBQUM7cUJBQ2xFO2lCQUNGLENBQUMsQ0FBQTthQUNIO2lCQUFNO2dCQUNMLGtCQUFrQixHQUFHLElBQUksRUFBRSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsWUFBWSxFQUFFO29CQUN6RSxJQUFJLEVBQUUsRUFBRTtvQkFDUixjQUFjLEVBQUU7d0JBQ2QsU0FBUyxFQUFFLGVBQWU7cUJBQzNCO2lCQUNGLENBQUMsQ0FBQTthQUNIO1lBQ0QsSUFBSSxDQUFDLDRCQUE0QixHQUFHLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDO1NBQzdFO1FBR0QsSUFBSSxLQUFLLENBQUMsYUFBYSxLQUFLLFNBQVMsRUFBRTtZQUVyQyxJQUFJLHNCQUFzQixHQUFHLElBQUksRUFBRSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsZ0JBQWdCLEVBQUU7Z0JBQ3pGLElBQUksRUFBRSxFQUFFO2dCQUNSLGNBQWMsRUFBRTtvQkFDZCxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWMsQ0FBQyxPQUFPLEVBQUU7aUJBQzlDO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxDQUFDLGdDQUFnQyxHQUFHLHNCQUFzQixDQUFDLG9CQUFvQixDQUFDO1NBQ3JGO1FBR0QsSUFBSSxLQUFLLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUNqQyxTQUFTLE9BQU8sQ0FBQyxDQUFXO2dCQUMxQixPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyQixDQUFDO1lBQ0QsSUFBSSxrQkFBa0IsR0FBRyxJQUFJLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLFlBQVksRUFBRTtnQkFDN0UsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsY0FBYyxFQUFFO29CQUNkLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7aUJBQ3pDO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxDQUFDLDRCQUE0QixHQUFHLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDO1NBQzdFO1FBRUQsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUMvQixTQUFTLE9BQU8sQ0FBQyxDQUFTO2dCQUN4QixPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyQixDQUFDO1lBQ0QsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLFVBQVUsRUFBRTtnQkFDdkUsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsY0FBYyxFQUFFO29CQUNkLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7aUJBQ3JDO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxDQUFDLDBCQUEwQixHQUFHLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDO1NBQ3pFO1FBRUQsSUFBSSxLQUFLLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUNsQyxTQUFTLE9BQU8sQ0FBQyxDQUFZO2dCQUMzQixPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyQixDQUFDO1lBQ0QsSUFBSSxtQkFBbUIsR0FBRyxJQUFJLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLGFBQWEsRUFBRTtnQkFDaEYsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsY0FBYyxFQUFFO29CQUNkLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7aUJBQzNDO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxDQUFDLDZCQUE2QixHQUFHLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDO1NBQy9FO1FBR0QsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUMvQixTQUFTLE9BQU8sQ0FBQyxDQUFhO2dCQUM1QixPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyQixDQUFDO1lBQ0QsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLFVBQVUsRUFBRTtnQkFDdkUsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsY0FBYyxFQUFFO29CQUNkLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7aUJBQ3JDO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxDQUFDLDBCQUEwQixHQUFHLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDO1NBQ3pFO1FBRUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDcEMsSUFBSSxFQUFFLEVBQUU7WUFDUixjQUFjLEVBQUU7Z0JBQ2Qsd0JBQXdCLEVBQUUsY0FBYyxDQUFDLG9CQUFvQjtnQkFDN0QsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLDRCQUE0QjtnQkFDL0QsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLGdDQUFnQztnQkFDdkUsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLDBCQUEwQjtnQkFDM0QsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLDRCQUE0QjtnQkFDL0QsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLDBCQUEwQjthQUM1RCxDQUFDLCtCQUErQjtTQUNsQyxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDekIsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUE7UUFDbEQsSUFBSSxDQUFDLE9BQU8sU0FBRyxLQUFLLENBQUMsSUFBSSwwQ0FBRSxPQUFPLENBQUE7SUFDcEMsQ0FBQztJQUVELFVBQVUsQ0FBQyxFQUFVLEVBQUUsSUFBVTtRQUMvQixPQUFPLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDekIsY0FBYyxFQUFFO2dCQUNkLDRCQUE0QixFQUFFLElBQUksQ0FBQyw0QkFBNEI7Z0JBQy9ELGdDQUFnQyxFQUFFLElBQUksQ0FBQyxnQ0FBZ0M7Z0JBQ3ZFLDBCQUEwQixFQUFFLElBQUksQ0FBQywwQkFBMEI7Z0JBQzNELDRCQUE0QixFQUFFLElBQUksQ0FBQyw0QkFBNEI7YUFDaEU7WUFDRCxJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQW9CLEVBQUUsRUFBVSxFQUFFLElBQVUsRUFBRSxRQUF1QjtRQUN2RixPQUFPLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDMUIsSUFBSSxFQUFFLElBQUk7WUFDVixjQUFjLEVBQUU7Z0JBQ2QsNEJBQTRCLEVBQUUsUUFBUSxDQUFDLDRCQUE0QjtnQkFDbkUsZ0NBQWdDLEVBQUUsUUFBUSxDQUFDLGdDQUFnQztnQkFDM0UsMEJBQTBCLEVBQUUsUUFBUSxDQUFDLDBCQUEwQjtnQkFDL0QsNEJBQTRCLEVBQUUsUUFBUSxDQUFDLDRCQUE0QjthQUNwRTtZQUNELElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtTQUNwQixDQUFDLENBQUE7SUFDSixDQUFDO0NBVUY7QUExT0Qsc0JBME9DIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEZ1bmN0aW9uLCBGdW5jdGlvbnMgfSBmcm9tICcuL2Z1bmN0aW9ucyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25zIH0gZnJvbSAnLi9zdWJzY3JpcHRpb24nXG5pbXBvcnQgeyBMb2dnZXJCYXNlIH0gZnJvbSAnLi9sb2dnZXInXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2UnXG5pbXBvcnQgeyBDb3JlIH0gZnJvbSAnLi9jb3JlJztcbmltcG9ydCB7IERldmljZSB9IGZyb20gJy4vZGV2aWNlJztcbmltcG9ydCAqIGFzIGdnIGZyb20gJ0Bhd3MtY2RrL2F3cy1ncmVlbmdyYXNzJ1xuaW1wb3J0IHsgR3JvdXBUZW1wbGF0ZSB9IGZyb20gJy4vdGVtcGxhdGUnO1xuaW1wb3J0IHsgUm9sZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nXG5pbXBvcnQgeyBDZm5GdW5jdGlvbkRlZmluaXRpb24gfSBmcm9tICdAYXdzLWNkay9hd3MtZ3JlZW5ncmFzcyc7XG5pbXBvcnQgeyBDb25uZWN0b3IgfSBmcm9tICcuL2Nvbm5lY3Rvcic7XG5cblxuZXhwb3J0IGludGVyZmFjZSBTdHJlYW1NYW5hZ2VyUHJvcHMge1xuICByZWFkb25seSBlbmFibGVTdHJlYW1NYW5hZ2VyOiBib29sZWFuO1xuICByZWFkb25seSBhbGxvd0luc2VjdXJlQWNjZXNzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGVudW0gQ2xvdWRTcG9vbGVyU3RvcmFnZVR5cGUge1xuICBNRU1PUlkgPSAnTWVtb3J5JyxcbiAgRklMRV9TWVNURU0gPSAnRmlsZVN5c3RlbSdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbG91ZFNwb29sZXJTdG9yYWdlUHJvcHMge1xuICByZWFkb25seSB0eXBlOiBDbG91ZFNwb29sZXJTdG9yYWdlVHlwZTtcbiAgcmVhZG9ubHkgbWF4U2l6ZTogY2RrLlNpemU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvdWRTcG9vbGVyUHJvcHMge1xuICByZWFkb25seSBzdG9yYWdlPzogQ2xvdWRTcG9vbGVyU3RvcmFnZVByb3BzO1xuICByZWFkb25seSBlbmFibGVQZXJzaXN0ZW50U2Vzc2lvbnM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwUHJvcHMge1xuICByZWFkb25seSBjb3JlOiBDb3JlO1xuICByZWFkb25seSBkZWZhdWx0RnVuY3Rpb25FeGVjdXRpb24/OiBGdW5jdGlvbnMuRXhlY3V0aW9uXG4gIHJlYWRvbmx5IGZ1bmN0aW9ucz86IEZ1bmN0aW9uW107XG4gIHJlYWRvbmx5IHN1YnNjcmlwdGlvbnM/OiBTdWJzY3JpcHRpb25zO1xuICByZWFkb25seSBsb2dnZXJzPzogTG9nZ2VyQmFzZVtdO1xuICByZWFkb25seSByZXNvdXJjZXM/OiBSZXNvdXJjZVtdO1xuICByZWFkb25seSBkZXZpY2VzPzogRGV2aWNlW107XG4gIHJlYWRvbmx5IGNvbm5lY3RvcnM/OiBDb25uZWN0b3JbXTtcbiAgcmVhZG9ubHkgZGV2aWNlU3BlY2lmaWNTdWJzY3JpcHRpb25zPzogU3Vic2NyaXB0aW9ucztcbiAgcmVhZG9ubHkgc3RyZWFtTWFuYWdlcj86IFN0cmVhbU1hbmFnZXJQcm9wcyxcbiAgcmVhZG9ubHkgZW5hYmxlQXV0b21hdGljSXBEaXNjb3Zlcnk/OiBib29sZWFuO1xuICByZWFkb25seSByb2xlPzogUm9sZTtcbiAgcmVhZG9ubHkgaW5pdGlhbFZlcnNpb24/OiBnZy5DZm5Hcm91cC5Hcm91cFZlcnNpb25Qcm9wZXJ0eTtcbiAgcmVhZG9ubHkgY2xvdWRTcG9vbGVyPzogQ2xvdWRTcG9vbGVyUHJvcHM7XG59XG5cbmV4cG9ydCBjbGFzcyBHcm91cCBleHRlbmRzIGNkay5Db25zdHJ1Y3Qge1xuICByZWFkb25seSBpZDogc3RyaW5nO1xuICByZWFkb25seSBhcm46IHN0cmluZztcbiAgcmVhZG9ubHkgbGF0ZXN0VmVyc2lvbkFybjogc3RyaW5nO1xuICByZWFkb25seSByb2xlQXJuPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogR3JvdXBQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBjb3JlRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5Db3JlRGVmaW5pdGlvbih0aGlzLCBpZCArICdfY29yZScsIHtcbiAgICAgIG5hbWU6IGlkLFxuICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgY29yZXM6IFtwcm9wcy5jb3JlLnJlc29sdmUoKV1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHByb3BzLmluaXRpYWxWZXJzaW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxldCByb2xlQXJuID0gcHJvcHMucm9sZT8ucm9sZUFybiB8fCB0aGlzLnJvbGVBcm5cbiAgICAgIGxldCBncm91cCA9IG5ldyBnZy5DZm5Hcm91cCh0aGlzLCBpZCwge1xuICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICBjb3JlRGVmaW5pdGlvblZlcnNpb25Bcm46IGNvcmVEZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuLFxuICAgICAgICAgIC4uLnByb3BzLmluaXRpYWxWZXJzaW9uXG4gICAgICAgIH0sXG4gICAgICAgIHJvbGVBcm46IHJvbGVBcm5cbiAgICAgIH0pXG4gICAgICB0aGlzLmFybiA9IGdyb3VwLmF0dHJBcm47XG4gICAgICB0aGlzLmlkID0gZ3JvdXAuYXR0cklkO1xuICAgICAgdGhpcy5sYXRlc3RWZXJzaW9uQXJuID0gZ3JvdXAuYXR0ckxhdGVzdFZlcnNpb25Bcm5cbiAgICAgIHRoaXMucm9sZUFybiA9IHJvbGVBcm5cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxldCBzeXN0ZW1GdW5jdGlvbnM6IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbi5GdW5jdGlvblByb3BlcnR5W10gPSBbXTtcbiAgICBpZiAocHJvcHMuc3RyZWFtTWFuYWdlcj8uZW5hYmxlU3RyZWFtTWFuYWdlciB8fCBwcm9wcy5lbmFibGVBdXRvbWF0aWNJcERpc2NvdmVyeSB8fCBwcm9wcy5jbG91ZFNwb29sZXIpIHtcbiAgICAgIGlmIChwcm9wcy5zdHJlYW1NYW5hZ2VyPy5lbmFibGVTdHJlYW1NYW5hZ2VyKSB7XG4gICAgICAgIGlmIChwcm9wcy5zdHJlYW1NYW5hZ2VyIS5hbGxvd0luc2VjdXJlQWNjZXNzKSB7XG4gICAgICAgICAgdGhpcy5zdHJlYW1NYW5hZ2VyRW52aXJvbm1lbnQgPSB7XG4gICAgICAgICAgICB2YXJpYWJsZXM6IHtcbiAgICAgICAgICAgICAgXCJTVFJFQU1fTUFOQUdFUl9BVVRIRU5USUNBVEVfQ0xJRU5UXCI6IFwiZmFsc2VcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzeXN0ZW1GdW5jdGlvbnMucHVzaCh7XG4gICAgICAgICAgaWQ6ICdzdHJlYW1fbWFuYWdlcicsXG4gICAgICAgICAgZnVuY3Rpb25Bcm46IFwiYXJuOmF3czpsYW1iZGE6OjpmdW5jdGlvbjpHR1N0cmVhbU1hbmFnZXI6MVwiLFxuICAgICAgICAgIGZ1bmN0aW9uQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgZW5jb2RpbmdUeXBlOiAnYmluYXJ5JyxcbiAgICAgICAgICAgIHBpbm5lZDogdHJ1ZSxcbiAgICAgICAgICAgIHRpbWVvdXQ6IDMsXG4gICAgICAgICAgICBlbnZpcm9ubWVudDogdGhpcy5zdHJlYW1NYW5hZ2VyRW52aXJvbm1lbnRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBpZiAocHJvcHMuZW5hYmxlQXV0b21hdGljSXBEaXNjb3ZlcnkpIHtcbiAgICAgICAgc3lzdGVtRnVuY3Rpb25zLnB1c2goe1xuICAgICAgICAgIGlkOiAnYXV0b19pcCcsXG4gICAgICAgICAgZnVuY3Rpb25Bcm46IFwiYXJuOmF3czpsYW1iZGE6OjpmdW5jdGlvbjpHR0lQRGV0ZWN0b3I6MVwiLFxuICAgICAgICAgIGZ1bmN0aW9uQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgcGlubmVkOiB0cnVlLFxuICAgICAgICAgICAgbWVtb3J5U2l6ZTogMzI3NjgsXG4gICAgICAgICAgICB0aW1lb3V0OiAzXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaWYgKHByb3BzLmNsb3VkU3Bvb2xlcikge1xuICAgICAgICBzeXN0ZW1GdW5jdGlvbnMucHVzaCh7XG4gICAgICAgICAgaWQ6ICdzcG9vbGVyJyxcbiAgICAgICAgICBmdW5jdGlvbkFybjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHQ2xvdWRTcG9vbGVyOjFcIixcbiAgICAgICAgICBmdW5jdGlvbkNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIGV4ZWN1dGFibGU6IFwic3Bvb2xlclwiLFxuICAgICAgICAgICAgcGlubmVkOiB0cnVlLFxuICAgICAgICAgICAgbWVtb3J5U2l6ZTogMzI3NjgsXG4gICAgICAgICAgICB0aW1lb3V0OiAzLFxuICAgICAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICAgICAgdmFyaWFibGVzOiB7XG4gICAgICAgICAgICAgICAgXCJHR19DT05GSUdfU1RPUkFHRV9UWVBFXCI6IHByb3BzLmNsb3VkU3Bvb2xlci5zdG9yYWdlPy50eXBlLFxuICAgICAgICAgICAgICAgIFwiR0dfQ09ORklHX01BWF9TSVpFX0JZVEVTXCI6IHByb3BzLmNsb3VkU3Bvb2xlci5zdG9yYWdlPy5tYXhTaXplLnRvS2liaWJ5dGVzKCksXG4gICAgICAgICAgICAgICAgXCJHR19DT05GSUdfU1VCU0NSSVBUSU9OX1FVQUxJVFlcIjogcHJvcHMuY2xvdWRTcG9vbGVyLmVuYWJsZVBlcnNpc3RlbnRTZXNzaW9ucyA/ICdBdExlYXN0T25jZVBlcnNpc3RlbnQnOiAnQXRNb3N0T25jZScsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmZ1bmN0aW9ucyAhPT0gdW5kZWZpbmVkIHx8IHN5c3RlbUZ1bmN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBmdW5jdGlvbiBjb252ZXJ0KHg6IEZ1bmN0aW9uKTogZ2cuQ2ZuRnVuY3Rpb25EZWZpbml0aW9uLkZ1bmN0aW9uUHJvcGVydHkge1xuICAgICAgICByZXR1cm4geC5yZXNvbHZlKCk7XG4gICAgICB9XG4gICAgICB2YXIgZnVuY3Rpb25EZWZpbml0aW9uOiBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb247XG4gICAgICBpZiAocHJvcHMuZnVuY3Rpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChwcm9wcy5kZWZhdWx0RnVuY3Rpb25FeGVjdXRpb24pIHtcbiAgICAgICAgICB0aGlzLmRlZmF1bHRDb25maWcgPSB7XG4gICAgICAgICAgICBleGVjdXRpb246IHtcbiAgICAgICAgICAgICAgLi4ucHJvcHMuZGVmYXVsdEZ1bmN0aW9uRXhlY3V0aW9uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICBmdW5jdGlvbkRlZmluaXRpb24gPSBuZXcgZ2cuQ2ZuRnVuY3Rpb25EZWZpbml0aW9uKHRoaXMsIGlkICsgJ19mdW5jdGlvbnMnLCB7XG4gICAgICAgICAgbmFtZTogaWQsXG4gICAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICAgIGRlZmF1bHRDb25maWc6IHRoaXMuZGVmYXVsdENvbmZpZyxcbiAgICAgICAgICAgIGZ1bmN0aW9uczogWy4uLnByb3BzLmZ1bmN0aW9ucyEubWFwKGNvbnZlcnQpLCAuLi5zeXN0ZW1GdW5jdGlvbnNdXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnVuY3Rpb25EZWZpbml0aW9uID0gbmV3IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbih0aGlzLCBpZCArICdfZnVuY3Rpb25zJywge1xuICAgICAgICAgIG5hbWU6IGlkLFxuICAgICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgICBmdW5jdGlvbnM6IHN5c3RlbUZ1bmN0aW9uc1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybiA9IGZ1bmN0aW9uRGVmaW5pdGlvbi5hdHRyTGF0ZXN0VmVyc2lvbkFybjtcbiAgICB9XG5cblxuICAgIGlmIChwcm9wcy5zdWJzY3JpcHRpb25zICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgbGV0IHN1YnNjcmlwdGlvbkRlZmluaXRpb24gPSBuZXcgZ2cuQ2ZuU3Vic2NyaXB0aW9uRGVmaW5pdGlvbih0aGlzLCBpZCArICdfc3Vic2NyaXB0aW9ucycsIHtcbiAgICAgICAgbmFtZTogaWQsXG4gICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgc3Vic2NyaXB0aW9uczogcHJvcHMuc3Vic2NyaXB0aW9ucyEucmVzb2x2ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuID0gc3Vic2NyaXB0aW9uRGVmaW5pdGlvbi5hdHRyTGF0ZXN0VmVyc2lvbkFybjtcbiAgICB9XG5cblxuICAgIGlmIChwcm9wcy5yZXNvdXJjZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVuY3Rpb24gY29udmVydCh4OiBSZXNvdXJjZSk6IGdnLkNmblJlc291cmNlRGVmaW5pdGlvbi5SZXNvdXJjZUluc3RhbmNlUHJvcGVydHkge1xuICAgICAgICByZXR1cm4geC5yZXNvbHZlKCk7XG4gICAgICB9XG4gICAgICBsZXQgcmVzb3VyY2VEZWZpbml0aW9uID0gbmV3IGdnLkNmblJlc291cmNlRGVmaW5pdGlvbih0aGlzLCBpZCArICdfcmVzb3VyY2VzJywge1xuICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICByZXNvdXJjZXM6IHByb3BzLnJlc291cmNlcyEubWFwKGNvbnZlcnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLnJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm4gPSByZXNvdXJjZURlZmluaXRpb24uYXR0ckxhdGVzdFZlcnNpb25Bcm47XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmRldmljZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVuY3Rpb24gY29udmVydCh4OiBEZXZpY2UpOiBnZy5DZm5EZXZpY2VEZWZpbml0aW9uLkRldmljZVByb3BlcnR5IHtcbiAgICAgICAgcmV0dXJuIHgucmVzb2x2ZSgpO1xuICAgICAgfVxuICAgICAgbGV0IGRldmljZURlZmluaXRpb24gPSBuZXcgZ2cuQ2ZuRGV2aWNlRGVmaW5pdGlvbih0aGlzLCBpZCArICdfZGV2aWNlcycsIHtcbiAgICAgICAgbmFtZTogaWQsXG4gICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgZGV2aWNlczogcHJvcHMuZGV2aWNlcyEubWFwKGNvbnZlcnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLmRldmljZURlZmluaXRpb25WZXJzaW9uQXJuID0gZGV2aWNlRGVmaW5pdGlvbi5hdHRyTGF0ZXN0VmVyc2lvbkFybjtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuY29ubmVjdG9ycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmdW5jdGlvbiBjb252ZXJ0KHg6IENvbm5lY3Rvcik6IGdnLkNmbkNvbm5lY3RvckRlZmluaXRpb24uQ29ubmVjdG9yUHJvcGVydHkge1xuICAgICAgICByZXR1cm4geC5yZXNvbHZlKCk7XG4gICAgICB9XG4gICAgICBsZXQgY29ubmVjdG9yRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5Db25uZWN0b3JEZWZpbml0aW9uKHRoaXMsIGlkICsgJ19jb25uZWN0b3JzJywge1xuICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICBjb25uZWN0b3JzOiBwcm9wcy5jb25uZWN0b3JzIS5tYXAoY29udmVydClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuY29ubmVjdG9yRGVmaW5pdGlvblZlcnNpb25Bcm4gPSBjb25uZWN0b3JEZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuO1xuICAgIH1cblxuXG4gICAgaWYgKHByb3BzLmxvZ2dlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVuY3Rpb24gY29udmVydCh4OiBMb2dnZXJCYXNlKTogZ2cuQ2ZuTG9nZ2VyRGVmaW5pdGlvbi5Mb2dnZXJQcm9wZXJ0eSB7XG4gICAgICAgIHJldHVybiB4LnJlc29sdmUoKTtcbiAgICAgIH1cbiAgICAgIGxldCBsb2dnZXJEZWZpbml0aW9uID0gbmV3IGdnLkNmbkxvZ2dlckRlZmluaXRpb24odGhpcywgaWQgKyAnX2xvZ2dlcnMnLCB7XG4gICAgICAgIG5hbWU6IGlkLFxuICAgICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICAgIGxvZ2dlcnM6IHByb3BzLmxvZ2dlcnMhLm1hcChjb252ZXJ0KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdGhpcy5sb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybiA9IGxvZ2dlckRlZmluaXRpb24uYXR0ckxhdGVzdFZlcnNpb25Bcm47XG4gICAgfVxuXG4gICAgbGV0IGdyb3VwID0gbmV3IGdnLkNmbkdyb3VwKHRoaXMsIGlkLCB7XG4gICAgICBuYW1lOiBpZCxcbiAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgIGNvcmVEZWZpbml0aW9uVmVyc2lvbkFybjogY29yZURlZmluaXRpb24uYXR0ckxhdGVzdFZlcnNpb25Bcm4sXG4gICAgICAgIGZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMuZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgICAgc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMuc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICAgIGxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLmxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgICByZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLnJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICAgIGRldmljZURlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLmRldmljZURlZmluaXRpb25WZXJzaW9uQXJuXG4gICAgICB9IC8vIFRPRE86IERldmljZXMgYW5kIENvbm5lY3RvcnNcbiAgICB9KVxuICAgIHRoaXMuYXJuID0gZ3JvdXAuYXR0ckFybjtcbiAgICB0aGlzLmlkID0gZ3JvdXAuYXR0cklkO1xuICAgIHRoaXMubGF0ZXN0VmVyc2lvbkFybiA9IGdyb3VwLmF0dHJMYXRlc3RWZXJzaW9uQXJuXG4gICAgdGhpcy5yb2xlQXJuID0gcHJvcHMucm9sZT8ucm9sZUFyblxuICB9XG5cbiAgY2xvbmVUb05ldyhpZDogc3RyaW5nLCBjb3JlOiBDb3JlKTogR3JvdXAge1xuICAgIHJldHVybiBuZXcgR3JvdXAodGhpcywgaWQsIHtcbiAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgIGZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMuZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgICAgc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMuc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICAgIGxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLmxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgICByZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLnJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm5cbiAgICAgIH0sXG4gICAgICBjb3JlOiBjb3JlXG4gICAgfSlcbiAgfVxuXG4gIHN0YXRpYyBmcm9tVGVtcGxhdGUoc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGNvcmU6IENvcmUsIHRlbXBsYXRlOiBHcm91cFRlbXBsYXRlKTogR3JvdXAge1xuICAgIHJldHVybiBuZXcgR3JvdXAoc2NvcGUsIGlkLCB7XG4gICAgICBjb3JlOiBjb3JlLFxuICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybjogdGVtcGxhdGUuZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgICAgc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm46IHRlbXBsYXRlLnN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgICBsb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybjogdGVtcGxhdGUubG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICAgIHJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm46IHRlbXBsYXRlLnJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm5cbiAgICAgIH0sXG4gICAgICByb2xlOiB0ZW1wbGF0ZS5yb2xlXG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgZGVmYXVsdENvbmZpZz86IENmbkZ1bmN0aW9uRGVmaW5pdGlvbi5EZWZhdWx0Q29uZmlnUHJvcGVydHk7XG4gIHByaXZhdGUgc3RyZWFtTWFuYWdlckVudmlyb25tZW50PzogZ2cuQ2ZuRnVuY3Rpb25EZWZpbml0aW9uLkVudmlyb25tZW50UHJvcGVydHk7XG4gIHJlYWRvbmx5IGZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xuICByZWFkb25seSBsb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybj86IHN0cmluZztcbiAgcmVhZG9ubHkgcmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybj86IHN0cmluZztcbiAgcmVhZG9ubHkgZGV2aWNlRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IGNvbm5lY3RvckRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xufVxuXG4iXX0=