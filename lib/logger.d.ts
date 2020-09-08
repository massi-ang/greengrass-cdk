import * as cdk from '@aws-cdk/core';
import { Size } from '@aws-cdk/core';
import * as gg from '@aws-cdk/aws-greengrass';
export declare namespace Logger {
    enum Component {
        LAMBDA = "Lambda",
        GREENGRASS = "GreengrassSystem"
    }
    enum LogLevel {
        ERROR = "ERROR",
        DEBUG = "DEBUG",
        INFO = "INFO",
        WARN = "WARN",
        FATAL = "FATAL"
    }
}
export interface LoggerProps {
    readonly level: Logger.LogLevel;
}
export interface LocalLoggerProps extends LoggerProps {
    readonly space: cdk.Size;
}
export declare abstract class LoggerBase extends cdk.Resource {
    readonly level: Logger.LogLevel;
    protected id: string;
    constructor(scope: cdk.Construct, id: string, props: LoggerProps);
    abstract resolve(): gg.CfnLoggerDefinition.LoggerProperty;
}
declare abstract class LocalLogger extends LoggerBase {
    readonly space: Size;
    constructor(scope: cdk.Construct, id: string, props: LocalLoggerProps);
}
export declare class LocalGreengrassLogger extends LocalLogger {
    resolve(): gg.CfnLoggerDefinition.LoggerProperty;
}
export declare class LocalUserLambdaLogger extends LocalLogger {
    resolve(): gg.CfnLoggerDefinition.LoggerProperty;
}
export declare class AWSCloudWatchGreengrassLogger extends LoggerBase {
    resolve(): gg.CfnLoggerDefinition.LoggerProperty;
}
export declare class AWSCloudWatchUserLambdaLogger extends LoggerBase {
    resolve(): gg.CfnLoggerDefinition.LoggerProperty;
}
export {};
