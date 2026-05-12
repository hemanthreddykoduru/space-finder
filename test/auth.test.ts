import { AuthService } from "./AuthService";

async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login("divyam", "Q7m#L2x@");
  const idToken = await service.getIdToken();
  console.log(loginResult);
  console.log(idToken);
}

testAuth();
