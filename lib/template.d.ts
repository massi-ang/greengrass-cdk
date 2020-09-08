import * as cdk from '@aws-cdk/core';
import { Function } from './functions';
import { Subscriptions } from './subscription';
import { LoggerBase } from './logger';
import { Resource } from './resource';
import { Role } from '@aws-cdk/aws-iam';
import { StreamManagerProps } from './group';
export interface GroupTemplateProps {
    readonly functions?: Function[];
    readonly subscriptions?: Subscriptions;
    readonly loggers?: LoggerBase[];
    readonly resources?: Resource[];
    readonly role?: Role;
    readonly streamManager?: StreamManagerProps;
    readonly enableAutomaticIpDiscovery?: boolean;
}
export declare class GroupTemplate extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: GroupTemplateProps);
    private streamManagerEnvironment?;
    readonly functionDefinitionVersionArn?: string;
    readonly subscriptionDefinitionVersionArn?: string;
    readonly loggerDefinitionVersionArn?: string;
    readonly resourceDefinitionVersionArn?: string;
    readonly role?: Role;
}
