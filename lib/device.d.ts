import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import { CfnThing } from '@aws-cdk/aws-iot';
import * as gg from '@aws-cdk/aws-greengrass';
export interface DeviceProps {
    readonly thing: CfnThing;
    readonly syncShadow: boolean;
    readonly certificateArn: string;
}
export declare class Device extends Construct {
    readonly thing: CfnThing;
    readonly syncShadow: boolean;
    readonly certificateArn: string;
    private id;
    constructor(parent: cdk.Construct, id: string, props: DeviceProps);
    resolve(): gg.CfnDeviceDefinition.DeviceProperty;
}
