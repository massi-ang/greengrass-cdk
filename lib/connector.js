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
exports.Connector = void 0;
const core_1 = require("@aws-cdk/core");
class Connector extends core_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.id = id;
        props = props;
    }
    resolve() {
        return {
            connectorArn: this.connectorArn,
            id: this.id,
            parameters: this.parameters
        };
    }
}
exports.Connector = Connector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29ubmVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7O0FBR0gsd0NBQTBDO0FBTTFDLE1BQXNCLFNBQVUsU0FBUSxnQkFBUztJQUU3QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixLQUFLLEdBQUcsS0FBSyxDQUFBO0lBRWpCLENBQUM7SUFJRCxPQUFPO1FBQ0gsT0FBTztZQUNILFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtZQUMvQixFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDWCxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDOUIsQ0FBQTtJQUNMLENBQUM7Q0FDSjtBQWxCRCw4QkFrQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICogYXMgZ2cgZnJvbSAnQGF3cy1jZGsvYXdzLWdyZWVuZ3Jhc3MnXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0b3JQcm9wcyB7XG5cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbm5lY3RvciBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgcHJpdmF0ZSBpZDogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogQ29ubmVjdG9yUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKVxuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHByb3BzID0gcHJvcHNcblxuICAgIH1cbiAgICBhYnN0cmFjdCBnZXQgY29ubmVjdG9yQXJuKCk6IHN0cmluZztcbiAgICBhYnN0cmFjdCBnZXQgcGFyYW1ldGVycygpOiBhbnk7XG5cbiAgICByZXNvbHZlKCk6IGdnLkNmbkNvbm5lY3RvckRlZmluaXRpb24uQ29ubmVjdG9yUHJvcGVydHkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29ubmVjdG9yQXJuOiB0aGlzLmNvbm5lY3RvckFybixcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICAgICAgcGFyYW1ldGVyczogdGhpcy5wYXJhbWV0ZXJzXG4gICAgICAgIH1cbiAgICB9XG59XG5cbiJdfQ==