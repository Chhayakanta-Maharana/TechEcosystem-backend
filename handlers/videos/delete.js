import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { videoId } = event.pathParameters;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!videoId) {
    throw new Error("videoId is required");
  }

  const video = await dynamoDb.get({
    TableName: process.env.videosTable,
    Key: { videoId }
  });

  if (!video.Item) {
    throw new Error("Video not found");
  }

  if (video.Item.uploadedBy !== userId) {
    throw new Error("Unauthorized");
  }

  await dynamoDb.delete({
    TableName: process.env.videosTable,
    Key: { videoId }
  });

  return {
    message: "Video deleted successfully"
  };
});
