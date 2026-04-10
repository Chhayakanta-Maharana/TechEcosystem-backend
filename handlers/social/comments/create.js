import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";
import utilLib from "../../../libs/util-lib";

export const main = handler(async (event) => {
  const { postId } = event.pathParameters;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;
  const { text } = JSON.parse(event.body);

  if (!postId || !text) {
    throw new Error("postId and text are required");
  }

  const post = await dynamoDb.get({
    TableName: process.env.postsTable,
    Key: { postId }
  });

  if (!post.Item) {
    throw new Error("Post not found");
  }

  const commentId = utilLib.generateId();
  const timestamp = utilLib.getCurrentTimestamp();

  const comment = {
    commentId,
    postId,
    userId,
    text,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await dynamoDb.put({
    TableName: process.env.commentsTable,
    Item: comment
  });

  // Update post comments count
  await dynamoDb.update({
    TableName: process.env.postsTable,
    Key: { postId },
    UpdateExpression: "SET comments = comments + :inc",
    ExpressionAttributeValues: {
      ":inc": 1
    }
  });

  return {
    message: "Comment added successfully",
    data: comment
  };
});
