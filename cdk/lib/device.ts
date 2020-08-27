import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import { CfnThing, CfnCertificate } from '@aws-cdk/aws-iot'

export interface DeviceProps {
    Thing: CfnThing,
    SyncShadow: boolean,
    Certificate: CfnCertificate
}

export class Device extends Construct {
    constructor(parent: cdk.Stack, name: string, props?: DeviceProps) {
        super(parent, name);
    }
}

