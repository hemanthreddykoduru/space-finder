import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  spacesLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "SpaceFinderApi");
    const spaceFinderResource = api.root.addResource("spaceFinder");
    spaceFinderResource.addMethod("GET", props.spacesLambdaIntegration);
    spaceFinderResource.addMethod("POST", props.spacesLambdaIntegration);
    spaceFinderResource.addMethod("PUT", props.spacesLambdaIntegration);
    spaceFinderResource.addMethod("DELETE", props.spacesLambdaIntegration);
  }
}
