import * as cdk from '@aws-cdk/core';
import { Function } from './functions';
import { Subscription } from './subscription'
import { LoggerBase } from './logger'
import { GGResource } from './resource'
import { Core } from './core';
import * as gg from '@aws-cdk/aws-greengrass'
import * as lambda from '@aws-cdk/aws-lambda'
import { Role } from '@aws-cdk/aws-iam';
import { StreamManagerProps } from './group'

export interface GroupTemplateProps {
    functions?: Function[];
    subscriptions?: Subscription[];
    loggers?: LoggerBase[];
    resources?: GGResource[];
    role?: Role,
    streamManager?: StreamManagerProps,
    enableAutomaticIpDiscovery?: boolean
}

export class GroupTemplate extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: GroupTemplateProps) {
        super(scope, id)
        let systemFunctions: gg.CfnFunctionDefinition.FunctionProperty[] = [];
        if (props.streamManager?.enableStreamManager || props.enableAutomaticIpDiscovery) {
            if (props.streamManager?.enableStreamManager) {
                if (props.streamManager!.allowInsecureAccess) {
                    this.streamManagerEnvironment = {
                        variables: {
                            "STREAM_MANAGER_AUTHENTICATE_CLIENT": "false"
                        }
                    }
                }
                systemFunctions.push({
                    id: 'stream_manager',
                    functionArn: "arn:aws:lambda:::function:GGStreamManager:1",
                    functionConfiguration: {
                        encodingType: 'binary',
                        pinned: true,
                        timeout: 3,
                        environment: this.streamManagerEnvironment
                    }
                })
            }
            if (props.enableAutomaticIpDiscovery) {
                systemFunctions.push({
                    id: 'auto_ip',
                    functionArn: "arn:aws:lambda:::function:GGIPDetector:1",
                    functionConfiguration: {
                        pinned: true,
                        memorySize: 32768,
                        timeout: 3
                    }
                })
            }
        }

        if (props.functions !== undefined || systemFunctions.length > 0) {
            function convert(x: Function): gg.CfnFunctionDefinition.FunctionProperty {
                return x.resolve();
            }
            var functionDefinition: gg.CfnFunctionDefinition;
            if (props.functions !== undefined) {
                functionDefinition = new gg.CfnFunctionDefinition(this, id + '_functions', {
                    name: id,
                    initialVersion: {
                        functions: [...props.functions!.map(convert), ...systemFunctions]
                    }
                })
            } else {
                functionDefinition = new gg.CfnFunctionDefinition(this, id + '_functions', {
                    name: id,
                    initialVersion: {
                        functions: systemFunctions
                    }
                })
            }
            this.functionDefinitionVersionArn = functionDefinition.attrLatestVersionArn;
        }
       

        if (props.subscriptions !== undefined) {
            function convert(x: Subscription): gg.CfnSubscriptionDefinition.SubscriptionProperty {
                return x.resolve();
            }
            let subscriptionDefinition = new gg.CfnSubscriptionDefinition(this, id + '_subscriptions', {
                name: id+'_s',
                initialVersion: {
                    subscriptions: props.subscriptions!.map(convert)
                }
            })
            this.subscriptionDefinitionVersionArn = subscriptionDefinition.attrLatestVersionArn;
        }


        if (props.subscriptions !== undefined) {
            console.log('Resources')
            function convert(x: GGResource): gg.CfnResourceDefinition.ResourceInstanceProperty {
                return x.resolve();
            }
            let resourceDefinition = new gg.CfnResourceDefinition(this, id + '_resources', {
                name: id+'_r',
                initialVersion: {
                    resources: props.resources!.map(convert)
                }
            })
            this.resourceDefinitionVersionArn = resourceDefinition.attrLatestVersionArn;
        }

        if (props.loggers !== undefined) {
            function convert(x: LoggerBase): gg.CfnLoggerDefinition.LoggerProperty {
                return x.resolve();
            }
            let loggerDefinition = new gg.CfnLoggerDefinition(this, id + '_loggers', {
                name: id+'_l',
                initialVersion: {
                    loggers: props.loggers!.map(convert)
                }
            })
            this.loggerDefinitionVersionArn = loggerDefinition.attrLatestVersionArn;
        }
    }

    private functionDef: gg.CfnFunctionDefinition;
    private subscriptionDef: gg.CfnSubscriptionDefinition;
    private loggerDef: gg.CfnLoggerDefinition;
    private resourceDef: gg.CfnResourceDefinition;
    private streamManagerEnvironment?: gg.CfnFunctionDefinition.EnvironmentProperty;

    readonly functionDefinitionVersionArn?: string;
    readonly subscriptionDefinitionVersionArn?: string;
    readonly loggerDefinitionVersionArn?: string;
    readonly resourceDefinitionVersionArn?: string;
    readonly role?: Role;
}