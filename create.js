import { v4 as uuidv4 } from "uuid";
// ...existing code...
 // A unique uuid
// ...existing code...
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      // The attributes of the item to be created
      userId: event.requestContext.identity.cognitoIdentityId, // The id of the author
      noteId: uuidv4(),// A unique uuid
      content: data.content, // Parsed from request body
      attachment: data?.attachment, // Parsed from request body
      createdAt: Date.now(), // Current Unix timestamp
    },
  };
  await dynamoDb.put(params);
  return params.Item;
});
