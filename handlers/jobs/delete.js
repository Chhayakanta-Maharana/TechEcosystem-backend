import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { jobId } = event.pathParameters;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!jobId) {
    throw new Error("jobId is required");
  }

  const job = await dynamoDb.get({
    TableName: process.env.jobsTable,
    Key: { jobId }
  });

  if (!job.Item) {
    throw new Error("Job not found");
  }

  if (job.Item.postedBy !== userId) {
    throw new Error("Unauthorized");
  }

  await dynamoDb.delete({
    TableName: process.env.jobsTable,
    Key: { jobId }
  });

  return {
    message: "Job deleted successfully"
  };
});
