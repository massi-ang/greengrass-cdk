import * as cdk from '@aws-cdk/core';
import { Function, Functions } from './functions';
import { Subscriptions } from './subscription';
import { LoggerBase } from './logger';
import { Resource } from './resource';
import { Connector } from './connectors';
import { Core } from './core';
import { Device } from './device';
import { Group } from './group';
import { Role } from '@aws-cdk/aws-iam';
import { Size } from '@aws-cdk/core';
export interface StreamManagerProps {
    readonly enableStreamManager: boolean;
    readonly allowInsecureAccess?: boolean;
    readonly storeRootDir?: string;
    readonly serverPort?: number;
    readonly exporterMaximumBandwidth?: number;
    readonly threadPoolSize?: number;
    readonly jvmArgs?: string;
    readonly readOnlyDirs?: string[];
    readonly minSizeMultipartUpload?: Size;
    readonly memorySize?: Size;
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
export interface GroupOptionsProps {
    readonly core: Core;
    readonly devices?: Device[];
    readonly deviceSpecificSubscriptions?: Subscriptions;
    readonly role?: Role;
}
export interface GroupTemplateProps {
    readonly defaultFunctionExecution?: Functions.Execution;
    readonly functions?: Function[];
    readonly subscriptions?: Subscriptions;
    readonly loggers?: LoggerBase[];
    readonly resources?: Resource[];
    readonly connectors?: Connector[];
    readonly streamManager?: StreamManagerProps;
    readonly enableAutomaticIpDiscovery?: boolean;
    readonly role?: Role;
    readonly cloudSpooler?: CloudSpoolerProps;
}
export declare class GroupTemplate extends cdk.Construct {
    private _subscriptions?;
    constructor(scope: cdk.Construct, id: string, props: GroupTemplateProps);
    createGroup(id: string, options: GroupOptionsProps): Group;
    private streamManagerEnvironment?;
    private defaultConfig?;
    readonly subscriptionDefinitionVersionArn?: string;
    readonly functionDefinitionVersionArn?: string;
    readonly loggerDefinitionVersionArn?: string;
    readonly resourceDefinitionVersionArn?: string;
    readonly connectorDefinitionVersionArn?: string;
    readonly role?: Role;
}
