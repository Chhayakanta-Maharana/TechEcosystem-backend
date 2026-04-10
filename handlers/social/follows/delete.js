import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { userId } = event.pathParameters;
  const followedBy = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!userId) {
    throw new Error("userId is required");
  }

  // Get the follow relationship
  const existingFollow = await dynamoDb.query({
    TableName: process.env.followsTable,
    IndexName: "followerIndex",
    KeyConditionExpression: "followedBy = :followedBy AND followingId = :followingId",
    ExpressionAttributeValues: {
      ":followedBy": followedBy,
      ":followingId": userId
    }
  });

  if (!existingFollow.Items || existingFollow.Items.length === 0) {
    throw new Error("Not following this user");
  }

  const follow = existingFollow.Items[0];

  await dynamoDb.delete({
    TableName: process.env.followsTable,
    Key: { followId: follow.followId }
  });

  // Update user followers count
  await dynamoDb.update({
    TableName: process.env.usersTable,
    Key: { userId },
    UpdateExpression: "SET followers = followers - :dec",
    ExpressionAttributeValues: {
      ":dec": 1
    }
  });

  // Update follower's following count
  await dynamoDb.update({
    TableName: process.env.usersTable,
    Key: { userId: followedBy },
    UpdateExpression: "SET #following = #following - :dec",
    ExpressionAttributeNames: {
      "#following": "following"
    },
    ExpressionAttributeValues: {
      ":dec": 1
    }
  });

  return {
    message: "User unfollowed successfully"
  };
});
