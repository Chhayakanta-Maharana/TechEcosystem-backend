import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";
import utilLib from "../../../libs/util-lib";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.userId;
  const { mediaUrl, mediaType, username } = JSON.parse(event.body);

  if (!mediaUrl) {
    throw new Error("mediaUrl is required");
  }

  const storyId = utilLib.generateId();
  const timestamp = utilLib.getCurrentTimestamp();
  // Stories expire after 24 hours
  const expiresAt = timestamp + 24 * 60 * 60;

  const story = {
    storyId,
    userId,
    username: username || "User",
    mediaUrl,
    mediaType: mediaType || "image", // 'image' or 'video'
    createdAt: timestamp,
    expiresAt,
  };

  await dynamoDb.put({
    TableName: process.env.storiesTable,
    Item: story,
  });

  return {
    message: "Story created successfully",
    data: story,
  };
});
