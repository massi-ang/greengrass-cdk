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
        let groupVersion = new aws_greengrass_1.CfnGroupVersion(this, id + '_group_version', {
            groupId: group.attrId,
            coreDefinitionVersionArn: coreDefinition.attrLatestVersionArn,
            functionDefinitionVersionArn: this.functionDefinitionVersionArn,
            subscriptionDefinitionVersionArn: this.subscriptionDefinitionVersionArn,
            loggerDefinitionVersionArn: this.loggerDefinitionVersionArn,
            connectorDefinitionVersionArn: this.connectorDefinitionVersionArn,
            resourceDefinitionVersionArn: this.resourceDefinitionVersionArn,
            deviceDefinitionVersionArn: this.deviceDefinitionVersionArn
        });
        groupVersion.addDependsOn(group);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7OztBQUVILHFDQUFxQztBQUlyQyw4Q0FBNkM7QUFDN0MseUNBQStEO0FBQy9ELDREQUEwRDtBQVMxRCxNQUFhLEtBQU0sU0FBUSxHQUFHLENBQUMsU0FBUztJQU10QyxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQWlCOztRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sY0FBYyxHQUFHLElBQUksRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsT0FBTyxFQUFFO1lBQ2xFLElBQUksRUFBRSxFQUFFO1lBQ1IsY0FBYyxFQUFFO2dCQUNkLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDOUI7U0FDRixDQUFDLENBQUE7UUFFRixJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQy9CLFNBQVMsT0FBTyxDQUFDLENBQVM7Z0JBQ3hCLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JCLENBQUM7WUFDRCxJQUFJLGdCQUFnQixHQUFHLElBQUksRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsVUFBVSxFQUFFO2dCQUN2RSxJQUFJLEVBQUUsRUFBRTtnQkFDUixjQUFjLEVBQUU7b0JBQ2QsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztpQkFDckM7YUFDRixDQUFDLENBQUE7WUFDRixJQUFJLENBQUMsMEJBQTBCLEdBQUcsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUM7U0FDekU7UUFFRCxJQUFJLEtBQUssQ0FBQyxhQUFhLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxhQUFhLENB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YXpvbi5jb20gb3IgaXRzIGFmZmlsaWF0ZXNcbiAqICBcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqICBcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqICBcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5cbmltcG9ydCB7IENvcmUgfSBmcm9tICcuL2NvcmUnO1xuaW1wb3J0IHsgRGV2aWNlIH0gZnJvbSAnLi9kZXZpY2UnO1xuaW1wb3J0ICogYXMgZ2cgZnJvbSAnQGF3cy1jZGsvYXdzLWdyZWVuZ3Jhc3MnXG5pbXBvcnQgeyBHcm91cFRlbXBsYXRlLCBHcm91cFRlbXBsYXRlUHJvcHMgfSBmcm9tICcuL3RlbXBsYXRlJztcbmltcG9ydCB7IENmbkdyb3VwVmVyc2lvbiB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1ncmVlbmdyYXNzJztcblxuXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwUHJvcHMgZXh0ZW5kcyBHcm91cFRlbXBsYXRlUHJvcHN7XG4gIHJlYWRvbmx5IGNvcmU6IENvcmU7XG4gIHJlYWRvbmx5IGRldmljZXM/OiBEZXZpY2VbXTtcbiAgcmVhZG9ubHkgaW5pdGlhbFZlcnNpb24/OiBnZy5DZm5Hcm91cC5Hcm91cFZlcnNpb25Qcm9wZXJ0eTtcbn1cblxuZXhwb3J0IGNsYXNzIEdyb3VwIGV4dGVuZHMgY2RrLkNvbnN0cnVjdCB7XG4gIHJlYWRvbmx5IGlkOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGFybjogc3RyaW5nO1xuICByZWFkb25seSBsYXRlc3RWZXJzaW9uQXJuOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHJvbGVBcm4/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBHcm91cFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGNvcmVEZWZpbml0aW9uID0gbmV3IGdnLkNmbkNvcmVEZWZpbml0aW9uKHRoaXMsIGlkICsgJ19jb3JlJywge1xuICAgICAgbmFtZTogaWQsXG4gICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICBjb3JlczogW3Byb3BzLmNvcmUucmVzb2x2ZSgpXVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAocHJvcHMuZGV2aWNlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmdW5jdGlvbiBjb252ZXJ0KHg6IERldmljZSk6IGdnLkNmbkRldmljZURlZmluaXRpb24uRGV2aWNlUHJvcGVydHkge1xuICAgICAgICByZXR1cm4geC5yZXNvbHZlKCk7XG4gICAgICB9XG4gICAgICBsZXQgZGV2aWNlRGVmaW5pdGlvbiA9IG5ldyBnZy5DZm5EZXZpY2VEZWZpbml0aW9uKHRoaXMsIGlkICsgJ19kZXZpY2VzJywge1xuICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgaW5pdGlhbFZlcnNpb246IHtcbiAgICAgICAgICBkZXZpY2VzOiBwcm9wcy5kZXZpY2VzIS5tYXAoY29udmVydClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuZGV2aWNlRGVmaW5pdGlvblZlcnNpb25Bcm4gPSBkZXZpY2VEZWZpbml0aW9uLmF0dHJMYXRlc3RWZXJzaW9uQXJuO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5zdWJzY3JpcHRpb25zICE9PSB1bmRlZmluZWQgJiYgcHJvcHMuc3Vic2NyaXB0aW9ucy5zdWJzY3JpcHRpb25MaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBzdWJzY3JpcHRpb25EZWZpbml0aW9uID0gbmV3IGdnLkNmblN1YnNjcmlwdGlvbkRlZmluaXRpb24odGhpcywgaWQgKyAnX3N1YnNjcmlwdGlvbnMnLCB7XG4gICAgICAgIG5hbWU6IGlkLFxuICAgICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICAgIHN1YnNjcmlwdGlvbnM6IHByb3BzLnN1YnNjcmlwdGlvbnMhLnJlc29sdmUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFybiA9IHN1YnNjcmlwdGlvbkRlZmluaXRpb24uYXR0ckxhdGVzdFZlcnNpb25Bcm47XG4gICAgfVxuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBuZXcgR3JvdXBUZW1wbGF0ZSh0aGlzLCBpZCArICdfdGVtcGxhdGUnLCBwcm9wcyk7XG4gICAgXG4gICAgdGhpcy5zdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFybiA9IHRoaXMuc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm47XG5cbiAgICB0aGlzLmNvbm5lY3RvckRlZmluaXRpb25WZXJzaW9uQXJuID0gdGVtcGxhdGUuY29ubmVjdG9yRGVmaW5pdGlvblZlcnNpb25Bcm5cbiAgICB0aGlzLnJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm4gPSB0ZW1wbGF0ZS5yZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuXG4gICAgdGhpcy5mdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuID0gdGVtcGxhdGUuZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFyblxuICAgIHRoaXMubG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm4gPSB0ZW1wbGF0ZS5sb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFyblxuXG4gICAgbGV0IHJvbGVBcm4gPSB0ZW1wbGF0ZS5yb2xlPy5yb2xlQXJuXG4gICAgbGV0IGdyb3VwID0gbmV3IGdnLkNmbkdyb3VwKHRoaXMsIGlkLCB7XG4gICAgICBuYW1lOiBpZCxcbiAgICAgIHJvbGVBcm46IHJvbGVBcm5cbiAgICB9KVxuXG4gICAgbGV0IGdyb3VwVmVyc2lvbiA9IG5ldyBDZm5Hcm91cFZlcnNpb24odGhpcywgaWQrJ19ncm91cF92ZXJzaW9uJywge1xuICAgICAgZ3JvdXBJZDogZ3JvdXAuYXR0cklkLFxuICAgICAgY29yZURlZmluaXRpb25WZXJzaW9uQXJuOiBjb3JlRGVmaW5pdGlvbi5hdHRyTGF0ZXN0VmVyc2lvbkFybixcbiAgICAgIGZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMuZnVuY3Rpb25EZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgIHN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLnN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgbG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMubG9nZ2VyRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICBjb25uZWN0b3JEZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5jb25uZWN0b3JEZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgIHJlc291cmNlRGVmaW5pdGlvblZlcnNpb25Bcm46IHRoaXMucmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgIGRldmljZURlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLmRldmljZURlZmluaXRpb25WZXJzaW9uQXJuXG4gIFxuICAgIH0pXG4gICAgZ3JvdXBWZXJzaW9uLmFkZERlcGVuZHNPbihncm91cCk7XG4gICAgdGhpcy5hcm4gPSBncm91cC5hdHRyQXJuO1xuICAgIHRoaXMuaWQgPSBncm91cC5hdHRySWQ7XG4gICAgdGhpcy5sYXRlc3RWZXJzaW9uQXJuID0gZ3JvdXBWZXJzaW9uLmdldEF0dCgnYXJuJykudG9TdHJpbmcoKVxuICAgIHRoaXMucm9sZUFybiA9IHJvbGVBcm5cbiAgICByZXR1cm5cbiAgfVxuXG4gIGNsb25lVG9OZXcoaWQ6IHN0cmluZywgY29yZTogQ29yZSk6IEdyb3VwIHtcbiAgICByZXR1cm4gbmV3IEdyb3VwKHRoaXMsIGlkLCB7XG4gICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAgICAgICBmdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLmZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gICAgICAgIHN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuOiB0aGlzLnN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgICBsb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5sb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybixcbiAgICAgICAgcmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5yZXNvdXJjZURlZmluaXRpb25WZXJzaW9uQXJuLFxuICAgICAgICBjb25uZWN0b3JEZWZpbml0aW9uVmVyc2lvbkFybjogdGhpcy5zdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFyblxuICAgICAgfSxcbiAgICAgIGNvcmU6IGNvcmVcbiAgICB9KVxuICB9XG5cbiAgLy8gc3RhdGljIGZyb21UZW1wbGF0ZShzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgY29yZTogQ29yZSwgdGVtcGxhdGU6IEdyb3VwVGVtcGxhdGUpOiBHcm91cCB7XG4gIC8vICAgcmV0dXJuIG5ldyBHcm91cChzY29wZSwgaWQsIHtcbiAgLy8gICAgIGNvcmU6IGNvcmUsXG4gIC8vICAgICBpbml0aWFsVmVyc2lvbjoge1xuICAvLyAgICAgICBmdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuOiB0ZW1wbGF0ZS5mdW5jdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuLFxuICAvLyAgICAgICBzdWJzY3JpcHRpb25EZWZpbml0aW9uVmVyc2lvbkFybjogdGVtcGxhdGUuc3Vic2NyaXB0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4sXG4gIC8vICAgICAgIGxvZ2dlckRlZmluaXRpb25WZXJzaW9uQXJuOiB0ZW1wbGF0ZS5sb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybixcbiAgLy8gICAgICAgcmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybjogdGVtcGxhdGUucmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybixcbiAgLy8gICAgICAgY29ubmVjdG9yRGVmaW5pdGlvblZlcnNpb25Bcm46IHRlbXBsYXRlLmNvbm5lY3RvckRlZmluaXRpb25WZXJzaW9uQXJuXG4gIC8vICAgICB9LFxuICAvLyAgICAgcm9sZTogdGVtcGxhdGUucm9sZVxuICAvLyAgIH0pXG4gIC8vIH1cblxuXG4gIHJlYWRvbmx5IGZ1bmN0aW9uRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHN1YnNjcmlwdGlvbkRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xuICByZWFkb25seSBsb2dnZXJEZWZpbml0aW9uVmVyc2lvbkFybj86IHN0cmluZztcbiAgcmVhZG9ubHkgcmVzb3VyY2VEZWZpbml0aW9uVmVyc2lvbkFybj86IHN0cmluZztcbiAgcmVhZG9ubHkgZGV2aWNlRGVmaW5pdGlvblZlcnNpb25Bcm4/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IGNvbm5lY3RvckRlZmluaXRpb25WZXJzaW9uQXJuPzogc3RyaW5nO1xufVxuXG4iXX0=