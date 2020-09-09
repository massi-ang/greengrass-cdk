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

import * as cdk from '@aws-cdk/core';
import { Function, Functions } from './functions';
import { Subscriptions } from './subscription'
import { LoggerBase } from './logger'
import { Resource } from './resource'
import { Core } from './core';
import { Device } from './device';
import * as gg from '@aws-cdk/aws-greengrass'
import { GroupTemplate } from './template';
import { Role } from '@aws-cdk/aws-iam'
import { CfnFunctionDefinition } from '@aws-cdk/aws-greengrass';
import { Connector } from './connector';


export interface StreamManagerProps {
  readonly enableStreamManager: boolean;
  readonly allowInsecureAccess?: boolean;
}

export enum CloudSpoolerStorageType {
  MEMORY = 'Memory',
  FILE_SYSTEM = 'FileSystem'
}

export interface CloudSpoolerStorageProps {
  readonly type: CloudSpoolerStorageType;
  readonly maxSize: cdk.Size;
}

export interface CloudSpoolerProps {
  readonly storage?: CloudSpoolerStorageProps;
  readonly enablePersistentSessions?: boolean;
}

export interface GroupProps {
  readonly core: Core;
  readonly defaultFunctionExecution?: Functions.Execution
  readonly functions?: Function[];
  readonly subscriptions?: Subscriptions;
  readonly loggers?: LoggerBase[];
  readonly resources?: Resource[];
  readonly devices?: Device[];
  readonly connectors?: Connector[];
  readonly deviceSpecificSubscriptions?: Subscriptions;
  readonly streamManager?: StreamManagerProps,
  readonly enableAutomaticIpDiscovery?: boolean;
  readonly role?: Role;
  readonly initialVersion?: gg.CfnGroup.GroupVersionProperty;
  readonly cloudSpooler?: CloudSpoolerProps;
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
    if (props.streamManager?.enableStreamManager || props.enableAutomaticIpDiscovery || props.cloudSpooler) {
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
      if (props.cloudSpooler) {
        systemFunctions.push({
          id: 'spooler',
          functionArn: "arn:aws:lambda:::function:GGCloudSpooler:1",
          functionConfiguration: {
            executable: "spooler",
            pinned: true,
            memorySize: 32768,
            timeout: 3,
            environment: {
              variables: {
                "GG_CONFIG_STORAGE_TYPE": props.cloudSpooler.storage?.type,
                "GG_CONFIG_MAX_SIZE_BYTES": props.cloudSpooler.storage?.maxSize.toKibibytes(),
                "GG_CONFIG_SUBSCRIPTION_QUALITY": props.cloudSpooler.enablePersistentSessions ? 'AtLeastOncePersistent': 'AtMostOnce',
              }
            }
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
        
        if (props.defaultFunctionExecution) {
          this.defaultConfig = {
            execution: {
              ...props.defaultFunctionExecution
            }
          }
        } 
        functionDefinition = new gg.CfnFunctionDefinition(this, id + '_functions', {
          name: id,
          initialVersion: {
            defaultConfig: this.defaultConfig,
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

      let subscriptionDefinition = new gg.CfnSubscriptionDefinition(this, id + '_subscriptions', {
        name: id,
        initialVersion: {
          subscriptions: props.subscriptions!.resolve()
        }
      })
      this.subscriptionDefinitionVersionArn = subscriptionDefinition.attrLatestVersionArn;
    }


    if (props.resources !== undefined) {
      function convert(x: Resource): gg.CfnResourceDefinition.ResourceInstanceProperty {
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

    if (props.devices !== undefined) {
      function convert(x: Device): gg.CfnDeviceDefinition.DeviceProperty {
        return x.resolve();
      }
      let deviceDefinition = new gg.CfnDeviceDefinition(this, id + '_devices', {
        name: id,
        initialVersion: {
          devices: props.devices!.map(convert)
        }
      })
      this.deviceDefinitionVersionArn = deviceDefinition.attrLatestVersionArn;
    }

    if (props.connectors !== undefined) {
      function convert(x: Connector): gg.CfnConnectorDefinition.ConnectorProperty {
        return x.resolve();
      }
      let connectorDefinition = new gg.CfnConnectorDefinition(this, id + '_connectors', {
        name: id,
        initialVersion: {
          connectors: props.connectors!.map(convert)
        }
      })
      this.connectorDefinitionVersionArn = connectorDefinition.attrLatestVersionArn;
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
        resourceDefinitionVersionArn: this.resourceDefinitionVersionArn,
        deviceDefinitionVersionArn: this.deviceDefinitionVersionArn
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

  private defaultConfig?: CfnFunctionDefinition.DefaultConfigProperty;
  private streamManagerEnvironment?: gg.CfnFunctionDefinition.EnvironmentProperty;
  readonly functionDefinitionVersionArn?: string;
  readonly subscriptionDefinitionVersionArn?: string;
  readonly loggerDefinitionVersionArn?: string;
  readonly resourceDefinitionVersionArn?: string;
  readonly deviceDefinitionVersionArn?: string;
  readonly connectorDefinitionVersionArn?: string;
}

