import * as cdk from '@aws-cdk/core';
import { GGLambda } from './functions';
import { Device } from './device';

export abstract class DestinationBase {
    abstract get arn(): string;
}

export class CloudDestination extends DestinationBase {
    get arn(): string {
        return "cloud"
    }
}

export class LocalShadowDestination extends DestinationBase {
    get arn(): string {
        return "GGShadowService"
    }
}

type Destination = CloudDestination | LocalShadowDestination | GGLambda | Device


export interface Subscription {
    topic: string;
    source: Destination;
    target: Destination;
}

  
