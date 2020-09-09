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
    merge(subscriptions) {
        if (subscriptions) {
            this.subscriptionList.concat(subscriptions.subscriptionList);
        }
        return this;
    }
    clear() {
        this.subscriptionList.splice(0, this.subscriptionList.length);
    }
    resolve() {
        let source;
        let target;
        const res = this.subscriptionList.map((s, i) => {
            if ('lambdaFunction' in s.source) {
                let f = s.source;
                source = f.lambdaFunction.functionArn + ':' + f.reference;
            }
            else if ('thing' in s.source) {
                let d = s.source;
                source = d.thing.getAtt('arn').toString();
            }
            else {
                let d = s.source;
                source = d.arn;
            }
            if ('lambdaFunction' in s.target) {
                let f = s.target;
                target = f.lambdaFunction.functionArn + ':' + f.reference;
            }
            else if ('thing' in s.target) {
                let d = s.target;
                target = d.thing.getAtt('arn').toString();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3Vic2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7O0FBRUgscUNBQXFDO0FBS3JDLE1BQXNCLG1CQUFtQjtDQUV4QztBQUZELGtEQUVDO0FBRUQsTUFBYSxXQUFZLFNBQVEsbUJBQW1CO0lBQ2hELElBQUksR0FBRztRQUNILE9BQU8sT0FBTyxDQUFBO0lBQ2xCLENBQUM7Q0FDSjtBQUpELGtDQUlDO0FBRUQsTUFBYSxXQUFZLFNBQVEsbUJBQW1CO0lBQ2hELElBQUksR0FBRztRQUNILE9BQU8saUJBQWlCLENBQUE7SUFDNUIsQ0FBQztDQUNKO0FBSkQsa0NBSUM7QUFlRCxNQUFhLGFBQWMsU0FBUSxHQUFHLENBQUMsUUFBUTtJQUczQyxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQTBCO1FBQ3BFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakIsSUFBSSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsYUFBYSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFNLENBQUMsYUFBYSxDQUFDO1NBQ2hEO2FBQU07WUFDSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFBO1NBQzdCO0lBQ0wsQ0FBQztJQUVELEdBQUcsQ0FBQyxNQUFtQixFQUFFLEtBQWEsRUFBRSxNQUFtQjtRQUN2RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsTUFBTSxFQUFFLE1BQU07WUFDZCxLQUFLLEVBQUUsS0FBSztTQUNmLENBQUMsQ0FBQTtRQUNGLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBNkI7UUFDL0IsSUFBSSxhQUFhLEVBQUU7WUFDZixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ2hFO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsS0FBSztRQUNELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsT0FBTztRQUVILElBQUksTUFBYyxDQUFDO1FBQ25CLElBQUksTUFBYyxDQUFDO1FBRW5CLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFFM0MsSUFBSSxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUM5QixJQUFJLENBQUMsR0FBSSxDQUFDLENBQUMsTUFBbUIsQ0FBQztnQkFDL0IsTUFBTSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO2FBQzdEO2lCQUFNLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQyxNQUFpQixDQUFBO2dCQUM1QixNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7YUFDNUM7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLEdBQUksQ0FBQyxDQUFDLE1BQThCLENBQUM7Z0JBQzFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFBO2FBQ2pCO1lBRUQsSUFBSSxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUM5QixJQUFJLENBQUMsR0FBSSxDQUFDLENBQUMsTUFBbUIsQ0FBQztnQkFDL0IsTUFBTSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO2FBQzdEO2lCQUFNLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQyxNQUFpQixDQUFBO2dCQUM1QixNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7YUFDNUM7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLEdBQUksQ0FBQyxDQUFDLE1BQThCLENBQUM7Z0JBQzFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFBO2FBQ2pCO1lBQ0QsT0FBTztnQkFDSCxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ1YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLO2FBQ25CLENBQUE7UUFDTCxDQUFDLENBQUMsQ0FBQTtRQUNGLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztDQUNKO0FBckVELHNDQXFFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIFxuICogIENvcHlyaWdodCAyMDIwIEFtYXpvbi5jb20gb3IgaXRzIGFmZmlsaWF0ZXNcbiAqICBcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqICBcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqICBcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBGdW5jdGlvbiB9IGZyb20gJy4vZnVuY3Rpb25zJztcbmltcG9ydCB7IERldmljZSB9IGZyb20gJy4vZGV2aWNlJztcbmltcG9ydCAqIGFzIGdnIGZyb20gJ0Bhd3MtY2RrL2F3cy1ncmVlbmdyYXNzJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIERlc3RpbmF0aW9uSW50ZXJuYWwge1xuICAgIGFic3RyYWN0IGdldCBhcm4oKTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgQVdTSW9UQ2xvdWQgZXh0ZW5kcyBEZXN0aW5hdGlvbkludGVybmFsIHtcbiAgICBnZXQgYXJuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcImNsb3VkXCJcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2NhbFNoYWRvdyBleHRlbmRzIERlc3RpbmF0aW9uSW50ZXJuYWwge1xuICAgIGdldCBhcm4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwiR0dTaGFkb3dTZXJ2aWNlXCJcbiAgICB9XG59XG5cbnR5cGUgRGVzdGluYXRpb24gPSBBV1NJb1RDbG91ZCB8IExvY2FsU2hhZG93IHwgRnVuY3Rpb24gfCBEZXZpY2VcblxuXG5leHBvcnQgaW50ZXJmYWNlIFN1YnNjcmlwdGlvblByb3BzIHtcbiAgICByZWFkb25seSB0b3BpYzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHNvdXJjZTogRGVzdGluYXRpb247XG4gICAgcmVhZG9ubHkgdGFyZ2V0OiBEZXN0aW5hdGlvbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdWJzY3JpcHRpb25zUHJvcHMge1xuICAgIHJlYWRvbmx5IHN1YnNjcmlwdGlvbnM/OiBTdWJzY3JpcHRpb25Qcm9wc1tdO1xufVxuXG5leHBvcnQgY2xhc3MgU3Vic2NyaXB0aW9ucyBleHRlbmRzIGNkay5SZXNvdXJjZSB7XG4gICAgcmVhZG9ubHkgc3Vic2NyaXB0aW9uTGlzdDogU3Vic2NyaXB0aW9uUHJvcHNbXTtcblxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN1YnNjcmlwdGlvbnNQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgICAgICBpZiAocHJvcHM/LnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uTGlzdCA9IHByb3BzIS5zdWJzY3JpcHRpb25zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25MaXN0ID0gW11cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZChzb3VyY2U6IERlc3RpbmF0aW9uLCB0b3BpYzogc3RyaW5nLCB0YXJnZXQ6IERlc3RpbmF0aW9uKTogU3Vic2NyaXB0aW9ucyB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uTGlzdC5wdXNoKHtcbiAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICB0b3BpYzogdG9waWNcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbWVyZ2Uoc3Vic2NyaXB0aW9ucz86IFN1YnNjcmlwdGlvbnMpOiBTdWJzY3JpcHRpb25zIHtcbiAgICAgICAgaWYgKHN1YnNjcmlwdGlvbnMpIHsgXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkxpc3QuY29uY2F0KHN1YnNjcmlwdGlvbnMuc3Vic2NyaXB0aW9uTGlzdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25MaXN0LnNwbGljZSgwLCB0aGlzLnN1YnNjcmlwdGlvbkxpc3QubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXNvbHZlKCk6IGdnLkNmblN1YnNjcmlwdGlvbkRlZmluaXRpb24uU3Vic2NyaXB0aW9uUHJvcGVydHlbXSB7XG5cbiAgICAgICAgbGV0IHNvdXJjZTogc3RyaW5nO1xuICAgICAgICBsZXQgdGFyZ2V0OiBzdHJpbmc7XG5cbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy5zdWJzY3JpcHRpb25MaXN0Lm1hcCgocywgaSkgPT4ge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoJ2xhbWJkYUZ1bmN0aW9uJyBpbiBzLnNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGxldCBmID0gKHMuc291cmNlIGFzIEZ1bmN0aW9uKTtcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBmLmxhbWJkYUZ1bmN0aW9uLmZ1bmN0aW9uQXJuICsgJzonICsgZi5yZWZlcmVuY2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCd0aGluZycgaW4gcy5zb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBsZXQgZCA9IChzLnNvdXJjZSBhcyBEZXZpY2UpXG4gICAgICAgICAgICAgICAgc291cmNlID0gZC50aGluZy5nZXRBdHQoJ2FybicpLnRvU3RyaW5nKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGQgPSAocy5zb3VyY2UgYXMgRGVzdGluYXRpb25JbnRlcm5hbCk7XG4gICAgICAgICAgICAgICAgc291cmNlID0gZC5hcm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCdsYW1iZGFGdW5jdGlvbicgaW4gcy50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICBsZXQgZiA9IChzLnRhcmdldCBhcyBGdW5jdGlvbik7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gZi5sYW1iZGFGdW5jdGlvbi5mdW5jdGlvbkFybiArICc6JyArIGYucmVmZXJlbmNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgndGhpbmcnIGluIHMudGFyZ2V0KSB7IFxuICAgICAgICAgICAgICAgIGxldCBkID0gKHMudGFyZ2V0IGFzIERldmljZSkgXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gZC50aGluZy5nZXRBdHQoJ2FybicpLnRvU3RyaW5nKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGQgPSAocy50YXJnZXQgYXMgRGVzdGluYXRpb25JbnRlcm5hbCk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gZC5hcm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaWQ6IGAke2l9YCxcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICAgICAgICBzdWJqZWN0OiBzLnRvcGljXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pICBcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG59XG5cbiJdfQ==