import { Stack, StackProps } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  MethodOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  spacesLambdaIntegration: LambdaIntegration;
  userPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "SpaceFinderApi");

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "SpacesAoiAuthorizer",
      {
        cognitoUserPools: [props.userPool],
        identitySource: "method.request.header.Authorization",
      },
    );

    authorizer._attachToApi(api);

    const optionsWithAuthorizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };

    const spaceFinderResource = api.root.addResource("spaceFinder");
    spaceFinderResource.addMethod(
      "GET",
      props.spacesLambdaIntegration,
      optionsWithAuthorizer,
    );
    spaceFinderResource.addMethod(
      "POST",
      props.spacesLambdaIntegration,
      optionsWithAuthorizer,
    );
    spaceFinderResource.addMethod(
      "PUT",
      props.spacesLambdaIntegration,
      optionsWithAuthorizer,
    );
    spaceFinderResource.addMethod(
      "DELETE",
      props.spacesLambdaIntegration,
      optionsWithAuthorizer,
    );
  }
}
