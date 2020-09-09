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

import { Core } from './core';
import { Device } from './device';
import * as gg from '@aws-cdk/aws-greengrass'
import { GroupTemplate, GroupTemplateProps } from './template';


export interface GroupProps extends GroupTemplateProps{
  readonly core: Core;
  readonly devices?: Device[];
  readonly initialVersion?: gg.CfnGroup.GroupVersionProperty;
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

    if (props.subscriptions !== undefined && props.subscriptions.subscriptionList.length > 0) {
      let subscriptionDefinition = new gg.CfnSubscriptionDefinition(this, id + '_subscriptions', {
        name: id,
        initialVersion: {
          subscriptions: props.subscriptions!.resolve()
        }
      })
      this.subscriptionDefinitionVersionArn = subscriptionDefinition.attrLatestVersionArn;
    }

    const template = new GroupTemplate(this, id + '_template', props);
    
    this.subscriptionDefinitionVersionArn = this.subscriptionDefinitionVersionArn;

    this.connectorDefinitionVersionArn = template.connectorDefinitionVersionArn
    this.resourceDefinitionVersionArn = template.resourceDefinitionVersionArn
    this.functionDefinitionVersionArn = template.functionDefinitionVersionArn
    this.loggerDefinitionVersionArn = template.loggerDefinitionVersionArn

    let roleArn = template.role?.roleArn
    let group = new gg.CfnGroup(this, id, {
      name: id,
      initialVersion: {
        coreDefinitionVersionArn: coreDefinition.attrLatestVersionArn,
        functionDefinitionVersionArn: this.functionDefinitionVersionArn,
        subscriptionDefinitionVersionArn: this.subscriptionDefinitionVersionArn,
        loggerDefinitionVersionArn: this.loggerDefinitionVersionArn,
        connectorDefinitionVersionArn: this.connectorDefinitionVersionArn,
        resourceDefinitionVersionArn: this.resourceDefinitionVersionArn,
        deviceDefinitionVersionArn: this.deviceDefinitionVersionArn
      },
      roleArn: roleArn
    })
    this.arn = group.attrArn;
    this.id = group.attrId;
    this.latestVersionArn = group.attrLatestVersionArn
    this.roleArn = roleArn
    return
  }

  cloneToNew(id: string, core: Core): Group {
    return new Group(this, id, {
      initialVersion: {
        functionDefinitionVersionArn: this.functionDefinitionVersionArn,
        subscriptionDefinitionVersionArn: this.subscriptionDefinitionVersionArn,
        loggerDefinitionVersionArn: this.loggerDefinitionVersionArn,
        resourceDefinitionVersionArn: this.resourceDefinitionVersionArn,
        connectorDefinitionVersionArn: this.subscriptionDefinitionVersionArn
      },
      core: core
    })
  }

  // static fromTemplate(scope: cdk.Construct, id: string, core: Core, template: GroupTemplate): Group {
  //   return new Group(scope, id, {
  //     core: core,
  //     initialVersion: {
  //       functionDefinitionVersionArn: template.functionDefinitionVersionArn,
  //       subscriptionDefinitionVersionArn: template.subscriptionDefinitionVersionArn,
  //       loggerDefinitionVersionArn: template.loggerDefinitionVersionArn,
  //       resourceDefinitionVersionArn: template.resourceDefinitionVersionArn,
  //       connectorDefinitionVersionArn: template.connectorDefinitionVersionArn
  //     },
  //     role: template.role
  //   })
  // }


  readonly functionDefinitionVersionArn?: string;
  readonly subscriptionDefinitionVersionArn?: string;
  readonly loggerDefinitionVersionArn?: string;
  readonly resourceDefinitionVersionArn?: string;
  readonly deviceDefinitionVersionArn?: string;
  readonly connectorDefinitionVersionArn?: string;
}

