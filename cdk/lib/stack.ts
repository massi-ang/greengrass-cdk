import * as cdk from '@aws-cdk/core'
import * as gg from './greengrass'
import * as iot from '@aws-cdk/aws-iot';
import * as lambda  from '@aws-cdk/aws-lambda';
import { RemovalPolicy } from '@aws-cdk/core';

export interface MyStackProps extends cdk.StackProps {
    certificateArn: string;
}

export class MyStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: MyStackProps) {
        super(scope, id, props);

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
        
        
        let t = new iot.CfnThing(this, 'a_thing', {
            thingName: 'MyThing'
        })

        // new iot.CfnThingPrincipalAttachment(this, 'a_thing_cert', {
        //     principal: props.certificateArn,
        //     thingName: t.thingName!
        // })

        let tmp_folder: gg.LocalVolumeResource = {
            destinationPath: '/tmp',
            sourcePath: '/home/ec2/tmp',
            groupOwnerSetting: {
                autoAddGroupOwner: true
            },
            name: 'temp'
        }

        let gg_lambda:gg.GGLambda = {
            function: f,
            alias: alias,
            encodingType: gg.Function.EncodingType.JSON,
            memorySize: 16000,
            pinned: false,
            timeout: 3,
            resourceAccessPolicies: [
                {
                    resource: tmp_folder,
                    permission: gg.Function.ResourceAccessPermission.READ_WRITE
                }
            ]
        }

        let localLogger: gg.LocalLogger = {
            component: gg.LoggerProps.Component.GREENGRASS,
            level: gg.LoggerProps.LogLevel.DEBUG,
            space: 32000
        }

        let template:gg.GroupTemplate = {
            functions: [
                gg_lambda
            ],
            loggers: [ localLogger ],
            subscriptions: [
                {
                    source: gg_lambda,
                    topic: '#',
                    target: new gg.CloudDestination()
                },
                {
                    source: new gg.CloudDestination(),
                    topic: '#',
                    target: gg_lambda
                }
            ],
            resources: [
                tmp_folder
            ]
        }

        new gg.Group(this, 'a_group', {
            core: {
                thing: t,
                syncShadow: true,
                certificateArn: props.certificateArn
            },
            functions: template.functions,
            subscriptions: template.subscriptions,
            loggers: template.loggers,
            resources: template.resources
        })
    }
}