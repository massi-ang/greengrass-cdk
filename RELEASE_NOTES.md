# RELEASE NOTES

## v0.2.0 
2020-09-04

* renamed `greengrass.ts` to `index.ts`, meaning that the import of the library is now `import * as gg from '<folder>/lib'`
* renamed `GGLambda` to `Function` and the `Function` namespace to `Functions`
* modified the `memory` property type of `FunctionProps` from `number` to `cdk.Size`
* modified the `timeout` property type of `FunctionProps` from `number` to `cdk.Duration`
* moved the sample stack application in the `./sample` folder