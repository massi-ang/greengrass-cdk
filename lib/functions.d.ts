import * as cdk from '@aws-cdk/core';
import { IResolvable, Duration, Size } from '@aws-cdk/core';
import { Resource } from './resource';
import * as lambda from '@aws-cdk/aws-lambda';
import * as gg from '@aws-cdk/aws-greengrass';
export declare namespace Functions {
    interface RunAs {
        readonly uid: number;
        readonly gid: number;
    }
    enum IsolationMode {
        CONTAINER_MODE = "GreengrassContainer",
        NO_CONTAINER_MODE = "NoContainer"
    }
    enum ResourceAccessPermission {
        READ_ONLY = "ro",
        READ_WRITE = "rw"
    }
    interface Execution {
        readonly isolationMode: IsolationMode;
        readonly runAs: RunAs;
    }
    interface ResourceAccessPolicy {
        readonly resource: Resource;
        readonly permission: ResourceAccessPermission;
    }
    enum EncodingType {
        JSON = "json",
        BINARY = "binary"
    }
}
export interface FunctionProps {
    readonly function: lambda.Function;
    readonly alias: lambda.Alias;
    readonly pinned: boolean | IResolvable;
    readonly memorySize: Size;
    readonly timeout: Duration;
    readonly executable?: string;
    readonly execArgs?: string;
    readonly encodingType?: Functions.EncodingType;
    readonly isolationMode?: Functions.IsolationMode;
    readonly runAs?: Functions.RunAs;
    readonly resourceAccessPolicies?: Functions.ResourceAccessPolicy[];
    readonly variables?: any;
    readonly accessSysFs?: boolean | IResolvable;
}
export declare class Function extends cdk.Resource {
    constructor(scope: cdk.Construct, id: string, props: FunctionProps);
    addResource(resource: Resource, permission: Functions.ResourceAccessPermission): Function;
    resolve(): gg.CfnFunctionDefinition.FunctionProperty;
    readonly name: string;
    readonly lambdaFunction: lambda.Function;
    readonly alias: lambda.Alias;
    readonly pinned: boolean | IResolvable;
    readonly memorySize: Size;
    readonly timeout: Duration;
    readonly executable?: string;
    readonly execArgs?: string;
    readonly encodingType?: Functions.EncodingType;
    readonly isolationMode?: Functions.IsolationMode;
    readonly runAs?: Functions.RunAs;
    resourceAccessPolicies?: Functions.ResourceAccessPolicy[];
    readonly variables?: any;
    readonly accessSysFs?: boolean | IResolvable;
}
