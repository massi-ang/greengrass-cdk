import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import { CfnThing, CfnCertificate } from '@aws-cdk/aws-iot'

export interface Core {
    thing: CfnThing,
    syncShadow: boolean,
    certificateArn: string
}


