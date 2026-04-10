import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { storyId } = event.pathParameters;
  const userId = event.requestContext.authorizer.userId;

  const existing = await dynamoDb.get({
    TableName: process.env.storiesTable,
    Key: { storyId },
  });

  if (!existing.Item) {
    throw new Error("Story not found");
  }

  if (existing.Item.userId !== userId) {
    throw new Error("Unauthorized - you can only delete your own stories");
  }

  await dynamoDb.delete({
    TableName: process.env.storiesTable,
    Key: { storyId },
  });

  return { message: "Story deleted successfully" };
});
