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

import * as cdk from '@aws-cdk/core'
import * as gg from '../../lib/index'
import * as iot from '@aws-cdk/aws-iot';
import * as lambda from '@aws-cdk/aws-lambda';
import { RemovalPolicy, Size, Duration } from '@aws-cdk/core';

export interface SimpleGGStackProps extends cdk.StackProps {
    certificateArn: string;
}

export class SimpleGGStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: SimpleGGStackProps) {
        super(scope, id, props);

        let f = new lambda.Function(this, 'f1', {
            code: lambda.Code.fromAsset('./src'),
            runtime: lambda.Runtime.PYTHON_3_7,
            handler: 'lambda.handler',
            currentVersionOptions: {
                removalPolicy: RemovalPolicy.RETAIN
            }
        })
        let alias = new lambda.Alias(this, 'prod_alias', {
            version: f.currentVersion,
            aliasName: 'prod',
        });

        // and then we need few Things as cores

        let a_t = new iot.CfnThing(this, 'a_thing', {
            thingName: 'MyThing'
        })

        let gg_lambda = new gg.Function(this, 'a_lambda', {
            function: f,
            alias: alias,
            encodingType: gg.Functions.EncodingType.JSON,
            memorySize: Size.mebibytes(128),
            pinned: false,
            timeout: Duration.seconds(3)
        })
      // We create a first group

        new gg.Group(this, 'a_group', {
            core: new gg.Core(this, 'a_core', {
                thing: a_t,
                syncShadow: true,
                certificateArn: props.certificateArn
            }),
            functions: [gg_lambda],
        })

    }
}