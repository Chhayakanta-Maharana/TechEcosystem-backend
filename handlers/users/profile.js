import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { userId } = event.pathParameters;

  if (!userId) {
    throw new Error("userId is required");
  }

  const result = await dynamoDb.get({
    TableName: process.env.usersTable,
    Key: { userId }
  });

  if (!result.Item) {
    throw new Error("User not found");
  }

  const user = result.Item;
  // Don't return password
  delete user.password;

  return {
    data: user
  };
});
