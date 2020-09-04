import * as cdk from '@aws-cdk/core';
import { Function } from './functions';
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

    addToCloud(source: Destination, topic: string): Subscriptions {
        this.subscriptionList.push({
            source: source,
            target: new CloudDestination(),
            topic: topic
        })   
        return this;
    }

    addFromCloud(target: Destination, topic: string): Subscriptions {
        this.subscriptionList.push({
            source: new CloudDestination(),
            topic: topic,
            target: target
        })
        return this;
    }

    addToLocalShadow(source: Destination, topic: string): Subscriptions {
        this.subscriptionList.push({
            source: source,
            topic: topic,
            target: new LocalShadowDestination()
        })
        return this;
    }

    addFromLocalShadow(target: Destination, topic: string): Subscriptions {
        this.subscriptionList.push({
            source: new LocalShadowDestination(),
            topic: topic,
            target: target
        });
        return this;
    }

    resolve(): gg.CfnSubscriptionDefinition.SubscriptionProperty[] {

        let source: string;
        let target: string;
        return this.subscriptionList.map(s => {
            
            if ('function' in s.source) {
                let f = (s.source as Function);
                source = f.lambdaFunction.functionArn + ':' + f.alias.aliasName;
            } else {
                let d = (s.source as DestinationBase);
                source = d.arn
            }

            if ('function' in s.target) {
                let f = (s.target as Function);
                target = f.lambdaFunction.functionArn + ':' + f.alias.aliasName;
            } else {
                let d = (s.target as DestinationBase);
                target = d.arn
            }
            return {
                id: `${source}.${s.topic}.${target}`,
                source: source,
                target: target,
                subject: s.topic
            }
        })

        
    }
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
            let f = (this.source as Function);
            source = f.lambdaFunction.functionArn + ':' + f.alias.aliasName;
        } else {
            let d = (this.source as DestinationBase);
            source = d.arn
        }

        if ('function' in this.target) {
            let f = (this.target as Function);
            target = f.lambdaFunction.functionArn + ':' + f.alias.aliasName;
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

  
