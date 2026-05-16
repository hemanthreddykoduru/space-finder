import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import type { AwsCredentialIdentity } from "@smithy/types";
import { AuthService } from "./AuthService";

async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login("divyam", "Q7m#L2x@");
  const idToken = await service.getIdToken();
  console.log(loginResult);
  console.log(idToken);
  const credentials = await service.generateCredentials();

  console.log(credentials);
  const listBucketsResult = await listBuckets(credentials);
  console.log(listBucketsResult);
}

async function listBuckets(credentials: AwsCredentialIdentity) {
  const s3Client = new S3Client({
    credentials,
  });
  const listBucketsResult = await s3Client.send(new ListBucketsCommand({}));
  return listBucketsResult;
}

testAuth();
