import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const videoId = event.pathParameters.videoId;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!videoId) {
    throw new Error("videoId is required");
  }

  const interactionId = `${userId}#${videoId}`;

  const result = await dynamoDb.get({
    TableName: process.env.videoInteractionsTable,
    Key: { interactionId: interactionId }
  });

  return {
    data: result.Item || {
      videoId,
      type: "none",
      liked: false,
      disliked: false
    },
    liked: result.Item?.type === "like",
    disliked: result.Item?.type === "dislike"
  };
});
