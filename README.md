# Welcome to your CDK Greengrass L2 Constructs

This project implements a set of constructs wrapping the L1 constructs provided by `@aws-cdk/aws-greengrass` library.

## Concepts

To create a new Greengrass group use the `Group` construct.

```typescript
new Group(this, id, {
    core: {
                thing: t,
                syncShadow: true,
                certificateArn: props.certificateArn
            },
    functions: [],
    subscriptions: [],
    loggers: [],
    resources: [],
    connectors: [],
    devices: []
})
```

Where t is a `CfnThing`. Functions, subscriptions, etc are exposed as L2 constructs by this library, and you do not need to work with xxxDefinition and xxxDefintionVersions. All that is managed for you.

An example stack to create a Greengrass Group would then be coded like:

```typescript
let f = new lambda.Function(this, 'f1', {
    ...
})
let alias = f.currentVersion.addAlias('prod')


let t = new iot.CfnThing(this, 'a_thing', {
    thingName: 'MyThing'
})


let tmp_folder: gg.LocalVolumeResource = {
    destinationPath: '/tmp',
    sourcePath: '/home/ec2/tmp',
    groupOwnerSetting: {
        autoAddGroupOwner: true
    },
    name: 'temp'
}

let gg_lambda:gg.GGLambda = {
    function: f,
    alias: alias,
    encodingType: gg.Function.EncodingType.JSON,
    memorySize: 16000,
    pinned: false,
    timeout: 3
}

let localLogger: gg.LocalLogger = {
    component: gg.LoggerProps.Component.GREENGRASS,
    level: gg.LoggerProps.LogLevel.DEBUG,
    space: 32000
}

new gg.Group(this, 'a_group', {
    core: {
        thing: t,
        syncShadow: true,
        certificateArn: props.certificateArn
    },
    functions: [ gg_lambda ],
    subscriptions: [
        {
            source: gg_lambda,
            topic: '#',
            target: new gg.CloudDestination()
        },
        {
            source: new gg.CloudDestination(),
            topic: '#',
            target: gg_lambda
        }
    ],
    loggers: [ localLogger ],
    resources: [ tmp_folder ]
})
```

