import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import jwtLib from "../../libs/jwt-lib";
import utilLib from "../../libs/util-lib";

export const main = handler(async (event) => {
  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Get user by email
  const result = await dynamoDb.query({
    TableName: process.env.usersTable,
    IndexName: "emailIndex",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email
    }
  });

  if (!result.Items || result.Items.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.Items[0];
  const passwordMatch = utilLib.comparePassword(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwtLib.sign({ userId: user.userId, email: user.email });

  return {
    message: "Login successful",
    data: {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      token
    }
  };
});
