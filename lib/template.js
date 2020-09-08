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
exports.GroupTemplate = void 0;
const cdk = require("@aws-cdk/core");
const gg = require("@aws-cdk/aws-greengrass");
class GroupTemplate extends cdk.Construct {
    constructor(scope, id, props) {
        var _a, _b;
        super(scope, id);
        let systemFunctions = [];
        if (((_a = props.streamManager) === null || _a === void 0 ? void 0 : _a.enableStreamManager) || props.enableAutomaticIpDiscovery) {
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
        }
        if (props.functions !== undefined || systemFunctions.length > 0) {
            function convert(x) {
                return x.resolve();
            }
            var functionDefinition;
            if (props.functions !== undefined) {
                functionDefinition = new gg.CfnFunctionDefinition(this, id + '_functions', {
                    name: id,
                    initialVersion: {
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
                name: id + '_s',
                initialVersion: {
                    subscriptions: props.subscriptions.resolve()
                }
            });
            this.subscriptionDefinitionVersionArn = subscriptionDefinition.attrLatestVersionArn;
        }
        if (props.subscriptions !== undefined) {
            console.log('Resources');
            function convert(x) {
                return x.resolve();
            }
            let resourceDefinition = new gg.CfnResourceDefinition(this, id + '_resources', {
                name: id + '_r',
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
                name: id + '_l',
                initialVersion: {
                    loggers: props.loggers.map(convert)
                }
            });
            this.loggerDefinitionVersionArn = loggerDefinition.attrLatestVersionArn;
        }
    }
}
exports.GroupTemplate = GroupTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7OztBQUVILHFDQUFxQztBQUtyQyw4Q0FBNkM7QUFjN0MsTUFBYSxhQUFjLFNBQVEsR0FBRyxDQUFDLFNBQVM7SUFDNUMsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUF5Qjs7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUNoQixJQUFJLGVBQWUsR0FBZ0QsRUFBRSxDQUFDO1FBQ3RFLElBQUksT0FBQSxLQUFLLENBQUMsYUFBYSwwQ0FBRSxtQkFBbUIsS0FBSSxLQUFLLENBQUMsMEJBQTBCLEVBQUU7WUFDOUUsVUFBSSxLQUFLLENBQUMsYUFBYSwwQ0FBRSxtQkFBbUIsRUFBRTtnQkFDMUMsSUFBSSxLQUFLLENBQUMsYUFBYyxDQUFDLG1CQUFtQixFQUFFO29CQUMxQyxJQUFJLENBQUMsd0JBQXdCLEdBQUc7d0JBQzVCLFNBQVMsRUFBRTs0QkFDUCxvQ0FBb0MsRUFBRSxPQUFPO3lCQUNoRDtxQkFDSixDQUFBO2lCQUNKO2dCQUNELGVBQWUsQ0FBQyxJQUFJLENBQUM7b0JBQ2pCLEVBQUUsRUFBRSxnQkFBZ0I7b0JBQ3BCLFdBQVcsRUFBRSw2Q0FBNkM7b0JBQzFELHFCQUFxQixFQUFFO3dCQUNuQixZQUFZLEVBQUUsUUFBUTt3QkFDdEIsTUFBTSxFQUFFLElBQUk7d0JBQ1osT0FBTyxFQUFFLENBQUM7d0JBQ1YsV0FBVyxFQUFFLElBQUksQ0FBQyx3QkFBd0I7cUJBQzdDO2lCQUNKLENBQUMsQ0FBQTthQUNMO1lBQ0QsSUFBSSxLQUFLLENBQUMsMEJBQTBCLEVBQUU7Z0JBQ2xDLGVBQWUsQ0FBQyxJQUFJLENBQUM7b0JBQ2pCLEVBQUUsRUFBRSxTQUFTO29CQUNiLFdBQVcsRUFBRSwwQ0FBMEM7b0JBQ3ZELHFCQUFxQixFQUFFO3dCQUNuQixN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QixHQUFHLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDO1NBQzNFO0lBQ0wsQ0FBQztDQVNKO0FBNUdELHNDQTRHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIFxuICogIENvcHlyaWdodCAyMDIwIEFtYXpvbi5jb20gb3IgaXRzIGFmZmlsaWF0ZXNcbiAqICBcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqICBcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqICBcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBGdW5jdGlvbiB9IGZyb20gJy4vZnVuY3Rpb25zJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbnMgfSBmcm9tICcuL3N1YnNjcmlwdGlvbidcbmltcG9ydCB7IExvZ2dlckJhc2UgfSBmcm9tICcuL2xvZ2dlcidcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZSdcbmltcG9ydCAqIGFzIGdnIGZyb20gJ0Bhd3MtY2RrL2F3cy1ncmVlbmdyYXNzJ1xuaW1wb3J0IHsgUm9sZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgU3RyZWFtTWFuYWdlclByb3BzIH0gZnJvbSAnLi9ncm91cCdcblxuZXhwb3J0IGludGVyZmFjZSBHcm91cFRlbXBsYXRlUHJvcHMge1xuICAgIHJlYWRvbmx5IGZ1bmN0aW9ucz86IEZ1bmN0aW9uW107XG4gICAgcmVhZG9ubHkgc3Vic2NyaXB0aW9ucz86IFN1YnNjcmlwdGlvbnM7XG4gICAgcmVhZG9ubHkgbG9nZ2Vycz86IExvZ2dlckJhc2VbXTtcbiAgICByZWFkb25seSByZXNvdXJjZXM/OiBSZXNvdXJjZVtdO1xuICAgIHJlYWRvbmx5IHJvbGU/OiBSb2xlLFxuICAgIHJlYWRvbmx5IHN0cmVhbU1hbmFnZXI/OiBTdHJlYW1NYW5hZ2VyUHJvcHMsXG4gICAgcmVhZG9ubHkgZW5hYmxlQXV0b21hdGljSXBEaXNjb3Zlcnk/OiBib29sZWFuXG59XG5cbmV4cG9ydCBjbGFzcyBHcm91cFRlbXBsYXRlIGV4dGVuZHMgY2RrLkNvbnN0cnVjdCB7XG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBHcm91cFRlbXBsYXRlUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKVxuICAgICAgICBsZXQgc3lzdGVtRnVuY3Rpb25zOiBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24uRnVuY3Rpb25Qcm9wZXJ0eVtdID0gW107XG4gICAgICAgIGlmIChwcm9wcy5zdHJlYW1NYW5hZ2VyPy5lbmFibGVTdHJlYW1NYW5hZ2VyIHx8IHByb3BzLmVuYWJsZUF1dG9tYXRpY0lwRGlzY292ZXJ5KSB7XG4gICAgICAgICAgICBpZiAocHJvcHMuc3RyZWFtTWFuYWdlcj8uZW5hYmxlU3RyZWFtTWFuYWdlcikge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wcy5zdHJlYW1NYW5hZ2VyIS5hbGxvd0luc2VjdXJlQWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtTWFuYWdlckVudmlyb25tZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJTVFJFQU1fTUFOQUdFUl9BVVRIRU5USUNBVEVfQ0xJRU5UXCI6IFwiZmFsc2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN5c3RlbUZ1bmN0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdzdHJlYW1fbWFuYWdlcicsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uQXJuOiBcImFybjphd3M6bGFtYmRhOjo6ZnVuY3Rpb246R0dTdHJlYW1NYW5hZ2VyOjFcIixcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25Db25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmNvZGluZ1R5cGU6ICdiaW5hcnknLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlubmVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50OiB0aGlzLnN0cmVhbU1hbmFnZXJFbnZpcm9ubWVudFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9wcy5lbmFibGVBdXRvbWF0aWNJcERpc2NvdmVyeSkge1xuICAgICAgICAgICAgICAgIHN5c3RlbUZ1bmN0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdhdXRvX2lwJyxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25Bcm46IFwiYXJuOmF3czpsYW1iZGE6OjpmdW5jdGlvbjpHR0lQRGV0ZWN0b3I6MVwiLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpbm5lZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeVNpemU6IDMyNzY4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDogM1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wcy5mdW5jdGlvbnMgIT09IHVuZGVmaW5lZCB8fCBzeXN0ZW1GdW5jdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY29udmVydCh4OiBGdW5jdGlvbik6IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbi5GdW5jdGlvblByb3BlcnR5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZnVuY3Rpb25EZWZpbml0aW9uOiBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb247XG4gICAgICAgICAgICBpZiAocHJvcHMuZnVuY3Rpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbkRlZmluaXRpb24gPSBuZXcgZ2cuQ2ZuRnVuY3Rpb25EZWZpbml0aW9uKHRoaXMsIGlkICsgJ19mdW5jdGlvbnMnLCB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGlkLFxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25zOiBbLi4ucHJvcHMuZnVuY3Rpb25zIS5tYXAoY29udmVydCksIC4uLnN5c3RlbUZ1bmN0aW9uc11cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24odGhpcywgaWQgKyAnX2Z1bmN0aW9ucycsIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogaWQsXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbnM6IHN5c3RlbUZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybiA9IGZ1bmN0aW9uRGVmaW5pdGlvbi5hdHRyTGF0ZXN0VmVyc2lvbkFybjtcbiAgICAgICAgfVxuICAgICAgIFxuXG4gICAgICAgIGlmIChwcm9wcy5zdWJzY3JpcHRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgc3Vic2NyaXB0aW9uRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5TdWJzY3JpcHRpb25EZWZpbml0aW9uKHRoaXMsIGlkICsgJ19zdWJzY3JpcHRpb25zJywge1xuICAgICAgICAgICAgICAgIG5hbWU6IGlkKydfcycsXG4gICAgICAgICAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uczogcHJvcHMuc3Vic2NyaXB0aW9ucyEucmVzb2x2ZSgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4gPSBzdWJzY3JpcHRpb25EZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuO1xuICAgICAgICB9XG5cblxuICAgICAgICBpZiAocHJvcHMuc3Vic2NyaXB0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVzb3VyY2VzJylcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbnZlcnQoeDogUmVzb3VyY2UpOiBnZy5DZm5SZXNvdXJjZURlZmluaXRpb24uUmVzb3VyY2VJbnN0YW5jZVByb3BlcnR5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcmVzb3VyY2VEZWZpbml0aW9uID0gbmV3IGdnLkNmblJlc291cmNlRGVmaW5pdGlvbih0aGlzLCBpZCArICdfcmVzb3VyY2VzJywge1xuICAgICAgICAgICAgICAgIG5hbWU6IGlkKydfcicsXG4gICAgICAgICAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VzOiBwcm9wcy5yZXNvdXJjZXMhLm1hcChjb252ZXJ0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm4gPSByZXNvdXJjZURlZmluaXRpb24uYXR0ckxhdGVzdFZlcnNpb25Bcm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcHMubG9nZ2VycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBjb252ZXJ0KHg6IExvZ2dlckJhc2UpOiBnZy5DZm5Mb2dnZXJEZWZpbml0aW9uLkxvZ2dlclByb3BlcnR5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbG9nZ2VyRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5Mb2dnZXJEZWZpbml0aW9uKHRoaXMsIGlkICsgJ19sb2dnZXJzJywge1xuICAgICAgICAgICAgICAgIG5hbWU6IGlkKydfbCcsXG4gICAgICAgICAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyczogcHJvcHMubG9nZ2VycyEubWFwKGNvbnZlcnQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm4gPSBsb2dnZXJEZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdHJlYW1NYW5hZ2VyRW52aXJvbm1lbnQ/OiBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24uRW52aXJvbm1lbnRQcm9wZXJ0eTtcblxuICAgIHJlYWRvbmx5IGZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgbG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgcmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybj86IHN0cmluZztcbiAgICByZWFkb25seSByb2xlPzogUm9sZTtcbn0iXX0=