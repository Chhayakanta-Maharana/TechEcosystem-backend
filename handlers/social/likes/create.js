import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";
import utilLib from "../../../libs/util-lib";

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

  // Check if already liked
  const likeId = `${userId}#${postId}`;
  const existingLike = await dynamoDb.get({
    TableName: process.env.likesTable,
    Key: { likeId }
  });

  if (existingLike.Item) {
    throw new Error("Already liked this post");
  }

  const timestamp = utilLib.getCurrentTimestamp();

  const like = {
    likeId,
    postId,
    userId,
    likedAt: timestamp
  };

  await dynamoDb.put({
    TableName: process.env.likesTable,
    Item: like
  });

  // Update post likes count
  await dynamoDb.update({
    TableName: process.env.postsTable,
    Key: { postId },
    UpdateExpression: "SET likes = likes + :inc",
    ExpressionAttributeValues: {
      ":inc": 1
    }
  });

  return {
    message: "Post liked successfully",
    data: like
  };
});
