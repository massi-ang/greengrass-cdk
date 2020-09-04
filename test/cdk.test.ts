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
      "Resources": {}
    }, MatchStyle.EXACT))
});
