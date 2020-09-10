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
const lambda = require("@aws-cdk/aws-lambda");
var Functions;
(function (Functions) {
    let IsolationMode;
    (function (IsolationMode) {
        /**
         * Run lambda function in isolated mode
         */
        IsolationMode["CONTAINER_MODE"] = "GreengrassContainer";
        /**
         * Run lambda function as processes. This must be used when
         * running Greengrass in a docker container
         */
        IsolationMode["NO_CONTAINER_MODE"] = "NoContainer";
    })(IsolationMode = Functions.IsolationMode || (Functions.IsolationMode = {}));
    let ResourceAccessPermission;
    (function (ResourceAccessPermission) {
        ResourceAccessPermission["READ_ONLY"] = "ro";
        ResourceAccessPermission["READ_WRITE"] = "rw";
    })(ResourceAccessPermission = Functions.ResourceAccessPermission || (Functions.ResourceAccessPermission = {}));
    /**
     * The encoding type of the `event` paramter passed to the handler
     */
    let EncodingType;
    (function (EncodingType) {
        EncodingType["JSON"] = "json";
        EncodingType["BINARY"] = "binary";
    })(EncodingType = Functions.EncodingType || (Functions.EncodingType = {}));
})(Functions = exports.Functions || (exports.Functions = {}));
class Function extends cdk.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        this.name = id;
        this.lambdaFunction = props.function;
        this.alias = props.alias;
        this.version = props.version;
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
    //readonly creationStack: string[];
    get reference() {
        if (this.alias) {
            return this.alias.aliasName;
        }
        else if (this.version) {
            return this.version.version;
        }
        else {
            throw Error('Either alias or version must be specified');
        }
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
        var _a, _b;
        if (!(this.lambdaFunction.runtime.name === lambda.Runtime.PYTHON_3_7.name ||
            this.lambdaFunction.runtime.name === lambda.Runtime.JAVA_8.name ||
            this.lambdaFunction.runtime.name === lambda.Runtime.NODEJS_12_X.name)) {
            throw new Error(`Invalid Lambda runtime: ${this.lambdaFunction.runtime}. Greengrass functions only support ${lambda.Runtime.PYTHON_3_7}, ${lambda.Runtime.JAVA_8}, and ${lambda.Runtime.NODEJS_8_10}`);
        }
        return {
            functionArn: this.lambdaFunction.functionArn + ':' + this.reference,
            functionConfiguration: {
                environment: {
                    accessSysfs: this.accessSysFs,
                    execution: {
                        isolationMode: this.isolationMode,
                        runAs: this.runAs
                    },
                    resourceAccessPolicies: (_a = this.resourceAccessPolicies) === null || _a === void 0 ? void 0 : _a.map(convertResourceAccessPolicies),
                    variables: this.variables
                },
                encodingType: this.encodingType,
                execArgs: this.execArgs,
                executable: this.executable,
                memorySize: (_b = this.memorySize) === null || _b === void 0 ? void 0 : _b.toKibibytes(),
                timeout: this.timeout.toSeconds(),
                pinned: this.pinned
            },
            id: this.name
        };
    }
}
exports.Function = Function;
function convertResourceAccessPolicies(rap) {
    return {
        resourceId: rap.resource.id,
        permission: rap.permission
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7O0FBRUgscUNBQXFDO0FBR3JDLDhDQUE2QztBQUc3QyxJQUFpQixTQUFTLENBc0R6QjtBQXRERCxXQUFpQixTQUFTO0lBWXRCLElBQVksYUFVWDtJQVZELFdBQVksYUFBYTtRQUNyQjs7V0FFRztRQUNILHVEQUFzQyxDQUFBO1FBQ3RDOzs7V0FHRztRQUNILGtEQUFpQyxDQUFBO0lBQ3JDLENBQUMsRUFWVyxhQUFhLEdBQWIsdUJBQWEsS0FBYix1QkFBYSxRQVV4QjtJQUVELElBQVksd0JBR1g7SUFIRCxXQUFZLHdCQUF3QjtRQUNoQyw0Q0FBZ0IsQ0FBQTtRQUNoQiw2Q0FBaUIsQ0FBQTtJQUNyQixDQUFDLEVBSFcsd0JBQXdCLEdBQXhCLGtDQUF3QixLQUF4QixrQ0FBd0IsUUFHbkM7SUFvQkQ7O09BRUc7SUFDSCxJQUFZLFlBR1g7SUFIRCxXQUFZLFlBQVk7UUFDcEIsNkJBQWEsQ0FBQTtRQUNiLGlDQUFpQixDQUFBO0lBQ3JCLENBQUMsRUFIVyxZQUFZLEdBQVosc0JBQVksS0FBWixzQkFBWSxRQUd2QjtBQUNMLENBQUMsRUF0RGdCLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBc0R6QjtBQXFDRCxNQUFhLFFBQVMsU0FBUSxHQUFHLENBQUMsUUFBUTtJQVl0QyxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFHakIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDckMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcs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LFNBQVM7aUJBQzVCO2dCQUNELFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDL0IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQzNCLFVBQVUsUUFBRSxJQUFJLENBQUMsVUFBVSwwQ0FBRSxXQUFXLEVBQUU7Z0JBQzFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtnQkFDakMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2FBQ3RCO1lBQ0QsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBRWhCLENBQUE7SUFDTCxDQUFDO0NBaUJKO0FBMUZELDRCQTBGQztBQUVELFNBQVMsNkJBQTZCLENBQUMsR0FBbUM7SUFDdEUsT0FBTztRQUNILFVBQVUsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDM0IsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVO0tBQzdCLENBQUE7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IElSZXNvbHZhYmxlLCBEdXJhdGlvbiwgU2l6ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJ1xuaW1wb3J0ICogYXMgZ2cgZnJvbSAnQGF3cy1jZGsvYXdzLWdyZWVuZ3Jhc3MnXG5cbmV4cG9ydCBuYW1lc3BhY2UgRnVuY3Rpb25zIHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIFJ1bkFzIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBsaW51eCB1c2VyIGlkIG9mIHRoZSB1c2VyIGV4ZWN1dGluZyB0aGUgcHJvY2Vzc1xuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdWlkOiBudW1iZXIsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbGludXggZ3JvdXAgaWQgb2YgdGhlIHVzZXIgZXhlY3V0aW5nIHRoZSBwcm9jZXNzXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBnaWQ6IG51bWJlclxuICAgIH1cblxuICAgIGV4cG9ydCBlbnVtIElzb2xhdGlvbk1vZGUge1xuICAgICAgICAvKipcbiAgICAgICAgICogUnVuIGxhbWJkYSBmdW5jdGlvbiBpbiBpc29sYXRlZCBtb2RlXG4gICAgICAgICAqL1xuICAgICAgICBDT05UQUlORVJfTU9ERSA9ICdHcmVlbmdyYXNzQ29udGFpbmVyJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJ1biBsYW1iZGEgZnVuY3Rpb24gYXMgcHJvY2Vzc2VzLiBUaGlzIG11c3QgYmUgdXNlZCB3aGVuIFxuICAgICAgICAgKiBydW5uaW5nIEdyZWVuZ3Jhc3MgaW4gYSBkb2NrZXIgY29udGFpbmVyXG4gICAgICAgICAqL1xuICAgICAgICBOT19DT05UQUlORVJfTU9ERSA9ICdOb0NvbnRhaW5lcidcbiAgICB9XG5cbiAgICBleHBvcnQgZW51bSBSZXNvdXJjZUFjY2Vzc1Blcm1pc3Npb24ge1xuICAgICAgICBSRUFEX09OTFkgPSAncm8nLFxuICAgICAgICBSRUFEX1dSSVRFID0gJ3J3J1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhlY3V0aW9uIHtcbiAgICAgICAgLyoqIFRoZSBtb2RlIGluIHdoaWNoIHRoZSBwcm9jZXNzIGZvciB0aGUgZnVuY3Rpb24gaXMgcnVuICovXG4gICAgICAgIHJlYWRvbmx5IGlzb2xhdGlvbk1vZGU6IElzb2xhdGlvbk1vZGUsXG4gICAgICAgIC8qKiBUaGUgdXNlciBydW5uaW5nIHRoZSBwcm9jZXNzICovXG4gICAgICAgIHJlYWRvbmx5IHJ1bkFzOiBSdW5Bc1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVzb3VyY2VBY2Nlc3NQb2xpY3kge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIFJlc291cmNlIHRvIGFzc29jaWF0ZSB0byB0aGlzIGZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSByZXNvdXJjZTogUmVzb3VyY2UsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcGVybWlzc2lvbnMgb2YgdGhlIGZ1bmN0aW9uIG9uIHRoZSByZXNvdXJjZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgcGVybWlzc2lvbjogUmVzb3VyY2VBY2Nlc3NQZXJtaXNzaW9uLFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBlbmNvZGluZyB0eXBlIG9mIHRoZSBgZXZlbnRgIHBhcmFtdGVyIHBhc3NlZCB0byB0aGUgaGFuZGxlclxuICAgICAqL1xuICAgIGV4cG9ydCBlbnVtIEVuY29kaW5nVHlwZSB7XG4gICAgICAgIEpTT04gPSAnanNvbicsXG4gICAgICAgIEJJTkFSWSA9ICdiaW5hcnknXG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZ1bmN0aW9uUHJvcHMge1xuICAgIC8qKlxuICAgICAqIFRoZSBMYW1iZGEgZnVuY3Rpb24gd2hvc2UgY29kZSB3aWxsIGJlIHVzZWQgZm9yIHRoaXMgR3JlZW5ncmFzcyBmdW5jdGlvblxuICAgICAqL1xuICAgIHJlYWRvbmx5IGZ1bmN0aW9uOiBsYW1iZGEuRnVuY3Rpb24sXG4gICAgLyoqXG4gICAgICogVEhlIGFsaWFzIG9mIHRoZSBmdW5jdGlvbi4gVGhpcyBpcyB0aGUgcmVjb21tZW5kZWQgd2F5IHRvIHJlZmVyIHRvIHRoZSBmdW5jdGlvblxuICAgICAqL1xuICAgIHJlYWRvbmx5IGFsaWFzPzogbGFtYmRhLkFsaWFzLFxuICAgIC8qKiBUaGUgdmVyc2lvbiBvZiB0aGUgZnVuY3Rpb24gdG8gdXNlICovXG4gICAgcmVhZG9ubHkgdmVyc2lvbj86IGxhbWJkYS5WZXJzaW9uLFxuICAgIC8qKiBJZiBzZXQgdG8gdHJ1ZSwgdGhlIGZ1bmN0aW9uIGlzIGxvbmcgcnVubmluZyAqL1xuICAgIHJlYWRvbmx5IHBpbm5lZDogYm9vbGVhbiB8IElSZXNvbHZhYmxlLFxuICAgIC8qKiBUaGUgbWVtb3J5IGFsbG9jYXRlZCB0byB0aGUgbGFtYmRhICovXG4gICAgcmVhZG9ubHkgbWVtb3J5U2l6ZTogU2l6ZSxcbiAgICAvKiogVGhlIHRpbWVvdXQgZm9yIHRoZSBleGVjdXRpb24gb2YgdGhlIGhhbmRsZXIgKi9cbiAgICByZWFkb25seSB0aW1lb3V0OiBEdXJhdGlvbixcbiAgICAvKiogVEhlIG5hbWUgb2YgdGhlIGV4ZWN1dGFibGUgd2hlbiB1c2luZyBjb21waWxlZCBleGVjdXRhYmxlcyAqL1xuICAgIHJlYWRvbmx5IGV4ZWN1dGFibGU/OiBzdHJpbmcsXG4gICAgLyoqIFRoZSBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgZXhlY3V0YWJsZSAqL1xuICAgIHJlYWRvbmx5IGV4ZWNBcmdzPzogc3RyaW5nLFxuICAgIC8qKiBUaGUgZW5jb2RpbmcgdHlwZSBvZiB0aGUgZXZlbnQgbWVzc2FnZS4gKi9cbiAgICByZWFkb25seSBlbmNvZGluZ1R5cGU/OiBGdW5jdGlvbnMuRW5jb2RpbmdUeXBlLFxuICAgIC8qKiBEZXRlcm1pbmVzIGlmIHRoZSBsYW1iZGEgaXMgcnVuIGluIGNvbnRhaW5lcml6ZWQgb3Igbm9uLWNvbnRhaW5lcml6ZWQgbW9kZSAqL1xuICAgIHJlYWRvbmx5IGlzb2xhdGlvbk1vZGU/OiBGdW5jdGlvbnMuSXNvbGF0aW9uTW9kZSxcbiAgICAvKiogVGhlIHVzZXIgcnVubmluZyB0aGUgbGFtYmRhICovXG4gICAgcmVhZG9ubHkgcnVuQXM/OiBGdW5jdGlvbnMuUnVuQXMsXG4gICAgLyoqIFRoZSByZXNvdXJjZSBhY2Nlc3MgcG9saWNpZXMgZm9yIHRoZSBmdW5jdGlvbiB0byBhc3NvY2lhdGVkIHJlc291cmNlcyAqL1xuICAgIHJlYWRvbmx5IHJlc291cmNlQWNjZXNzUG9saWNpZXM/OiBGdW5jdGlvbnMuUmVzb3VyY2VBY2Nlc3NQb2xpY3lbXSxcbiAgICAvKiogRW52aXJvbm1lbnQgdmFyaWFibGVzIHRvIGFzc29jaWF0ZSB0byB0aGUgTGFtYmRhICovXG4gICAgcmVhZG9ubHkgdmFyaWFibGVzPzogYW55LFxuICAgIC8qKiBBbGxvdyBhY2Nlc3MgdG8gdGhlIFN5c0ZzICovXG4gICAgcmVhZG9ubHkgYWNjZXNzU3lzRnM/OiBib29sZWFuIHwgSVJlc29sdmFibGVcbn1cblxuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uIGV4dGVuZHMgY2RrLlJlc291cmNlIHtcbiAgICAvL3JlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdO1xuICAgIGdldCByZWZlcmVuY2UoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuYWxpYXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFsaWFzLmFsaWFzTmFtZVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmVyc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmVyc2lvbi52ZXJzaW9uXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignRWl0aGVyIGFsaWFzIG9yIHZlcnNpb24gbXVzdCBiZSBzcGVjaWZpZWQnKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBGdW5jdGlvblByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgXG4gICAgICAgIHRoaXMubmFtZSA9IGlkO1xuICAgICAgICB0aGlzLmxhbWJkYUZ1bmN0aW9uID0gcHJvcHMuZnVuY3Rpb247XG4gICAgICAgIHRoaXMuYWxpYXMgPSBwcm9wcy5hbGlhcztcbiAgICAgICAgdGhpcy52ZXJzaW9uID0gcHJvcHMudmVyc2lvbjtcbiAgICAgICAgdGhpcy5waW5uZWQgPSBwcm9wcy5waW5uZWQ7XG4gICAgICAgIHRoaXMubWVtb3J5U2l6ZSA9IHByb3BzLm1lbW9yeVNpemU7XG4gICAgICAgIHRoaXMudGltZW91dCA9IHByb3BzLnRpbWVvdXQ7XG4gICAgICAgIHRoaXMuZXhlY3V0YWJsZSA9IHByb3BzLmV4ZWN1dGFibGU7IFxuICAgICAgICB0aGlzLmV4ZWNBcmdzID0gcHJvcHMuZXhlY0FyZ3M7IFxuICAgICAgICB0aGlzLmVuY29kaW5nVHlwZSA9IHByb3BzLmVuY29kaW5nVHlwZTsgXG4gICAgICAgIHRoaXMuaXNvbGF0aW9uTW9kZSA9IHByb3BzLmlzb2xhdGlvbk1vZGU7IFxuICAgICAgICB0aGlzLnJ1bkFzID0gcHJvcHMucnVuQXM7IFxuICAgICAgICB0aGlzLnJlc291cmNlQWNjZXNzUG9saWNpZXMgPSBwcm9wcy5yZXNvdXJjZUFjY2Vzc1BvbGljaWVzOyBcbiAgICAgICAgdGhpcy52YXJpYWJsZXMgPSBwcm9wcy52YXJpYWJsZXM7IFxuICAgICAgICB0aGlzLmFjY2Vzc1N5c0ZzID0gcHJvcHMuYWNjZXNzU3lzRnM7IFxuICAgIH1cblxuICAgIGFkZFJlc291cmNlKHJlc291cmNlOiBSZXNvdXJjZSwgcGVybWlzc2lvbjogRnVuY3Rpb25zLlJlc291cmNlQWNjZXNzUGVybWlzc2lvbik6IEZ1bmN0aW9uIHtcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBY2Nlc3NQb2xpY2llcyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBY2Nlc3NQb2xpY2llcyA9IFtdXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXNvdXJjZUFjY2Vzc1BvbGljaWVzPy5wdXNoKHtcbiAgICAgICAgICAgIHBlcm1pc3Npb246IHBlcm1pc3Npb24sXG4gICAgICAgICAgICByZXNvdXJjZTogcmVzb3VyY2VcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVzb2x2ZSgpOiBnZy5DZm5GdW5jdGlvbkRlZmluaXRpb24uRnVuY3Rpb25Qcm9wZXJ0eSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoISh0aGlzLmxhbWJkYUZ1bmN0aW9uLnJ1bnRpbWUubmFtZSA9PT0gbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfNy5uYW1lIHx8XG4gICAgICAgICAgICB0aGlzLmxhbWJkYUZ1bmN0aW9uLnJ1bnRpbWUubmFtZSA9PT0gbGFtYmRhLlJ1bnRpbWUuSkFWQV84Lm5hbWUgfHxcbiAgICAgICAgICAgIHRoaXMubGFtYmRhRnVuY3Rpb24ucnVudGltZS5uYW1lID09PSBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTJfWC5uYW1lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIExhbWJkYSBydW50aW1lOiAke3RoaXMubGFtYmRhRnVuY3Rpb24ucnVudGltZX0uIEdyZWVuZ3Jhc3MgZnVuY3Rpb25zIG9ubHkgc3VwcG9ydCAke2xhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzd9LCAke2xhbWJkYS5SdW50aW1lLkpBVkFfOH0sIGFuZCAke2xhbWJkYS5SdW50aW1lLk5PREVKU184XzEwfWApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uQXJuOiB0aGlzLmxhbWJkYUZ1bmN0aW9uLmZ1bmN0aW9uQXJuICsgJzonICsgdGhpcy5yZWZlcmVuY2UsXG4gICAgICAgICAgICBmdW5jdGlvbkNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NTeXNmczogdGhpcy5hY2Nlc3NTeXNGcyxcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc29sYXRpb25Nb2RlOiB0aGlzLmlzb2xhdGlvbk1vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5BczogdGhpcy5ydW5Bc1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZUFjY2Vzc1BvbGljaWVzOiB0aGlzLnJlc291cmNlQWNjZXNzUG9saWNpZXM/Lm1hcChjb252ZXJ0UmVzb3VyY2VBY2Nlc3NQb2xpY2llcyksXG4gICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlczogdGhpcy52YXJpYWJsZXNcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVuY29kaW5nVHlwZTogdGhpcy5lbmNvZGluZ1R5cGUsXG4gICAgICAgICAgICAgICAgZXhlY0FyZ3M6IHRoaXMuZXhlY0FyZ3MsXG4gICAgICAgICAgICAgICAgZXhlY3V0YWJsZTogdGhpcy5leGVjdXRhYmxlLFxuICAgICAgICAgICAgICAgIG1lbW9yeVNpemU6IHRoaXMubWVtb3J5U2l6ZT8udG9LaWJpYnl0ZXMoKSxcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiB0aGlzLnRpbWVvdXQudG9TZWNvbmRzKCksXG4gICAgICAgICAgICAgICAgcGlubmVkOiB0aGlzLnBpbm5lZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlkOiB0aGlzLm5hbWVcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGxhbWJkYUZ1bmN0aW9uOiBsYW1iZGEuRnVuY3Rpb247XG4gICAgcmVhZG9ubHkgYWxpYXM/OiBsYW1iZGEuQWxpYXM7XG4gICAgcmVhZG9ubHkgdmVyc2lvbj86IGxhbWJkYS5WZXJzaW9uO1xuICAgIHJlYWRvbmx5IHBpbm5lZDogYm9vbGVhbiB8IElSZXNvbHZhYmxlO1xuICAgIHJlYWRvbmx5IG1lbW9yeVNpemU/OiBTaXplO1xuICAgIHJlYWRvbmx5IHRpbWVvdXQ6IER1cmF0aW9uO1xuICAgIHJlYWRvbmx5IGV4ZWN1dGFibGU/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZXhlY0FyZ3M/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZW5jb2RpbmdUeXBlPzogRnVuY3Rpb25zLkVuY29kaW5nVHlwZTtcbiAgICByZWFkb25seSBpc29sYXRpb25Nb2RlPzogRnVuY3Rpb25zLklzb2xhdGlvbk1vZGU7XG4gICAgcmVhZG9ubHkgcnVuQXM/OiBGdW5jdGlvbnMuUnVuQXM7XG4gICAgcmVzb3VyY2VBY2Nlc3NQb2xpY2llcz86IEZ1bmN0aW9ucy5SZXNvdXJjZUFjY2Vzc1BvbGljeVtdO1xuICAgIHJlYWRvbmx5IHZhcmlhYmxlcz86IGFueTtcbiAgICByZWFkb25seSBhY2Nlc3NTeXNGcyA/OiBib29sZWFuIHwgSVJlc29sdmFibGU7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRSZXNvdXJjZUFjY2Vzc1BvbGljaWVzKHJhcDogRnVuY3Rpb25zLlJlc291cmNlQWNjZXNzUG9saWN5KTogZ2cuQ2ZuRnVuY3Rpb25EZWZpbml0aW9uLlJlc291cmNlQWNjZXNzUG9saWN5UHJvcGVydHkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc291cmNlSWQ6IHJhcC5yZXNvdXJjZS5pZCxcbiAgICAgICAgcGVybWlzc2lvbjogcmFwLnBlcm1pc3Npb25cbiAgICB9XG59Il19