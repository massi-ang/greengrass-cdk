import * as cdk from '@aws-cdk/core';
import { CfnThing } from '@aws-cdk/aws-iot';
import * as gg from '@aws-cdk/aws-greengrass';
export interface ICore {
    /**
     * The thing acting as core
     */
    readonly thing: CfnThing;
    /**
     * Enables/disables synching of the ThingShadow locally
     */
    syncShadow: boolean;
    /**
     * One of the certificates associated with the thing to authenticate to the cloud
     */
    readonly certificateArn: string;
}
export interface CoreProps {
    /**
     * The thing acting as core
     */
    readonly thing: CfnThing;
    /**
     * Enables/disables synching of the ThingShadow locally
     */
    readonly syncShadow: boolean;
    /**
     * One of the certificates associated with the thing to authenticate to the cloud
     */
    readonly certificateArn: string;
}
export declare class Core extends cdk.Resource implements ICore {
    /**
     * The Thing associated to this Core
     */
    readonly thing: CfnThing;
    /**
     * The certificate Arn used to authenticate to AWS IoT Core
     */
    readonly certificateArn: string;
    syncShadow: boolean;
    constructor(scope: cdk.Construct, id: string, props: CoreProps);
    resolve(): gg.CfnCoreDefinitionVersion.CoreProperty;
}
