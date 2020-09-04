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
        const res = this.subscriptionList.map(s => {
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
                id: `${source}.${s.topic}.${target}`,
                source: source,
                target: target,
                subject: s.topic
            };
        });
        return res;
    }
}
exports.Subscriptions = Subscriptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3Vic2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7O0FBRUgscUNBQXFDO0FBS3JDLE1BQXNCLG1CQUFtQjtDQUV4QztBQUZELGtEQUVDO0FBRUQsTUFBYSxnQkFBaUIsU0FBUSxtQkFBbUI7SUFDckQsSUFBSSxHQUFHO1FBQ0gsT0FBTyxPQUFPLENBQUE7SUFDbEIsQ0FBQztDQUNKO0FBSkQsNENBSUM7QUFFRCxNQUFhLHNCQUF1QixTQUFRLG1CQUFtQjtJQUMzRCxJQUFJLEdBQUc7UUFDSCxPQUFPLGlCQUFpQixDQUFBO0lBQzVCLENBQUM7Q0FDSjtBQUpELHdEQUlDO0FBZUQsTUFBYSxhQUFjLFNBQVEsR0FBRyxDQUFDLFFBQVE7SUFHM0MsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pCLElBQUksS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBTSxDQUFDLGFBQWEsQ0FBQztTQUNoRDthQUFNO1lBQ0gsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtTQUM3QjtJQUNMLENBQUM7SUFFRCxHQUFHLENBQUMsTUFBbUIsRUFBRSxLQUFhLEVBQUUsTUFBbUI7UUFDdkQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQztZQUN2QixNQUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxNQUFNO1lBQ2QsS0FBSyxFQUFFLEtBQUs7U0FDZixDQUFDLENBQUE7UUFDRixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsT0FBTztRQUVILElBQUksTUFBYyxDQUFDO1FBQ25CLElBQUksTUFBYyxDQUFDO1FBRW5CLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFFdEMsSUFBSSxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUM5QixJQUFJLENBQUMsR0FBSSxDQUFDLENBQUMsTUFBbUIsQ0FBQztnQkFDL0IsTUFBTSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQzthQUNuRTtpQkFBTTtnQkFDSCxJQUFJLENBQUMsR0FBSSxDQUFDLENBQUMsTUFBOEIsQ0FBQztnQkFDMUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUE7YUFDakI7WUFFRCxJQUFJLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQyxNQUFtQixDQUFDO2dCQUMvQixNQUFNLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO2FBQ25FO2lCQUFNO2dCQUNILElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQyxNQUE4QixDQUFDO2dCQUMxQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQTthQUNqQjtZQUNELE9BQU87Z0JBQ0gsRUFBRSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsQ0FBQyxLQUFLLElBQUksTUFBTSxFQUFFO2dCQUNwQyxNQUFNLEVBQUUsTUFBTTtnQkFDZCxNQUFNLEVBQUUsTUFBTTtnQkFDZCxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUs7YUFDbkIsQ0FBQTtRQUNMLENBQUMsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0NBQ0o7QUFwREQsc0NBb0RDIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEZ1bmN0aW9uIH0gZnJvbSAnLi9mdW5jdGlvbnMnO1xuaW1wb3J0IHsgRGV2aWNlIH0gZnJvbSAnLi9kZXZpY2UnO1xuaW1wb3J0ICogYXMgZ2cgZnJvbSAnQGF3cy1jZGsvYXdzLWdyZWVuZ3Jhc3MnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRGVzdGluYXRpb25JbnRlcm5hbCB7XG4gICAgYWJzdHJhY3QgZ2V0IGFybigpOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBDbG91ZERlc3RpbmF0aW9uIGV4dGVuZHMgRGVzdGluYXRpb25JbnRlcm5hbCB7XG4gICAgZ2V0IGFybigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gXCJjbG91ZFwiXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTG9jYWxTaGFkb3dEZXN0aW5hdGlvbiBleHRlbmRzIERlc3RpbmF0aW9uSW50ZXJuYWwge1xuICAgIGdldCBhcm4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwiR0dTaGFkb3dTZXJ2aWNlXCJcbiAgICB9XG59XG5cbnR5cGUgRGVzdGluYXRpb24gPSBDbG91ZERlc3RpbmF0aW9uIHwgTG9jYWxTaGFkb3dEZXN0aW5hdGlvbiB8IEZ1bmN0aW9uIHwgRGV2aWNlXG5cblxuZXhwb3J0IGludGVyZmFjZSBTdWJzY3JpcHRpb25Qcm9wcyB7XG4gICAgcmVhZG9ubHkgdG9waWM6IHN0cmluZztcbiAgICByZWFkb25seSBzb3VyY2U6IERlc3RpbmF0aW9uO1xuICAgIHJlYWRvbmx5IHRhcmdldDogRGVzdGluYXRpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3Vic2NyaXB0aW9uc1Byb3BzIHtcbiAgICByZWFkb25seSBzdWJzY3JpcHRpb25zPzogU3Vic2NyaXB0aW9uUHJvcHNbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbnMgZXh0ZW5kcyBjZGsuUmVzb3VyY2Uge1xuICAgIHJlYWRvbmx5IHN1YnNjcmlwdGlvbkxpc3Q6IFN1YnNjcmlwdGlvblByb3BzW107XG5cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdWJzY3JpcHRpb25zUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICAgICAgaWYgKHByb3BzPy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkxpc3QgPSBwcm9wcyEuc3Vic2NyaXB0aW9ucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uTGlzdCA9IFtdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGQoc291cmNlOiBEZXN0aW5hdGlvbiwgdG9waWM6IHN0cmluZywgdGFyZ2V0OiBEZXN0aW5hdGlvbik6IFN1YnNjcmlwdGlvbnMge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkxpc3QucHVzaCh7XG4gICAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgdG9waWM6IHRvcGljXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlc29sdmUoKTogZ2cuQ2ZuU3Vic2NyaXB0aW9uRGVmaW5pdGlvbi5TdWJzY3JpcHRpb25Qcm9wZXJ0eVtdIHtcblxuICAgICAgICBsZXQgc291cmNlOiBzdHJpbmc7XG4gICAgICAgIGxldCB0YXJnZXQ6IHN0cmluZztcblxuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnN1YnNjcmlwdGlvbkxpc3QubWFwKHMgPT4ge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoJ2xhbWJkYUZ1bmN0aW9uJyBpbiBzLnNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGxldCBmID0gKHMuc291cmNlIGFzIEZ1bmN0aW9uKTtcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBmLmxhbWJkYUZ1bmN0aW9uLmZ1bmN0aW9uQXJuICsgJzonICsgZi5hbGlhcy5hbGlhc05hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBkID0gKHMuc291cmNlIGFzIERlc3RpbmF0aW9uSW50ZXJuYWwpO1xuICAgICAgICAgICAgICAgIHNvdXJjZSA9IGQuYXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgnbGFtYmRhRnVuY3Rpb24nIGluIHMudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGYgPSAocy50YXJnZXQgYXMgRnVuY3Rpb24pO1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IGYubGFtYmRhRnVuY3Rpb24uZnVuY3Rpb25Bcm4gKyAnOicgKyBmLmFsaWFzLmFsaWFzTmFtZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGQgPSAocy50YXJnZXQgYXMgRGVzdGluYXRpb25JbnRlcm5hbCk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gZC5hcm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaWQ6IGAke3NvdXJjZX0uJHtzLnRvcGljfS4ke3RhcmdldH1gLFxuICAgICAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgICAgIHN1YmplY3Q6IHMudG9waWNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkgIFxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn1cblxuIl19