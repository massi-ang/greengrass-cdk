import * as cdk from '@aws-cdk/core'
import * as gg from '../../lib/index'
import * as iot from '@aws-cdk/aws-iot';
import * as lambda from '@aws-cdk/aws-lambda';
import { RemovalPolicy } from '@aws-cdk/core';

export interface MyStackProps extends cdk.StackProps {
    certificateArn: string;
}

export class MyStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: MyStackProps) {
        super(scope, id, props);

        // Let's create a Lambda function 

        let f = new lambda.Function(this, 'f1', {
            code: lambda.Code.fromAsset('../src'),
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
            groupOwnerSetting: {
                autoAddGroupOwner: true
            }
        })

        // we define the Greengrass Lambda using the Lambda create before
        // this construct also validates the runtime type

        let gg_lambda = new gg.GGLambda(this, 'a_lambda', {
            function: f,
            alias: alias,
            encodingType: gg.Function.EncodingType.JSON,
            memorySize: 16000,
            pinned: false,
            timeout: 3
        })

        // we add the resource to the function

        gg_lambda.addResource(tmp_folder, gg.Function.ResourceAccessPermission.READ_ONLY);

        // setting up local logging for greenfrass components

        let localLogger = new gg.LocalGreengrassLogger(this, 'local_logger', {
            level: gg.Logger.LogLevel.DEBUG,
            space: 32000
        })

        // and some subscriptions

        let subscriptions = [
            gg.Subscription.toCloud(this, 'my_sub1', gg_lambda, '#'),
            gg.Subscription.fromCloud(this, 'my_sub2', gg_lambda, '#')
        ];

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