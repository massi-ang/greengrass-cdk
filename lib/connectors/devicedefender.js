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
exports.DeviceDefender = void 0;
const connector_1 = require("../connector");
class DeviceDefender extends connector_1.Connector {
    constructor(scope, id, props) {
        super(scope, id);
        this._parameters = props;
    }
    get parameters() {
        return this._parameters;
    }
    get connectorArn() {
        return "arn:aws:greengrass:region::/connectors/DeviceDefender/versions/3";
    }
}
exports.DeviceDefender = DeviceDefender;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2aWNlZGVmZW5kZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZXZpY2VkZWZlbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7OztBQUVILDRDQUF3RDtBQVF4RCxNQUFhLGNBQWUsU0FBUSxxQkFBUztJQUV6QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW1DO1FBQ3pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDaEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQUksVUFBVTtRQUNWLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBSSxZQUFZO1FBQ1osT0FBTyxrRUFBa0UsQ0FBQTtJQUM3RSxDQUFDO0NBQ0o7QUFkRCx3Q0FjQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIFxuICogIENvcHlyaWdodCAyMDIwIEFtYXpvbi5jb20gb3IgaXRzIGFmZmlsaWF0ZXNcbiAqICBcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqICBcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqICBcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb25uZWN0b3IsIENvbm5lY3RvclByb3BzIH0gZnJvbSAnLi4vY29ubmVjdG9yJ1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnQGF3cy1jZGsvY29yZSdcbmV4cG9ydCBpbnRlcmZhY2UgRGV2aWNlRGVmZW5kZXJDb25uZWN0b3JQcm9wcyBleHRlbmRzIENvbm5lY3RvclByb3BzIHtcbiAgICByZWFkb25seSBzYW1wbGVJbnRlcnZhbFNlY29uZHM6IHN0cmluZztcbiAgICByZWFkb25seSBwcm9jRGVzdGluYXRpb25QYXRoUmVzb3VyY2VJZDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHByb2NEZXN0aW5hdGlvblBhdGg6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIERldmljZURlZmVuZGVyIGV4dGVuZHMgQ29ubmVjdG9yIHtcbiAgICBwcml2YXRlIF9wYXJhbWV0ZXJzOiBhbnk7XG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IERldmljZURlZmVuZGVyQ29ubmVjdG9yUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKVxuICAgICAgICB0aGlzLl9wYXJhbWV0ZXJzID0gcHJvcHM7XG4gICAgfVxuXG4gICAgZ2V0IHBhcmFtZXRlcnMoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmFtZXRlcnM7XG4gICAgfVxuXG4gICAgZ2V0IGNvbm5lY3RvckFybigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gXCJhcm46YXdzOmdyZWVuZ3Jhc3M6cmVnaW9uOjovY29ubmVjdG9ycy9EZXZpY2VEZWZlbmRlci92ZXJzaW9ucy8zXCJcbiAgICB9XG59XG5cbiJdfQ==