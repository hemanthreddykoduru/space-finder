import { handler } from "../src/services/spaces/handler";

process.env.AWS_REGION = "us-west-2";
process.env.SPACE_FINDER_TABLE_NAME = "SpaceFinderTable-0a469a421c97";

// handler(
//   {
//     httpMethod: "GET",
//     queryStringParameters: {
//       id: "5bd78e10-d25f-433c-a575-e18c3df16f8b",
//     },
//   } as any,
//   {} as any,
// );

// handler(
//   {
//     httpMethod: "DELETE",
//     queryStringParameters: {
//       id: "5bd78e10-d25f-433c-a575-e18c3df16f8b",
//     },
//   } as any,
//   {} as any,
// );

handler(
  {
    httpMethod: "POST",
    body: JSON.stringify({
      location: "Nagpur",
      name: "Sangamwadi",
    }),
  } as any,
  {} as any,
).then((res) => console.log(res));

// handler(
//   {
//     httpMethod: "GET",
//   } as any,
//   {} as any,
// );

// handler(
//   {
//     httpMethod: "PUT",
//     queryStringParameters: {
//       id: "5bd78e10-d25f-433c-a575-e18c3df16f8b",
//     },
//     body: JSON.stringify({
//       location: "Dubai",
//     }),
//   } as any,
//   {} as any,
// );
