import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import { CfnThing } from '@aws-cdk/aws-iot';
import * as gg from '@aws-cdk/aws-greengrass';
export interface DeviceProps {
    /**
     * The Thing associated to this Device
     */
    readonly thing: CfnThing;
    /**
     * Enable device shadow synching to the cloud
     */
    readonly syncShadow: boolean;
    /**
     * The certificate Arn used to authenticate
     */
    readonly certificateArn: string;
}
export declare class Device extends Construct {
    /**
     * THe thing associated to this device
     */
    readonly thing: CfnThing;
    /**
     * Local shadow synching to cloud
     */
    readonly syncShadow: boolean;
    /**
     * The certificate arn
     */
    readonly certificateArn: string;
    private id;
    constructor(parent: cdk.Construct, id: string, props: DeviceProps);
    resolve(): gg.CfnDeviceDefinition.DeviceProperty;
}
