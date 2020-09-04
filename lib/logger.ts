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
import {  Size } from '@aws-cdk/core';
import * as gg from '@aws-cdk/aws-greengrass';

export namespace Logger {
    export enum Component {
        LAMBDA = 'Lambda',
        GREENGRASS = 'GreengrassSystem'
    }

    export enum LogLevel {
        ERROR = 'ERROR',
        DEBUG = 'DEBUG',
        INFO = 'INFO',
        WARN = 'WARN',
        FATAL = 'FATAL'
    }   
}

enum LoggerType {
    LOCAL = 'FileSystem',
    CLOUD = 'AWSCloudWatch'
}

export interface LoggerProps {
    readonly level: Logger.LogLevel,
}

export interface LocalLoggerProps extends LoggerProps {
    readonly space: cdk.Size;
}

export abstract class LoggerBase extends cdk.Resource {
    readonly level: Logger.LogLevel;
    protected id: string;

    constructor(scope: cdk.Construct, id: string, props: LoggerProps) {
        super(scope, id);
        this.level = props.level;
        this.id = id;
    }

    abstract resolve(): gg.CfnLoggerDefinition.LoggerProperty;
}

abstract class LocalLogger extends LoggerBase {
    readonly space: Size;
    
    constructor(scope: cdk.Construct, id: string, props: LocalLoggerProps) {
        super(scope, id, props);
        this.space = props.space;
    }
}

export class LocalGreengrassLogger extends LocalLogger {
    resolve(): gg.CfnLoggerDefinition.LoggerProperty {
        return {
            id: this.id,
            component: Logger.Component.GREENGRASS,
            level: this.level,
            type: LoggerType.LOCAL,
            space: this.space.toKibibytes()
        }
    }
}

export class LocalUserLambdaLogger extends LocalLogger {
    resolve(): gg.CfnLoggerDefinition.LoggerProperty {
        return {
            id: this.id,
            component: Logger.Component.LAMBDA,
            level: this.level,
            type: LoggerType.LOCAL,
            space: this.space.toKibibytes()
        }
    }
}

export class AWSCloudWatchGreengrassLogger extends LoggerBase {
    resolve(): gg.CfnLoggerDefinition.LoggerProperty {
        return {
            id: this.id,
            component: Logger.Component.GREENGRASS,
            level: this.level,
            type: LoggerType.CLOUD,
        }
    }
}

export class AWSCloudWatchUserLambdaLogger extends LoggerBase {
    resolve(): gg.CfnLoggerDefinition.LoggerProperty {
        return {
            id: this.id,
            component: Logger.Component.LAMBDA,
            level: this.level,
            type: LoggerType.CLOUD,
        }
    }
}