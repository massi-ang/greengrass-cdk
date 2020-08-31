import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import * as gg from '@aws-cdk/aws-greengrass';
import { throws } from 'assert';

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

interface LoggerProps {
    level: Logger.LogLevel,
}

export interface LocalLoggerProps extends LoggerProps {
    space: number;
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
    readonly space: number;
    
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
            space: this.space
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
            space: this.space
        }
    }
}

export class AWSCloudWatchGreengrassLogger extends LoggerBase {
    resolve(): gg.CfnLoggerDefinition.LoggerProperty {
        return {
            id: this.id,
            component: Logger.Component.GREENGRASS,
            level: this.level,
            type: LoggerType.LOCAL,
        }
    }
}

export class AWSCloudWatchUserLambdaLogger extends LoggerBase {
    resolve(): gg.CfnLoggerDefinition.LoggerProperty {
        return {
            id: this.id,
            component: Logger.Component.LAMBDA,
            level: this.level,
            type: LoggerType.LOCAL,
        }
    }
}