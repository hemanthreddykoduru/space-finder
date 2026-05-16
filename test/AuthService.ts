import { Amplify } from "aws-amplify";
import { fetchAuthSession, signIn, SignInOutput } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const awsRegion = "us-west-2";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-west-2_IMFEiBFWl",
      userPoolClientId: "atctpor9vfm35nn52oodqke06",
      identityPoolId: "us-west-2:80d0f433-fbbb-411d-9f10-ff0361b6e14c",
    },
  },
});

export class AuthService {
  public async login(username: string, password: string) {
    const signInResult: SignInOutput = await signIn({
      username,
      password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      },
    });
    return signInResult;
  }

  public async getIdToken() {
    const authSession = await fetchAuthSession();
    return authSession.tokens?.idToken?.toString() ?? "";
  }

  public async generateCredentials() {
    const idToken = await this.getIdToken();
    const congnitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-west-2_IMFEiBFWl`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: "us-west-2:80d0f433-fbbb-411d-9f10-ff0361b6e14c",
        logins: {
          [congnitoIdentityPool]: idToken,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
