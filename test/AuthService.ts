import { Amplify } from "aws-amplify";
import { fetchAuthSession, signIn, SignInOutput } from "@aws-amplify/auth";

const awsRegion = "us-west-2";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-west-2_IMFEiBFWl",
      userPoolClientId: "atctpor9vfm35nn52oodqke06",
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
    return authSession.tokens?.idToken?.toString();
  }
}
