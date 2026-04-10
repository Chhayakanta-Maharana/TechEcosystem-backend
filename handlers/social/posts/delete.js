import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { postId } = event.pathParameters;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!postId) {
    throw new Error("postId is required");
  }

  const post = await dynamoDb.get({
    TableName: process.env.postsTable,
    Key: { postId }
  });

  if (!post.Item) {
    throw new Error("Post not found");
  }

  if (post.Item.createdBy !== userId) {
    throw new Error("Unauthorized");
  }

  await dynamoDb.delete({
    TableName: process.env.postsTable,
    Key: { postId }
  });

  return {
    message: "Post deleted successfully"
  };
});
