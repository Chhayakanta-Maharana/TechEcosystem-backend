import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import utilLib from "../../libs/util-lib";

export const main = handler(async (event) => {
  const { userId } = event.pathParameters;
  const currentUserId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;
  const { firstName, lastName, bio, profilePicture, username } = JSON.parse(event.body);

  if (!userId) {
    throw new Error("userId is required");
  }

  if (userId !== currentUserId) {
    throw new Error("Unauthorized");
  }

  const timestamp = utilLib.getCurrentTimestamp();
  let updateExpression = "SET updatedAt = :updatedAt";
  const expressionAttributeValues = { ":updatedAt": timestamp };

  if (firstName) {
    updateExpression += ", firstName = :firstName";
    expressionAttributeValues[":firstName"] = firstName;
  }
  if (lastName) {
    updateExpression += ", lastName = :lastName";
    expressionAttributeValues[":lastName"] = lastName;
  }
  if (bio) {
    updateExpression += ", bio = :bio";
    expressionAttributeValues[":bio"] = bio;
  }
  if (profilePicture) {
    updateExpression += ", profilePicture = :profilePicture";
    expressionAttributeValues[":profilePicture"] = profilePicture;
  }
  if (username) {
    updateExpression += ", username = :username";
    expressionAttributeValues[":username"] = username;
  }

  await dynamoDb.update({
    TableName: process.env.usersTable,
    Key: { userId },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues
  });

  return {
    message: "Profile updated successfully",
    data: { userId, updatedAt: timestamp }
  };
});
