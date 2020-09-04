import * as cdk from '@aws-cdk/core';
import * as gg from '@aws-cdk/aws-greengrass';

export interface ResourceProps {
    readonly name: string
}

export enum Permission {
    READ_ONLY = 'ro',
    READ_WRITE = 'rw'
}

export interface OwnerSetting {
    readonly groupOwner: string,
    readonly groupPermission: Permission
}

export interface GroupOwnerSetting  {
    readonly groupOwner?: string,
    readonly autoAddGroupOwner: boolean
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
    readonly sageMakerJobArn: string,
    readonly destinationPath: string,
    readonly ownerSettings: OwnerSetting
}

export interface S3MachineLearningModelResourceProps extends ResourceProps {
    readonly s3Uri: string,
    readonly destinationPath: string
    readonly ownerSettings: OwnerSetting
}


export abstract class Resource extends cdk.Resource {
    readonly id: string;
    readonly name: string;

    constructor(scope: cdk.Construct, id: string, props: ResourceProps) {
        super(scope, id)
        this.id = id
        this.name = props.name
    }

    abstract resolve(): gg.CfnResourceDefinition.ResourceInstanceProperty;
} 


export class LocalDeviceResource extends Resource {
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
            name: this.name,
            resourceDataContainer: {
                localDeviceResourceData: {
                    sourcePath: this.sourcePath,
                    groupOwnerSetting: this.groupOwnerSetting
                }
            }
        }
    }
}

export class LocalVolumeResource extends Resource {
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

export class SageMakerMachineLearningModelResource extends Resource {
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


export class S3MachineLearningModelResource extends Resource {
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
            name: this.name,
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