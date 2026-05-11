import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export default async function getSpaces(
  event: APIGatewayProxyEvent,
  dbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  console.log(event);
  if (event.queryStringParameters && event.queryStringParameters.id) {
    const spaceId = event.queryStringParameters.id;
    const response = await dbClient.send(
      new GetItemCommand({
        TableName: process.env.SPACE_FINDER_TABLE_NAME,
        Key: {
          id: { S: spaceId },
        },
      }),
    );
    if (response.Item) {
      const unmarshalledItem = unmarshall(response.Item);
      return {
        statusCode: 200,
        body: JSON.stringify(unmarshalledItem),
      };
    }
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Space not found" }),
    };
  }
  const result = await dbClient.send(
    new ScanCommand({
      TableName: process.env.SPACE_FINDER_TABLE_NAME,
    }),
  );
  const unmarshalledItems = result.Items?.map((item) => unmarshall(item));
  console.log(result.Items);
  return {
    statusCode: 201,
    body: JSON.stringify(unmarshalledItems),
  };
}

// export default async function getSpaces(
//   event: APIGatewayProxyEvent,
//   dbClient: DynamoDBClient,
// ): Promise<APIGatewayProxyResult> {
//   console.log(event);
//   const dbDocClient = DynamoDBDocumentClient.from(dbClient);
//   if (event.queryStringParameters && event.queryStringParameters.id) {
//     const spaceId = event.queryStringParameters.id;
//     const response = await dbDocClient.send(
//       new GetItemCommand({
//         TableName: process.env.SPACE_FINDER_TABLE_NAME,
//         Key: {
//           id: { S: spaceId },
//         },
//       }),
//     );
//     if (response.Item) {
//       return {
//         statusCode: 200,
//         body: JSON.stringify(response.Item),
//       };
//     }
//     return {
//       statusCode: 404,
//       body: JSON.stringify({ message: "Space not found" }),
//     };
//   }
//   const result = await dbDocClient.send(
//     new ScanCommand({
//       TableName: process.env.SPACE_FINDER_TABLE_NAME,
//     }),
//   );
//   // const unmarshalledItems = result.Items?.map((item) => unmarshall(item));
//   console.log(result.Items);
//   return {
//     statusCode: 201,
//     body: JSON.stringify(result.Items),
//   };
// }
