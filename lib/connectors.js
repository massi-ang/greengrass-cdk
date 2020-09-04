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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./connectors/cloudwatchmetrics"), exports);
__exportStar(require("./connectors/iotanalytics"), exports);
__exportStar(require("./connectors/iotsitewise"), exports);
__exportStar(require("./connectors/kinesisfirehose"), exports);
__exportStar(require("./connectors/mlfeedback"), exports);
__exportStar(require("./connectors/devicedefender"), exports);
__exportStar(require("./connector"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbm5lY3RvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7OztHQWNHOzs7Ozs7Ozs7Ozs7QUFFSCxpRUFBK0M7QUFDL0MsNERBQTBDO0FBQzFDLDJEQUF5QztBQUN6QywrREFBNkM7QUFDN0MsMERBQXdDO0FBQ3hDLDhEQUE0QztBQUM1Qyw4Q0FBNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBcbiAqICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tIG9yIGl0cyBhZmZpbGlhdGVzXG4gKiAgXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKiAgXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0ICogZnJvbSAnLi9jb25uZWN0b3JzL2Nsb3Vkd2F0Y2htZXRyaWNzJztcbmV4cG9ydCAqIGZyb20gJy4vY29ubmVjdG9ycy9pb3RhbmFseXRpY3MnO1xuZXhwb3J0ICogZnJvbSAnLi9jb25uZWN0b3JzL2lvdHNpdGV3aXNlJztcbmV4cG9ydCAqIGZyb20gJy4vY29ubmVjdG9ycy9raW5lc2lzZmlyZWhvc2UnO1xuZXhwb3J0ICogZnJvbSAnLi9jb25uZWN0b3JzL21sZmVlZGJhY2snO1xuZXhwb3J0ICogZnJvbSAnLi9jb25uZWN0b3JzL2RldmljZWRlZmVuZGVyJztcbmV4cG9ydCAqIGZyb20gJy4vY29ubmVjdG9yJztcblxuIl19