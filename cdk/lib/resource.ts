import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import * as gg from '@aws-cdk/aws-greengrass';
import * as uuid from 'uuid'
export interface Resource {
    name: string;
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

export interface LocalDeviceResource extends Resource {
    sourcePath: string,
    groupOwnerSetting: GroupOwnerSetting
}
export interface LocalVolumeResource extends Resource {
    sourcePath: string,
    destinationPath: string,
    groupOwnerSetting: GroupOwnerSetting
}

export interface SageMakerMachimneLearningModelResource extends Resource {
    sageMakerJobArn: string,
    destinationPath: string,
    ownerSettings: OwnerSetting
}

export interface S3MachimneLearningModelResource extends Resource {
    s3Uri: string,
    destinationPath: string
    ownerSettings: OwnerSetting
}


export class ResourceHelper {
    static convertResources(r: Resource): gg.CfnResourceDefinition.ResourceInstanceProperty {
        let resourceData: gg.CfnResourceDefinition.ResourceDataContainerProperty = {}
        if ('s3Uri' in r) {
            let res = r as S3MachimneLearningModelResource;
            resourceData = {
                s3MachineLearningModelResourceData: res
            }
        } else if ('sageMakerJobArn' in r) {
            let res = r as SageMakerMachimneLearningModelResource;
            resourceData = {
                sageMakerMachineLearningModelResourceData: res
            }
        } else if ('destinationPath' in r) {
            let res = r as LocalVolumeResource;
            resourceData = {
                localVolumeResourceData: res
            }
        } else if ('sourcePath' in r) { // Redundant but needed to avoid compiler complaining
            let res = r as LocalDeviceResource;
            resourceData = {
                localDeviceResourceData: res
            }
        }
        return {
            id: uuid.v4(),
            name: r.name,
            resourceDataContainer: resourceData
        }
    }

}
