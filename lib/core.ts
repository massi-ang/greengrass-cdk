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

import * as cdk from '@aws-cdk/core';
import { CfnThing } from '@aws-cdk/aws-iot'
import * as gg from '@aws-cdk/aws-greengrass'

export interface ICore {
    /**
     * The thing acting as core
     */
    readonly thing: CfnThing,

    /**
     * Enables/disables synching of the ThingShadow locally
     */

    syncShadow: boolean,

    /**
     * One of the certificates associated with the thing to authenticate to the cloud
     */
    readonly certificateArn: string
}

export interface CoreProps {
    /**
     * The thing acting as core
     */
    readonly thing: CfnThing,

    /**
     * Enables/disables synching of the ThingShadow locally
     */

    readonly syncShadow: boolean,

    /**
     * One of the certificates associated with the thing to authenticate to the cloud
     */
    readonly certificateArn: string
}

export class Core extends cdk.Resource implements ICore {
    readonly thing: CfnThing;
    readonly certificateArn: string;
    syncShadow: boolean;

    constructor(scope: cdk.Construct, id: string, props: CoreProps) {
        super(scope, id);
        this.thing = props.thing
        this.certificateArn = props.certificateArn
        this.syncShadow = props.syncShadow
    }

    resolve(): gg.CfnCoreDefinitionVersion.CoreProperty {
        return {
            certificateArn: this.certificateArn,
            syncShadow: this.syncShadow,
            thingArn: this.stack.formatArn({
                service: 'iot',
                resource: 'thing',
                resourceName: this.thing.thingName
            }), //`arn:aws:iot:${parent.region}:${parent.account}:thing/${props.core.thing.thingName}`,
            id: '0'
        }
    }

}

