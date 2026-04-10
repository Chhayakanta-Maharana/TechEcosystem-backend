import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const limit = parseInt(event.queryStringParameters?.limit || "20");

  const params = {
    TableName: process.env.postsTable,
    Limit: limit,
  };

  const result = await dynamoDb.scan(params);

  return {
    data: {
      posts: result.Items || []
    },
    lastEvaluatedKey: result.LastEvaluatedKey
  };
});
