/* 
 *  Copyright 2020 Massimiliano Angelino
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

import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Core } from '../lib';
import * as iot from '@aws-cdk/aws-iot';


test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
  const thing = new iot.CfnThing(app, 'a_thing', {
    thingName: 'testThing'
  })
  const stack = new Core(app, 'MyCore', { 
      certificateArn: 'AAA',
    syncShadow: false,
      thing: thing
    });
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": { }
    }, MatchStyle.SUPERSET))
});
