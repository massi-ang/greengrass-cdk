/* 
 *  Copyright 2020 Amazon.com or its affiliates
 *  
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as cdk from '@aws-cdk/core';
import { IResolvable, Duration, Size } from '@aws-cdk/core';
import { Resource } from './resource';
import * as lambda from '@aws-cdk/aws-lambda'
import * as gg from '@aws-cdk/aws-greengrass'

export namespace Functions {
    export interface RunAs {
        /**
         * The linux user id of the user executing the process
         */
        readonly uid: number,
        /**
         * The linux group id of the user executing the process
         */
        readonly gid: number
    }

    export enum IsolationMode {
        /**
         * Run lambda function in isolated mode
         */
        CONTAINER_MODE = 'GreengrassContainer',
        /**
         * Run lambda function as processes. This must be used when 
         * running Greengrass in a docker container
         */
        NO_CONTAINER_MODE = 'NoContainer'
    }

    export enum ResourceAccessPermission {
        READ_ONLY = 'ro',
        READ_WRITE = 'rw'
    }

    export interface Execution {
        /** The mode in which the process for the function is run */
        readonly isolationMode: IsolationMode,
        /** The user running the process */
        readonly runAs: RunAs
    }

    export interface ResourceAccessPolicy {
        /**
         * The Resource to associate to this function
         */
        readonly resource: Resource,
        /**
         * The permissions of the function on the resource
         */
        readonly permission: ResourceAccessPermission,
    }

    /**
     * The encoding type of the `event` paramter passed to the handler
     */
    export enum EncodingType {
        JSON = 'json',
        BINARY = 'binary'
    }
}

export interface FunctionProps {
    /**
     * The Lambda function whose code will be used for this Greengrass function
     */
    readonly function: lambda.Function,
    /**
     * THe alias of the function. This is the recommended way to refer to the function
     */
    readonly alias?: lambda.Alias,
    /** The version of the function to use */
    readonly version?: lambda.Version,
    /** If set to true, the function is long running */
    readonly pinned: boolean | IResolvable,
    /** The memory allocated to the lambda */
    readonly memorySize?: Size,
    /** The timeout for the execution of the handler */
    readonly timeout: Duration,
    /** THe name of the executable when using compiled executables */
    readonly executable?: string,
    /** The arguments to pass to the executable */
    readonly execArgs?: string,
    /** The encoding type of the event message. */
    readonly encodingType?: Functions.EncodingType,
    /** Determines if the lambda is run in containerized or non-containerized mode */
    readonly isolationMode?: Functions.IsolationMode,
    /** The user running the lambda */
    readonly runAs?: Functions.RunAs,
    /** The resource access policies for the function to associated resources */
    readonly resourceAccessPolicies?: Functions.ResourceAccessPolicy[],
    /** Environment variables to associate to the Lambda */
    readonly variables?: any,
    /** Allow access to the SysFs */
    readonly accessSysFs?: boolean | IResolvable
}

export class Function extends cdk.Resource {
    //readonly creationStack: string[];
    get reference(): string {
        if (this.alias) {
            return this.alias.aliasName
        } else if (this.version) {
            return this.version.version
        } else {
            throw Error('Either alias or version must be specified')
        }
    }

    constructor(scope: cdk.Construct, id: string, props: FunctionProps) {
        super(scope, id);

        
        this.name = id;
        this.lambdaFunction = props.function;
        this.alias = props.alias;
        this.version = props.version;
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
        
        if (!(this.lambdaFunction.runtime.name === lambda.Runtime.PYTHON_3_7.name ||
            this.lambdaFunction.runtime.name === lambda.Runtime.JAVA_8.name ||
            this.lambdaFunction.runtime.name === lambda.Runtime.NODEJS_8_10.name)) {
            throw new Error(`Invalid Lambda runtime: ${this.lambdaFunction.runtime}. Greengrass functions only support ${lambda.Runtime.PYTHON_3_7}, ${lambda.Runtime.JAVA_8}, and ${lambda.Runtime.NODEJS_8_10}`)
        }
        return {
            functionArn: this.lambdaFunction.functionArn + ':' + this.reference,
            functionConfiguration: {
                environment: {
                    accessSysfs: this.accessSysFs,
                    execution: {
                        isolationMode: this.isolationMode,
                        runAs: this.runAs
                    },
                    resourceAccessPolicies: this.resourceAccessPolicies?.map(convertResourceAccessPolicies),
                    variables: this.variables
                },
                encodingType: this.encodingType,
                execArgs: this.execArgs,
                executable: this.executable,
                memorySize: this.memorySize?.toKibibytes(),
                timeout: this.timeout.toSeconds(),
                pinned: this.pinned
            },
            id: this.name

        }
    }

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
    readonly accessSysFs ?: boolean | IResolvable;
}

function convertResourceAccessPolicies(rap: Functions.ResourceAccessPolicy): gg.CfnFunctionDefinition.ResourceAccessPolicyProperty {
    return {
        resourceId: rap.resource.id,
        permission: rap.permission
    }
}