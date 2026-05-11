import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export default async function updateSpace(
  event: APIGatewayProxyEvent,
  dbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  if (
    event.queryStringParameters &&
    event.queryStringParameters.id &&
    event.body
  ) {
    const parsedBody = JSON.parse(event.body);
    if (parsedBody.location) {
      const spaceId = event.queryStringParameters.id;
      const updatedLocation = parsedBody.location;
      const dbDocClient = DynamoDBDocumentClient.from(dbClient);
      const updateResult = await dbDocClient.send(
        new UpdateCommand({
          TableName: process.env.SPACE_FINDER_TABLE_NAME,
          Key: { id: spaceId }, // plain string, no {S: ...}
          UpdateExpression: "set #location = :location",
          ExpressionAttributeNames: { "#location": "location" },
          ExpressionAttributeValues: { ":location": updatedLocation }, // plain string
          ReturnValues: "UPDATED_NEW",
        }),
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Space updated successfully",
          attributes: updateResult.Attributes,
        }),
      };
    }
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request" }),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Invalid request" }),
  };
}
