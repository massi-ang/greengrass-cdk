import * as cdk from '@aws-cdk/core';
import { Function, Functions } from './functions';
import { Subscriptions } from './subscription';
import { LoggerBase } from './logger';
import { Resource } from './resource';
import { Core } from './core';
import { Device } from './device';
import * as gg from '@aws-cdk/aws-greengrass';
import { GroupTemplate } from './template';
import { Role } from '@aws-cdk/aws-iam';
import { Connector } from './connector';
export interface StreamManagerProps {
    readonly enableStreamManager: boolean;
    readonly allowInsecureAccess?: boolean;
}
export declare enum CloudSpoolerStorageType {
    MEMORY = "Memory",
    FILE_SYSTEM = "FileSystem"
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
    readonly defaultFunctionExecution?: Functions.Execution;
    readonly functions?: Function[];
    readonly subscriptions?: Subscriptions;
    readonly loggers?: LoggerBase[];
    readonly resources?: Resource[];
    readonly devices?: Device[];
    readonly connectors?: Connector[];
    readonly deviceSpecificSubscriptions?: Subscriptions;
    readonly streamManager?: StreamManagerProps;
    readonly enableAutomaticIpDiscovery?: boolean;
    readonly role?: Role;
    readonly initialVersion?: gg.CfnGroup.GroupVersionProperty;
    readonly cloudSpooler?: CloudSpoolerProps;
}
export declare class Group extends cdk.Construct {
    readonly id: string;
    readonly arn: string;
    readonly latestVersionArn: string;
    readonly roleArn?: string;
    constructor(scope: cdk.Construct, id: string, props: GroupProps);
    cloneToNew(id: string, core: Core): Group;
    static fromTemplate(scope: cdk.Construct, id: string, core: Core, template: GroupTemplate): Group;
    private defaultConfig?;
    private streamManagerEnvironment?;
    readonly functionDefinitionVersionArn?: string;
    readonly subscriptionDefinitionVersionArn?: string;
    readonly loggerDefinitionVersionArn?: string;
    readonly resourceDefinitionVersionArn?: string;
    readonly deviceDefinitionVersionArn?: string;
    readonly connectorDefinitionVersionArn?: string;
}
