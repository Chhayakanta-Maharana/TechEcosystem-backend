import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.userId;

  const params = {
    TableName: process.env.notificationsTable,
    IndexName: "userNotificationsIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    },
    ScanIndexForward: false // Newest first
  };

  const result = await dynamoDb.query(params);

  return {
    data: result.Items || []
  };
});
