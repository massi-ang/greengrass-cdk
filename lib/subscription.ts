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
import { Function } from './functions';
import { Device } from './device';
import * as gg from '@aws-cdk/aws-greengrass';

export abstract class DestinationInternal {
    abstract get arn(): string;
}

export class CloudDestination extends DestinationInternal {
    get arn(): string {
        return "cloud"
    }
}

export class LocalShadowDestination extends DestinationInternal {
    get arn(): string {
        return "GGShadowService"
    }
}

type Destination = CloudDestination | LocalShadowDestination | Function | Device


export interface SubscriptionProps {
    readonly topic: string;
    readonly source: Destination;
    readonly target: Destination;
}

export interface SubscriptionsProps {
    readonly subscriptions?: SubscriptionProps[];
}

export class Subscriptions extends cdk.Resource {
    readonly subscriptionList: SubscriptionProps[];

    constructor(scope: cdk.Construct, id: string, props?: SubscriptionsProps) {
        super(scope, id);
        if (props?.subscriptions) {
            this.subscriptionList = props!.subscriptions;
        } else {
            this.subscriptionList = []
        }
    }

    add(source: Destination, topic: string, target: Destination): Subscriptions {
        this.subscriptionList.push({
            source: source,
            target: target,
            topic: topic
        })
        return this;
    }

    resolve(): gg.CfnSubscriptionDefinition.SubscriptionProperty[] {

        let source: string;
        let target: string;

        const res = this.subscriptionList.map((s, i) => {
            
            if ('lambdaFunction' in s.source) {
                let f = (s.source as Function);
                source = f.lambdaFunction.functionArn + ':' + f.reference;
            } else {
                let d = (s.source as DestinationInternal);
                source = d.arn
            }

            if ('lambdaFunction' in s.target) {
                let f = (s.target as Function);
                target = f.lambdaFunction.functionArn + ':' + f.reference;
            } else {
                let d = (s.target as DestinationInternal);
                target = d.arn
            }
            return {
                id: `${i}`,
                source: source,
                target: target,
                subject: s.topic
            }
        })  
        return res;
    }
}

