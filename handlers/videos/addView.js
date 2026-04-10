import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const videoId = event.pathParameters.videoId;

  if (!videoId) {
    throw new Error("videoId is required");
  }

  // Increment views
  await dynamoDb.update({
    TableName: process.env.videosTable,
    Key: { videoId: videoId },
    UpdateExpression: "SET views = if_not_exists(views, :zero) + :inc",
    ExpressionAttributeValues: {
      ":zero": 0,
      ":inc": 1
    }
  });

  return {
    message: "View count incremented successfully"
  };
});
