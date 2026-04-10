import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";
import utilLib from "../../../libs/util-lib";

export const main = handler(async (event) => {
  const { postId } = event.pathParameters;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;
  const { content } = JSON.parse(event.body);

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

  const timestamp = utilLib.getCurrentTimestamp();
  const updateData = { updatedAt: timestamp };
  let updateExpression = "SET updatedAt = :updatedAt";
  const expressionAttributeValues = { ":updatedAt": timestamp };

  if (content) {
    updateExpression += ", content = :content";
    expressionAttributeValues[":content"] = content;
  }

  await dynamoDb.update({
    TableName: process.env.postsTable,
    Key: { postId },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues
  });

  return {
    message: "Post updated successfully",
    data: { postId, ...updateData }
  };
});
