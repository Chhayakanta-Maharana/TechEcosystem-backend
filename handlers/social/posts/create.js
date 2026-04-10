import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";
import utilLib from "../../../libs/util-lib";

export const main = handler(async (event) => {
  const { content, image, video } = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!content && !image && !video) {
    throw new Error("Content or media is required");
  }

  const postId = utilLib.generateId();
  const timestamp = utilLib.getCurrentTimestamp();

  const post = {
    postId,
    content,
    image: image || "",
    video: video || "",
    createdBy: userId,
    createdAt: timestamp,
    updatedAt: timestamp,
    likes: 0,
    comments: 0
  };

  await dynamoDb.put({
    TableName: process.env.postsTable,
    Item: post
  });

  return {
    message: "Post created successfully",
    data: post
  };
});
