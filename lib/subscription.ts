import * as cdk from '@aws-cdk/core';
import { GGLambda } from './functions';
import { Device } from './device';
import * as gg from '@aws-cdk/aws-greengrass';
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


export interface SubscriptionProps {
    topic: string;
    source: Destination;
    target: Destination;
}

export class Subscription extends cdk.Resource {
    readonly topic: string;
    readonly source: Destination;
    readonly target: Destination;
    private id: string;

    constructor(scope: cdk.Construct, id: string, props: SubscriptionProps) {
        super(scope, id);
        this.id = id;
        this.topic = props.topic;
        this.source = props.source;
        this.target = props.target;
    }

    static toCloud(scope: cdk.Construct, id: string, source: Destination, topic: string): Subscription {
        return new Subscription(scope, id, {
            source: source,
            topic: topic, 
            target: new CloudDestination()

        } )
    }

    static fromCloud(scope: cdk.Construct, id: string, target: Destination, topic: string): Subscription {
        return new Subscription(scope, id, {
            source: new CloudDestination(),
            topic: topic,
            target: target
        })
    }

    static toLocalShadow(scope: cdk.Construct, id: string, source: Destination, topic: string): Subscription {
        return new Subscription(scope, id, {
            source: source,
            topic: topic,
            target: new LocalShadowDestination()

        })
    }

    static fromLocalShadow(scope: cdk.Construct, id: string, target: Destination, topic: string): Subscription {
        return new Subscription(scope, id, {
            source: new LocalShadowDestination(),
            topic: topic,
            target: target
        })
    }

    resolve(): gg.CfnSubscriptionDefinition.SubscriptionProperty {
        let source: string;
        let target: string;

        if ('function' in this.source) {
            let f = (this.source as GGLambda);
            source = f.function.functionArn + ':' + f.alias.aliasName;
        } else {
            let d = (this.source as DestinationBase);
            source = d.arn
        }

        if ('function' in this.target) {
            let f = (this.target as GGLambda);
            target = f.function.functionArn + ':' + f.alias.aliasName;
        } else {
            let d = (this.target as DestinationBase);
            target = d.arn
        }
        return {
            id: this.id,
            source: source,
            target: target,
            subject: this.topic
        }
    }
}

  
