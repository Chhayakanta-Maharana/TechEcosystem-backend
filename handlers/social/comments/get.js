import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { postId } = event.pathParameters;
  const limit = parseInt(event.queryStringParameters?.limit || "20");

  if (!postId) {
    throw new Error("postId is required");
  }

  const result = await dynamoDb.query({
    TableName: process.env.commentsTable,
    IndexName: "postCommentsIndex",
    KeyConditionExpression: "postId = :postId",
    ExpressionAttributeValues: {
      ":postId": postId
    },
    Limit: limit,
    ScanIndexForward: false
  });

  return {
    data: result.Items || [],
    lastEvaluatedKey: result.LastEvaluatedKey
  };
});
