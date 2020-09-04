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
import { Construct } from '@aws-cdk/core';
import { CfnThing } from '@aws-cdk/aws-iot';
import * as gg from '@aws-cdk/aws-greengrass';

export interface DeviceProps {
    readonly thing: CfnThing,
    readonly syncShadow: boolean,
    readonly certificateArn: string
}

export class Device extends Construct {
    readonly thing: CfnThing;
    readonly syncShadow: boolean;
    readonly certificateArn: string;
    private id: string;

    constructor(parent: cdk.Construct, id: string, props: DeviceProps) {
        super(parent, id);
        this.thing = props.thing;
        this.syncShadow = props.syncShadow;
        this.certificateArn = props.certificateArn;
        this.id = id;
    }

    resolve(): gg.CfnDeviceDefinition.DeviceProperty {
        return {
            id: this.id,
            thingArn: this.thing.getAtt('arn').toString(),
            certificateArn: this.certificateArn,
            syncShadow: this.syncShadow
        }
    } 
}

