import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { videoId } = event.pathParameters;

  if (!videoId) {
    throw new Error("videoId is required");
  }

  const result = await dynamoDb.get({
    TableName: process.env.videosTable,
    Key: { videoId }
  });

  if (!result.Item) {
    throw new Error("Video not found");
  }

  // Increment views
  await dynamoDb.update({
    TableName: process.env.videosTable,
    Key: { videoId },
    UpdateExpression: "SET views = views + :val",
    ExpressionAttributeValues: {
      ":val": 1
    }
  });

  return {
    data: result.Item
  };
});
