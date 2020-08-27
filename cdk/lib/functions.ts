import * as cdk from '@aws-cdk/core';
import { Construct, IResolvable } from '@aws-cdk/core';
import { Resource } from './resource';
import * as lambda from '@aws-cdk/aws-lambda'

/** Functions
 *
 */

export namespace Function {
    export interface RunAs {
        uid: number,
        gid: number
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
        isolationMode: IsolationMode,
        runAs: RunAs
    }

    export interface ResourceAccessPolicy {
        resource: Resource,
        permission: ResourceAccessPermission,
    }

    export interface Environment {
        variables?: Map<String, String>,
        resourceAccessPolicies?: ResourceAccessPolicy[],
        accessSysFs?: boolean,
        execution?: Execution
    }

    export enum EncodingType {
        JSON = 'json',
        BINARY = 'binary'
    }
}
export interface GGLambda {
    function: lambda.Function,
    alias: lambda.Alias,
    pinned: boolean | IResolvable,
    memorySize: number,
    timeout: number,
    executable?: string,
    execArgs?: string,
    encodingType?: Function.EncodingType,
    isolationMode?: Function.IsolationMode,
    runAs?: Function.RunAs,
    resourceAccessPolicies?: Function.ResourceAccessPolicy[],
    variables?: Map<string, string>,
    accessSysFs?: boolean | IResolvable
}

export interface FunctionDefinitionProps {
    execution: Function.Execution
}