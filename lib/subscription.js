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
exports.Subscriptions = exports.LocalShadow = exports.AWSIoTCloud = exports.DestinationInternal = void 0;
const cdk = require("@aws-cdk/core");
class DestinationInternal {
}
exports.DestinationInternal = DestinationInternal;
class AWSIoTCloud extends DestinationInternal {
    get arn() {
        return "cloud";
    }
}
exports.AWSIoTCloud = AWSIoTCloud;
class LocalShadow extends DestinationInternal {
    get arn() {
        return "GGShadowService";
    }
}
exports.LocalShadow = LocalShadow;
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
                source = f.lambdaFunction.functionArn + ':' + f.reference;
            }
            else {
                let d = s.source;
                source = d.arn;
            }
            if ('lambdaFunction' in s.target) {
                let f = s.target;
                target = f.lambdaFunction.functionArn + ':' + f.reference;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3Vic2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7O0FBRUgscUNBQXFDO0FBS3JDLE1BQXNCLG1CQUFtQjtDQUV4QztBQUZELGtEQUVDO0FBRUQsTUFBYSxXQUFZLFNBQVEsbUJBQW1CO0lBQ2hELElBQUksR0FBRztRQUNILE9BQU8sT0FBTyxDQUFBO0lBQ2xCLENBQUM7Q0FDSjtBQUpELGtDQUlDO0FBRUQsTUFBYSxXQUFZLFNBQVEsbUJBQW1CO0lBQ2hELElBQUksR0FBRztRQUNILE9BQU8saUJBQWlCLENBQUE7SUFDNUIsQ0FBQztDQUNKO0FBSkQsa0NBSUM7QUFlRCxNQUFhLGFBQWMsU0FBUSxHQUFHLENBQUMsUUFBUTtJQUczQyxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQTBCO1FBQ3BFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakIsSUFBSSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsYUFBYSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFNLENBQUMsYUFBYSxDQUFDO1NBQ2hEO2FBQU07WUFDSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFBO1NBQzdCO0lBQ0wsQ0FBQztJQUVELEdBQUcsQ0FBQyxNQUFtQixFQUFFLEtBQWEsRUFBRSxNQUFtQjtRQUN2RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsTUFBTSxFQUFFLE1BQU07WUFDZCxLQUFLLEVBQUUsS0FBSztTQUNmLENBQUMsQ0FBQTtRQUNGLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxPQUFPO1FBRUgsSUFBSSxNQUFjLENBQUM7UUFDbkIsSUFBSSxNQUFjLENBQUM7UUFFbkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUUzQyxJQUFJLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQyxNQUFtQixDQUFDO2dCQUMvQixNQUFNLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUM7YUFDN0Q7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLEdBQUksQ0FBQyxDQUFDLE1BQThCLENBQUM7Z0JBQzFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFBO2FBQ2pCO1lBRUQsSUFBSSxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUM5QixJQUFJLENBQUMsR0FBSSxDQUFDLENBQUMsTUFBbUIsQ0FBQztnQkFDL0IsTUFBTSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO2FBQzdEO2lCQUFNO2dCQUNILElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQyxNQUE4QixDQUFDO2dCQUMxQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQTthQUNqQjtZQUNELE9BQU87Z0JBQ0gsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNWLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSzthQUNuQixDQUFBO1FBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDRixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Q0FDSjtBQXBERCxzQ0FvREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRnVuY3Rpb24gfSBmcm9tICcuL2Z1bmN0aW9ucyc7XG5pbXBvcnQgeyBEZXZpY2UgfSBmcm9tICcuL2RldmljZSc7XG5pbXBvcnQgKiBhcyBnZyBmcm9tICdAYXdzLWNkay9hd3MtZ3JlZW5ncmFzcyc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBEZXN0aW5hdGlvbkludGVybmFsIHtcbiAgICBhYnN0cmFjdCBnZXQgYXJuKCk6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEFXU0lvVENsb3VkIGV4dGVuZHMgRGVzdGluYXRpb25JbnRlcm5hbCB7XG4gICAgZ2V0IGFybigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gXCJjbG91ZFwiXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTG9jYWxTaGFkb3cgZXh0ZW5kcyBEZXN0aW5hdGlvbkludGVybmFsIHtcbiAgICBnZXQgYXJuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcIkdHU2hhZG93U2VydmljZVwiXG4gICAgfVxufVxuXG50eXBlIERlc3RpbmF0aW9uID0gQVdTSW9UQ2xvdWQgfCBMb2NhbFNoYWRvdyB8IEZ1bmN0aW9uIHwgRGV2aWNlXG5cblxuZXhwb3J0IGludGVyZmFjZSBTdWJzY3JpcHRpb25Qcm9wcyB7XG4gICAgcmVhZG9ubHkgdG9waWM6IHN0cmluZztcbiAgICByZWFkb25seSBzb3VyY2U6IERlc3RpbmF0aW9uO1xuICAgIHJlYWRvbmx5IHRhcmdldDogRGVzdGluYXRpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3Vic2NyaXB0aW9uc1Byb3BzIHtcbiAgICByZWFkb25seSBzdWJzY3JpcHRpb25zPzogU3Vic2NyaXB0aW9uUHJvcHNbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbnMgZXh0ZW5kcyBjZGsuUmVzb3VyY2Uge1xuICAgIHJlYWRvbmx5IHN1YnNjcmlwdGlvbkxpc3Q6IFN1YnNjcmlwdGlvblByb3BzW107XG5cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdWJzY3JpcHRpb25zUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICAgICAgaWYgKHByb3BzPy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkxpc3QgPSBwcm9wcyEuc3Vic2NyaXB0aW9ucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uTGlzdCA9IFtdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGQoc291cmNlOiBEZXN0aW5hdGlvbiwgdG9waWM6IHN0cmluZywgdGFyZ2V0OiBEZXN0aW5hdGlvbik6IFN1YnNjcmlwdGlvbnMge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkxpc3QucHVzaCh7XG4gICAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgdG9waWM6IHRvcGljXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlc29sdmUoKTogZ2cuQ2ZuU3Vic2NyaXB0aW9uRGVmaW5pdGlvbi5TdWJzY3JpcHRpb25Qcm9wZXJ0eVtdIHtcblxuICAgICAgICBsZXQgc291cmNlOiBzdHJpbmc7XG4gICAgICAgIGxldCB0YXJnZXQ6IHN0cmluZztcblxuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnN1YnNjcmlwdGlvbkxpc3QubWFwKChzLCBpKSA9PiB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICgnbGFtYmRhRnVuY3Rpb24nIGluIHMuc291cmNlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGYgPSAocy5zb3VyY2UgYXMgRnVuY3Rpb24pO1xuICAgICAgICAgICAgICAgIHNvdXJjZSA9IGYubGFtYmRhRnVuY3Rpb24uZnVuY3Rpb25Bcm4gKyAnOicgKyBmLnJlZmVyZW5jZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGQgPSAocy5zb3VyY2UgYXMgRGVzdGluYXRpb25JbnRlcm5hbCk7XG4gICAgICAgICAgICAgICAgc291cmNlID0gZC5hcm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCdsYW1iZGFGdW5jdGlvbicgaW4gcy50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICBsZXQgZiA9IChzLnRhcmdldCBhcyBGdW5jdGlvbik7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gZi5sYW1iZGFGdW5jdGlvbi5mdW5jdGlvbkFybiArICc6JyArIGYucmVmZXJlbmNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgZCA9IChzLnRhcmdldCBhcyBEZXN0aW5hdGlvbkludGVybmFsKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBkLmFyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpZDogYCR7aX1gLFxuICAgICAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgICAgIHN1YmplY3Q6IHMudG9waWNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkgIFxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn1cblxuIl19