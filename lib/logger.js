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
exports.AWSCloudWatchUserLambdaLogger = exports.AWSCloudWatchGreengrassLogger = exports.LocalUserLambdaLogger = exports.LocalGreengrassLogger = exports.LoggerBase = exports.Logger = void 0;
const cdk = require("@aws-cdk/core");
var Logger;
(function (Logger) {
    let Component;
    (function (Component) {
        Component["LAMBDA"] = "Lambda";
        Component["GREENGRASS"] = "GreengrassSystem";
    })(Component = Logger.Component || (Logger.Component = {}));
    let LogLevel;
    (function (LogLevel) {
        LogLevel["ERROR"] = "ERROR";
        LogLevel["DEBUG"] = "DEBUG";
        LogLevel["INFO"] = "INFO";
        LogLevel["WARN"] = "WARN";
        LogLevel["FATAL"] = "FATAL";
    })(LogLevel = Logger.LogLevel || (Logger.LogLevel = {}));
})(Logger = exports.Logger || (exports.Logger = {}));
var LoggerType;
(function (LoggerType) {
    LoggerType["LOCAL"] = "FileSystem";
    LoggerType["CLOUD"] = "AWSCloudWatch";
})(LoggerType || (LoggerType = {}));
class LoggerBase extends cdk.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        this.level = props.level;
        this.id = id;
    }
}
exports.LoggerBase = LoggerBase;
class LocalLogger extends LoggerBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.space = props.space;
    }
}
class LocalGreengrassLogger extends LocalLogger {
    resolve() {
        return {
            id: this.id,
            component: Logger.Component.GREENGRASS,
            level: this.level,
            type: LoggerType.LOCAL,
            space: this.space.toKibibytes()
        };
    }
}
exports.LocalGreengrassLogger = LocalGreengrassLogger;
class LocalUserLambdaLogger extends LocalLogger {
    resolve() {
        return {
            id: this.id,
            component: Logger.Component.LAMBDA,
            level: this.level,
            type: LoggerType.LOCAL,
            space: this.space.toKibibytes()
        };
    }
}
exports.LocalUserLambdaLogger = LocalUserLambdaLogger;
class AWSCloudWatchGreengrassLogger extends LoggerBase {
    resolve() {
        return {
            id: this.id,
            component: Logger.Component.GREENGRASS,
            level: this.level,
            type: LoggerType.CLOUD,
        };
    }
}
exports.AWSCloudWatchGreengrassLogger = AWSCloudWatchGreengrassLogger;
class AWSCloudWatchUserLambdaLogger extends LoggerBase {
    resolve() {
        return {
            id: this.id,
            component: Logger.Component.LAMBDA,
            level: this.level,
            type: LoggerType.CLOUD,
        };
    }
}
exports.AWSCloudWatchUserLambdaLogger = AWSCloudWatchUserLambdaLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7O0FBRUgscUNBQXFDO0FBSXJDLElBQWlCLE1BQU0sQ0FhdEI7QUFiRCxXQUFpQixNQUFNO0lBQ25CLElBQVksU0FHWDtJQUhELFdBQVksU0FBUztRQUNqQiw4QkFBaUIsQ0FBQTtRQUNqQiw0Q0FBK0IsQ0FBQTtJQUNuQyxDQUFDLEVBSFcsU0FBUyxHQUFULGdCQUFTLEtBQVQsZ0JBQVMsUUFHcEI7SUFFRCxJQUFZLFFBTVg7SUFORCxXQUFZLFFBQVE7UUFDaEIsMkJBQWUsQ0FBQTtRQUNmLDJCQUFlLENBQUE7UUFDZix5QkFBYSxDQUFBO1FBQ2IseUJBQWEsQ0FBQTtRQUNiLDJCQUFlLENBQUE7SUFDbkIsQ0FBQyxFQU5XLFFBQVEsR0FBUixlQUFRLEtBQVIsZUFBUSxRQU1uQjtBQUNMLENBQUMsRUFiZ0IsTUFBTSxHQUFOLGNBQU0sS0FBTixjQUFNLFFBYXRCO0FBRUQsSUFBSyxVQUdKO0FBSEQsV0FBSyxVQUFVO0lBQ1gsa0NBQW9CLENBQUE7SUFDcEIscUNBQXVCLENBQUE7QUFDM0IsQ0FBQyxFQUhJLFVBQVUsS0FBVixVQUFVLFFBR2Q7QUFVRCxNQUFzQixVQUFXLFNBQVEsR0FBRyxDQUFDLFFBQVE7SUFJakQsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNqQixDQUFDO0NBR0o7QUFYRCxnQ0FXQztBQUVELE1BQWUsV0FBWSxTQUFRLFVBQVU7SUFHekMsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUF1QjtRQUNqRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDN0IsQ0FBQztDQUNKO0FBRUQsTUFBYSxxQkFBc0IsU0FBUSxXQUFXO0lBQ2xELE9BQU87UUFDSCxPQUFPO1lBQ0gsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ1gsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVTtZQUN0QyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsSUFBSSxFQUFFLFVBQVUsQ0FBQyxLQUFLO1lBQ3RCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtTQUNsQyxDQUFBO0lBQ0wsQ0FBQztDQUNKO0FBVkQsc0RBVUM7QUFFRCxNQUFhLHFCQUFzQixTQUFRLFdBQVc7SUFDbEQsT0FBTztRQUNILE9BQU87WUFDSCxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDWCxTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNO1lBQ2xDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQUs7WUFDdEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO1NBQ2xDLENBQUE7SUFDTCxDQUFDO0NBQ0o7QUFWRCxzREFVQztBQUVELE1BQWEsNkJBQThCLFNBQVEsVUFBVTtJQUN6RCxPQUFPO1FBQ0gsT0FBTztZQUNILEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNYLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVU7WUFDdEMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSztTQUN6QixDQUFBO0lBQ0wsQ0FBQztDQUNKO0FBVEQsc0VBU0M7QUFFRCxNQUFhLDZCQUE4QixTQUFRLFVBQVU7SUFDekQsT0FBTztRQUNILE9BQU87WUFDSCxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDWCxTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNO1lBQ2xDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQUs7U0FDekIsQ0FBQTtJQUNMLENBQUM7Q0FDSjtBQVRELHNFQVNDIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7ICBTaXplIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBnZyBmcm9tICdAYXdzLWNkay9hd3MtZ3JlZW5ncmFzcyc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgTG9nZ2VyIHtcbiAgICBleHBvcnQgZW51bSBDb21wb25lbnQge1xuICAgICAgICBMQU1CREEgPSAnTGFtYmRhJyxcbiAgICAgICAgR1JFRU5HUkFTUyA9ICdHcmVlbmdyYXNzU3lzdGVtJ1xuICAgIH1cblxuICAgIGV4cG9ydCBlbnVtIExvZ0xldmVsIHtcbiAgICAgICAgRVJST1IgPSAnRVJST1InLFxuICAgICAgICBERUJVRyA9ICdERUJVRycsXG4gICAgICAgIElORk8gPSAnSU5GTycsXG4gICAgICAgIFdBUk4gPSAnV0FSTicsXG4gICAgICAgIEZBVEFMID0gJ0ZBVEFMJ1xuICAgIH0gICBcbn1cblxuZW51bSBMb2dnZXJUeXBlIHtcbiAgICBMT0NBTCA9ICdGaWxlU3lzdGVtJyxcbiAgICBDTE9VRCA9ICdBV1NDbG91ZFdhdGNoJ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExvZ2dlclByb3BzIHtcbiAgICByZWFkb25seSBsZXZlbDogTG9nZ2VyLkxvZ0xldmVsLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExvY2FsTG9nZ2VyUHJvcHMgZXh0ZW5kcyBMb2dnZXJQcm9wcyB7XG4gICAgcmVhZG9ubHkgc3BhY2U6IGNkay5TaXplO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTG9nZ2VyQmFzZSBleHRlbmRzIGNkay5SZXNvdXJjZSB7XG4gICAgcmVhZG9ubHkgbGV2ZWw6IExvZ2dlci5Mb2dMZXZlbDtcbiAgICBwcm90ZWN0ZWQgaWQ6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTG9nZ2VyUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICAgICAgdGhpcy5sZXZlbCA9IHByb3BzLmxldmVsO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgcmVzb2x2ZSgpOiBnZy5DZm5Mb2dnZXJEZWZpbml0aW9uLkxvZ2dlclByb3BlcnR5O1xufVxuXG5hYnN0cmFjdCBjbGFzcyBMb2NhbExvZ2dlciBleHRlbmRzIExvZ2dlckJhc2Uge1xuICAgIHJlYWRvbmx5IHNwYWNlOiBTaXplO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTG9jYWxMb2dnZXJQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICAgICAgdGhpcy5zcGFjZSA9IHByb3BzLnNwYWNlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIExvY2FsR3JlZW5ncmFzc0xvZ2dlciBleHRlbmRzIExvY2FsTG9nZ2VyIHtcbiAgICByZXNvbHZlKCk6IGdnLkNmbkxvZ2dlckRlZmluaXRpb24uTG9nZ2VyUHJvcGVydHkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBjb21wb25lbnQ6IExvZ2dlci5Db21wb25lbnQuR1JFRU5HUkFTUyxcbiAgICAgICAgICAgIGxldmVsOiB0aGlzLmxldmVsLFxuICAgICAgICAgICAgdHlwZTogTG9nZ2VyVHlwZS5MT0NBTCxcbiAgICAgICAgICAgIHNwYWNlOiB0aGlzLnNwYWNlLnRvS2liaWJ5dGVzKClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIExvY2FsVXNlckxhbWJkYUxvZ2dlciBleHRlbmRzIExvY2FsTG9nZ2VyIHtcbiAgICByZXNvbHZlKCk6IGdnLkNmbkxvZ2dlckRlZmluaXRpb24uTG9nZ2VyUHJvcGVydHkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBjb21wb25lbnQ6IExvZ2dlci5Db21wb25lbnQuTEFNQkRBLFxuICAgICAgICAgICAgbGV2ZWw6IHRoaXMubGV2ZWwsXG4gICAgICAgICAgICB0eXBlOiBMb2dnZXJUeXBlLkxPQ0FMLFxuICAgICAgICAgICAgc3BhY2U6IHRoaXMuc3BhY2UudG9LaWJpYnl0ZXMoKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQVdTQ2xvdWRXYXRjaEdyZWVuZ3Jhc3NMb2dnZXIgZXh0ZW5kcyBMb2dnZXJCYXNlIHtcbiAgICByZXNvbHZlKCk6IGdnLkNmbkxvZ2dlckRlZmluaXRpb24uTG9nZ2VyUHJvcGVydHkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBjb21wb25lbnQ6IExvZ2dlci5Db21wb25lbnQuR1JFRU5HUkFTUyxcbiAgICAgICAgICAgIGxldmVsOiB0aGlzLmxldmVsLFxuICAgICAgICAgICAgdHlwZTogTG9nZ2VyVHlwZS5DTE9VRCxcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFXU0Nsb3VkV2F0Y2hVc2VyTGFtYmRhTG9nZ2VyIGV4dGVuZHMgTG9nZ2VyQmFzZSB7XG4gICAgcmVzb2x2ZSgpOiBnZy5DZm5Mb2dnZXJEZWZpbml0aW9uLkxvZ2dlclByb3BlcnR5IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICAgICAgY29tcG9uZW50OiBMb2dnZXIuQ29tcG9uZW50LkxBTUJEQSxcbiAgICAgICAgICAgIGxldmVsOiB0aGlzLmxldmVsLFxuICAgICAgICAgICAgdHlwZTogTG9nZ2VyVHlwZS5DTE9VRCxcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=