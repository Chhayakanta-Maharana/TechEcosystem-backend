import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async () => {
  const now = Math.floor(Date.now() / 1000);

  const result = await dynamoDb.scan({
    TableName: process.env.storiesTable,
    FilterExpression: "expiresAt > :now",
    ExpressionAttributeValues: {
      ":now": now,
    },
  });

  // Sort by createdAt descending
  const stories = (result.Items || []).sort((a, b) => b.createdAt - a.createdAt);

  // Group by userId so each user shows one bubble
  const grouped = {};
  for (const story of stories) {
    if (!grouped[story.userId]) {
      grouped[story.userId] = [];
    }
    grouped[story.userId].push(story);
  }

  const groupedArray = Object.values(grouped).map((storyList) => ({
    userId: storyList[0].userId,
    username: storyList[0].username,
    previewUrl: storyList[0].mediaUrl,
    previewType: storyList[0].mediaType,
    stories: storyList,
  }));

  return {
    data: { stories: groupedArray },
  };
});
