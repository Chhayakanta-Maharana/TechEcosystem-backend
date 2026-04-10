import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const commentId = event.pathParameters.commentId;
  const videoId = event.queryStringParameters?.videoId;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!commentId || !videoId) {
    throw new Error("commentId and videoId are required");
  }

  // Get comment to verify ownership
  const result = await dynamoDb.get({
    TableName: process.env.videoCommentsTable,
    Key: { commentId: commentId }
  });

  if (!result.Item) {
    throw new Error("Comment not found");
  }

  // Check if user owns the comment
  if (result.Item.userId !== userId) {
    throw new Error("Unauthorized: You can only delete your own comments");
  }

  // Delete comment
  await dynamoDb.delete({
    TableName: process.env.videoCommentsTable,
    Key: { commentId: commentId }
  });

  // Update video comment count
  await dynamoDb.update({
    TableName: process.env.videosTable,
    Key: { videoId: videoId },
    UpdateExpression: "SET commentsCount = if_not_exists(commentsCount, :zero) - :dec",
    ExpressionAttributeValues: {
      ":zero": 0,
      ":dec": 1
    }
  });

  return {
    message: "Comment deleted successfully"
  };
});
