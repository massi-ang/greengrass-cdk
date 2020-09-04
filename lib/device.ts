import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import { CfnThing } from '@aws-cdk/aws-iot';
import * as gg from '@aws-cdk/aws-greengrass';

export interface DeviceProps {
    readonly thing: CfnThing,
    readonly syncShadow: boolean,
    readonly certificateArn: string
}

export class Device extends Construct {
    readonly thing: CfnThing;
    readonly syncShadow: boolean;
    readonly certificateArn: string;
    private id: string;

    constructor(parent: cdk.Construct, id: string, props: DeviceProps) {
        super(parent, id);
        this.thing = props.thing;
        this.syncShadow = props.syncShadow;
        this.certificateArn = props.certificateArn;
        this.id = id;
    }

    resolve(): gg.CfnDeviceDefinition.DeviceProperty {
        return {
            id: this.id,
            thingArn: this.thing.getAtt('arn').toString(),
            certificateArn: this.certificateArn,
            syncShadow: this.syncShadow
        }
    } 
}

