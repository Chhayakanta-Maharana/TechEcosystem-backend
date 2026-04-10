import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { postId } = event.pathParameters;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!postId) {
    throw new Error("postId is required");
  }

  const likeId = `${userId}#${postId}`;
  const like = await dynamoDb.get({
    TableName: process.env.likesTable,
    Key: { likeId }
  });

  if (!like.Item) {
    throw new Error("Like not found");
  }

  await dynamoDb.delete({
    TableName: process.env.likesTable,
    Key: { likeId }
  });

  // Update post likes count
  await dynamoDb.update({
    TableName: process.env.postsTable,
    Key: { postId },
    UpdateExpression: "SET likes = likes - :dec",
    ExpressionAttributeValues: {
      ":dec": 1
    }
  });

  return {
    message: "Like removed successfully"
  };
});
