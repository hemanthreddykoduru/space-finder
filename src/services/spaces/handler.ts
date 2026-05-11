// exports.main = async function (event, context) {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: `Hello, I will read from ${process.env.SPACE_FINDER_TABLE_NAME}`,
//     }),
//   };
// };

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import postSpaces from "./PostSpaces";
import getSpaces from "./GetSpaces";
import updateSpace from "./UpdateSpace";
import deleteSpace from "./DeleteSpace";
import { JSONValidationError, MissingFieldError } from "../shared/Validator";

const dbClient = new DynamoDBClient({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  try {
    let message: string;
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, dbClient);
        return getResponse;
      case "POST":
        const postResponse = await postSpaces(event, dbClient);
        return postResponse;
      case "PUT":
        const updateResponse = await updateSpace(event, dbClient);
        return updateResponse;
      case "DELETE":
        const deleteResponse = await deleteSpace(event, dbClient);
        return deleteResponse;
      default:
        message = "Invalid request method";
        break;
    }
    const response: APIGatewayProxyResult = {
      statusCode: 200,
      body: message,
    };
    return response;
  } catch (error) {
    console.error(error);
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }
    if (error instanceof JSONValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: (error as Error).message,
      }),
    };
  }
}

export { handler };
