import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import utilLib from "../../libs/util-lib";

export const main = handler(async (event) => {
  const { applicationId } = event.pathParameters;
  const { status } = JSON.parse(event.body); // 'accepted', 'rejected', 'pending'
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!applicationId || !status) {
    throw new Error("applicationId and status are required");
  }

  // Get application first to verify ownership of the job
  const applicationResult = await dynamoDb.get({
    TableName: process.env.applicationsTable,
    Key: { applicationId }
  });

  const application = applicationResult.Item;
  if (!application) {
    throw new Error("Application not found");
  }

  // Verify the user making the update is the poster of the job
  const jobResult = await dynamoDb.get({
    TableName: process.env.jobsTable,
    Key: { jobId: application.jobId }
  });

  const job = jobResult.Item;
  if (!job) {
    throw new Error("Associated job not found");
  }

  if (job.postedBy !== userId) {
    throw new Error("Unauthorized: Only the job poster can update application status");
  }

  const timestamp = utilLib.getCurrentTimestamp();

  await dynamoDb.update({
    TableName: process.env.applicationsTable,
    Key: { applicationId },
    UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":status": status,
      ":updatedAt": timestamp
    },
    ExpressionAttributeNames: {
      "#status": "status"
    }
  });

  return {
    message: `Application status updated to ${status} successfully`,
    data: { applicationId, status, updatedAt: timestamp }
  };
});
