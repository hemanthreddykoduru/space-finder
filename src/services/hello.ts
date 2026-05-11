// exports.main = async function (event, context) {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: `Hello, I will read from ${process.env.SPACE_FINDER_TABLE_NAME}`,
//     }),
//   };
// };

import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { idGenerator } from "./shared/Utils";

const s3Client = new S3Client({});

async function handler(event: APIGatewayProxyEvent, context: Context) {
  const command = new ListBucketsCommand({});
  const listBucketsResult = (await s3Client.send(command)).Buckets;
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, I will read from ${process.env.SPACE_FINDER_TABLE_NAME}. This is the id: ${idGenerator()}. I will list the buckets: ${listBucketsResult?.map((bucket) => bucket?.Name).join(", ")}`,
    }),
  };
  console.log(event);
  return response;
}

export { handler };
