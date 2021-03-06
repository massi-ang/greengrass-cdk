# CDK Greengrass L2 Constructs

This project implements a set of constructs wrapping the L1 constructs provided by `@aws-cdk/aws-greengrass` library.

To use this construct run:

```
npm install git+https://github.com/massi-ang/greengrass-cdk.git
```

in your CDK project folder.

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
    subscriptions: subs,
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

let gg_lambda:gg.Function = {
    function: f,
    alias: alias,
    encodingType: gg.Functions.EncodingType.JSON,
    memorySize: cdk.Size.mibibytes(16),
    pinned: false,
    timeout: cdk.Duration.seconds(3),
    variables: new Map([
        ["name": "value"]
    ])
}

let localLogger: gg.LocalLogger = {
    component: gg.LoggerProps.Component.GREENGRASS,
    level: gg.LoggerProps.LogLevel.DEBUG,
    space: 32000
}

let subs = new Subscriptions(this, 'subscriptions')
subs.add(gg_lambda. '#', new CloudDestination())
subs.add(new CloudDestination(), '#', gg_lambda)

new gg.Group(this, 'a_group', {
    core: {
        thing: t,
        syncShadow: true,
        certificateArn: props.certificateArn
    },
    functions: [ gg_lambda ],
    subscriptions: subs,
    loggers: [ localLogger ],
    resources: [ tmp_folder ]
})
```

