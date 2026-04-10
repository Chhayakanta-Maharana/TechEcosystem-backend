import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import utilLib from "../../libs/util-lib";

export const main = handler(async (event) => {
  const { videoId } = event.pathParameters;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;
  const { title, description, thumbnail } = JSON.parse(event.body);

  if (!videoId) {
    throw new Error("videoId is required");
  }

  const video = await dynamoDb.get({
    TableName: process.env.videosTable,
    Key: { videoId }
  });

  if (!video.Item) {
    throw new Error("Video not found");
  }

  if (video.Item.uploadedBy !== userId) {
    throw new Error("Unauthorized");
  }

  const timestamp = utilLib.getCurrentTimestamp();
  const updateData = { updatedAt: timestamp };
  let updateExpression = "SET updatedAt = :updatedAt";
  const expressionAttributeValues = { ":updatedAt": timestamp };

  if (title) {
    updateExpression += ", title = :title";
    expressionAttributeValues[":title"] = title;
  }
  if (description) {
    updateExpression += ", description = :description";
    expressionAttributeValues[":description"] = description;
  }
  if (thumbnail) {
    updateExpression += ", thumbnail = :thumbnail";
    expressionAttributeValues[":thumbnail"] = thumbnail;
  }

  await dynamoDb.update({
    TableName: process.env.videosTable,
    Key: { videoId },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues
  });

  return {
    message: "Video updated successfully",
    data: { videoId, ...updateData }
  };
});
