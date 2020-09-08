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
exports.Subscriptions = exports.LocalShadowDestination = exports.CloudDestination = exports.DestinationInternal = void 0;
const cdk = require("@aws-cdk/core");
class DestinationInternal {
}
exports.DestinationInternal = DestinationInternal;
class CloudDestination extends DestinationInternal {
    get arn() {
        return "cloud";
    }
}
exports.CloudDestination = CloudDestination;
class LocalShadowDestination extends DestinationInternal {
    get arn() {
        return "GGShadowService";
    }
}
exports.LocalShadowDestination = LocalShadowDestination;
class Subscriptions extends cdk.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        if (props === null || props === void 0 ? void 0 : props.subscriptions) {
            this.subscriptionList = props.subscriptions;
        }
        else {
            this.subscriptionList = [];
        }
    }
    add(source, topic, target) {
        this.subscriptionList.push({
            source: source,
            target: target,
            topic: topic
        });
        return this;
    }
    resolve() {
        let source;
        let target;
        const res = this.subscriptionList.map((s, i) => {
            if ('lambdaFunction' in s.source) {
                let f = s.source;
                source = f.lambdaFunction.functionArn + ':' + f.alias.aliasName;
            }
            else {
                let d = s.source;
                source = d.arn;
            }
            if ('lambdaFunction' in s.target) {
                let f = s.target;
                target = f.lambdaFunction.functionArn + ':' + f.alias.aliasName;
            }
            else {
                let d = s.target;
                target = d.arn;
            }
            return {
                id: `${i}`,
                source: source,
                target: target,
                subject: s.topic
            };
        });
        return res;
    }
}
exports.Subscriptions = Subscriptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3Vic2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7O0FBRUgscUNBQXFDO0FBS3JDLE1BQXNCLG1CQUFtQjtDQUV4QztBQUZELGtEQUVDO0FBRUQsTUFBYSxnQkFBaUIsU0FBUSxtQkFBbUI7SUFDckQsSUFBSSxHQUFHO1FBQ0gsT0FBTyxPQUFPLENBQUE7SUFDbEIsQ0FBQztDQUNKO0FBSkQsNENBSUM7QUFFRCxNQUFhLHNCQUF1QixTQUFRLG1CQUFtQjtJQUMzRCxJQUFJLEdBQUc7UUFDSCxPQUFPLGlCQUFpQixDQUFBO0lBQzVCLENBQUM7Q0FDSjtBQUpELHdEQUlDO0FBZUQsTUFBYSxhQUFjLFNBQVEsR0FBRyxDQUFDLFFBQVE7SUFHM0MsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pCLElBQUksS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBTSxDQUFDLGFBQWEsQ0FBQztTQUNoRDthQUFNO1lBQ0gsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtTQUM3QjtJQUNMLENBQUM7SUFFRCxHQUFHLENBQUMsTUFBbUIsRUFBRSxLQUFhLEVBQUUsTUFBbUI7UUFDdkQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQztZQUN2QixNQUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxNQUFNO1lBQ2QsS0FBSyxFQUFFLEtBQUs7U0FDZixDQUFDLENBQUE7UUFDRixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsT0FBTztRQUVILElBQUksTUFBYyxDQUFDO1FBQ25CLElBQUksTUFBYyxDQUFDO1FBRW5CLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFFM0MsSUFBSSxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUM5QixJQUFJLENBQUMsR0FBSSxDQUFDLENBQUMsTUFBbUIsQ0FBQztnQkFDL0IsTUFBTSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQzthQUNuRTtpQkFBTTtnQkFDSCxJQUFJLENBQUMsR0FBSSxDQUFDLENBQUMsTUFBOEIsQ0FBQztnQkFDMUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUE7YUFDakI7WUFFRCxJQUFJLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQyxNQUFtQixDQUFDO2dCQUMvQixNQUFNLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO2FBQ25FO2lCQUFNO2dCQUNILElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQyxNQUE4QixDQUFDO2dCQUMxQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQTthQUNqQjtZQUNELE9BQU87Z0JBQ0gsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNWLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSzthQUNuQixDQUFBO1FBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDRixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Q0FDSjtBQXBERCxzQ0FvREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRnVuY3Rpb24gfSBmcm9tICcuL2Z1bmN0aW9ucyc7XG5pbXBvcnQgeyBEZXZpY2UgfSBmcm9tICcuL2RldmljZSc7XG5pbXBvcnQgKiBhcyBnZyBmcm9tICdAYXdzLWNkay9hd3MtZ3JlZW5ncmFzcyc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBEZXN0aW5hdGlvbkludGVybmFsIHtcbiAgICBhYnN0cmFjdCBnZXQgYXJuKCk6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIENsb3VkRGVzdGluYXRpb24gZXh0ZW5kcyBEZXN0aW5hdGlvbkludGVybmFsIHtcbiAgICBnZXQgYXJuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcImNsb3VkXCJcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2NhbFNoYWRvd0Rlc3RpbmF0aW9uIGV4dGVuZHMgRGVzdGluYXRpb25JbnRlcm5hbCB7XG4gICAgZ2V0IGFybigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gXCJHR1NoYWRvd1NlcnZpY2VcIlxuICAgIH1cbn1cblxudHlwZSBEZXN0aW5hdGlvbiA9IENsb3VkRGVzdGluYXRpb24gfCBMb2NhbFNoYWRvd0Rlc3RpbmF0aW9uIHwgRnVuY3Rpb24gfCBEZXZpY2VcblxuXG5leHBvcnQgaW50ZXJmYWNlIFN1YnNjcmlwdGlvblByb3BzIHtcbiAgICByZWFkb25seSB0b3BpYzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHNvdXJjZTogRGVzdGluYXRpb247XG4gICAgcmVhZG9ubHkgdGFyZ2V0OiBEZXN0aW5hdGlvbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdWJzY3JpcHRpb25zUHJvcHMge1xuICAgIHJlYWRvbmx5IHN1YnNjcmlwdGlvbnM/OiBTdWJzY3JpcHRpb25Qcm9wc1tdO1xufVxuXG5leHBvcnQgY2xhc3MgU3Vic2NyaXB0aW9ucyBleHRlbmRzIGNkay5SZXNvdXJjZSB7XG4gICAgcmVhZG9ubHkgc3Vic2NyaXB0aW9uTGlzdDogU3Vic2NyaXB0aW9uUHJvcHNbXTtcblxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN1YnNjcmlwdGlvbnNQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgICAgICBpZiAocHJvcHM/LnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uTGlzdCA9IHByb3BzIS5zdWJzY3JpcHRpb25zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25MaXN0ID0gW11cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZChzb3VyY2U6IERlc3RpbmF0aW9uLCB0b3BpYzogc3RyaW5nLCB0YXJnZXQ6IERlc3RpbmF0aW9uKTogU3Vic2NyaXB0aW9ucyB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uTGlzdC5wdXNoKHtcbiAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICB0b3BpYzogdG9waWNcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVzb2x2ZSgpOiBnZy5DZm5TdWJzY3JpcHRpb25EZWZpbml0aW9uLlN1YnNjcmlwdGlvblByb3BlcnR5W10ge1xuXG4gICAgICAgIGxldCBzb3VyY2U6IHN0cmluZztcbiAgICAgICAgbGV0IHRhcmdldDogc3RyaW5nO1xuXG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMuc3Vic2NyaXB0aW9uTGlzdC5tYXAoKHMsIGkpID0+IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCdsYW1iZGFGdW5jdGlvbicgaW4gcy5zb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBsZXQgZiA9IChzLnNvdXJjZSBhcyBGdW5jdGlvbik7XG4gICAgICAgICAgICAgICAgc291cmNlID0gZi5sYW1iZGFGdW5jdGlvbi5mdW5jdGlvbkFybiArICc6JyArIGYuYWxpYXMuYWxpYXNOYW1lO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgZCA9IChzLnNvdXJjZSBhcyBEZXN0aW5hdGlvbkludGVybmFsKTtcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBkLmFyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJ2xhbWJkYUZ1bmN0aW9uJyBpbiBzLnRhcmdldCkge1xuICAgICAgICAgICAgICAgIGxldCBmID0gKHMudGFyZ2V0IGFzIEZ1bmN0aW9uKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBmLmxhbWJkYUZ1bmN0aW9uLmZ1bmN0aW9uQXJuICsgJzonICsgZi5hbGlhcy5hbGlhc05hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBkID0gKHMudGFyZ2V0IGFzIERlc3RpbmF0aW9uSW50ZXJuYWwpO1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IGQuYXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlkOiBgJHtpfWAsXG4gICAgICAgICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICAgICAgc3ViamVjdDogcy50b3BpY1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSAgXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxufVxuXG4iXX0=