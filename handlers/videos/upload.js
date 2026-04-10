import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import utilLib from "../../libs/util-lib";

export const main = handler(async (event) => {
  const { title, description, videoKey, thumbnail } = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.userId;

  if (!title || !videoKey) {
    throw new Error("Title and videoKey are required");
  }

  const videoId = utilLib.generateId();
  const timestamp = utilLib.getCurrentTimestamp();

  // Generate S3 URL from key
  const videoUrl = `https://${process.env.videosBucket}.s3.amazonaws.com/${videoKey}`;

  const video = {
    videoId,
    title,
    description: description || "",
    videoUrl: videoUrl,
    videoKey: videoKey,
    thumbnail: thumbnail || "",
    uploadedBy: userId,
    uploadedAt: timestamp,
    views: 0,
    likes: 0,
    dislikes: 0,
    commentsCount: 0,
    updatedAt: timestamp
  };

  await dynamoDb.put({
    TableName: process.env.videosTable,
    Item: video
  });

  return {
    message: "Video uploaded successfully",
    data: video
  };
});
