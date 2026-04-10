import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { userId } = event.pathParameters;
  const limit = parseInt(event.queryStringParameters?.limit || "20");

  if (!userId) {
    throw new Error("userId is required");
  }

  const result = await dynamoDb.query({
    TableName: process.env.postsTable,
    IndexName: "userPostsIndex",
    KeyConditionExpression: "createdBy = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    },
    Limit: limit,
    ScanIndexForward: false
  });

  return {
    data: result.Items || [],
    lastEvaluatedKey: result.LastEvaluatedKey
  };
});
