import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const limit = parseInt(event.queryStringParameters?.limit || "20");

  let params = {
    TableName: process.env.videosTable,
    Limit: limit
  };

  let result;
  if (event.queryStringParameters?.userId) {
    params.IndexName = "userVideosIndex";
    params.KeyConditionExpression = "uploadedBy = :userId";
    params.ExpressionAttributeValues = {
      ":userId": event.queryStringParameters.userId
    };
    result = await dynamoDb.query(params);
  } else {
    // If no userId, scan all videos for the main feed
    result = await dynamoDb.scan(params);
  }

  return {
    data: result.Items || [],
    lastEvaluatedKey: result.LastEvaluatedKey
  };
});
