import * as cdk from '@aws-cdk/core';
import { GGLambda, Function } from './functions';
import { DestinationBase, Subscription } from './subscription'
import { LoggerBase } from './logger'
import { GGResource } from './resource'
import { Core } from './core';
import { Device } from './device';
import * as gg from '@aws-cdk/aws-greengrass'
import * as lambda from '@aws-cdk/aws-lambda'
import { GroupTemplate } from './template';
import { Role } from '@aws-cdk/aws-iam'


export interface StreamManagerProps {
  enableStreamManager: boolean;
  allowInsecureAccess?: boolean;
}
export interface GroupProps {
  core: Core;
  functions?: GGLambda[];
  subscriptions?: Subscription[];
  loggers?: LoggerBase[];
  resources?: GGResource[];
  devices?: Device[];
  deviceSpecificSubscriptions?: Subscription[];
  streamManager?: StreamManagerProps,
  enableAutomaticIpDiscovery?: boolean;
  role?: Role
  initialVersion?: gg.CfnGroup.GroupVersionProperty
}

export class Group extends cdk.Construct {
  readonly id: string;
  readonly arn: string;
  readonly latestVersionArn: string;
  readonly roleArn?: string;

  constructor(scope: cdk.Construct, id: string, props: GroupProps) {
    super(scope, id);

    const coreDefinition = new gg.CfnCoreDefinition(this, id + '_core', {
      name: id,
      initialVersion: {
        cores: [props.core.resolve()]
      }
    })

    if (props.initialVersion !== undefined) {
      let roleArn = props.role?.roleArn || this.roleArn
      let group = new gg.CfnGroup(this, id, {
        name: id,
        initialVersion: {
          coreDefinitionVersionArn: coreDefinition.attrLatestVersionArn,
          ...props.initialVersion
        },
        roleArn: roleArn
      })
      this.arn = group.attrArn;
      this.id = group.attrId;
      this.latestVersionArn = group.attrLatestVersionArn
      this.roleArn = roleArn
      return
    }

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
      function convert(x: GGLambda): gg.CfnFunctionDefinition.FunctionProperty {
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
        name: id,
        initialVersion: {
          subscriptions: props.subscriptions!.map(convert)
        }
      })
      this.subscriptionDefinitionVersionArn = subscriptionDefinition.attrLatestVersionArn;
    }


    if (props.resources !== undefined) {
      function convert(x: GGResource): gg.CfnResourceDefinition.ResourceInstanceProperty {
        return x.resolve();
      }
      let resourceDefinition = new gg.CfnResourceDefinition(this, id + '_resources', {
        name: id,
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
        name: id,
        initialVersion: {
          loggers: props.loggers!.map(convert)
        }
      })
      this.loggerDefinitionVersionArn = loggerDefinition.attrLatestVersionArn;
    }

    let group = new gg.CfnGroup(this, id, {
      name: id,
      initialVersion: {
        coreDefinitionVersionArn: coreDefinition.attrLatestVersionArn,
        functionDefinitionVersionArn: this.functionDefinitionVersionArn,
        subscriptionDefinitionVersionArn: this.subscriptionDefinitionVersionArn,
        loggerDefinitionVersionArn: this.loggerDefinitionVersionArn,
        resourceDefinitionVersionArn: this.resourceDefinitionVersionArn
      } // TODO: Devices and Connectors
    })
    this.arn = group.attrArn;
    this.id = group.attrId;
    this.latestVersionArn = group.attrLatestVersionArn
    this.roleArn = props.role?.roleArn
  }

  cloneToNew(id: string, core: Core): Group {
    return new Group(this, id, {
      initialVersion: {
        functionDefinitionVersionArn: this.functionDefinitionVersionArn,
        subscriptionDefinitionVersionArn: this.subscriptionDefinitionVersionArn,
        loggerDefinitionVersionArn: this.loggerDefinitionVersionArn,
        resourceDefinitionVersionArn: this.resourceDefinitionVersionArn
      },
      core: core
    })
  }

  static fromTemplate(scope: cdk.Construct, id: string, core: Core, template: GroupTemplate): Group {
    return new Group(scope, id, {
      core: core,
      initialVersion: {
        functionDefinitionVersionArn: template.functionDefinitionVersionArn,
        subscriptionDefinitionVersionArn: template.subscriptionDefinitionVersionArn,
        loggerDefinitionVersionArn: template.loggerDefinitionVersionArn,
        resourceDefinitionVersionArn: template.resourceDefinitionVersionArn
      },
      role: template.role
    })
  }

  private streamManagerEnvironment?: gg.CfnFunctionDefinition.EnvironmentProperty;
  readonly functionDefinitionVersionArn?: string;
  readonly subscriptionDefinitionVersionArn?: string;
  readonly loggerDefinitionVersionArn?: string;
  readonly resourceDefinitionVersionArn?: string;
}

