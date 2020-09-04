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

import * as cdk from '@aws-cdk/core'
import * as gg from '../../lib/index'
import * as iot from '@aws-cdk/aws-iot';
import * as lambda from '@aws-cdk/aws-lambda';
import { RemovalPolicy, Size, Duration } from '@aws-cdk/core';
import { CloudDestination } from '../../lib/index';

export interface MyStackProps extends cdk.StackProps {
    certificateArn: string;
}

export class MyStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: MyStackProps) {
        super(scope, id, props);

        // Let's create a Lambda function 

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

        let b_t = new iot.CfnThing(this, 'b_thing', {
            thingName: 'MyThing_Core_B'
        })

        let c_t = new iot.CfnThing(this, 'c_thing', {
            thingName: 'MyThing_Core_C'
        })

        let d_t = new iot.CfnThing(this, 'd_thing', {
            thingName: 'MyThing_Core_D'
        })

        // We need a local volume resource

        let tmp_folder = new gg.LocalVolumeResource(this, 'temp', {
            destinationPath: '/tmp',
            sourcePath: '/home/ec2/tmp',
            name: 'temp',
            groupOwnerSetting: {
                autoAddGroupOwner: true
            }
        })

        // we define the Greengrass Lambda using the Lambda create before
        // this construct also validates the runtime type

        let gg_lambda = new gg.Function(this, 'a_lambda', {
            function: f,
            alias: alias,
            encodingType: gg.Functions.EncodingType.JSON,
            memorySize: Size.mebibytes(128),
            pinned: false,
            timeout: Duration.seconds(3)
        })

        // we add the resource to the function

        gg_lambda.addResource(tmp_folder, gg.Functions.ResourceAccessPermission.READ_ONLY);

        // setting up local logging for greenfrass components

        let localLogger = new gg.LocalGreengrassLogger(this, 'local_logger', {
            level: gg.Logger.LogLevel.DEBUG,
            space: Size.mebibytes(32)
        })

        // and some subscriptions

        let subscriptions = new gg.Subscriptions(this, 'subscriptions')
            .add(gg_lambda, '#', new CloudDestination())
            .add(new CloudDestination(), '#', gg_lambda)
        

        // We create a first group

        new gg.Group(this, 'a_group', {
            core: new gg.Core(this, 'a_core', {
                thing: a_t,
                syncShadow: true,
                certificateArn: props.certificateArn
            }),
            functions: [gg_lambda],
            subscriptions: subscriptions,
            loggers: [localLogger],
            resources: [tmp_folder]
        })

        // and a second group, using the same configuration, but different cores

        let b_group = new gg.Group(this, 'b_group', {
            core: new gg.Core(this, 'b_core', {
                thing: b_t,
                syncShadow: false,
                certificateArn: props.certificateArn
            }),
            functions: [gg_lambda],
            subscriptions: subscriptions,
            loggers: [localLogger],
            resources: [tmp_folder]
        })

        // well, we could also use a template. Templates do not exposte Core or Device 

        // in this template we only add a lambda and a logger
        let template = new gg.GroupTemplate(this, 'gg_template', {
            functions: [gg_lambda],
            loggers: [localLogger]
        })

        new cdk.CfnOutput(this, 'function_version', {
            description: 'FunctionVersionArn',
            value: template.functionDefinitionVersionArn!,
            exportName: id + '-function-version'
        })

        // and here we create the group
        let core_c = new gg.Core(this, 'c_core', {
            thing: c_t,
            syncShadow: false,
            certificateArn: props.certificateArn
        })

        gg.Group.fromTemplate(this, 'c_group', core_c, template);

        // and here we create the group
        let core_d = new gg.Core(this, 'd_core', {
            thing: d_t,
            syncShadow: false,
            certificateArn: props.certificateArn
        })

        // or we can simply clone an existing one:
        b_group.cloneToNew('d_group', core_d)

    }
}