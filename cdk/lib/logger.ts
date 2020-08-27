import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import * as gg from '@aws-cdk/aws-greengrass';
import * as uuid from 'uuid';

export namespace LoggerProps {
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

interface Logger {
    level: LoggerProps.LogLevel,
    component: LoggerProps.Component,
}

export interface LocalLogger extends Logger {
    space: number;
}

export interface AWSCloudWatchLogger extends Logger {
    
}

export class LoggerDefinition extends Construct {
    constructor(parent: cdk.Stack, name: string) {
        super(parent, name);
    }
}


export class LoggerHelper {
    static loggersConverter(l: Logger): gg.CfnLoggerDefinition.LoggerProperty {
        if ('space' in l) {
            let localLogger = l as LocalLogger;
            return {
                id: uuid.v4(),
                component: localLogger.component,
                level: localLogger.level,
                type: LoggerType.LOCAL,
                space: localLogger.space
            }
            
        } else {
            let cloudLogger = l as AWSCloudWatchLogger;
            return {
                id: uuid.v4(),
                component: cloudLogger.component,
                level: cloudLogger.level,
                type: LoggerType.CLOUD,

            }
        }
        
    }
}