import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const videoId = event.pathParameters.videoId;

  if (!videoId) {
    throw new Error("videoId is required");
  }

  const params = {
    TableName: process.env.videoCommentsTable,
    IndexName: "videoIdIndex",
    KeyConditionExpression: "videoId = :videoId",
    ExpressionAttributeValues: {
      ":videoId": videoId
    },
    ScanIndexForward: false, // Sort by createdAt descending (newest first)
    Limit: 100
  };

  const result = await dynamoDb.query(params);

  return {
    data: result.Items || [],
    count: result.Items ? result.Items.length : 0,
    lastEvaluatedKey: result.LastEvaluatedKey
  };
});
