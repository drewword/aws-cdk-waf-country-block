import * as cdk from '@aws-cdk/core';
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";

export class HelloWorldLambda {

    restAPI: apigateway.RestApi;

    constructor(stack: cdk.Stack) {
        const handler = new lambda.Function(stack,
            "wafreadyapi", {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.asset("resources"),
            handler: "wafreadyapi.main",
        });
        this.restAPI = new apigateway.RestApi(stack, "hello-world-api", {
            restApiName: "HelloWorldWAFLambda",
            description: "Simple hello world lambda."
        });
        const apiIntegration = new apigateway.LambdaIntegration(handler, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        });
        this.restAPI.root.addMethod("GET", apiIntegration);
    }
}