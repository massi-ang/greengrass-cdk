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
const template_1 = require("./template");
class Group extends cdk.Construct {
    constructor(scope, id, props) {
        var _a;
        super(scope, id);
        const coreDefinition = new gg.CfnCoreDefinition(this, id + '_core', {
            name: id,
            initialVersion: {
                cores: [props.core.resolve()]
            }
        });
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
        if (props.subscriptions !== undefined && props.subscriptions.subscriptionList.length > 0) {
            let subscriptionDefinition = new gg.CfnSubscriptionDefinition(this, id + '_subscriptions', {
                name: id,
                initialVersion: {
                    subscriptions: props.subscriptions.resolve()
                }
            });
            this.subscriptionDefinitionVersionArn = subscriptionDefinition.attrLatestVersionArn;
        }
        const template = new template_1.GroupTemplate(this, id + '_template', props);
        this.subscriptionDefinitionVersionArn = this.subscriptionDefinitionVersionArn;
        this.connectorDefinitionVersionArn = template.connectorDefinitionVersionArn;
        this.resourceDefinitionVersionArn = template.resourceDefinitionVersionArn;
        this.functionDefinitionVersionArn = template.functionDefinitionVersionArn;
        this.loggerDefinitionVersionArn = template.loggerDefinitionVersionArn;
        let roleArn = (_a = template.role) === null || _a === void 0 ? void 0 : _a.roleArn;
        let group = new gg.CfnGroup(this, id, {
            name: id,
            initialVersion: {
                coreDefinitionVersionArn: coreDefinition.attrLatestVersionArn,
                functionDefinitionVersionArn: this.functionDefinitionVersionArn,
                subscriptionDefinitionVersionArn: this.subscriptionDefinitionVersionArn,
                loggerDefinitionVersionArn: this.loggerDefinitionVersionArn,
                connectorDefinitionVersionArn: this.connectorDefinitionVersionArn,
                resourceDefinitionVersionArn: this.resourceDefinitionVersionArn,
                deviceDefinitionVersionArn: this.deviceDefinitionVersionArn
            },
            roleArn: roleArn
        });
        this.arn = group.attrArn;
        this.id = group.attrId;
        this.latestVersionArn = group.attrLatestVersionArn;
        this.roleArn = roleArn;
        return;
    }
    cloneToNew(id, core) {
        return new Group(this, id, {
            initialVersion: {
                functionDefinitionVersionArn: this.functionDefinitionVersionArn,
                subscriptionDefinitionVersionArn: this.subscriptionDefinitionVersionArn,
                loggerDefinitionVersionArn: this.loggerDefinitionVersionArn,
                resourceDefinitionVersionArn: this.resourceDefinitionVersionArn,
                connectorDefinitionVersionArn: this.subscriptionDefinitionVersionArn
            },
            core: core
        });
    }
}
exports.Group = Group;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7OztBQUVILHFDQUFxQztBQUlyQyw4Q0FBNkM7QUFDN0MseUNBQStEO0FBUy9ELE1BQWEsS0FBTSxTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBTXRDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBaUI7O1FBQzdELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxjQUFjLEdBQUcsSUFBSSxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxPQUFPLEVBQUU7WUFDbEUsSUFBSSxFQUFFLEVBQUU7WUFDUixjQUFjLEVBQUU7Z0JBQ2QsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUM5QjtTQUNGLENBQUMsQ0FBQTtRQUVGLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDL0IsU0FBUyxPQUFPLENBQUMsQ0FBUztnQkFDeEIsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckIsQ0FBQztZQUNELElBQUksZ0JBQWdCLEdBQUcsSUFBSSxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxVQUFVLEVBQUU7Z0JBQ3ZFLElBQUksRUFBRSxFQUFFO2dCQUNSLGNBQWMsRUFBRTtvQkFDZCxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO2lCQUNyQzthQUNGLENBQUMsQ0FBQTtZQUNGLElBQUksQ0FBQywwQkFBMEIsR0FBRyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQztTQUN6RTtRQUVELElBQUksS0FBSyxDQUFDLGFBQWEsS0FBSyxTQUFTLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3hGLElBQUksc0JBQXNCLEdBQUcsSUFBSSxFQUFFLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxnQkFBZ0IsRUFBRTtnQkFDekYsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsY0FBYyxFQUFFO29CQUNkLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYyxDQUFDLE9BQU8sRUFBRTtpQkFDOUM7YUFDRixDQUFDLENBQUE7WUFDRixJQUFJLENBQUMsZ0NBQWdDLEdBQUcsc0JBQXNCLENBQUMsb0JBQW9CLENBQUM7U0FDckY7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLHdCQUFhLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbEUsSUFBSSxDQUFDLGdDQUFnQyxHQUFHLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQztRQUU5RSxJQUFJLENBQUMsNkJBQTZCLEdBQUcsUUFBUSxDQUFDLDZCQUE2QixDQUFBO1FBQzNFLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxRQUFRLENBQUMsNEJBQTRCLENBQUE7UUFDekUsSUFBSSxDQUFDLDRCQUE0QixHQUFHLFFBQVEsQ0FBQyw0QkFBNEIsQ0FBQTtRQUN6RSxJQUFJLENBQUMsMEJBQTBCLEdBQUcsUUFBUSxDQUFDLDBCQUEwQixDQUFBO1FBRXJFLElBQUksT0FBTyxTQUFHLFFBQVEsQ0FBQyxJQUFJLDBDQUFFLE9BQU8sQ0FBQTtRQUNwQyxJQUFJLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUNwQyxJQUFJLEVBQUUsRUFBRTtZQUNSLGNBQWMsRUFBRTtnQkFDZCx3QkFBd0IsRUFBRSxjQUFjLENBQUMsb0JBQW9CO2dCQUM3RCw0QkFBNEIsRUFBRSxJQUFJLENBQUMsNEJBQTRCO2dCQUMvRCxnQ0FBZ0MsRUFBRSxJQUFJLENBQUMsZ0NBQWdDO2dCQUN2RSwwQkFBMEIsRUFBRSxJQUFJLENBQUMsMEJBQTBCO2dCQUMzRCw2QkFBNkIsRUFBRSxJQUFJLENBQUMsNkJBQTZCO2dCQUNqRSw0QkFBNEIsRUFBRSxJQUFJLENBQUMsNEJBQTRCO2dCQUMvRCwwQkFBMEIsRUFBRSxJQUFJLENBQUMsMEJBQTBCO2FBQzVEO1lBQ0QsT0FBTyxFQUFFLE9BQU87U0FDakIsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUN2QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixDQUFBO1FBQ2xELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1FBQ3RCLE9BQU07SUFDUixDQUFDO0lBRUQsVUFBVSxDQUFDLEVBQVUsRUFBRSxJQUFVO1FBQy9CLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUN6QixjQUFjLEVBQUU7Z0JBQ2QsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLDRCQUE0QjtnQkFDL0QsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLGdDQUFnQztnQkFDdkUsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLDBCQUEwQjtnQkFDM0QsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLDRCQUE0QjtnQkFDL0QsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLGdDQUFnQzthQUNyRTtZQUNELElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQXVCRjtBQXZHRCxzQkF1R0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG5pbXBvcnQgeyBDb3JlIH0gZnJvbSAnLi9jb3JlJztcbmltcG9ydCB7IERldmljZSB9IGZyb20gJy4vZGV2aWNlJztcbmltcG9ydCAqIGFzIGdnIGZyb20gJ0Bhd3MtY2RrL2F3cy1ncmVlbmdyYXNzJ1xuaW1wb3J0IHsgR3JvdXBUZW1wbGF0ZSwgR3JvdXBUZW1wbGF0ZVByb3BzIH0gZnJvbSAnLi90ZW1wbGF0ZSc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBHcm91cFByb3BzIGV4dGVuZHMgR3JvdXBUZW1wbGF0ZVByb3Bze1xuICByZWFkb25seSBjb3JlOiBDb3JlO1xuICByZWFkb25seSBkZXZpY2VzPzogRGV2aWNlW107XG4gIHJlYWRvbmx5IGluaXRpYWxWZXJzaW9uPzogZ2cuQ2ZuR3JvdXAuR3JvdXBWZXJzaW9uUHJvcGVydHk7XG59XG5cbmV4cG9ydCBjbGFzcyBHcm91cCBleHRlbmRzIGNkay5Db25zdHJ1Y3Qge1xuICByZWFkb25seSBpZDogc3RyaW5nO1xuICByZWFkb25seSBhcm46IHN0cmluZztcbiAgcmVhZG9ubHkgbGF0ZXN0VmVyc2lvbkFybjogc3RyaW5nO1xuICByZWFkb25seSByb2xlQXJuPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogR3JvdXBQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBjb3JlRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5Db3JlRGVmaW5pdGlvbih0aGlzLCBpZCArICdfY29yZScsIHtcbiAgICAgIG5hbWU6IGlkLFxuICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgY29yZXM6IFtwcm9wcy5jb3JlLnJlc29sdmUoKV1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHByb3BzLmRldmljZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVuY3Rpb24gY29udmVydCh4OiBEZXZpY2UpOiBnZy5DZm5EZXZpY2VEZWZpbml0aW9uLkRldmljZVByb3BlcnR5IHtcbiAgICAgICAgcmV0dXJuIHgucmVzb2x2ZSgpO1xuICAgICAgfVxuICAgICAgbGV0IGRldmljZURlZmluaXRpb24gPSBuZXcgZ2cuQ2ZuRGV2aWNlRGVmaW5pdGlvbih0aGlzLCBpZCArICdfZGV2aWNlcycsIHtcbiAgICAgICAgbmFtZTogaWQsXG4gICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgZGV2aWNlczogcHJvcHMuZGV2aWNlcyEubWFwKGNvbnZlcnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLmRldmljZURlZmluaXRpb25WZXJzaW9uQXJuID0gZGV2aWNlRGVmaW5pdGlvbi5hdHRyTGF0ZXN0VmVyc2lvbkFybjtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuc3Vic2NyaXB0aW9ucyAhPT0gdW5kZWZpbmVkICYmIHByb3BzLnN1YnNjcmlwdGlvbnMuc3Vic2NyaXB0aW9uTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgc3Vic2NyaXB0aW9uRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5TdWJzY3JpcHRpb25EZWZpbml0aW9uKHRoaXMsIGlkICsgJ19zdWJzY3JpcHRpb25zJywge1xuICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICBzdWJzY3JpcHRpb25zOiBwcm9wcy5zdWJzY3JpcHRpb25zIS5yZXNvbHZlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4gPSBzdWJzY3JpcHRpb25EZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRlbXBsYXRlID0gbmV3IEdyb3VwVGVtcGxhdGUodGhpcywgaWQgKyAnX3RlbXBsYXRlJywgcHJvcHMpO1xuICAgIFxuICAgIHRoaXMuc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4gPSB0aGlzLnN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuO1xuXG4gICAgdGhpcy5jb25uZWN0b3JEZWZpbml0aW9uVmVyc2lvbkFybiA9IHRlbXBsYXRlLmNvbm5lY3RvckRlZmluaXRpb25WZXJzaW9uQXJuXG4gICAgdGhpcy5yZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuID0gdGVtcGxhdGUucmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFyblxuICAgIHRoaXMuZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybiA9IHRlbXBsYXRlLmZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm5cbiAgICB0aGlzLmxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuID0gdGVtcGxhdGUubG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm5cblxuICAgIGxldCByb2xlQXJuID0gdGVtcGxhdGUucm9sZT8ucm9sZUFyblxuICAgIGxldCBncm91cCA9IG5ldyBnZy5DZm5Hcm91cCh0aGlzLCBpZCwge1xuICAgICAgbmFtZTogaWQsXG4gICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICBjb3JlRGVmaW5pdGlvblZlcnNpb25Bcm46IGNvcmVEZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuLFxuICAgICAgICBmdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLmZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICAgIHN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLnN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgICBsb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5sb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgICAgY29ubmVjdG9yRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMuY29ubmVjdG9yRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICAgIHJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMucmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgICAgZGV2aWNlRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMuZGV2aWNlRGVmaW5pdGlvblZlcnNpb25Bcm5cbiAgICAgIH0sXG4gICAgICByb2xlQXJuOiByb2xlQXJuXG4gICAgfSlcbiAgICB0aGlzLmFybiA9IGdyb3VwLmF0dHJBcm47XG4gICAgdGhpcy5pZCA9IGdyb3VwLmF0dHJJZDtcbiAgICB0aGlzLmxhdGVzdFZlcnNpb25Bcm4gPSBncm91cC5hdHRyTGF0ZXN0VmVyc2lvbkFyblxuICAgIHRoaXMucm9sZUFybiA9IHJvbGVBcm5cbiAgICByZXR1cm5cbiAgfVxuXG4gIGNsb25lVG9OZXcoaWQ6IHN0cmluZywgY29yZTogQ29yZSk6IEdyb3VwIHtcbiAgICByZXR1cm4gbmV3IEdyb3VwKHRoaXMsIGlkLCB7XG4gICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICBmdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLmZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICAgIHN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLnN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgICBsb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5sb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgICAgcmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5yZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgICBjb25uZWN0b3JEZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5zdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFyblxuICAgICAgfSxcbiAgICAgIGNvcmU6IGNvcmVcbiAgICB9KVxuICB9XG5cbiAgLy8gc3RhdGljIGZyb21UZW1wbGF0ZShzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgY29yZTogQ29yZSwgdGVtcGxhdGU6IEdyb3VwVGVtcGxhdGUpOiBHcm91cCB7XG4gIC8vICAgcmV0dXJuIG5ldyBHcm91cChzY29wZSwgaWQsIHtcbiAgLy8gICAgIGNvcmU6IGNvcmUsXG4gIC8vICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAvLyAgICAgICBmdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuOiB0ZW1wbGF0ZS5mdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAvLyAgICAgICBzdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFybjogdGVtcGxhdGUuc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gIC8vICAgICAgIGxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuOiB0ZW1wbGF0ZS5sb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybixcbiAgLy8gICAgICAgcmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybjogdGVtcGxhdGUucmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybixcbiAgLy8gICAgICAgY29ubmVjdG9yRGVmaW5pdGlvblZlcnNpb25Bcm46IHRlbXBsYXRlLmNvbm5lY3RvckRlZmluaXRpb25WZXJzaW9uQXJuXG4gIC8vICAgICB9LFxuICAvLyAgICAgcm9sZTogdGVtcGxhdGUucm9sZVxuICAvLyAgIH0pXG4gIC8vIH1cblxuXG4gIHJlYWRvbmx5IGZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xuICByZWFkb25seSBsb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybj86IHN0cmluZztcbiAgcmVhZG9ubHkgcmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybj86IHN0cmluZztcbiAgcmVhZG9ubHkgZGV2aWNlRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IGNvbm5lY3RvckRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xufVxuXG4iXX0=