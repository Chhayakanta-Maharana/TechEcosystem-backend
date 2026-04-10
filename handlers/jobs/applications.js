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

  const result = await dynamoDb.query({
    TableName: process.env.applicationsTable,
    IndexName: "jobApplicationsIndex",
    KeyConditionExpression: "jobId = :jobId",
    ExpressionAttributeValues: {
      ":jobId": jobId
    }
  });

  return {
    data: result.Items || []
  };
});
