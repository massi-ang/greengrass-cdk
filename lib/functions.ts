import * as cdk from '@aws-cdk/core';
import { IResolvable, Duration, Size } from '@aws-cdk/core';
import { Resource } from './resource';
import * as lambda from '@aws-cdk/aws-lambda'
import * as gg from '@aws-cdk/aws-greengrass'

export namespace Functions {
    export interface RunAs {
        readonly uid: number,
        readonly gid: number
    }

    export enum IsolationMode {
        CONTAINER_MODE = 'GreengrassContainer',
        NO_CONTAINER_MODE = 'NoContainer'
    }

    export enum ResourceAccessPermission {
        READ_ONLY = 'ro',
        READ_WRITE = 'rw'
    }

    export interface Execution {
        readonly isolationMode: IsolationMode,
        readonly runAs: RunAs
    }

    export interface ResourceAccessPolicy {
        readonly resource: Resource,
        readonly permission: ResourceAccessPermission,
    }

    export enum EncodingType {
        JSON = 'json',
        BINARY = 'binary'
    }
}

export interface FunctionProps {
    readonly function: lambda.Function,
    readonly alias: lambda.Alias,
    readonly pinned: boolean | IResolvable,
    readonly memorySize: Size,
    readonly timeout: Duration,
    readonly executable?: string,
    readonly execArgs?: string,
    readonly encodingType?: Functions.EncodingType,
    readonly isolationMode?: Functions.IsolationMode,
    readonly runAs?: Functions.RunAs,
    readonly resourceAccessPolicies?: Functions.ResourceAccessPolicy[],
    readonly variables?: any,
    readonly accessSysFs?: boolean | IResolvable
}

export class Function extends cdk.Resource {
    //readonly creationStack: string[];
    constructor(scope: cdk.Construct, id: string, props: FunctionProps) {
        super(scope, id);

        // if (!(props.function.runtime === lambda.Runtime.PYTHON_3_7 ||
        //     props.function.runtime === lambda.Runtime.JAVA_8 ||
        //     props.function.runtime === lambda.Runtime.NODEJS_8_10)) {
        //     throw new Error(`Invalid Lambda runtime: ${props.function.runtime}. Greengrass functions only support ${lambda.Runtime.PYTHON_3_7}, ${lambda.Runtime.JAVA_8}, and ${lambda.Runtime.NODEJS_8_10}`)
        // }
        this.name = id;
        this.lambdaFunction = props.function;
        this.alias = props.alias;
        this.pinned = props.pinned;
        this.memorySize = props.memorySize;
        this.timeout = props.timeout;
        this.executable = props.executable; 
        this.execArgs = props.execArgs; 
        this.encodingType = props.encodingType; 
        this.isolationMode = props.isolationMode; 
        this.runAs = props.runAs; 
        this.resourceAccessPolicies = props.resourceAccessPolicies; 
        this.variables = props.variables; 
        this.accessSysFs = props.accessSysFs; 
    }

    addResource(resource: Resource, permission: Functions.ResourceAccessPermission): Function {
        if (this.resourceAccessPolicies == undefined) {
            this.resourceAccessPolicies = []
        }
        this.resourceAccessPolicies?.push({
            permission: permission,
            resource: resource
        })
        return this;
    }

    resolve(): gg.CfnFunctionDefinition.FunctionProperty {
        return {
            functionArn: this.lambdaFunction.functionArn + ':' + this.alias.aliasName,
            functionConfiguration: {
                environment: {
                    accessSysfs: this.accessSysFs,
                    execution: {
                        isolationMode: this.isolationMode,
                        runAs: this.runAs
                    },
                    resourceAccessPolicies: this.resourceAccessPolicies?.map(convertResouceAccessPolicies),
                    variables: this.variables
                },
                encodingType: this.encodingType,
                execArgs: this.execArgs,
                executable: this.executable,
                memorySize: this.memorySize.toKibibytes(),
                timeout: this.timeout.toSeconds(),
                pinned: this.pinned
            },
            id: this.name

        }
    }

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
    readonly accessSysFs ?: boolean | IResolvable;
}

function convertResouceAccessPolicies(rap: Functions.ResourceAccessPolicy): gg.CfnFunctionDefinition.ResourceAccessPolicyProperty {
    return {
        resourceId: rap.resource.id,
        permission: rap.permission
    }
}