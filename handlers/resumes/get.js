import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { userId } = event.pathParameters;

  if (!userId) {
    throw new Error("userId is required");
  }

  const result = await dynamoDb.query({
    TableName: process.env.resumesTable,
    IndexName: "userResumesIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    }
  });

  return {
    data: result.Items || []
  };
});
