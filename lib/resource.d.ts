import * as cdk from '@aws-cdk/core';
import * as gg from '@aws-cdk/aws-greengrass';
export interface ResourceProps {
    readonly name: string;
}
export declare enum Permission {
    READ_ONLY = "ro",
    READ_WRITE = "rw"
}
export interface OwnerSetting {
    readonly groupOwner: string;
    readonly groupPermission: Permission;
}
export interface GroupOwnerSetting {
    readonly groupOwner?: string;
    readonly autoAddGroupOwner: boolean;
}
export interface LocalDeviceResourceProps extends ResourceProps {
    readonly sourcePath: string;
    readonly groupOwnerSetting: GroupOwnerSetting;
}
export interface LocalVolumeResourceProps extends ResourceProps {
    readonly sourcePath: string;
    readonly destinationPath: string;
    readonly groupOwnerSetting: GroupOwnerSetting;
}
export interface SageMakerMachineLearningModelResourceProps extends ResourceProps {
    readonly sageMakerJobArn: string;
    readonly destinationPath: string;
    readonly ownerSettings: OwnerSetting;
}
export interface S3MachineLearningModelResourceProps extends ResourceProps {
    readonly s3Uri: string;
    readonly destinationPath: string;
    readonly ownerSettings: OwnerSetting;
}
export declare abstract class Resource extends cdk.Resource {
    readonly id: string;
    readonly name: string;
    constructor(scope: cdk.Construct, id: string, props: ResourceProps);
    abstract resolve(): gg.CfnResourceDefinition.ResourceInstanceProperty;
}
export declare class LocalDeviceResource extends Resource {
    constructor(scope: cdk.Construct, id: string, props: LocalDeviceResourceProps);
    readonly sourcePath: string;
    readonly groupOwnerSetting: GroupOwnerSetting;
    resolve(): gg.CfnResourceDefinition.ResourceInstanceProperty;
}
export declare class LocalVolumeResource extends Resource {
    constructor(scope: cdk.Construct, id: string, props: LocalVolumeResourceProps);
    readonly sourcePath: string;
    readonly destinationPath: string;
    readonly groupOwnerSetting: GroupOwnerSetting;
    resolve(): gg.CfnResourceDefinition.ResourceInstanceProperty;
}
export declare class SageMakerMachineLearningModelResource extends Resource {
    constructor(scope: cdk.Construct, id: string, props: SageMakerMachineLearningModelResourceProps);
    readonly sageMakerJobArn: string;
    readonly destinationPath: string;
    readonly ownerSetting: OwnerSetting;
    resolve(): gg.CfnResourceDefinition.ResourceInstanceProperty;
}
export declare class S3MachineLearningModelResource extends Resource {
    constructor(scope: cdk.Construct, id: string, props: S3MachineLearningModelResourceProps);
    readonly s3Uri: string;
    readonly destinationPath: string;
    readonly ownerSetting: OwnerSetting;
    resolve(): gg.CfnResourceDefinition.ResourceInstanceProperty;
}
