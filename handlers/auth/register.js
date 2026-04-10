import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import jwtLib from "../../libs/jwt-lib";
import utilLib from "../../libs/util-lib";

export const main = handler(async (event) => {
  const { email, password, firstName, lastName, username } = JSON.parse(event.body);

  if (!email || !password || !firstName || !lastName || !username) {
    throw new Error("Email, password, firstName, lastName, and username are required");
  }

  const userId = utilLib.generateId();
  const hashedPassword = utilLib.hashPassword(password);
  const timestamp = utilLib.getCurrentTimestamp();

  // Check if user already exists
  const existingUser = await dynamoDb.query({
    TableName: process.env.usersTable,
    IndexName: "emailIndex",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email
    }
  });

  if (existingUser.Items && existingUser.Items.length > 0) {
    throw new Error("Email already registered");
  }

  const user = {
    userId,
    email,
    password: hashedPassword,
    firstName,
    lastName,
    username,
    bio: "",
    profilePicture: "",
    following: 0,
    followers: 0,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await dynamoDb.put({
    TableName: process.env.usersTable,
    Item: user
  });

  const token = jwtLib.sign({ userId, email });

  return {
    message: "User registered successfully",
    data: {
      userId,
      email,
      firstName,
      lastName,
      username,
      token
    }
  };
});
