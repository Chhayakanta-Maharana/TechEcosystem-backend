import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { userId } = event.pathParameters;
  const now = Math.floor(Date.now() / 1000);

  const result = await dynamoDb.query({
    TableName: process.env.storiesTable,
    IndexName: "userStoriesIndex",
    KeyConditionExpression: "userId = :userId",
    FilterExpression: "expiresAt > :now",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":now": now
    },
    ScanIndexForward: false // Newest first
  });

  return {
    data: { stories: result.Items || [] }
  };
});
