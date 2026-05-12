import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { belongsToAdminGroup } from "../shared/Utils";

export default async function deleteSpace(
  event: APIGatewayProxyEvent,
  dbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  if (!belongsToAdminGroup(event)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  if (event.queryStringParameters && event.queryStringParameters.id) {
    const spaceId = event.queryStringParameters.id;
    const dbDocClient = DynamoDBDocumentClient.from(dbClient);
    const deleteResult = await dbDocClient.send(
      new DeleteCommand({
        TableName: process.env.SPACE_FINDER_TABLE_NAME,
        Key: { id: spaceId },
        ReturnValues: "ALL_OLD",
      }),
    );
    if (!deleteResult.Attributes) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Space not found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Space deleted successfully" }),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Invalid request" }),
  };
}
