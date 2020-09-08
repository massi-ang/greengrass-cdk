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
exports.Group = void 0;
const cdk = require("@aws-cdk/core");
const gg = require("@aws-cdk/aws-greengrass");
class Group extends cdk.Construct {
    constructor(scope, id, props) {
        var _a, _b, _c, _d;
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
        if (((_b = props.streamManager) === null || _b === void 0 ? void 0 : _b.enableStreamManager) || props.enableAutomaticIpDiscovery) {
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
        }
        if (props.functions !== undefined || systemFunctions.length > 0) {
            function convert(x) {
                return x.resolve();
            }
            var functionDefinition;
            if (props.functions !== undefined) {
                if (props.functionExecution) {
                    this.defaultConfig = {
                        execution: {
                            ...props.functionExecution
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
                resourceDefinitionVersionArn: this.resourceDefinitionVersionArn
            } // TODO: Devices and Connectors
        });
        this.arn = group.attrArn;
        this.id = group.attrId;
        this.latestVersionArn = group.attrLatestVersionArn;
        this.roleArn = (_d = props.role) === null || _d === void 0 ? void 0 : _d.roleArn;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7OztBQUVILHFDQUFxQztBQU9yQyw4Q0FBNkM7QUEyQjdDLE1BQWEsS0FBTSxTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBTXRDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBaUI7O1FBQzdELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxjQUFjLEdBQUcsSUFBSSxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxPQUFPLEVBQUU7WUFDbEUsSUFBSSxFQUFFLEVBQUU7WUFDUixjQUFjLEVBQUU7Z0JBQ2QsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUM5QjtTQUNGLENBQUMsQ0FBQTtRQUVGLElBQUksS0FBSyxDQUFDLGNBQWMsS0FBSyxTQUFTLEVBQUU7WUFDdEMsSUFBSSxPQUFPLEdBQUcsT0FBQSxLQUFLLENBQUMsSUFBSSwwQ0FBRSxPQUFPLEtBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQTtZQUNqRCxJQUFJLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtnQkFDcEMsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsY0FBYyxFQUFFO29CQUNkLHdCQUF3QixFQUFFLGNBQWMsQ0FBQyxvQkFBb0I7b0JBQzdELEdBQUcsS0FBSyxDQUFDLGNBQWM7aUJBQ3hCO2dCQUNELE9BQU8sRUFBRSxPQUFPO2FBQ2pCLENBQUMsQ0FBQTtZQUNGLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUN6QixJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDdkIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtB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QUUsUUFBUSxDQUFDLDRCQUE0QjtnQkFDbkUsZ0NBQWdDLEVBQUUsUUFBUSxDQUFDLGdDQUFnQztnQkFDM0UsMEJBQTBCLEVBQUUsUUFBUSxDQUFDLDBCQUEwQjtnQkFDL0QsNEJBQTRCLEVBQUUsUUFBUSxDQUFDLDRCQUE0QjthQUNwRTtZQUNELElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtTQUNwQixDQUFDLENBQUE7SUFDSixDQUFDO0NBUUY7QUExTEQsc0JBMExDIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEZ1bmN0aW9uLCBGdW5jdGlvbnMgfSBmcm9tICcuL2Z1bmN0aW9ucyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25zIH0gZnJvbSAnLi9zdWJzY3JpcHRpb24nXG5pbXBvcnQgeyBMb2dnZXJCYXNlIH0gZnJvbSAnLi9sb2dnZXInXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2UnXG5pbXBvcnQgeyBDb3JlIH0gZnJvbSAnLi9jb3JlJztcbmltcG9ydCB7IERldmljZSB9IGZyb20gJy4vZGV2aWNlJztcbmltcG9ydCAqIGFzIGdnIGZyb20gJ0Bhd3MtY2RrL2F3cy1ncmVlbmdyYXNzJ1xuaW1wb3J0IHsgR3JvdXBUZW1wbGF0ZSB9IGZyb20gJy4vdGVtcGxhdGUnO1xuaW1wb3J0IHsgUm9sZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nXG5pbXBvcnQgeyBDZm5GdW5jdGlvbkRlZmluaXRpb24gfSBmcm9tICdAYXdzLWNkay9hd3MtZ3JlZW5ncmFzcyc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBTdHJlYW1NYW5hZ2VyUHJvcHMge1xuICByZWFkb25seSBlbmFibGVTdHJlYW1NYW5hZ2VyOiBib29sZWFuO1xuICByZWFkb25seSBhbGxvd0luc2VjdXJlQWNjZXNzPzogYm9vbGVhbjtcbn1cblxuXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwUHJvcHMge1xuICByZWFkb25seSBjb3JlOiBDb3JlO1xuICByZWFkb25seSBmdW5jdGlvbkV4ZWN1dGlvbj86IEZ1bmN0aW9ucy5FeGVjdXRpb25cbiAgcmVhZG9ubHkgZnVuY3Rpb25zPzogRnVuY3Rpb25bXTtcbiAgcmVhZG9ubHkgc3Vic2NyaXB0aW9ucz86IFN1YnNjcmlwdGlvbnM7XG4gIHJlYWRvbmx5IGxvZ2dlcnM/OiBMb2dnZXJCYXNlW107XG4gIHJlYWRvbmx5IHJlc291cmNlcz86IFJlc291cmNlW107XG4gIHJlYWRvbmx5IGRldmljZXM/OiBEZXZpY2VbXTtcbiAgcmVhZG9ubHkgZGV2aWNlU3BlY2lmaWNTdWJzY3JpcHRpb25zPzogU3Vic2NyaXB0aW9ucztcbiAgcmVhZG9ubHkgc3RyZWFtTWFuYWdlcj86IFN0cmVhbU1hbmFnZXJQcm9wcyxcbiAgcmVhZG9ubHkgZW5hYmxlQXV0b21hdGljSXBEaXNjb3Zlcnk/OiBib29sZWFuO1xuICByZWFkb25seSByb2xlPzogUm9sZVxuICByZWFkb25seSBpbml0aWFsVmVyc2lvbj86IGdnLkNmbkdyb3VwLkdyb3VwVmVyc2lvblByb3BlcnR5XG59XG5cbmV4cG9ydCBjbGFzcyBHcm91cCBleHRlbmRzIGNkay5Db25zdHJ1Y3Qge1xuICByZWFkb25seSBpZDogc3RyaW5nO1xuICByZWFkb25seSBhcm46IHN0cmluZztcbiAgcmVhZG9ubHkgbGF0ZXN0VmVyc2lvbkFybjogc3RyaW5nO1xuICByZWFkb25seSByb2xlQXJuPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogR3JvdXBQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBjb3JlRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5Db3JlRGVmaW5pdGlvbih0aGlzLCBpZCArICdfY29yZScsIHtcbiAgICAgIG5hbWU6IGlkLFxuICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgY29yZXM6IFtwcm9wcy5jb3JlLnJlc29sdmUoKV1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHByb3BzLmluaXRpYWxWZXJzaW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxldCByb2xlQXJuID0gcHJvcHMucm9sZT8ucm9sZUFybiB8fCB0aGlzLnJvbGVBcm5cbiAgICAgIGxldCBncm91cCA9IG5ldyBnZy5DZm5Hcm91cCh0aGlzLCBpZCwge1xuICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICBjb3JlRGVmaW5pdGlvblZlcnNpb25Bcm46IGNvcmVEZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuLFxuICAgICAgICAgIC4uLnByb3BzLmluaXRpYWxWZXJzaW9uXG4gICAgICAgIH0sXG4gICAgICAgIHJvbGVBcm46IHJvbGVBcm5cbiAgICAgIH0pXG4gICAgICB0aGlzLmFybiA9IGdyb3VwLmF0dHJBcm47XG4gICAgICB0aGlzLmlkID0gZ3JvdXAuYXR0cklkO1xuICAgICAgdGhpcy5sYXRlc3RWZXJzaW9uQXJuID0gZ3JvdXAuYXR0ckxhdGVzdFZlcnNpb25Bcm5cbiAgICAgIHRoaXMucm9sZUFybiA9IHJvbGVBcm5cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxldCBzeXN0ZW1GdW5jdGlvbnM6IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbi5GdW5jdGlvblByb3BlcnR5W10gPSBbXTtcbiAgICBpZiAocHJvcHMuc3RyZWFtTWFuYWdlcj8uZW5hYmxlU3RyZWFtTWFuYWdlciB8fCBwcm9wcy5lbmFibGVBdXRvbWF0aWNJcERpc2NvdmVyeSkge1xuICAgICAgaWYgKHByb3BzLnN0cmVhbU1hbmFnZXI/LmVuYWJsZVN0cmVhbU1hbmFnZXIpIHtcbiAgICAgICAgaWYgKHByb3BzLnN0cmVhbU1hbmFnZXIhLmFsbG93SW5zZWN1cmVBY2Nlc3MpIHtcbiAgICAgICAgICB0aGlzLnN0cmVhbU1hbmFnZXJFbnZpcm9ubWVudCA9IHtcbiAgICAgICAgICAgIHZhcmlhYmxlczoge1xuICAgICAgICAgICAgICBcIlNUUkVBTV9NQU5BR0VSX0FVVEhFTlRJQ0FURV9DTElFTlRcIjogXCJmYWxzZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN5c3RlbUZ1bmN0aW9ucy5wdXNoKHtcbiAgICAgICAgICBpZDogJ3N0cmVhbV9tYW5hZ2VyJyxcbiAgICAgICAgICBmdW5jdGlvbkFybjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHU3RyZWFtTWFuYWdlcjoxXCIsXG4gICAgICAgICAgZnVuY3Rpb25Db25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBlbmNvZGluZ1R5cGU6ICdiaW5hcnknLFxuICAgICAgICAgICAgcGlubmVkOiB0cnVlLFxuICAgICAgICAgICAgdGltZW91dDogMyxcbiAgICAgICAgICAgIGVudmlyb25tZW50OiB0aGlzLnN0cmVhbU1hbmFnZXJFbnZpcm9ubWVudFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGlmIChwcm9wcy5lbmFibGVBdXRvbWF0aWNJcERpc2NvdmVyeSkge1xuICAgICAgICBzeXN0ZW1GdW5jdGlvbnMucHVzaCh7XG4gICAgICAgICAgaWQ6ICdhdXRvX2lwJyxcbiAgICAgICAgICBmdW5jdGlvbkFybjogXCJhcm46YXdzOmxhbWJkYTo6OmZ1bmN0aW9uOkdHSVBEZXRlY3RvcjoxXCIsXG4gICAgICAgICAgZnVuY3Rpb25Db25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBwaW5uZWQ6IHRydWUsXG4gICAgICAgICAgICBtZW1vcnlTaXplOiAzMjc2OCxcbiAgICAgICAgICAgIHRpbWVvdXQ6IDNcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmZ1bmN0aW9ucyAhPT0gdW5kZWZpbmVkIHx8IHN5c3RlbUZ1bmN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBmdW5jdGlvbiBjb252ZXJ0KHg6IEZ1bmN0aW9uKTogZ2cuQ2ZuRnVuY3Rpb25EZWZpbml0aW9uLkZ1bmN0aW9uUHJvcGVydHkge1xuICAgICAgICByZXR1cm4geC5yZXNvbHZlKCk7XG4gICAgICB9XG4gICAgICB2YXIgZnVuY3Rpb25EZWZpbml0aW9uOiBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb247XG4gICAgICBpZiAocHJvcHMuZnVuY3Rpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChwcm9wcy5mdW5jdGlvbkV4ZWN1dGlvbikge1xuICAgICAgICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgICAgICAgIGV4ZWN1dGlvbjoge1xuICAgICAgICAgICAgICAuLi5wcm9wcy5mdW5jdGlvbkV4ZWN1dGlvblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgZnVuY3Rpb25EZWZpbml0aW9uID0gbmV3IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbih0aGlzLCBpZCArICdfZnVuY3Rpb25zJywge1xuICAgICAgICAgIG5hbWU6IGlkLFxuICAgICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0Q29uZmlnOiB0aGlzLmRlZmF1bHRDb25maWcsXG4gICAgICAgICAgICBmdW5jdGlvbnM6IFsuLi5wcm9wcy5mdW5jdGlvbnMhLm1hcChjb252ZXJ0KSwgLi4uc3lzdGVtRnVuY3Rpb25zXVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bmN0aW9uRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24odGhpcywgaWQgKyAnX2Z1bmN0aW9ucycsIHtcbiAgICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICAgICAgZnVuY3Rpb25zOiBzeXN0ZW1GdW5jdGlvbnNcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICB0aGlzLmZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4gPSBmdW5jdGlvbkRlZmluaXRpb24uYXR0ckxhdGVzdFZlcnNpb25Bcm47XG4gICAgfVxuXG5cbiAgICBpZiAocHJvcHMuc3Vic2NyaXB0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIGxldCBzdWJzY3JpcHRpb25EZWZpbml0aW9uID0gbmV3IGdnLkNmblN1YnNjcmlwdGlvbkRlZmluaXRpb24odGhpcywgaWQgKyAnX3N1YnNjcmlwdGlvbnMnLCB7XG4gICAgICAgIG5hbWU6IGlkLFxuICAgICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICAgIHN1YnNjcmlwdGlvbnM6IHByb3BzLnN1YnNjcmlwdGlvbnMhLnJlc29sdmUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFybiA9IHN1YnNjcmlwdGlvbkRlZmluaXRpb24uYXR0ckxhdGVzdFZlcnNpb25Bcm47XG4gICAgfVxuXG5cbiAgICBpZiAocHJvcHMucmVzb3VyY2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZ1bmN0aW9uIGNvbnZlcnQoeDogUmVzb3VyY2UpOiBnZy5DZm5SZXNvdXJjZURlZmluaXRpb24uUmVzb3VyY2VJbnN0YW5jZVByb3BlcnR5IHtcbiAgICAgICAgcmV0dXJuIHgucmVzb2x2ZSgpO1xuICAgICAgfVxuICAgICAgbGV0IHJlc291cmNlRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5SZXNvdXJjZURlZmluaXRpb24odGhpcywgaWQgKyAnX3Jlc291cmNlcycsIHtcbiAgICAgICAgbmFtZTogaWQsXG4gICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgcmVzb3VyY2VzOiBwcm9wcy5yZXNvdXJjZXMhLm1hcChjb252ZXJ0KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdGhpcy5yZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuID0gcmVzb3VyY2VEZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuO1xuICAgIH1cblxuXG4gICAgaWYgKHByb3BzLmxvZ2dlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVuY3Rpb24gY29udmVydCh4OiBMb2dnZXJCYXNlKTogZ2cuQ2ZuTG9nZ2VyRGVmaW5pdGlvbi5Mb2dnZXJQcm9wZXJ0eSB7XG4gICAgICAgIHJldHVybiB4LnJlc29sdmUoKTtcbiAgICAgIH1cbiAgICAgIGxldCBsb2dnZXJEZWZpbml0aW9uID0gbmV3IGdnLkNmbkxvZ2dlckRlZmluaXRpb24odGhpcywgaWQgKyAnX2xvZ2dlcnMnLCB7XG4gICAgICAgIG5hbWU6IGlkLFxuICAgICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICAgIGxvZ2dlcnM6IHByb3BzLmxvZ2dlcnMhLm1hcChjb252ZXJ0KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdGhpcy5sb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybiA9IGxvZ2dlckRlZmluaXRpb24uYXR0ckxhdGVzdFZlcnNpb25Bcm47XG4gICAgfVxuXG4gICAgbGV0IGdyb3VwID0gbmV3IGdnLkNmbkdyb3VwKHRoaXMsIGlkLCB7XG4gICAgICBuYW1lOiBpZCxcbiAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgIGNvcmVEZWZpbml0aW9uVmVyc2lvbkFybjogY29yZURlZmluaXRpb24uYXR0ckxhdGVzdFZlcnNpb25Bcm4sXG4gICAgICAgIGZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMuZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgICAgc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMuc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICAgIGxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLmxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgICByZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLnJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm5cbiAgICAgIH0gLy8gVE9ETzogRGV2aWNlcyBhbmQgQ29ubmVjdG9yc1xuICAgIH0pXG4gICAgdGhpcy5hcm4gPSBncm91cC5hdHRyQXJuO1xuICAgIHRoaXMuaWQgPSBncm91cC5hdHRySWQ7XG4gICAgdGhpcy5sYXRlc3RWZXJzaW9uQXJuID0gZ3JvdXAuYXR0ckxhdGVzdFZlcnNpb25Bcm5cbiAgICB0aGlzLnJvbGVBcm4gPSBwcm9wcy5yb2xlPy5yb2xlQXJuXG4gIH1cblxuICBjbG9uZVRvTmV3KGlkOiBzdHJpbmcsIGNvcmU6IENvcmUpOiBHcm91cCB7XG4gICAgcmV0dXJuIG5ldyBHcm91cCh0aGlzLCBpZCwge1xuICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5mdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgICBzdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5zdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgICAgbG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMubG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICAgIHJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMucmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFyblxuICAgICAgfSxcbiAgICAgIGNvcmU6IGNvcmVcbiAgICB9KVxuICB9XG5cbiAgc3RhdGljIGZyb21UZW1wbGF0ZShzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgY29yZTogQ29yZSwgdGVtcGxhdGU6IEdyb3VwVGVtcGxhdGUpOiBHcm91cCB7XG4gICAgcmV0dXJuIG5ldyBHcm91cChzY29wZSwgaWQsIHtcbiAgICAgIGNvcmU6IGNvcmUsXG4gICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICBmdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuOiB0ZW1wbGF0ZS5mdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgICBzdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFybjogdGVtcGxhdGUuc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICAgIGxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuOiB0ZW1wbGF0ZS5sb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgICAgcmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybjogdGVtcGxhdGUucmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFyblxuICAgICAgfSxcbiAgICAgIHJvbGU6IHRlbXBsYXRlLnJvbGVcbiAgICB9KVxuICB9XG5cbiAgcHJpdmF0ZSBkZWZhdWx0Q29uZmlnPzogQ2ZuRnVuY3Rpb25EZWZpbml0aW9uLkRlZmF1bHRDb25maWdQcm9wZXJ0eTtcbiAgcHJpdmF0ZSBzdHJlYW1NYW5hZ2VyRW52aXJvbm1lbnQ/OiBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24uRW52aXJvbm1lbnRQcm9wZXJ0eTtcbiAgcmVhZG9ubHkgZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybj86IHN0cmluZztcbiAgcmVhZG9ubHkgc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IGxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xuICByZWFkb25seSByZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xufVxuXG4iXX0=