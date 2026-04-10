import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";
import utilLib from "../../../libs/util-lib";

export const main = handler(async (event) => {
  const { videoId, text } = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;
  const userEmail = event.requestContext.authorizer.email;

  if (!videoId || !text) {
    throw new Error("videoId and text are required");
  }

  if (text.trim().length === 0 || text.length > 500) {
    throw new Error("Comment must be between 1 and 500 characters");
  }

  const commentId = utilLib.generateId();
  const timestamp = utilLib.getCurrentTimestamp();

  const comment = {
    commentId,
    videoId,
    userId,
    userEmail,
    text: text.trim(),
    likes: 0,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  // Save comment to DynamoDB
  await dynamoDb.put({
    TableName: process.env.videoCommentsTable,
    Item: comment
  });

  // Update video comment count
  await dynamoDb.update({
    TableName: process.env.videosTable,
    Key: { videoId: videoId },
    UpdateExpression: "SET commentsCount = if_not_exists(commentsCount, :zero) + :inc",
    ExpressionAttributeValues: {
      ":zero": 0,
      ":inc": 1
    }
  });

  return {
    message: "Comment added successfully",
    data: comment
  };
});
