import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.userId;

  const result = await dynamoDb.query({
    TableName: process.env.applicationsTable,
    IndexName: "userApplicationsIndex",
    KeyConditionExpression: "appliedBy = :appliedBy",
    ExpressionAttributeValues: {
      ":appliedBy": userId
    }
  });

  // For each application, we might want to fetch more job details
  // but for now, we'll return the applications as is.
  // The frontend can use jobId to map to job details if needed.

  return {
    data: result.Items || []
  };
});
