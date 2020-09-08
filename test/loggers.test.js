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
require("@aws-cdk/assert/jest");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
const iot = require("@aws-cdk/aws-iot");
const core_1 = require("@aws-cdk/core");
//import { SynthUtils } from '@aws-cdk/assert';
var stack;
var t;
var c;
beforeEach(() => {
    stack = new cdk.Stack;
    t = new iot.CfnThing(stack, 'a_thing', {
        thingName: 'testThing'
    });
    c = new lib_1.Core(stack, 'MyCore', {
        certificateArn: 'AAA',
        syncShadow: true,
        thing: t
    });
});
afterEach(() => {
    //console.log(JSON.stringify(SynthUtils.toCloudFormation(stack), undefined, 2))
});
test('system logger local', () => {
    let l = new lib_1.LocalGreengrassLogger(stack, 'l', {
        level: lib_1.Logger.LogLevel.DEBUG,
        space: core_1.Size.gibibytes(2)
    });
    new lib_1.Group(stack, 'a group', {
        core: c,
        loggers: [l]
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::LoggerDefinition', {
        InitialVersion: {
            Loggers: [
                {
                    "Component": "GreengrassSystem",
                    "Id": "l",
                    "Level": "DEBUG",
                    "Space": 2097152,
                    "Type": "FileSystem"
                }
            ]
        }
    });
});
test('user logger local', () => {
    let l = new lib_1.LocalUserLambdaLogger(stack, 'l', {
        level: lib_1.Logger.LogLevel.DEBUG,
        space: core_1.Size.gibibytes(2)
    });
    new lib_1.Group(stack, 'a group', {
        core: c,
        loggers: [l]
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::LoggerDefinition', {
        InitialVersion: {
            Loggers: [
                {
                    "Component": "Lambda",
                    "Id": "l",
                    "Level": "DEBUG",
                    "Space": 2097152,
                    "Type": "FileSystem"
                }
            ]
        }
    });
});
test('gg cloud watch', () => {
    let l = new lib_1.AWSCloudWatchGreengrassLogger(stack, 'l', {
        level: lib_1.Logger.LogLevel.INFO,
    });
    new lib_1.Group(stack, 'a group', {
        core: c,
        loggers: [l]
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::LoggerDefinition', {
        InitialVersion: {
            Loggers: [
                {
                    "Component": "GreengrassSystem",
                    "Id": "l",
                    "Level": "INFO",
                    "Type": "AWSCloudWatch"
                }
            ]
        }
    });
});
test('user cloud watch', () => {
    let l = new lib_1.AWSCloudWatchUserLambdaLogger(stack, 'l', {
        level: lib_1.Logger.LogLevel.WARN,
    });
    new lib_1.Group(stack, 'a group', {
        core: c,
        loggers: [l]
    });
    expect(stack).toHaveResourceLike('AWS::Greengrass::LoggerDefinition', {
        InitialVersion: {
            Loggers: [
                {
                    "Component": "Lambda",
                    "Id": "l",
                    "Level": "WARN",
                    "Type": "AWSCloudWatch"
                }
            ]
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2Vycy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nZ2Vycy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCxnQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLGdDQUF5SjtBQUN6Six3Q0FBd0M7QUFDeEMsd0NBQXFDO0FBQ3JDLCtDQUErQztBQUkvQyxJQUFJLEtBQWdCLENBQUM7QUFDckIsSUFBSSxDQUFlLENBQUM7QUFDcEIsSUFBSSxDQUFPLENBQUM7QUFFWixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDckMsU0FBUyxFQUFFLFdBQVc7S0FDdkIsQ0FBQyxDQUFBO0lBQ0YsQ0FBQyxHQUFHLElBQUksVUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDNUIsY0FBYyxFQUFFLEtBQUs7UUFDckIsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQTtBQUVGLFNBQVMsQ0FBQyxHQUFHLEVBQUU7SUFDYiwrRUFBK0U7QUFDakYsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBRS9CLElBQUksQ0FBQyxHQUFHLElBQUksMkJBQXFCLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtRQUM1QyxLQUFLLEVBQUUsWUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLO1FBQzVCLEtBQUssRUFBRSxXQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztLQUN6QixDQUFDLENBQUE7SUFFRixJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzFCLElBQUksRUFBRSxDQUFD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QUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyogXG4gKiAgQ29weXJpZ2h0IDIwMjAgQW1hem9uLmNvbSBvciBpdHMgYWZmaWxpYXRlc1xuICogIFxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogIFxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICogIFxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAnQGF3cy1jZGsvYXNzZXJ0L2plc3QnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29yZSwgR3JvdXAsIExvY2FsR3JlZW5ncmFzc0xvZ2dlciwgTG9nZ2VyLCBMb2NhbFVzZXJMYW1iZGFMb2dnZXIsIEFXU0Nsb3VkV2F0Y2hHcmVlbmdyYXNzTG9nZ2VyLCBBV1NDbG91ZFdhdGNoVXNlckxhbWJkYUxvZ2dlciB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgKiBhcyBpb3QgZnJvbSAnQGF3cy1jZGsvYXdzLWlvdCc7XG5pbXBvcnQgeyBTaXplIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG4vL2ltcG9ydCB7IFN5bnRoVXRpbHMgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuXG5cblxudmFyIHN0YWNrOiBjZGsuU3RhY2s7XG52YXIgdDogaW90LkNmblRoaW5nO1xudmFyIGM6IENvcmU7XG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBjZGsuU3RhY2s7XG4gIHQgPSBuZXcgaW90LkNmblRoaW5nKHN0YWNrLCAnYV90aGluZycsIHtcbiAgICB0aGluZ05hbWU6ICd0ZXN0VGhpbmcnXG4gIH0pXG4gIGMgPSBuZXcgQ29yZShzdGFjaywgJ015Q29yZScsIHtcbiAgICBjZXJ0aWZpY2F0ZUFybjogJ0FBQScsXG4gICAgc3luY1NoYWRvdzogdHJ1ZSxcbiAgICB0aGluZzogdFxuICB9KTtcbn0pXG5cbmFmdGVyRWFjaCgoKSA9PiB7XG4gIC8vY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoU3ludGhVdGlscy50b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSwgdW5kZWZpbmVkLCAyKSlcbn0pO1xuXG50ZXN0KCdzeXN0ZW0gbG9nZ2VyIGxvY2FsJywgKCkgPT4ge1xuICBcbiAgbGV0IGwgPSBuZXcgTG9jYWxHcmVlbmdyYXNzTG9nZ2VyKHN0YWNrLCAnbCcsIHtcbiAgICBsZXZlbDogTG9nZ2VyLkxvZ0xldmVsLkRFQlVHLFxuICAgIHNwYWNlOiBTaXplLmdpYmlieXRlcygyKVxuICB9KVxuXG4gIG5ldyBHcm91cChzdGFjaywgJ2EgZ3JvdXAnLCB7XG4gICAgY29yZTogYyxcbiAgICBsb2dnZXJzOiBbbF1cbiAgfSlcbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6TG9nZ2VyRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgTG9nZ2VyczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJDb21wb25lbnRcIjogXCJHcmVlbmdyYXNzU3lzdGVtXCIsXG4gICAgICAgICAgXCJJZFwiOiBcImxcIixcbiAgICAgICAgICBcIkxldmVsXCI6IFwiREVCVUdcIixcbiAgICAgICAgICBcIlNwYWNlXCI6IDIwOTcxNTIsXG4gICAgICAgICAgXCJUeXBlXCI6IFwiRmlsZVN5c3RlbVwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pO1xuXG59KVxuXG50ZXN0KCd1c2VyIGxvZ2dlciBsb2NhbCcsICgpID0+IHtcblxuICBsZXQgbCA9IG5ldyBMb2NhbFVzZXJMYW1iZGFMb2dnZXIoc3RhY2ssICdsJywge1xuICAgIGxldmVsOiBMb2dnZXIuTG9nTGV2ZWwuREVCVUcsXG4gICAgc3BhY2U6IFNpemUuZ2liaWJ5dGVzKDIpXG4gIH0pXG5cbiAgbmV3IEdyb3VwKHN0YWNrLCAnYSBncm91cCcsIHtcbiAgICBjb3JlOiBjLFxuICAgIGxvZ2dlcnM6IFtsXVxuICB9KVxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpMb2dnZXJEZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBMb2dnZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIkNvbXBvbmVudFwiOiBcIkxhbWJkYVwiLFxuICAgICAgICAgIFwiSWRcIjogXCJsXCIsXG4gICAgICAgICAgXCJMZXZlbFwiOiBcIkRFQlVHXCIsXG4gICAgICAgICAgXCJTcGFjZVwiOiAyMDk3MTUyLFxuICAgICAgICAgIFwiVHlwZVwiOiBcIkZpbGVTeXN0ZW1cIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcblxufSlcblxudGVzdCgnZ2cgY2xvdWQgd2F0Y2gnLCAoKSA9PiB7XG5cbiAgbGV0IGwgPSBuZXcgQVdTQ2xvdWRXYXRjaEdyZWVuZ3Jhc3NMb2dnZXIoc3RhY2ssICdsJywge1xuICAgIGxldmVsOiBMb2dnZXIuTG9nTGV2ZWwuSU5GTyxcbiAgfSlcblxuXG4gIG5ldyBHcm91cChzdGFjaywgJ2EgZ3JvdXAnLCB7XG4gICAgY29yZTogYyxcbiAgICBsb2dnZXJzOiBbbF1cbiAgfSlcbiAgZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6R3JlZW5ncmFzczo6TG9nZ2VyRGVmaW5pdGlvbicsIHtcbiAgICBJbml0aWFsVmVyc2lvbjoge1xuICAgICAgTG9nZ2VyczogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJDb21wb25lbnRcIjogXCJHcmVlbmdyYXNzU3lzdGVtXCIsXG4gICAgICAgICAgXCJJZFwiOiBcImxcIixcbiAgICAgICAgICBcIkxldmVsXCI6IFwiSU5GT1wiLFxuICAgICAgICAgIFwiVHlwZVwiOiBcIkFXU0Nsb3VkV2F0Y2hcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KTtcblxufSlcblxudGVzdCgndXNlciBjbG91ZCB3YXRjaCcsICgpID0+IHtcblxuICBsZXQgbCA9IG5ldyBBV1NDbG91ZFdhdGNoVXNlckxhbWJkYUxvZ2dlcihzdGFjaywgJ2wnLCB7XG4gICAgbGV2ZWw6IExvZ2dlci5Mb2dMZXZlbC5XQVJOLFxuICB9KVxuXG5cbiAgbmV3IEdyb3VwKHN0YWNrLCAnYSBncm91cCcsIHtcbiAgICBjb3JlOiBjLFxuICAgIGxvZ2dlcnM6IFtsXVxuICB9KVxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlTGlrZSgnQVdTOjpHcmVlbmdyYXNzOjpMb2dnZXJEZWZpbml0aW9uJywge1xuICAgIEluaXRpYWxWZXJzaW9uOiB7XG4gICAgICBMb2dnZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIkNvbXBvbmVudFwiOiBcIkxhbWJkYVwiLFxuICAgICAgICAgIFwiSWRcIjogXCJsXCIsXG4gICAgICAgICAgXCJMZXZlbFwiOiBcIldBUk5cIixcbiAgICAgICAgICBcIlR5cGVcIjogXCJBV1NDbG91ZFdhdGNoXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG5cbn0pXG5cbiJdfQ==