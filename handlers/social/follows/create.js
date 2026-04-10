import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";
import utilLib from "../../../libs/util-lib";

export const main = handler(async (event) => {
  const { userId } = event.pathParameters;
  const followedBy = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!userId) {
    throw new Error("userId is required");
  }

  if (userId === followedBy) {
    throw new Error("Cannot follow yourself");
  }

  // Check if already following
  const existingFollow = await dynamoDb.query({
    TableName: process.env.followsTable,
    IndexName: "followerIndex",
    KeyConditionExpression: "followedBy = :followedBy AND followingId = :followingId",
    ExpressionAttributeValues: {
      ":followedBy": followedBy,
      ":followingId": userId
    }
  });

  if (existingFollow.Items && existingFollow.Items.length > 0) {
    throw new Error("Already following this user");
  }

  const followId = utilLib.generateId();
  const timestamp = utilLib.getCurrentTimestamp();

  const follow = {
    followId,
    followedBy,
    followingId: userId,
    followedAt: timestamp
  };

  await dynamoDb.put({
    TableName: process.env.followsTable,
    Item: follow
  });

  // Update user followers count
  await dynamoDb.update({
    TableName: process.env.usersTable,
    Key: { userId },
    UpdateExpression: "SET followers = followers + :inc",
    ExpressionAttributeValues: {
      ":inc": 1
    }
  });

  // Update follower's following count
  await dynamoDb.update({
    TableName: process.env.usersTable,
    Key: { userId: followedBy },
    UpdateExpression: "SET #following = #following + :inc",
    ExpressionAttributeNames: {
      "#following": "following"
    },
    ExpressionAttributeValues: {
      ":inc": 1
    }
  });

  return {
    message: "User followed successfully",
    data: follow
  };
});
