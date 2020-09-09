import * as cdk from '@aws-cdk/core';
import { Core } from './core';
import { Device } from './device';
import * as gg from '@aws-cdk/aws-greengrass';
import { GroupTemplateProps } from './template';
export interface GroupProps extends GroupTemplateProps {
    readonly core: Core;
    readonly devices?: Device[];
    readonly initialVersion?: gg.CfnGroup.GroupVersionProperty;
}
export declare class Group extends cdk.Construct {
    readonly id: string;
    readonly arn: string;
    readonly latestVersionArn: string;
    readonly roleArn?: string;
    constructor(scope: cdk.Construct, id: string, props: GroupProps);
    cloneToNew(id: string, core: Core): Group;
    readonly functionDefinitionVersionArn?: string;
    readonly subscriptionDefinitionVersionArn?: string;
    readonly loggerDefinitionVersionArn?: string;
    readonly resourceDefinitionVersionArn?: string;
    readonly deviceDefinitionVersionArn?: string;
    readonly connectorDefinitionVersionArn?: string;
}
