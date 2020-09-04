import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import * as gg from '@aws-cdk/aws-greengrass';
export interface IResource {
}

export interface ResourceProps {
}

export enum Permission {
    READ_ONLY = 'ro',
    READ_WRITE = 'rw'
}

export interface OwnerSetting {
    groupOwner: string,
    groupPermission: Permission
}

export interface GroupOwnerSetting  {
    groupOwner?: string,
    autoAddGroupOwner: boolean
}

export interface LocalDeviceResourceProps extends ResourceProps {
    readonly sourcePath: string,
    readonly groupOwnerSetting: GroupOwnerSetting
}
export interface LocalVolumeResourceProps extends ResourceProps {
    readonly sourcePath: string,
    readonly destinationPath: string,
    readonly groupOwnerSetting: GroupOwnerSetting
}

export interface SageMakerMachineLearningModelResourceProps extends ResourceProps {
    sageMakerJobArn: string,
    destinationPath: string,
    ownerSettings: OwnerSetting
}

export interface S3MachineLearningModelResourceProps extends ResourceProps {
    s3Uri: string,
    destinationPath: string
    ownerSettings: OwnerSetting
}


export abstract class GGResource extends cdk.Resource {
    readonly id: string;
    constructor(scope: cdk.Construct, id: string, props: ResourceProps) {
        super(scope, id)
        this.id = id
    }

    abstract resolve(): gg.CfnResourceDefinition.ResourceInstanceProperty;
} 


export class LocalDeviceResource extends GGResource {
    constructor(scope: cdk.Construct, id: string, props: LocalDeviceResourceProps) {
        super(scope, id, props)
        this.sourcePath = props.sourcePath
        this.groupOwnerSetting = props.groupOwnerSetting
    }

    readonly sourcePath: string;
    readonly groupOwnerSetting: GroupOwnerSetting;

    resolve(): gg.CfnResourceDefinition.ResourceInstanceProperty {
        return {
            id: this.id,
            name: this.id,
            resourceDataContainer: {
                localDeviceResourceData: {
                    sourcePath: this.sourcePath,
                    groupOwnerSetting: this.groupOwnerSetting
                }
            }
        }
    }
}

export class LocalVolumeResource extends GGResource {
    constructor(scope: cdk.Construct, id: string, props: LocalVolumeResourceProps) {
        super(scope, id, props)
        this.sourcePath = props.sourcePath
        this.groupOwnerSetting = props.groupOwnerSetting
        this.destinationPath = props.destinationPath
    }

    readonly sourcePath: string;
    readonly destinationPath: string;
    readonly groupOwnerSetting: GroupOwnerSetting;

    resolve(): gg.CfnResourceDefinition.ResourceInstanceProperty {
        return {
            id: this.id,
            name: this.id,
            resourceDataContainer: {
                localVolumeResourceData: {
                    sourcePath: this.sourcePath,
                    groupOwnerSetting: this.groupOwnerSetting,
                    destinationPath: this.destinationPath
                }
            }
        }
    }
}

export class SageMakerMachineLearningModelResource extends GGResource {
    constructor(scope: cdk.Construct, id: string, props: SageMakerMachineLearningModelResourceProps) {
        super(scope, id, props)
        this.sageMakerJobArn = props.sageMakerJobArn
        this.ownerSetting = props.ownerSettings
        this.destinationPath = props.destinationPath
    }

    readonly sageMakerJobArn: string;
    readonly destinationPath: string;
    readonly ownerSetting: OwnerSetting;

    resolve(): gg.CfnResourceDefinition.ResourceInstanceProperty {
        return {
            id: this.id,
            name: this.id,
            resourceDataContainer: {
                sageMakerMachineLearningModelResourceData: {
                    sageMakerJobArn: this.sageMakerJobArn,
                    ownerSetting: this.ownerSetting,
                    destinationPath: this.destinationPath
                }
            }
        }
    }
}


export class S3MachineLearningModelResource extends GGResource {
    constructor(scope: cdk.Construct, id: string, props: S3MachineLearningModelResourceProps) {
        super(scope, id, props)
        this.s3Uri = props.s3Uri
        this.ownerSetting = props.ownerSettings
        this.destinationPath = props.destinationPath
    }

    readonly s3Uri: string;
    readonly destinationPath: string;
    readonly ownerSetting: OwnerSetting;

    resolve(): gg.CfnResourceDefinition.ResourceInstanceProperty {
        return {
            id: this.id,
            name: this.id,
            resourceDataContainer: {
                s3MachineLearningModelResourceData: {
                    s3Uri: this.s3Uri,
                    ownerSetting: this.ownerSetting,
                    destinationPath: this.destinationPath
                }
            }
        }
    }
}