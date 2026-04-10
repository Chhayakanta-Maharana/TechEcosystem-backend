import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { resumeId } = event.pathParameters;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!resumeId) {
    throw new Error("resumeId is required");
  }

  const resume = await dynamoDb.get({
    TableName: process.env.resumesTable,
    Key: { resumeId }
  });

  if (!resume.Item) {
    throw new Error("Resume not found");
  }

  if (resume.Item.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await dynamoDb.delete({
    TableName: process.env.resumesTable,
    Key: { resumeId }
  });

  return {
    message: "Resume deleted successfully"
  };
});
