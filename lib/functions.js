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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7O0FBRUgscUNBQXFDO0FBR3JDLDhDQUE2QztBQUc3QyxJQUFpQixTQUFTLENBc0R6QjtBQXRERCxXQUFpQixTQUFTO0lBWXRCLElBQVksYUFVWDtJQVZELFdBQVksYUFBYTtRQUNyQjs7V0FFRztRQUNILHVEQUFzQyxDQUFBO1FBQ3RDOzs7V0FHRztRQUNILGtEQUFpQyxDQUFBO0lBQ3JDLENBQUMsRUFWVyxhQUFhLEdBQWIsdUJBQWEsS0FBYix1QkFBYSxRQVV4QjtJQUVELElBQVksd0JBR1g7SUFIRCxXQUFZLHdCQUF3QjtRQUNoQyw0Q0FBZ0IsQ0FBQTtRQUNoQiw2Q0FBaUIsQ0FBQTtJQUNyQixDQUFDLEVBSFcsd0JBQXdCLEdBQXhCLGtDQUF3QixLQUF4QixrQ0FBd0IsUUFHbkM7SUFvQkQ7O09BRUc7SUFDSCxJQUFZLFlBR1g7SUFIRCxXQUFZLFlBQVk7UUFDcEIsNkJBQWEsQ0FBQTtRQUNiLGlDQUFpQixDQUFBO0lBQ3JCLENBQUMsRUFIVyxZQUFZLEdBQVosc0JBQVksS0FBWixzQkFBWSxRQUd2QjtBQUNMLENBQUMsRUF0RGdCLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBc0R6QjtBQXVDRCxNQUFhLFFBQVMsU0FBUSxHQUFHLENBQUMsUUFBUTtJQVl0QyxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFHakIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDckMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUN2QyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUMsc0JBQXNCLENBQUM7UUFDM0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztJQUN6QyxDQUFDO0lBOUJELG1DQUFtQztJQUNuQyxJQUFJLFNBQVM7UUFDVCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFBO1NBQzlCO2FBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUE7U0FDOUI7YUFBTTtZQUNILE1BQU0sS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUE7U0FDM0Q7SUFDTCxDQUFDO0lBdUJELFdBQVcsQ0FBQyxRQUFrQixFQUFFLFVBQThDOztRQUMxRSxJQUFJLElBQUksQ0FBQyxzQkFBc0IsSUFBSSxTQUFTLEVBQUU7WUFDMUMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQTtTQUNuQztRQUNELE1BQUEsSUFBSSxDQUFDLHNCQUFzQiwwQ0FBRSxJQUFJLENBQUM7WUFDOUIsVUFBVSxFQUFFLFVBQVU7WUFDdEIsUUFBUSxFQUFFLFFBQVE7U0FDckIsRUFBQztRQUNGLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxPQUFPOztRQUVILElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJO1lBQ3JFLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJO1lBQy9ELElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN2RSxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sdUNBQXVDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxTQUFTLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtTQUN6TTtRQUNELE9BQU87WUFDSCxXQUFXLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTO1lBQ25FLHFCQUFxQixFQUFFO2dCQUNuQixXQUFXLEVBQUU7b0JBQ1QsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO29CQUM3QixTQUFTLEVBQUU7d0JBQ1AsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO3dCQUNqQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7cUJBQ3BCO29CQUNELHNCQUFzQixRQUFFLElBQUksQ0FBQyxzQkFBc0IsMENBQUUsR0FBRyxDQUFDLDZCQUE2QixDQUFDO29CQUN2RixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7aUJBQzVCO2dCQUNELFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDL0IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQzNCLFVBQVUsUUFBRSxJQUFJLENBQUMsVUFBVSwwQ0FBRSxXQUFXLEVBQUU7Z0JBQzFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtnQkFDakMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2FBQ3RCO1lBQ0QsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBRWhCLENBQUE7SUFDTCxDQUFDO0NBaUJKO0FBMUZELDRCQTBGQztBQUVELFNBQVMsNkJBQTZCLENBQUMsR0FBbUM7SUFDdEUsT0FBTztRQUNILFVBQVUsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDM0IsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVO0tBQzdCLENBQUE7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IElSZXNvbHZhYmxlLCBEdXJhdGlvbiwgU2l6ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJ1xuaW1wb3J0ICogYXMgZ2cgZnJvbSAnQGF3cy1jZGsvYXdzLWdyZWVuZ3Jhc3MnXG5cbmV4cG9ydCBuYW1lc3BhY2UgRnVuY3Rpb25zIHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIFJ1bkFzIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBsaW51eCB1c2VyIGlkIG9mIHRoZSB1c2VyIGV4ZWN1dGluZyB0aGUgcHJvY2Vzc1xuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgdWlkOiBudW1iZXIsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbGludXggZ3JvdXAgaWQgb2YgdGhlIHVzZXIgZXhlY3V0aW5nIHRoZSBwcm9jZXNzXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBnaWQ6IG51bWJlclxuICAgIH1cblxuICAgIGV4cG9ydCBlbnVtIElzb2xhdGlvbk1vZGUge1xuICAgICAgICAvKipcbiAgICAgICAgICogUnVuIGxhbWJkYSBmdW5jdGlvbiBpbiBpc29sYXRlZCBtb2RlXG4gICAgICAgICAqL1xuICAgICAgICBDT05UQUlORVJfTU9ERSA9ICdHcmVlbmdyYXNzQ29udGFpbmVyJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJ1biBsYW1iZGEgZnVuY3Rpb24gYXMgcHJvY2Vzc2VzLiBUaGlzIG11c3QgYmUgdXNlZCB3aGVuIFxuICAgICAgICAgKiBydW5uaW5nIEdyZWVuZ3Jhc3MgaW4gYSBkb2NrZXIgY29udGFpbmVyXG4gICAgICAgICAqL1xuICAgICAgICBOT19DT05UQUlORVJfTU9ERSA9ICdOb0NvbnRhaW5lcidcbiAgICB9XG5cbiAgICBleHBvcnQgZW51bSBSZXNvdXJjZUFjY2Vzc1Blcm1pc3Npb24ge1xuICAgICAgICBSRUFEX09OTFkgPSAncm8nLFxuICAgICAgICBSRUFEX1dSSVRFID0gJ3J3J1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhlY3V0aW9uIHtcbiAgICAgICAgLyoqIFRoZSBtb2RlIGluIHdoaWNoIHRoZSBwcm9jZXNzIGZvciB0aGUgZnVuY3Rpb24gaXMgcnVuICovXG4gICAgICAgIHJlYWRvbmx5IGlzb2xhdGlvbk1vZGU6IElzb2xhdGlvbk1vZGUsXG4gICAgICAgIC8qKiBUaGUgdXNlciBydW5uaW5nIHRoZSBwcm9jZXNzICovXG4gICAgICAgIHJlYWRvbmx5IHJ1bkFzPzogUnVuQXNcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFJlc291cmNlQWNjZXNzUG9saWN5IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBSZXNvdXJjZSB0byBhc3NvY2lhdGUgdG8gdGhpcyBmdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgcmVzb3VyY2U6IFJlc291cmNlLFxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHBlcm1pc3Npb25zIG9mIHRoZSBmdW5jdGlvbiBvbiB0aGUgcmVzb3VyY2VcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5IHBlcm1pc3Npb246IFJlc291cmNlQWNjZXNzUGVybWlzc2lvbixcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZW5jb2RpbmcgdHlwZSBvZiB0aGUgYGV2ZW50YCBwYXJhbXRlciBwYXNzZWQgdG8gdGhlIGhhbmRsZXJcbiAgICAgKi9cbiAgICBleHBvcnQgZW51bSBFbmNvZGluZ1R5cGUge1xuICAgICAgICBKU09OID0gJ2pzb24nLFxuICAgICAgICBCSU5BUlkgPSAnYmluYXJ5J1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBGdW5jdGlvblByb3BzIHtcbiAgICAvKipcbiAgICAgKiBUaGUgTGFtYmRhIGZ1bmN0aW9uIHdob3NlIGNvZGUgd2lsbCBiZSB1c2VkIGZvciB0aGlzIEdyZWVuZ3Jhc3MgZnVuY3Rpb25cbiAgICAgKi9cbiAgICByZWFkb25seSBmdW5jdGlvbjogbGFtYmRhLkZ1bmN0aW9uLFxuICAgIC8qKlxuICAgICAqIFRIZSBhbGlhcyBvZiB0aGUgZnVuY3Rpb24uIFRoaXMgaXMgdGhlIHJlY29tbWVuZGVkIHdheSB0byByZWZlciB0byB0aGUgZnVuY3Rpb25cbiAgICAgKi9cbiAgICByZWFkb25seSBhbGlhcz86IGxhbWJkYS5BbGlhcyxcbiAgICAvKiogVGhlIHZlcnNpb24gb2YgdGhlIGZ1bmN0aW9uIHRvIHVzZSAqL1xuICAgIHJlYWRvbmx5IHZlcnNpb24/OiBsYW1iZGEuVmVyc2lvbixcbiAgICAvKiogSWYgc2V0IHRvIHRydWUsIHRoZSBmdW5jdGlvbiBpcyBsb25nIHJ1bm5pbmcgKi9cbiAgICByZWFkb25seSBwaW5uZWQ6IGJvb2xlYW4gfCBJUmVzb2x2YWJsZSxcbiAgICAvKiogVGhlIG1lbW9yeSBhbGxvY2F0ZWQgdG8gdGhlIGxhbWJkYS4gTXVzdCBiZSBzcGVjaWZpZWQgZm9yIENvbnRhaW5lciBNb2RlLFxuICAgICAqIGFuZCBvbWl0dGVkIGluIG5vIGNvbnRhaW5lciBtb2RlXG4gICAgICovXG4gICAgcmVhZG9ubHkgbWVtb3J5U2l6ZT86IFNpemUsXG4gICAgLyoqIFRoZSB0aW1lb3V0IGZvciB0aGUgZXhlY3V0aW9uIG9mIHRoZSBoYW5kbGVyICovXG4gICAgcmVhZG9ubHkgdGltZW91dDogRHVyYXRpb24sXG4gICAgLyoqIFRIZSBuYW1lIG9mIHRoZSBleGVjdXRhYmxlIHdoZW4gdXNpbmcgY29tcGlsZWQgZXhlY3V0YWJsZXMgKi9cbiAgICByZWFkb25seSBleGVjdXRhYmxlPzogc3RyaW5nLFxuICAgIC8qKiBUaGUgYXJndW1lbnRzIHRvIHBhc3MgdG8gdGhlIGV4ZWN1dGFibGUgKi9cbiAgICByZWFkb25seSBleGVjQXJncz86IHN0cmluZyxcbiAgICAvKiogVGhlIGVuY29kaW5nIHR5cGUgb2YgdGhlIGV2ZW50IG1lc3NhZ2UuICovXG4gICAgcmVhZG9ubHkgZW5jb2RpbmdUeXBlPzogRnVuY3Rpb25zLkVuY29kaW5nVHlwZSxcbiAgICAvKiogRGV0ZXJtaW5lcyBpZiB0aGUgbGFtYmRhIGlzIHJ1biBpbiBjb250YWluZXJpemVkIG9yIG5vbi1jb250YWluZXJpemVkIG1vZGUgKi9cbiAgICByZWFkb25seSBpc29sYXRpb25Nb2RlPzogRnVuY3Rpb25zLklzb2xhdGlvbk1vZGUsXG4gICAgLyoqIFRoZSB1c2VyIHJ1bm5pbmcgdGhlIGxhbWJkYSAqL1xuICAgIHJlYWRvbmx5IHJ1bkFzPzogRnVuY3Rpb25zLlJ1bkFzLFxuICAgIC8qKiBUaGUgcmVzb3VyY2UgYWNjZXNzIHBvbGljaWVzIGZvciB0aGUgZnVuY3Rpb24gdG8gYXNzb2NpYXRlZCByZXNvdXJjZXMgKi9cbiAgICByZWFkb25seSByZXNvdXJjZUFjY2Vzc1BvbGljaWVzPzogRnVuY3Rpb25zLlJlc291cmNlQWNjZXNzUG9saWN5W10sXG4gICAgLyoqIEVudmlyb25tZW50IHZhcmlhYmxlcyB0byBhc3NvY2lhdGUgdG8gdGhlIExhbWJkYSAqL1xuICAgIHJlYWRvbmx5IHZhcmlhYmxlcz86IGFueSxcbiAgICAvKiogQWxsb3cgYWNjZXNzIHRvIHRoZSBTeXNGcyAqL1xuICAgIHJlYWRvbmx5IGFjY2Vzc1N5c0ZzPzogYm9vbGVhbiB8IElSZXNvbHZhYmxlXG59XG5cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbiBleHRlbmRzIGNkay5SZXNvdXJjZSB7XG4gICAgLy9yZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXTtcbiAgICBnZXQgcmVmZXJlbmNlKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmFsaWFzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hbGlhcy5hbGlhc05hbWVcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZlcnNpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZlcnNpb24udmVyc2lvblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ0VpdGhlciBhbGlhcyBvciB2ZXJzaW9uIG11c3QgYmUgc3BlY2lmaWVkJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRnVuY3Rpb25Qcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIFxuICAgICAgICB0aGlzLm5hbWUgPSBpZDtcbiAgICAgICAgdGhpcy5sYW1iZGFGdW5jdGlvbiA9IHByb3BzLmZ1bmN0aW9uO1xuICAgICAgICB0aGlzLmFsaWFzID0gcHJvcHMuYWxpYXM7XG4gICAgICAgIHRoaXMudmVyc2lvbiA9IHByb3BzLnZlcnNpb247XG4gICAgICAgIHRoaXMucGlubmVkID0gcHJvcHMucGlubmVkO1xuICAgICAgICB0aGlzLm1lbW9yeVNpemUgPSBwcm9wcy5tZW1vcnlTaXplO1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSBwcm9wcy50aW1lb3V0O1xuICAgICAgICB0aGlzLmV4ZWN1dGFibGUgPSBwcm9wcy5leGVjdXRhYmxlOyBcbiAgICAgICAgdGhpcy5leGVjQXJncyA9IHByb3BzLmV4ZWNBcmdzOyBcbiAgICAgICAgdGhpcy5lbmNvZGluZ1R5cGUgPSBwcm9wcy5lbmNvZGluZ1R5cGU7IFxuICAgICAgICB0aGlzLmlzb2xhdGlvbk1vZGUgPSBwcm9wcy5pc29sYXRpb25Nb2RlOyBcbiAgICAgICAgdGhpcy5ydW5BcyA9IHByb3BzLnJ1bkFzOyBcbiAgICAgICAgdGhpcy5yZXNvdXJjZUFjY2Vzc1BvbGljaWVzID0gcHJvcHMucmVzb3VyY2VBY2Nlc3NQb2xpY2llczsgXG4gICAgICAgIHRoaXMudmFyaWFibGVzID0gcHJvcHMudmFyaWFibGVzOyBcbiAgICAgICAgdGhpcy5hY2Nlc3NTeXNGcyA9IHByb3BzLmFjY2Vzc1N5c0ZzOyBcbiAgICB9XG5cbiAgICBhZGRSZXNvdXJjZShyZXNvdXJjZTogUmVzb3VyY2UsIHBlcm1pc3Npb246IEZ1bmN0aW9ucy5SZXNvdXJjZUFjY2Vzc1Blcm1pc3Npb24pOiBGdW5jdGlvbiB7XG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQWNjZXNzUG9saWNpZXMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlc291cmNlQWNjZXNzUG9saWNpZXMgPSBbXVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzb3VyY2VBY2Nlc3NQb2xpY2llcz8ucHVzaCh7XG4gICAgICAgICAgICBwZXJtaXNzaW9uOiBwZXJtaXNzaW9uLFxuICAgICAgICAgICAgcmVzb3VyY2U6IHJlc291cmNlXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlc29sdmUoKTogZ2cuQ2ZuRnVuY3Rpb25EZWZpbml0aW9uLkZ1bmN0aW9uUHJvcGVydHkge1xuICAgICAgICBcbiAgICAgICAgaWYgKCEodGhpcy5sYW1iZGFGdW5jdGlvbi5ydW50aW1lLm5hbWUgPT09IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzcubmFtZSB8fFxuICAgICAgICAgICAgdGhpcy5sYW1iZGFGdW5jdGlvbi5ydW50aW1lLm5hbWUgPT09IGxhbWJkYS5SdW50aW1lLkpBVkFfOC5uYW1lIHx8XG4gICAgICAgICAgICB0aGlzLmxhbWJkYUZ1bmN0aW9uLnJ1bnRpbWUubmFtZSA9PT0gbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzEyX1gubmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBMYW1iZGEgcnVudGltZTogJHt0aGlzLmxhbWJkYUZ1bmN0aW9uLnJ1bnRpbWV9LiBHcmVlbmdyYXNzIGZ1bmN0aW9ucyBvbmx5IHN1cHBvcnQgJHtsYW1iZGEuUnVudGltZS5QWVRIT05fM183fSwgJHtsYW1iZGEuUnVudGltZS5KQVZBXzh9LCBhbmQgJHtsYW1iZGEuUnVudGltZS5OT0RFSlNfOF8xMH1gKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmdW5jdGlvbkFybjogdGhpcy5sYW1iZGFGdW5jdGlvbi5mdW5jdGlvbkFybiArICc6JyArIHRoaXMucmVmZXJlbmNlLFxuICAgICAgICAgICAgZnVuY3Rpb25Db25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzU3lzZnM6IHRoaXMuYWNjZXNzU3lzRnMsXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNvbGF0aW9uTW9kZTogdGhpcy5pc29sYXRpb25Nb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcnVuQXM6IHRoaXMucnVuQXNcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VBY2Nlc3NQb2xpY2llczogdGhpcy5yZXNvdXJjZUFjY2Vzc1BvbGljaWVzPy5tYXAoY29udmVydFJlc291cmNlQWNjZXNzUG9saWNpZXMpLFxuICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZXM6IHRoaXMudmFyaWFibGVzXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlbmNvZGluZ1R5cGU6IHRoaXMuZW5jb2RpbmdUeXBlLFxuICAgICAgICAgICAgICAgIGV4ZWNBcmdzOiB0aGlzLmV4ZWNBcmdzLFxuICAgICAgICAgICAgICAgIGV4ZWN1dGFibGU6IHRoaXMuZXhlY3V0YWJsZSxcbiAgICAgICAgICAgICAgICBtZW1vcnlTaXplOiB0aGlzLm1lbW9yeVNpemU/LnRvS2liaWJ5dGVzKCksXG4gICAgICAgICAgICAgICAgdGltZW91dDogdGhpcy50aW1lb3V0LnRvU2Vjb25kcygpLFxuICAgICAgICAgICAgICAgIHBpbm5lZDogdGhpcy5waW5uZWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpZDogdGhpcy5uYW1lXG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgICByZWFkb25seSBsYW1iZGFGdW5jdGlvbjogbGFtYmRhLkZ1bmN0aW9uO1xuICAgIHJlYWRvbmx5IGFsaWFzPzogbGFtYmRhLkFsaWFzO1xuICAgIHJlYWRvbmx5IHZlcnNpb24/OiBsYW1iZGEuVmVyc2lvbjtcbiAgICByZWFkb25seSBwaW5uZWQ6IGJvb2xlYW4gfCBJUmVzb2x2YWJsZTtcbiAgICByZWFkb25seSBtZW1vcnlTaXplPzogU2l6ZTtcbiAgICByZWFkb25seSB0aW1lb3V0OiBEdXJhdGlvbjtcbiAgICByZWFkb25seSBleGVjdXRhYmxlPzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGV4ZWNBcmdzPzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGVuY29kaW5nVHlwZT86IEZ1bmN0aW9ucy5FbmNvZGluZ1R5cGU7XG4gICAgcmVhZG9ubHkgaXNvbGF0aW9uTW9kZT86IEZ1bmN0aW9ucy5Jc29sYXRpb25Nb2RlO1xuICAgIHJlYWRvbmx5IHJ1bkFzPzogRnVuY3Rpb25zLlJ1bkFzO1xuICAgIHJlc291cmNlQWNjZXNzUG9saWNpZXM/OiBGdW5jdGlvbnMuUmVzb3VyY2VBY2Nlc3NQb2xpY3lbXTtcbiAgICByZWFkb25seSB2YXJpYWJsZXM/OiBhbnk7XG4gICAgcmVhZG9ubHkgYWNjZXNzU3lzRnMgPzogYm9vbGVhbiB8IElSZXNvbHZhYmxlO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UmVzb3VyY2VBY2Nlc3NQb2xpY2llcyhyYXA6IEZ1bmN0aW9ucy5SZXNvdXJjZUFjY2Vzc1BvbGljeSk6IGdnLkNmbkZ1bmN0aW9uRGVmaW5pdGlvbi5SZXNvdXJjZUFjY2Vzc1BvbGljeVByb3BlcnR5IHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXNvdXJjZUlkOiByYXAucmVzb3VyY2UuaWQsXG4gICAgICAgIHBlcm1pc3Npb246IHJhcC5wZXJtaXNzaW9uXG4gICAgfVxufSJdfQ==