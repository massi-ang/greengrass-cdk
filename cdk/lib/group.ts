import * as cdk from '@aws-cdk/core';
import { GGLambda, Function } from './functions';
import { DestinationBase, Subscription } from './subscription'
import { LoggerHelper, AWSCloudWatchLogger, LocalLogger } from './logger'
import { Resource, ResourceHelper } from './resource'
import { Core } from './core';
import { Device } from './device';
import * as gg from '@aws-cdk/aws-greengrass'
import * as lambda from '@aws-cdk/aws-lambda'
import * as uuid from 'uuid';


  export interface GroupTemplate {
    functions?: GGLambda[];
    subscriptions?: Subscription[];
    loggers?: (AWSCloudWatchLogger | LocalLogger)[];
    resources?: Resource[];
  }

  export interface GroupProps {
    core: Core;
    functions?: GGLambda[];
    subscriptions?: Subscription[];
    loggers?: (AWSCloudWatchLogger | LocalLogger)[];
    resources?: Resource[];
    devices?: Device[];
    deviceSpecificSubscriptions?: Subscription[];
    groupTemplate?: GroupTemplate;
  }

  function convertResouceAccessPolicies(rap: Function.ResourceAccessPolicy): gg.CfnFunctionDefinition.ResourceAccessPolicyProperty {
    return {
      resourceId: rap.resource.name,
      permission: rap.permission
    }
  }

  function convertFunctions(f: GGLambda): gg.CfnFunctionDefinition.FunctionProperty {
    if (!(f.function.runtime == lambda.Runtime.PYTHON_3_7 ||
      f.function.runtime == lambda.Runtime.JAVA_8 ||
      f.function.runtime == lambda.Runtime.NODEJS_8_10)) {
      throw new Error(`Invalid Lambda runtime ${f.function.runtime}. Greengrass lambdas only support Python 3.7, Java 8 and Node 8.10`)
    }
    return {
      functionArn: f.function.functionArn + ':' + f.alias.aliasName,
      functionConfiguration: {
        environment: {
          accessSysfs: f.accessSysFs,
          execution: {
            isolationMode: f.isolationMode,
            runAs: f.runAs
          },
          resourceAccessPolicies: f.resourceAccessPolicies?.map(convertResouceAccessPolicies),
          variables: f.variables
        },
        encodingType: f.encodingType,
        execArgs: f.execArgs,
        executable: f.executable,
        memorySize: f.memorySize,
        timeout: f.timeout,
        pinned: f.pinned
      },
      id: uuid.v4()

    }
  }

  function convertSubscriptions(s: Subscription): gg.CfnSubscriptionDefinition.SubscriptionProperty {
    let source: string;
    let target: string;

    if ('function' in s.source) {
      let f = (s.source as GGLambda);
      source = f.function.functionArn + ':' + f.alias.aliasName;
    } else {
      let d = (s.source as DestinationBase);
      source = d.arn
    }

    if ('function' in s.target) {
      let f = (s.target as GGLambda);
      target = f.function.functionArn + ':' + f.alias.aliasName;
    } else {
      let d = (s.target as DestinationBase);
      target = d.arn
    }
    return {
      id: uuid.v4(),
      source: source,
      target: target,
      subject: s.topic
    }
  }



  export class Group extends cdk.Construct {

    constructor(parent: cdk.Stack, name: string, props: GroupProps) {
      super(parent, name);

      const coreDefinition = new gg.CfnCoreDefinition(this, name + '_core', {
        name: name,
        initialVersion: {
          cores: [{
            certificateArn: props.core.certificateArn,
            syncShadow: props.core.syncShadow,
            thingArn: `arn:aws:iot:${parent.region}:${parent.account}:thing/${props.core.thing.thingName}`,
            id: '0'
          }]
        }
      })

      let functionDefinitionVersionArn = undefined;
      if (props.functions !== null) {
        let functionDefinition = new gg.CfnFunctionDefinition(this, name + '_functions', {
          name: name,
          initialVersion: {
            functions: props.functions!.map(convertFunctions)
          }
        })
        functionDefinitionVersionArn = functionDefinition.attrLatestVersionArn;
      }

      let subscriptionDefinitionVersionArn = undefined;
      if (props.subscriptions !== null) {
        let subscriptionDefinition = new gg.CfnSubscriptionDefinition(this, name + '_subscriptions', {
          name: name,
          initialVersion: {
            subscriptions: props.subscriptions!.map(convertSubscriptions)
          }
        })
        subscriptionDefinitionVersionArn = subscriptionDefinition.attrLatestVersionArn;
      }


      let resourceDefinitionVersionArn = undefined;
      if (props.resources !== null) {
        let resourceDefinition = new gg.CfnResourceDefinition(this, name + '_resources', {
          name: name,
          initialVersion: {
            resources: props.resources!.map(ResourceHelper.convertResources)
          }
        })
        resourceDefinitionVersionArn = resourceDefinition.attrLatestVersionArn;
      }

      let loggerDefinitionVersionArn = undefined;
      if (props.loggers !== null) {
        let loggerDefinition = new gg.CfnLoggerDefinition(this, name + '_loggers', {
          name: name,
          initialVersion: {
            loggers: props.loggers!.map(LoggerHelper.loggersConverter)
          }
        })
        loggerDefinitionVersionArn = loggerDefinition.attrLatestVersionArn;
      }

      new gg.CfnGroup(this, name + '_group', {
        name: name,
        initialVersion: {
          coreDefinitionVersionArn: coreDefinition.attrLatestVersionArn,
          functionDefinitionVersionArn: functionDefinitionVersionArn,
          subscriptionDefinitionVersionArn: subscriptionDefinitionVersionArn,
          loggerDefinitionVersionArn: loggerDefinitionVersionArn,
          resourceDefinitionVersionArn: resourceDefinitionVersionArn
        }
      })
    
      // The code that defines your stack goes here
    }
  }

