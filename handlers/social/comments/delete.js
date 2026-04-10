import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { commentId } = event.pathParameters;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!commentId) {
    throw new Error("commentId is required");
  }

  const comment = await dynamoDb.get({
    TableName: process.env.commentsTable,
    Key: { commentId }
  });

  if (!comment.Item) {
    throw new Error("Comment not found");
  }

  if (comment.Item.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await dynamoDb.delete({
    TableName: process.env.commentsTable,
    Key: { commentId }
  });

  // Update post comments count
  await dynamoDb.update({
    TableName: process.env.postsTable,
    Key: { postId: comment.Item.postId },
    UpdateExpression: "SET comments = comments - :dec",
    ExpressionAttributeValues: {
      ":dec": 1
    }
  });

  return {
    message: "Comment deleted successfully"
  };
});
