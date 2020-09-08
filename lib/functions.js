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
exports.Function = exports.Functions = void 0;
const cdk = require("@aws-cdk/core");
var Functions;
(function (Functions) {
    let IsolationMode;
    (function (IsolationMode) {
        IsolationMode["CONTAINER_MODE"] = "GreengrassContainer";
        IsolationMode["NO_CONTAINER_MODE"] = "NoContainer";
    })(IsolationMode = Functions.IsolationMode || (Functions.IsolationMode = {}));
    let ResourceAccessPermission;
    (function (ResourceAccessPermission) {
        ResourceAccessPermission["READ_ONLY"] = "ro";
        ResourceAccessPermission["READ_WRITE"] = "rw";
    })(ResourceAccessPermission = Functions.ResourceAccessPermission || (Functions.ResourceAccessPermission = {}));
    let EncodingType;
    (function (EncodingType) {
        EncodingType["JSON"] = "json";
        EncodingType["BINARY"] = "binary";
    })(EncodingType = Functions.EncodingType || (Functions.EncodingType = {}));
})(Functions = exports.Functions || (exports.Functions = {}));
class Function extends cdk.Resource {
    //readonly creationStack: string[];
    constructor(scope, id, props) {
        super(scope, id);
        // if (!(props.function.runtime === lambda.Runtime.PYTHON_3_7 ||
        //     props.function.runtime === lambda.Runtime.JAVA_8 ||
        //     props.function.runtime === lambda.Runtime.NODEJS_8_10)) {
        //     throw new Error(`Invalid Lambda runtime: ${props.function.runtime}. Greengrass functions only support ${lambda.Runtime.PYTHON_3_7}, ${lambda.Runtime.JAVA_8}, and ${lambda.Runtime.NODEJS_8_10}`)
        // }
        this.name = id;
        this.lambdaFunction = props.function;
        this.alias = props.alias;
        this.pinned = props.pinned;
        this.memorySize = props.memorySize;
        this.timeout = props.timeout;
        this.executable = props.executable;
        this.execArgs = props.execArgs;
        this.encodingType = props.encodingType;
        this.isolationMode = props.isolationMode;
        this.runAs = props.runAs;
        this.resourceAccessPolicies = props.resourceAccessPolicies;
        this.variables = props.variables;
        this.accessSysFs = props.accessSysFs;
    }
    addResource(resource, permission) {
        var _a;
        if (this.resourceAccessPolicies == undefined) {
            this.resourceAccessPolicies = [];
        }
        (_a = this.resourceAccessPolicies) === null || _a === void 0 ? void 0 : _a.push({
            permission: permission,
            resource: resource
        });
        return this;
    }
    resolve() {
        var _a;
        return {
            functionArn: this.lambdaFunction.functionArn + ':' + this.alias.aliasName,
            functionConfiguration: {
                environment: {
                    accessSysfs: this.accessSysFs,
                    execution: {
                        isolationMode: this.isolationMode,
                        runAs: this.runAs
                    },
                    resourceAccessPolicies: (_a = this.resourceAccessPolicies) === null || _a === void 0 ? void 0 : _a.map(convertResouceAccessPolicies),
                    variables: this.variables
                },
                encodingType: this.encodingType,
                execArgs: this.execArgs,
                executable: this.executable,
                memorySize: this.memorySize.toKibibytes(),
                timeout: this.timeout.toSeconds(),
                pinned: this.pinned
            },
            id: this.name
        };
    }
}
exports.Function = Function;
function convertResouceAccessPolicies(rap) {
    return {
        resourceId: rap.resource.id,
        permission: rap.permission
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7O0FBRUgscUNBQXFDO0FBTXJDLElBQWlCLFNBQVMsQ0E4QnpCO0FBOUJELFdBQWlCLFNBQVM7SUFNdEIsSUFBWSxhQUdYO0lBSEQsV0FBWSxhQUFhO1FBQ3JCLHVEQUFzQyxDQUFBO1FBQ3RDLGtEQUFpQyxDQUFBO0lBQ3JDLENBQUMsRUFIVyxhQUFhLEdBQWIsdUJBQWEsS0FBYix1QkFBYSxRQUd4QjtJQUVELElBQVksd0JBR1g7SUFIRCxXQUFZLHdCQUF3QjtRQUNoQyw0Q0FBZ0IsQ0FBQTtRQUNoQiw2Q0FBaUIsQ0FBQTtJQUNyQixDQUFDLEVBSFcsd0JBQXdCLEdBQXhCLGtDQUF3QixLQUF4QixrQ0FBd0IsUUFHbkM7SUFZRCxJQUFZLFlBR1g7SUFIRCxXQUFZLFlBQVk7UUFDcEIsNkJBQWEsQ0FBQTtRQUNiLGlDQUFpQixDQUFBO0lBQ3JCLENBQUMsRUFIVyxZQUFZLEdBQVosc0JBQVksS0FBWixzQkFBWSxRQUd2QjtBQUNMLENBQUMsRUE5QmdCLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBOEJ6QjtBQWtCRCxNQUFhLFFBQVMsU0FBUSxHQUFHLENBQUMsUUFBUTtJQUN0QyxtQ0FBbUM7SUFDbkMsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFvQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLGdFQUFnRTtRQUNoRSwwREFBMEQ7UUFDMUQsZ0VBQWdFO1FBQ2hFLHdNQUF3TTtRQUN4TSxJQUFJO1FBQ0osSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDckMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztRQUN6QyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQztRQUMzRCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxXQUFXLENBQUMsUUFBa0IsRUFBRSxVQUE4Qzs7UUFDMUUsSUFBSSxJQUFJLENBQUMsc0JBQXNCLElBQUksU0FBUyxFQUFFO1lBQzFDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUE7U0FDbkM7UUFDRCxNQUFBLElBQUksQ0FBQyxzQkFBc0IsMENBQUUsSUFBSSxDQUFDO1lBQzlCLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLFFBQVEsRUFBRSxRQUFRO1NBQ3JCLEVBQUM7UUFDRixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsT0FBTzs7UUFDSCxPQUFPO1lBQ0gsV0FBVyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVM7WUFDekUscUJBQXFCLEVBQUU7Z0JBQ25CLFdBQVcsRUFBRTtvQkFDVCxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7b0JBQzdCLFNBQVMsRUFBRTt3QkFDUCxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7d0JBQ2pDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztxQkFDcEI7b0JBQ0Qsc0JBQXNCLFFBQUUsSUFBSSxDQUFDLHNCQUFzQiwwQ0FBRSxHQUFHLENBQUMsNEJBQTRCLENBQUM7b0JBQ3RGLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztpQkFDNUI7Z0JBQ0QsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUMvQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3ZCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDM0IsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFO2dCQUN6QyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7Z0JBQ2pDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTthQUN0QjtZQUNELEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSTtTQUVoQixDQUFBO0lBQ0wsQ0FBQztDQWdCSjtBQTVFRCw0QkE0RUM7QUFFRCxTQUFTLDRCQUE0QixDQUFDLEdBQW1DO0lBQ3JFLE9BQU87UUFDSCxVQUFVLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQzNCLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVTtLQUM3QixDQUFBO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIFxuICogIENvcHlyaWdodCAyMDIwIEFtYXpvbi5jb20gb3IgaXRzIGFmZmlsaWF0ZXNcbiAqICBcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqICBcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqICBcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJUmVzb2x2YWJsZSwgRHVyYXRpb24sIFNpemUgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSdcbmltcG9ydCAqIGFzIGdnIGZyb20gJ0Bhd3MtY2RrL2F3cy1ncmVlbmdyYXNzJ1xuXG5leHBvcnQgbmFtZXNwYWNlIEZ1bmN0aW9ucyB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBSdW5BcyB7XG4gICAgICAgIHJlYWRvbmx5IHVpZDogbnVtYmVyLFxuICAgICAgICByZWFkb25seSBnaWQ6IG51bWJlclxuICAgIH1cblxuICAgIGV4cG9ydCBlbnVtIElzb2xhdGlvbk1vZGUge1xuICAgICAgICBDT05UQUlORVJfTU9ERSA9ICdHcmVlbmdyYXNzQ29udGFpbmVyJyxcbiAgICAgICAgTk9fQ09OVEFJTkVSX01PREUgPSAnTm9Db250YWluZXInXG4gICAgfVxuXG4gICAgZXhwb3J0IGVudW0gUmVzb3VyY2VBY2Nlc3NQZXJtaXNzaW9uIHtcbiAgICAgICAgUkVBRF9PTkxZID0gJ3JvJyxcbiAgICAgICAgUkVBRF9XUklURSA9ICdydydcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEV4ZWN1dGlvbiB7XG4gICAgICAgIHJlYWRvbmx5IGlzb2xhdGlvbk1vZGU6IElzb2xhdGlvbk1vZGUsXG4gICAgICAgIHJlYWRvbmx5IHJ1bkFzOiBSdW5Bc1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVzb3VyY2VBY2Nlc3NQb2xpY3kge1xuICAgICAgICByZWFkb25seSByZXNvdXJjZTogUmVzb3VyY2UsXG4gICAgICAgIHJlYWRvbmx5IHBlcm1pc3Npb246IFJlc291cmNlQWNjZXNzUGVybWlzc2lvbixcbiAgICB9XG5cbiAgICBleHBvcnQgZW51bSBFbmNvZGluZ1R5cGUge1xuICAgICAgICBKU09OID0gJ2pzb24nLFxuICAgICAgICBCSU5BUlkgPSAnYmluYXJ5J1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBGdW5jdGlvblByb3BzIHtcbiAgICByZWFkb25seSBmdW5jdGlvbjogbGFtYmRhLkZ1bmN0aW9uLFxuICAgIHJlYWRvbmx5IGFsaWFzOiBsYW1iZGEuQWxpYXMsXG4gICAgcmVhZG9ubHkgcGlubmVkOiBib29sZWFuIHwgSVJlc29sdmFibGUsXG4gICAgcmVhZG9ubHkgbWVtb3J5U2l6ZTogU2l6ZSxcbiAgICByZWFkb25seSB0aW1lb3V0OiBEdXJhdGlvbixcbiAgICByZWFkb25seSBleGVjdXRhYmxlPzogc3RyaW5nLFxuICAgIHJlYWRvbmx5IGV4ZWNBcmdzPzogc3RyaW5nLFxuICAgIHJlYWRvbmx5IGVuY29kaW5nVHlwZT86IEZ1bmN0aW9ucy5FbmNvZGluZ1R5cGUsXG4gICAgcmVhZG9ubHkgaXNvbGF0aW9uTW9kZT86IEZ1bmN0aW9ucy5Jc29sYXRpb25Nb2RlLFxuICAgIHJlYWRvbmx5IHJ1bkFzPzogRnVuY3Rpb25zLlJ1bkFzLFxuICAgIHJlYWRvbmx5IHJlc291cmNlQWNjZXNzUG9saWNpZXM/OiBGdW5jdGlvbnMuUmVzb3VyY2VBY2Nlc3NQb2xpY3lbXSxcbiAgICByZWFkb25seSB2YXJpYWJsZXM/OiBhbnksXG4gICAgcmVhZG9ubHkgYWNjZXNzU3lzRnM/OiBib29sZWFuIHwgSVJlc29sdmFibGVcbn1cblxuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uIGV4dGVuZHMgY2RrLlJlc291cmNlIHtcbiAgICAvL3JlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdO1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRnVuY3Rpb25Qcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIC8vIGlmICghKHByb3BzLmZ1bmN0aW9uLnJ1bnRpbWUgPT09IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzcgfHxcbiAgICAgICAgLy8gICAgIHByb3BzLmZ1bmN0aW9uLnJ1bnRpbWUgPT09IGxhbWJkYS5SdW50aW1lLkpBVkFfOCB8fFxuICAgICAgICAvLyAgICAgcHJvcHMuZnVuY3Rpb24ucnVudGltZSA9PT0gbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzhfMTApKSB7XG4gICAgICAgIC8vICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgTGFtYmRhIHJ1bnRpbWU6ICR7cHJvcHMuZnVuY3Rpb24ucnVudGltZX0uIEdyZWVuZ3Jhc3MgZnVuY3Rpb25zIG9ubHkgc3VwcG9ydCAke2xhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzd9LCAke2xhbWJkYS5SdW50aW1lLkpBVkFfOH0sIGFuZCAke2xhbWJkYS5SdW50aW1lLk5PREVKU184XzEwfWApXG4gICAgICAgIC8vIH1cbiAgICAgICAgdGhpcy5uYW1lID0gaWQ7XG4gICAgICAgIHRoaXMubGFtYmRhRnVuY3Rpb24gPSBwcm9wcy5mdW5jdGlvbjtcbiAgICAgICAgdGhpcy5hbGlhcyA9IHByb3BzLmFsaWFzO1xuICAgICAgICB0aGlzLnBpbm5lZCA9IHByb3BzLnBpbm5lZDtcbiAgICAgICAgdGhpcy5tZW1vcnlTaXplID0gcHJvcHMubWVtb3J5U2l6ZTtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gcHJvcHMudGltZW91dDtcbiAgICAgICAgdGhpcy5leGVjdXRhYmxlID0gcHJvcHMuZXhlY3V0YWJsZTsgXG4gICAgICAgIHRoaXMuZXhlY0FyZ3MgPSBwcm9wcy5leGVjQXJnczsgXG4gICAgICAgIHRoaXMuZW5jb2RpbmdUeXBlID0gcHJvcHMuZW5jb2RpbmdUeXBlOyBcbiAgICAgICAgdGhpcy5pc29sYXRpb25Nb2RlID0gcHJvcHMuaXNvbGF0aW9uTW9kZTsgXG4gICAgICAgIHRoaXMucnVuQXMgPSBwcm9wcy5ydW5BczsgXG4gICAgICAgIHRoaXMucmVzb3VyY2VBY2Nlc3NQb2xpY2llcyA9IHByb3BzLnJlc291cmNlQWNjZXNzUG9saWNpZXM7IFxuICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IHByb3BzLnZhcmlhYmxlczsgXG4gICAgICAgIHRoaXMuYWNjZXNzU3lzRnMgPSBwcm9wcy5hY2Nlc3NTeXNGczsgXG4gICAgfVxuXG4gICAgYWRkUmVzb3VyY2UocmVzb3VyY2U6IFJlc291cmNlLCBwZXJtaXNzaW9uOiBGdW5jdGlvbnMuUmVzb3VyY2VBY2Nlc3NQZXJtaXNzaW9uKTogRnVuY3Rpb24ge1xuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFjY2Vzc1BvbGljaWVzID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFjY2Vzc1BvbGljaWVzID0gW11cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc291cmNlQWNjZXNzUG9saWNpZXM/LnB1c2goe1xuICAgICAgICAgICAgcGVybWlzc2lvbjogcGVybWlzc2lvbixcbiAgICAgICAgICAgIHJlc291cmNlOiByZXNvdXJjZVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXNvbHZlKCk6IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbi5GdW5jdGlvblByb3BlcnR5IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uQXJuOiB0aGlzLmxhbWJkYUZ1bmN0aW9uLmZ1bmN0aW9uQXJuICsgJzonICsgdGhpcy5hbGlhcy5hbGlhc05hbWUsXG4gICAgICAgICAgICBmdW5jdGlvbkNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NTeXNmczogdGhpcy5hY2Nlc3NTeXNGcyxcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc29sYXRpb25Nb2RlOiB0aGlzLmlzb2xhdGlvbk1vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5BczogdGhpcy5ydW5Bc1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZUFjY2Vzc1BvbGljaWVzOiB0aGlzLnJlc291cmNlQWNjZXNzUG9saWNpZXM/Lm1hcChjb252ZXJ0UmVzb3VjZUFjY2Vzc1BvbGljaWVzKSxcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzOiB0aGlzLnZhcmlhYmxlc1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZW5jb2RpbmdUeXBlOiB0aGlzLmVuY29kaW5nVHlwZSxcbiAgICAgICAgICAgICAgICBleGVjQXJnczogdGhpcy5leGVjQXJncyxcbiAgICAgICAgICAgICAgICBleGVjdXRhYmxlOiB0aGlzLmV4ZWN1dGFibGUsXG4gICAgICAgICAgICAgICAgbWVtb3J5U2l6ZTogdGhpcy5tZW1vcnlTaXplLnRvS2liaWJ5dGVzKCksXG4gICAgICAgICAgICAgICAgdGltZW91dDogdGhpcy50aW1lb3V0LnRvU2Vjb25kcygpLFxuICAgICAgICAgICAgICAgIHBpbm5lZDogdGhpcy5waW5uZWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpZDogdGhpcy5uYW1lXG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgICByZWFkb25seSBsYW1iZGFGdW5jdGlvbjogbGFtYmRhLkZ1bmN0aW9uO1xuICAgIHJlYWRvbmx5IGFsaWFzOiBsYW1iZGEuQWxpYXM7XG4gICAgcmVhZG9ubHkgcGlubmVkOiBib29sZWFuIHwgSVJlc29sdmFibGU7XG4gICAgcmVhZG9ubHkgbWVtb3J5U2l6ZTogU2l6ZTtcbiAgICByZWFkb25seSB0aW1lb3V0OiBEdXJhdGlvbjtcbiAgICByZWFkb25seSBleGVjdXRhYmxlPzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGV4ZWNBcmdzPzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGVuY29kaW5nVHlwZT86IEZ1bmN0aW9ucy5FbmNvZGluZ1R5cGU7XG4gICAgcmVhZG9ubHkgaXNvbGF0aW9uTW9kZT86IEZ1bmN0aW9ucy5Jc29sYXRpb25Nb2RlO1xuICAgIHJlYWRvbmx5IHJ1bkFzPzogRnVuY3Rpb25zLlJ1bkFzO1xuICAgIHJlc291cmNlQWNjZXNzUG9saWNpZXM/OiBGdW5jdGlvbnMuUmVzb3VyY2VBY2Nlc3NQb2xpY3lbXTtcbiAgICByZWFkb25seSB2YXJpYWJsZXM/OiBhbnk7XG4gICAgcmVhZG9ubHkgYWNjZXNzU3lzRnMgPzogYm9vbGVhbiB8IElSZXNvbHZhYmxlO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UmVzb3VjZUFjY2Vzc1BvbGljaWVzKHJhcDogRnVuY3Rpb25zLlJlc291cmNlQWNjZXNzUG9saWN5KTogZ2cuQ2ZuRnVuY3Rpb25EZWZpbml0aW9uLlJlc291cmNlQWNjZXNzUG9saWN5UHJvcGVydHkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc291cmNlSWQ6IHJhcC5yZXNvdXJjZS5pZCxcbiAgICAgICAgcGVybWlzc2lvbjogcmFwLnBlcm1pc3Npb25cbiAgICB9XG59Il19