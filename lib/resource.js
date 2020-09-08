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
exports.S3MachineLearningModelResource = exports.SageMakerMachineLearningModelResource = exports.LocalVolumeResource = exports.LocalDeviceResource = exports.Resource = exports.Permission = void 0;
const cdk = require("@aws-cdk/core");
var Permission;
(function (Permission) {
    Permission["READ_ONLY"] = "ro";
    Permission["READ_WRITE"] = "rw";
})(Permission = exports.Permission || (exports.Permission = {}));
class Resource extends cdk.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        this.id = id;
        this.name = props.name;
    }
}
exports.Resource = Resource;
class LocalDeviceResource extends Resource {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.sourcePath = props.sourcePath;
        this.groupOwnerSetting = props.groupOwnerSetting;
    }
    resolve() {
        return {
            id: this.id,
            name: this.name,
            resourceDataContainer: {
                localDeviceResourceData: {
                    sourcePath: this.sourcePath,
                    groupOwnerSetting: this.groupOwnerSetting
                }
            }
        };
    }
}
exports.LocalDeviceResource = LocalDeviceResource;
class LocalVolumeResource extends Resource {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.sourcePath = props.sourcePath;
        this.groupOwnerSetting = props.groupOwnerSetting;
        this.destinationPath = props.destinationPath;
    }
    resolve() {
        return {
            id: this.id,
            name: this.id,
            resourceDataContainer: {
                localVolumeResourceData: {
                    sourcePath: this.sourcePath,
                    groupOwnerSetting: this.groupOwnerSetting,
                    destinationPath: this.destinationPath
                }
            }
        };
    }
}
exports.LocalVolumeResource = LocalVolumeResource;
class SageMakerMachineLearningModelResource extends Resource {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.sageMakerJobArn = props.sageMakerJobArn;
        this.ownerSetting = props.ownerSettings;
        this.destinationPath = props.destinationPath;
    }
    resolve() {
        return {
            id: this.id,
            name: this.id,
            resourceDataContainer: {
                sageMakerMachineLearningModelResourceData: {
                    sageMakerJobArn: this.sageMakerJobArn,
                    ownerSetting: this.ownerSetting,
                    destinationPath: this.destinationPath
                }
            }
        };
    }
}
exports.SageMakerMachineLearningModelResource = SageMakerMachineLearningModelResource;
class S3MachineLearningModelResource extends Resource {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.s3Uri = props.s3Uri;
        this.ownerSetting = props.ownerSettings;
        this.destinationPath = props.destinationPath;
    }
    resolve() {
        return {
            id: this.id,
            name: this.name,
            resourceDataContainer: {
                s3MachineLearningModelResourceData: {
                    s3Uri: this.s3Uri,
                    ownerSetting: this.ownerSetting,
                    destinationPath: this.destinationPath
                }
            }
        };
    }
}
exports.S3MachineLearningModelResource = S3MachineLearningModelResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7OztBQUVILHFDQUFxQztBQU9yQyxJQUFZLFVBR1g7QUFIRCxXQUFZLFVBQVU7SUFDbEIsOEJBQWdCLENBQUE7SUFDaEIsK0JBQWlCLENBQUE7QUFDckIsQ0FBQyxFQUhXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBR3JCO0FBbUNELE1BQXNCLFFBQVMsU0FBUSxHQUFHLENBQUMsUUFBUTtJQUkvQyxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUE7UUFDWixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUE7SUFDMUIsQ0FBQztDQUdKO0FBWEQsNEJBV0M7QUFHRCxNQUFhLG1CQUFvQixTQUFRLFFBQVE7SUFDN0MsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUErQjtRQUN6RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUE7UUFDbEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQTtJQUNwRCxDQUFDO0lBS0QsT0FBTztRQUNILE9BQU87WUFDSCxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixxQkFBcUIsRUFBRTtnQkFDbkIsdUJBQXVCLEVBQUU7b0JBQ3JCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtvQkFDM0IsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtpQkFDNUM7YUFDSjtTQUNKLENBQUE7SUFDTCxDQUFDO0NBQ0o7QUF0QkQsa0RBc0JDO0FBRUQsTUFBYSxtQkFBb0IsU0FBUSxRQUFRO0lBQzdDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBK0I7UUFDekUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFBO1FBQ2xDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUE7UUFDaEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFBO0lBQ2hELENBQUM7SUFNRCxPQUFPO1FBQ0gsT0FBTztZQUNILEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNYLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNiLHFCQUFxQixFQUFFO2dCQUNuQix1QkFBdUIsRUFBRTtvQkFDckIsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO29CQUMzQixpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCO29CQUN6QyxlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWU7aUJBQ3hDO2FBQ0o7U0FDSixDQUFBO0lBQ0wsQ0FBQztDQUNKO0FBekJELGtEQXlCQztBQUVELE1BQWEscUNBQXNDLFNBQVEsUUFBUTtJQUMvRCxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQWlEO1FBQzNGLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQTtRQUM1QyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUE7UUFDdkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFBO0lBQ2hELENBQUM7SUFNRCxPQUFPO1FBQ0gsT0FBTztZQUNILEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNYLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNiLHFCQUFxQixFQUFFO2dCQUNuQix5Q0FBeUMsRUFBRTtvQkFDdkMsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO29CQUNyQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7b0JBQy9CLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZTtpQkFDeEM7YUFDSjtTQUNKLENBQUE7SUFDTCxDQUFDO0NBQ0o7QUF6QkQsc0ZBeUJDO0FBR0QsTUFBYSw4QkFBK0IsU0FBUSxRQUFRO0lBQ3hELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBMEM7UUFDcEYsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFBO1FBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQTtRQUN2QyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUE7SUFDaEQsQ0FBQztJQU1ELE9BQU87UUFDSCxPQUFPO1lBQ0gsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YscUJBQXFCLEVBQUU7Z0JBQ25CLGtDQUFrQyxFQUFFO29CQUNoQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7b0JBQ2pCLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtvQkFDL0IsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO2lCQUN4QzthQUNKO1NBQ0osQ0FBQTtJQUNMLENBQUM7Q0FDSjtBQXpCRCx3RUF5QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgZ2cgZnJvbSAnQGF3cy1jZGsvYXdzLWdyZWVuZ3Jhc3MnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlc291cmNlUHJvcHMge1xuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZ1xufVxuXG5leHBvcnQgZW51bSBQZXJtaXNzaW9uIHtcbiAgICBSRUFEX09OTFkgPSAncm8nLFxuICAgIFJFQURfV1JJVEUgPSAncncnXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3duZXJTZXR0aW5nIHtcbiAgICByZWFkb25seSBncm91cE93bmVyOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgZ3JvdXBQZXJtaXNzaW9uOiBQZXJtaXNzaW9uXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR3JvdXBPd25lclNldHRpbmcgIHtcbiAgICByZWFkb25seSBncm91cE93bmVyPzogc3RyaW5nLFxuICAgIHJlYWRvbmx5IGF1dG9BZGRHcm91cE93bmVyOiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9jYWxEZXZpY2VSZXNvdXJjZVByb3BzIGV4dGVuZHMgUmVzb3VyY2VQcm9wcyB7XG4gICAgcmVhZG9ubHkgc291cmNlUGF0aDogc3RyaW5nLFxuICAgIHJlYWRvbmx5IGdyb3VwT3duZXJTZXR0aW5nOiBHcm91cE93bmVyU2V0dGluZ1xufVxuZXhwb3J0IGludGVyZmFjZSBMb2NhbFZvbHVtZVJlc291cmNlUHJvcHMgZXh0ZW5kcyBSZXNvdXJjZVByb3BzIHtcbiAgICByZWFkb25seSBzb3VyY2VQYXRoOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgZGVzdGluYXRpb25QYXRoOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgZ3JvdXBPd25lclNldHRpbmc6IEdyb3VwT3duZXJTZXR0aW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2FnZU1ha2VyTWFjaGluZUxlYXJuaW5nTW9kZWxSZXNvdXJjZVByb3BzIGV4dGVuZHMgUmVzb3VyY2VQcm9wcyB7XG4gICAgcmVhZG9ubHkgc2FnZU1ha2VySm9iQXJuOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgZGVzdGluYXRpb25QYXRoOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgb3duZXJTZXR0aW5nczogT3duZXJTZXR0aW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUzNNYWNoaW5lTGVhcm5pbmdNb2RlbFJlc291cmNlUHJvcHMgZXh0ZW5kcyBSZXNvdXJjZVByb3BzIHtcbiAgICByZWFkb25seSBzM1VyaTogc3RyaW5nLFxuICAgIHJlYWRvbmx5IGRlc3RpbmF0aW9uUGF0aDogc3RyaW5nXG4gICAgcmVhZG9ubHkgb3duZXJTZXR0aW5nczogT3duZXJTZXR0aW5nXG59XG5cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlc291cmNlIGV4dGVuZHMgY2RrLlJlc291cmNlIHtcbiAgICByZWFkb25seSBpZDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUmVzb3VyY2VQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpXG4gICAgICAgIHRoaXMuaWQgPSBpZFxuICAgICAgICB0aGlzLm5hbWUgPSBwcm9wcy5uYW1lXG4gICAgfVxuXG4gICAgYWJzdHJhY3QgcmVzb2x2ZSgpOiBnZy5DZm5SZXNvdXJjZURlZmluaXRpb24uUmVzb3VyY2VJbnN0YW5jZVByb3BlcnR5O1xufSBcblxuXG5leHBvcnQgY2xhc3MgTG9jYWxEZXZpY2VSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IExvY2FsRGV2aWNlUmVzb3VyY2VQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKVxuICAgICAgICB0aGlzLnNvdXJjZVBhdGggPSBwcm9wcy5zb3VyY2VQYXRoXG4gICAgICAgIHRoaXMuZ3JvdXBPd25lclNldHRpbmcgPSBwcm9wcy5ncm91cE93bmVyU2V0dGluZ1xuICAgIH1cblxuICAgIHJlYWRvbmx5IHNvdXJjZVBhdGg6IHN0cmluZztcbiAgICByZWFkb25seSBncm91cE93bmVyU2V0dGluZzogR3JvdXBPd25lclNldHRpbmc7XG5cbiAgICByZXNvbHZlKCk6IGdnLkNmblJlc291cmNlRGVmaW5pdGlvbi5SZXNvdXJjZUluc3RhbmNlUHJvcGVydHkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICByZXNvdXJjZURhdGFDb250YWluZXI6IHtcbiAgICAgICAgICAgICAgICBsb2NhbERldmljZVJlc291cmNlRGF0YToge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VQYXRoOiB0aGlzLnNvdXJjZVBhdGgsXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwT3duZXJTZXR0aW5nOiB0aGlzLmdyb3VwT3duZXJTZXR0aW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTG9jYWxWb2x1bWVSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IExvY2FsVm9sdW1lUmVzb3VyY2VQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKVxuICAgICAgICB0aGlzLnNvdXJjZVBhdGggPSBwcm9wcy5zb3VyY2VQYXRoXG4gICAgICAgIHRoaXMuZ3JvdXBPd25lclNldHRpbmcgPSBwcm9wcy5ncm91cE93bmVyU2V0dGluZ1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uUGF0aCA9IHByb3BzLmRlc3RpbmF0aW9uUGF0aFxuICAgIH1cblxuICAgIHJlYWRvbmx5IHNvdXJjZVBhdGg6IHN0cmluZztcbiAgICByZWFkb25seSBkZXN0aW5hdGlvblBhdGg6IHN0cmluZztcbiAgICByZWFkb25seSBncm91cE93bmVyU2V0dGluZzogR3JvdXBPd25lclNldHRpbmc7XG5cbiAgICByZXNvbHZlKCk6IGdnLkNmblJlc291cmNlRGVmaW5pdGlvbi5SZXNvdXJjZUluc3RhbmNlUHJvcGVydHkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBuYW1lOiB0aGlzLmlkLFxuICAgICAgICAgICAgcmVzb3VyY2VEYXRhQ29udGFpbmVyOiB7XG4gICAgICAgICAgICAgICAgbG9jYWxWb2x1bWVSZXNvdXJjZURhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlUGF0aDogdGhpcy5zb3VyY2VQYXRoLFxuICAgICAgICAgICAgICAgICAgICBncm91cE93bmVyU2V0dGluZzogdGhpcy5ncm91cE93bmVyU2V0dGluZyxcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25QYXRoOiB0aGlzLmRlc3RpbmF0aW9uUGF0aFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNhZ2VNYWtlck1hY2hpbmVMZWFybmluZ01vZGVsUmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTYWdlTWFrZXJNYWNoaW5lTGVhcm5pbmdNb2RlbFJlc291cmNlUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcylcbiAgICAgICAgdGhpcy5zYWdlTWFrZXJKb2JBcm4gPSBwcm9wcy5zYWdlTWFrZXJKb2JBcm5cbiAgICAgICAgdGhpcy5vd25lclNldHRpbmcgPSBwcm9wcy5vd25lclNldHRpbmdzXG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25QYXRoID0gcHJvcHMuZGVzdGluYXRpb25QYXRoXG4gICAgfVxuXG4gICAgcmVhZG9ubHkgc2FnZU1ha2VySm9iQXJuOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZGVzdGluYXRpb25QYXRoOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgb3duZXJTZXR0aW5nOiBPd25lclNldHRpbmc7XG5cbiAgICByZXNvbHZlKCk6IGdnLkNmblJlc291cmNlRGVmaW5pdGlvbi5SZXNvdXJjZUluc3RhbmNlUHJvcGVydHkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBuYW1lOiB0aGlzLmlkLFxuICAgICAgICAgICAgcmVzb3VyY2VEYXRhQ29udGFpbmVyOiB7XG4gICAgICAgICAgICAgICAgc2FnZU1ha2VyTWFjaGluZUxlYXJuaW5nTW9kZWxSZXNvdXJjZURhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc2FnZU1ha2VySm9iQXJuOiB0aGlzLnNhZ2VNYWtlckpvYkFybixcbiAgICAgICAgICAgICAgICAgICAgb3duZXJTZXR0aW5nOiB0aGlzLm93bmVyU2V0dGluZyxcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25QYXRoOiB0aGlzLmRlc3RpbmF0aW9uUGF0aFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgUzNNYWNoaW5lTGVhcm5pbmdNb2RlbFJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUzNNYWNoaW5lTGVhcm5pbmdNb2RlbFJlc291cmNlUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcylcbiAgICAgICAgdGhpcy5zM1VyaSA9IHByb3BzLnMzVXJpXG4gICAgICAgIHRoaXMub3duZXJTZXR0aW5nID0gcHJvcHMub3duZXJTZXR0aW5nc1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uUGF0aCA9IHByb3BzLmRlc3RpbmF0aW9uUGF0aFxuICAgIH1cblxuICAgIHJlYWRvbmx5IHMzVXJpOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZGVzdGluYXRpb25QYXRoOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgb3duZXJTZXR0aW5nOiBPd25lclNldHRpbmc7XG5cbiAgICByZXNvbHZlKCk6IGdnLkNmblJlc291cmNlRGVmaW5pdGlvbi5SZXNvdXJjZUluc3RhbmNlUHJvcGVydHkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICByZXNvdXJjZURhdGFDb250YWluZXI6IHtcbiAgICAgICAgICAgICAgICBzM01hY2hpbmVMZWFybmluZ01vZGVsUmVzb3VyY2VEYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHMzVXJpOiB0aGlzLnMzVXJpLFxuICAgICAgICAgICAgICAgICAgICBvd25lclNldHRpbmc6IHRoaXMub3duZXJTZXR0aW5nLFxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvblBhdGg6IHRoaXMuZGVzdGluYXRpb25QYXRoXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSJdfQ==