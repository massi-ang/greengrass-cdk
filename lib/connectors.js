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
__exportStar(require("./connectors/generic"), exports);
__exportStar(require("./connector"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbm5lY3RvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7OztHQWNHOzs7Ozs7Ozs7Ozs7QUFFSCxpRUFBK0M7QUFDL0MsNERBQTBDO0FBQzFDLDJEQUF5QztBQUN6QywrREFBNkM7QUFDN0MsMERBQXdDO0FBQ3hDLDhEQUE0QztBQUM1Qyx1REFBcUM7QUFDckMsOENBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vY29ubmVjdG9ycy9jbG91ZHdhdGNobWV0cmljcyc7XG5leHBvcnQgKiBmcm9tICcuL2Nvbm5lY3RvcnMvaW90YW5hbHl0aWNzJztcbmV4cG9ydCAqIGZyb20gJy4vY29ubmVjdG9ycy9pb3RzaXRld2lzZSc7XG5leHBvcnQgKiBmcm9tICcuL2Nvbm5lY3RvcnMva2luZXNpc2ZpcmVob3NlJztcbmV4cG9ydCAqIGZyb20gJy4vY29ubmVjdG9ycy9tbGZlZWRiYWNrJztcbmV4cG9ydCAqIGZyb20gJy4vY29ubmVjdG9ycy9kZXZpY2VkZWZlbmRlcic7XG5leHBvcnQgKiBmcm9tICcuL2Nvbm5lY3RvcnMvZ2VuZXJpYyc7XG5leHBvcnQgKiBmcm9tICcuL2Nvbm5lY3Rvcic7XG5cbiJdfQ==