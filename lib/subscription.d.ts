import * as cdk from '@aws-cdk/core';
import { Function } from './functions';
import { Device } from './device';
import * as gg from '@aws-cdk/aws-greengrass';
export declare abstract class DestinationInternal {
    abstract get arn(): string;
}
export declare class AWSIoTCloud extends DestinationInternal {
    get arn(): string;
}
export declare class LocalShadow extends DestinationInternal {
    get arn(): string;
}
declare type Destination = AWSIoTCloud | LocalShadow | Function | Device;
export interface SubscriptionProps {
    readonly topic: string;
    readonly source: Destination;
    readonly target: Destination;
}
export interface SubscriptionsProps {
    readonly subscriptions?: SubscriptionProps[];
}
export declare class Subscriptions extends cdk.Resource {
    readonly subscriptionList: SubscriptionProps[];
    constructor(scope: cdk.Construct, id: string, props?: SubscriptionsProps);
    add(source: Destination, topic: string, target: Destination): Subscriptions;
    resolve(): gg.CfnSubscriptionDefinition.SubscriptionProperty[];
}
export {};
