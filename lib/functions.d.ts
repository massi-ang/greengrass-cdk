import * as cdk from '@aws-cdk/core';
import { IResolvable, Duration, Size } from '@aws-cdk/core';
import { Resource } from './resource';
import * as lambda from '@aws-cdk/aws-lambda';
import * as gg from '@aws-cdk/aws-greengrass';
export declare namespace Functions {
    interface RunAs {
        /**
         * The linux user id of the user executing the process
         */
        readonly uid: number;
        /**
         * The linux group id of the user executing the process
         */
        readonly gid: number;
    }
    enum IsolationMode {
        /**
         * Run lamnda function in isolated mode
         */
        CONTAINER_MODE = "GreengrassContainer",
        /**
         * Run lambda function as processes. This must be used when
         * running Greengrass in a docker container
         */
        NO_CONTAINER_MODE = "NoContainer"
    }
    enum ResourceAccessPermission {
        READ_ONLY = "ro",
        READ_WRITE = "rw"
    }
    interface Execution {
        /** The mode in which the process for the function is run */
        readonly isolationMode: IsolationMode;
        /** The user running the process */
        readonly runAs: RunAs;
    }
    interface ResourceAccessPolicy {
        /**
         * The Resource to associate to this function
         */
        readonly resource: Resource;
        /**
         * The permissions of the function on the resource
         */
        readonly permission: ResourceAccessPermission;
    }
    /**
     * The encoding type of the `event` paramter passed to the handler
     */
    enum EncodingType {
        JSON = "json",
        BINARY = "binary"
    }
}
export interface FunctionProps {
    /**
     * The Lambda function whose code will be used for this Greengrass function
     */
    readonly function: lambda.Function;
    /**
     * THe alias of the function. This is the recommended way to refer to the function
     */
    readonly alias?: lambda.Alias;
    /** The version of the function to use */
    readonly version?: lambda.Version;
    /** If set to true, the function is long running */
    readonly pinned: boolean | IResolvable;
    /** The memory allocated to the lambda */
    readonly memorySize?: Size;
    /** The timeout for the execution of the handler */
    readonly timeout: Duration;
    /** THe name of the executable when using compiled executables */
    readonly executable?: string;
    /** The arguments to pass to the executable */
    readonly execArgs?: string;
    /** The encoding type of the event message. */
    readonly encodingType?: Functions.EncodingType;
    /** Determines if the lambda is run in containerized or non-containerized mode */
    readonly isolationMode?: Functions.IsolationMode;
    /** The user running the lambda */
    readonly runAs?: Functions.RunAs;
    /** The resource access policies for the function to associated resources */
    readonly resourceAccessPolicies?: Functions.ResourceAccessPolicy[];
    /** Environment variables to associate to the Lambda */
    readonly variables?: any;
    /** Allow access to the SysFs */
    readonly accessSysFs?: boolean | IResolvable;
}
export declare class Function extends cdk.Resource {
    get reference(): string;
    constructor(scope: cdk.Construct, id: string, props: FunctionProps);
    addResource(resource: Resource, permission: Functions.ResourceAccessPermission): Function;
    resolve(): gg.CfnFunctionDefinition.FunctionProperty;
    readonly name: string;
    readonly lambdaFunction: lambda.Function;
    readonly alias?: lambda.Alias;
    readonly version?: lambda.Version;
    readonly pinned: boolean | IResolvable;
    readonly memorySize?: Size;
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
