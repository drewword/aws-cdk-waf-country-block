import * as cdk from '@aws-cdk/core';
import * as wafv2 from "@aws-cdk/aws-wafv2";
import { Fn } from '@aws-cdk/core';
import * as apigateway from "@aws-cdk/aws-apigateway";

/**
 * CountryCodeBlocker
 *  Creates a WAF ACL and associates it with an API gateway endpoint.
 */
export class CountryCodeBlocker {

    constructor( stack: cdk.Stack, 
                 restAPI: apigateway.RestApi, 
                 region: string,
                 countryCodes: string[]) {

        const ruleDefinition = this.getCountryCodeRule(countryCodes);

        const webacl = new wafv2.CfnWebACL(stack, "country-block-acl", {
            defaultAction: {
                allow: { Type: "ALLOW" },
            },
            scope: "REGIONAL",
            visibilityConfig: {
                cloudWatchMetricsEnabled: false,
                metricName: "waf-country-block-acl",
                sampledRequestsEnabled: false,
            },
            rules: [ ruleDefinition ]
        });

        let apiGwArn = this.getResourceARNForEndpoint(
                    region, 
                    restAPI.deploymentStage.restApi.restApiId, 
                    restAPI.deploymentStage.stageName);

        new wafv2.CfnWebACLAssociation(stack, "mywebaclassoc", {
            webAclArn: webacl.attrArn,
            resourceArn: apiGwArn
        });
    }

    /**
     * getResourceARNForEndpoint
     * @param region 
     * @param restApiId 
     * @param stageName 
     */

    getResourceARNForEndpoint(region:string, restApiId:string, stageName:string ):string {
        let Arn:string = Fn.join("",
            [
                "arn:aws:apigateway:",
                region,
                "::/restapis/",
                restApiId,
                "/stages/",
                stageName
            ]
        );
        return Arn;
    }


    /**
     * getCountryCodeRule
     *  create a WAF rule for use in a CDK WebACL
     * @param countryCodes 
     */
    getCountryCodeRule(countryCodes:string[]): wafv2.CfnWebACL.RuleProperty {

        let ruleProp:wafv2.CfnWebACL.RuleProperty = {
            name: 'mywafrule',
            priority: 0,
            action: {
                block: { block: true }
            },
            statement: {
                geoMatchStatement: {
                    countryCodes: countryCodes
                }
            },
            visibilityConfig: {
                sampledRequestsEnabled: false,
                cloudWatchMetricsEnabled: false,
                metricName: 'visiconfigformetricrule',
            },
        }

        return ruleProp;
    }

}