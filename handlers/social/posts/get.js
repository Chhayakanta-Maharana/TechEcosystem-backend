import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { postId } = event.pathParameters;

  if (!postId) {
    throw new Error("postId is required");
  }

  const result = await dynamoDb.get({
    TableName: process.env.postsTable,
    Key: { postId }
  });

  if (!result.Item) {
    throw new Error("Post not found");
  }

  return {
    data: result.Item
  };
});
