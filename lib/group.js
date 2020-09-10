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
const aws_greengrass_1 = require("@aws-cdk/aws-greengrass");
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
            roleArn: roleArn
        });
        let groupVersion = new aws_greengrass_1.CfnGroupVersion(this, id, {
            groupId: group.attrId,
            coreDefinitionVersionArn: coreDefinition.attrLatestVersionArn,
            functionDefinitionVersionArn: this.functionDefinitionVersionArn,
            subscriptionDefinitionVersionArn: this.subscriptionDefinitionVersionArn,
            loggerDefinitionVersionArn: this.loggerDefinitionVersionArn,
            connectorDefinitionVersionArn: this.connectorDefinitionVersionArn,
            resourceDefinitionVersionArn: this.resourceDefinitionVersionArn,
            deviceDefinitionVersionArn: this.deviceDefinitionVersionArn
        });
        this.arn = group.attrArn;
        this.id = group.attrId;
        this.latestVersionArn = groupVersion.getAtt('arn').toString();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7OztBQUVILHFDQUFxQztBQUlyQyw4Q0FBNkM7QUFDN0MseUNBQStEO0FBQy9ELDREQUEwRDtBQVMxRCxNQUFhLEtBQU0sU0FBUSxHQUFHLENBQUMsU0FBUztJQU10QyxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQWlCOztRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sY0FBYyxHQUFHLElBQUksRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsT0FBTyxFQUFFO1lBQ2xFLElBQUksRUFBRSxFQUFFO1lBQ1IsY0FBYyxFQUFFO2dCQUNkLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDOUI7U0FDRixDQUFDLENBQUE7UUFFRixJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQy9CLFNBQVMsT0FBTyxDQUFDLENBQVM7Z0JBQ3hCLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JCLENBQUM7WUFDRCxJQUFJLGdCQUFnQixHQUFHLElBQUksRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsVUFBVSxFQUFFO2dCQUN2RSxJQUFJLEVBQUUsRUFBRTtnQkFDUixjQUFjLEVBQUU7b0JBQ2QsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztpQkFDckM7YUFDRixDQUFDLENBQUE7WUFDRixJQUFJLENBQUMsMEJBQTBCLEdBQUcsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUM7U0FDekU7UUFFRCxJQUFJLEtBQUssQ0FBQyxhQUFhLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN4RixJQUFJLHNCQUFzQixHQUFHLElBQUksRUFBRSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsZ0JBQWdCLEVBQUU7Z0JBQ3pGLElBQUksRUFBRSxFQUFFO2dCQUNSLGNBQWMsRUFBRTtvQkFDZCxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWMsQ0FBQyxPQUFPLEVBQUU7aUJBQzlDO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxDQUFDLGdDQUFnQyxHQUFHLHNCQUFzQixDQUFDLG9CQUFvQixDQUFDO1NBQ3JGO1FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSx3QkFBYSxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWxFLElBQUksQ0FBQyxnQ0FBZ0MsR0FBRyxJQUFJLENBQUMsZ0NBQWdDLENBQUM7UUFFOUUsSUFBSSxDQUFDLDZCQUE2QixHQUFHLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQTtRQUMzRSxJQUFJLENBQUMsNEJBQTRCLEdBQUcsUUFBUSxDQUFDLDRCQUE0QixDQUFBO1FBQ3pFLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxRQUFRLENBQUMsNEJBQTRCLENBQUE7UUFDekUsSUFBSSxDQUFDLDBCQUEwQixHQUFHLFFBQVEsQ0FBQywwQkFBMEIsQ0FBQTtRQUVyRSxJQUFJLE9BQU8sU0FBRyxRQUFRLENBQUMsSUFBSSwwQ0FBRSxPQUFPLENBQUE7UUFDcEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDcEMsSUFBSSxFQUFFLEVBQUU7WUFFUixPQUFPLEVBQUUsT0FBTztTQUNqQixDQUFDLENBQUE7UUFFRixJQUFJLFlBQVksR0FBRyxJQUFJLGdDQUFlLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUMvQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDckIsd0JBQXdCLEVBQUUsY0FBYyxDQUFDLG9CQUFvQjtZQUM3RCw0QkFBNEIsRUFBRSxJQUFJLENBQUMsNEJBQTRCO1lBQy9ELGdDQUFnQyxFQUFFLElBQUksQ0FBQyxnQ0FBZ0M7WUFDdkUsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLDBCQUEwQjtZQUMzRCw2QkFBNkIsRUFBRSxJQUFJLENBQUMsNkJBQTZCO1lBQ2pFLDRCQUE0QixFQUFFLElBQUksQ0FBQyw0QkFBNEI7WUFDL0QsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLDBCQUEwQjtTQUU1RCxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDekIsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQzdELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1FBQ3RCLE9BQU07SUFDUixDQUFDO0lBRUQsVUFBVSxDQUFDLEVBQVUsRUFBRSxJQUFVO1FBQy9CLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUN6QixjQUFjLEVBQUU7Z0JBQ2QsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLDRCQUE0QjtnQkFDL0QsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLGdDQUFnQztnQkFDdkUsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLDBCQUEwQjtnQkFDM0QsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLDRCQUE0QjtnQkFDL0QsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLGdDQUFnQzthQUNyRTtZQUNELElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQXVCRjtBQTNHRCxzQkEyR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG5pbXBvcnQgeyBDb3JlIH0gZnJvbSAnLi9jb3JlJztcbmltcG9ydCB7IERldmljZSB9IGZyb20gJy4vZGV2aWNlJztcbmltcG9ydCAqIGFzIGdnIGZyb20gJ0Bhd3MtY2RrL2F3cy1ncmVlbmdyYXNzJ1xuaW1wb3J0IHsgR3JvdXBUZW1wbGF0ZSwgR3JvdXBUZW1wbGF0ZVByb3BzIH0gZnJvbSAnLi90ZW1wbGF0ZSc7XG5pbXBvcnQgeyBDZm5Hcm91cFZlcnNpb24gfSBmcm9tICdAYXdzLWNkay9hd3MtZ3JlZW5ncmFzcyc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBHcm91cFByb3BzIGV4dGVuZHMgR3JvdXBUZW1wbGF0ZVByb3Bze1xuICByZWFkb25seSBjb3JlOiBDb3JlO1xuICByZWFkb25seSBkZXZpY2VzPzogRGV2aWNlW107XG4gIHJlYWRvbmx5IGluaXRpYWxWZXJzaW9uPzogZ2cuQ2ZuR3JvdXAuR3JvdXBWZXJzaW9uUHJvcGVydHk7XG59XG5cbmV4cG9ydCBjbGFzcyBHcm91cCBleHRlbmRzIGNkay5Db25zdHJ1Y3Qge1xuICByZWFkb25seSBpZDogc3RyaW5nO1xuICByZWFkb25seSBhcm46IHN0cmluZztcbiAgcmVhZG9ubHkgbGF0ZXN0VmVyc2lvbkFybjogc3RyaW5nO1xuICByZWFkb25seSByb2xlQXJuPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogR3JvdXBQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBjb3JlRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5Db3JlRGVmaW5pdGlvbih0aGlzLCBpZCArICdfY29yZScsIHtcbiAgICAgIG5hbWU6IGlkLFxuICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgY29yZXM6IFtwcm9wcy5jb3JlLnJlc29sdmUoKV1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHByb3BzLmRldmljZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVuY3Rpb24gY29udmVydCh4OiBEZXZpY2UpOiBnZy5DZm5EZXZpY2VEZWZpbml0aW9uLkRldmljZVByb3BlcnR5IHtcbiAgICAgICAgcmV0dXJuIHgucmVzb2x2ZSgpO1xuICAgICAgfVxuICAgICAgbGV0IGRldmljZURlZmluaXRpb24gPSBuZXcgZ2cuQ2ZuRGV2aWNlRGVmaW5pdGlvbih0aGlzLCBpZCArICdfZGV2aWNlcycsIHtcbiAgICAgICAgbmFtZTogaWQsXG4gICAgICAgIGluaXRpYWxWZXJzaW9uOiB7XG4gICAgICAgICAgZGV2aWNlczogcHJvcHMuZGV2aWNlcyEubWFwKGNvbnZlcnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLmRldmljZURlZmluaXRpb25WZXJzaW9uQXJuID0gZGV2aWNlRGVmaW5pdGlvbi5hdHRyTGF0ZXN0VmVyc2lvbkFybjtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuc3Vic2NyaXB0aW9ucyAhPT0gdW5kZWZpbmVkICYmIHByb3BzLnN1YnNjcmlwdGlvbnMuc3Vic2NyaXB0aW9uTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgc3Vic2NyaXB0aW9uRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5TdWJzY3JpcHRpb25EZWZpbml0aW9uKHRoaXMsIGlkICsgJ19zdWJzY3JpcHRpb25zJywge1xuICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICBzdWJzY3JpcHRpb25zOiBwcm9wcy5zdWJzY3JpcHRpb25zIS5yZXNvbHZlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4gPSBzdWJzY3JpcHRpb25EZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRlbXBsYXRlID0gbmV3IEdyb3VwVGVtcGxhdGUodGhpcywgaWQgKyAnX3RlbXBsYXRlJywgcHJvcHMpO1xuICAgIFxuICAgIHRoaXMuc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4gPSB0aGlzLnN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuO1xuXG4gICAgdGhpcy5jb25uZWN0b3JEZWZpbml0aW9uVmVyc2lvbkFybiA9IHRlbXBsYXRlLmNvbm5lY3RvckRlZmluaXRpb25WZXJzaW9uQXJuXG4gICAgdGhpcy5yZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuID0gdGVtcGxhdGUucmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFyblxuICAgIHRoaXMuZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybiA9IHRlbXBsYXRlLmZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm5cbiAgICB0aGlzLmxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuID0gdGVtcGxhdGUubG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm5cblxuICAgIGxldCByb2xlQXJuID0gdGVtcGxhdGUucm9sZT8ucm9sZUFyblxuICAgIGxldCBncm91cCA9IG5ldyBnZy5DZm5Hcm91cCh0aGlzLCBpZCwge1xuICAgICAgbmFtZTogaWQsXG4gICAgICBcbiAgICAgIHJvbGVBcm46IHJvbGVBcm5cbiAgICB9KVxuXG4gICAgbGV0IGdyb3VwVmVyc2lvbiA9IG5ldyBDZm5Hcm91cFZlcnNpb24odGhpcywgaWQsIHtcbiAgICAgIGdyb3VwSWQ6IGdyb3VwLmF0dHJJZCxcbiAgICAgIGNvcmVEZWZpbml0aW9uVmVyc2lvbkFybjogY29yZURlZmluaXRpb24uYXR0ckxhdGVzdFZlcnNpb25Bcm4sXG4gICAgICBmdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLmZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICBzdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5zdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgIGxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLmxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgY29ubmVjdG9yRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMuY29ubmVjdG9yRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICByZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLnJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICBkZXZpY2VEZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5kZXZpY2VEZWZpbml0aW9uVmVyc2lvbkFyblxuICBcbiAgICB9KVxuICAgIHRoaXMuYXJuID0gZ3JvdXAuYXR0ckFybjtcbiAgICB0aGlzLmlkID0gZ3JvdXAuYXR0cklkO1xuICAgIHRoaXMubGF0ZXN0VmVyc2lvbkFybiA9IGdyb3VwVmVyc2lvbi5nZXRBdHQoJ2FybicpLnRvU3RyaW5nKClcbiAgICB0aGlzLnJvbGVBcm4gPSByb2xlQXJuXG4gICAgcmV0dXJuXG4gIH1cblxuICBjbG9uZVRvTmV3KGlkOiBzdHJpbmcsIGNvcmU6IENvcmUpOiBHcm91cCB7XG4gICAgcmV0dXJuIG5ldyBHcm91cCh0aGlzLCBpZCwge1xuICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5mdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgICBzdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5zdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgICAgbG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMubG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICAgIHJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMucmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgICAgY29ubmVjdG9yRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMuc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm5cbiAgICAgIH0sXG4gICAgICBjb3JlOiBjb3JlXG4gICAgfSlcbiAgfVxuXG4gIC8vIHN0YXRpYyBmcm9tVGVtcGxhdGUoc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGNvcmU6IENvcmUsIHRlbXBsYXRlOiBHcm91cFRlbXBsYXRlKTogR3JvdXAge1xuICAvLyAgIHJldHVybiBuZXcgR3JvdXAoc2NvcGUsIGlkLCB7XG4gIC8vICAgICBjb3JlOiBjb3JlLFxuICAvLyAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgLy8gICAgICAgZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybjogdGVtcGxhdGUuZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybixcbiAgLy8gICAgICAgc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm46IHRlbXBsYXRlLnN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAvLyAgICAgICBsb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybjogdGVtcGxhdGUubG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gIC8vICAgICAgIHJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm46IHRlbXBsYXRlLnJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gIC8vICAgICAgIGNvbm5lY3RvckRlZmluaXRpb25WZXJzaW9uQXJuOiB0ZW1wbGF0ZS5jb25uZWN0b3JEZWZpbml0aW9uVmVyc2lvbkFyblxuICAvLyAgICAgfSxcbiAgLy8gICAgIHJvbGU6IHRlbXBsYXRlLnJvbGVcbiAgLy8gICB9KVxuICAvLyB9XG5cblxuICByZWFkb25seSBmdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xuICByZWFkb25seSBzdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFybj86IHN0cmluZztcbiAgcmVhZG9ubHkgbG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IGRldmljZURlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xuICByZWFkb25seSBjb25uZWN0b3JEZWZpbml0aW9uVmVyc2lvbkFybj86IHN0cmluZztcbn1cblxuIl19