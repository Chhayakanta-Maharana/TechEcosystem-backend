import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import utilLib from "../../libs/util-lib";

export const main = handler(async (event) => {
  const { resumeId } = event.pathParameters;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;
  const { title, summary, skills } = JSON.parse(event.body);

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

  const timestamp = utilLib.getCurrentTimestamp();
  let updateExpression = "SET updatedAt = :updatedAt";
  const expressionAttributeValues = { ":updatedAt": timestamp };

  if (title) {
    updateExpression += ", title = :title";
    expressionAttributeValues[":title"] = title;
  }
  if (summary) {
    updateExpression += ", summary = :summary";
    expressionAttributeValues[":summary"] = summary;
  }
  if (skills) {
    updateExpression += ", skills = :skills";
    expressionAttributeValues[":skills"] = skills;
  }

  await dynamoDb.update({
    TableName: process.env.resumesTable,
    Key: { resumeId },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues
  });

  return {
    message: "Resume updated successfully",
    data: { resumeId, updatedAt: timestamp }
  };
});
