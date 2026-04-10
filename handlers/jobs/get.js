import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { jobId } = event.pathParameters;

  if (!jobId) {
    throw new Error("jobId is required");
  }

  const result = await dynamoDb.get({
    TableName: process.env.jobsTable,
    Key: { jobId }
  });

  if (!result.Item) {
    throw new Error("Job not found");
  }

  return {
    data: result.Item
  };
});
