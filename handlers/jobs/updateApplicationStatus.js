import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import utilLib from "../../libs/util-lib";

export const main = handler(async (event) => {
  const { applicationId } = event.pathParameters;
  const { status, scheduledAt, interviewType } = JSON.parse(event.body); // 'accepted', 'rejected', 'pending'
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

  const updateExpression = ["SET #status = :status, updatedAt = :updatedAt"];
  const expressionValues = {
    ":status": status,
    ":updatedAt": timestamp
  };

  if (scheduledAt) {
    updateExpression.push("scheduledAt = :scheduledAt");
    expressionValues[":scheduledAt"] = scheduledAt;
  }

  if (interviewType) {
    updateExpression.push("interviewType = :interviewType");
    expressionValues[":interviewType"] = interviewType;
  }

  await dynamoDb.update({
    TableName: process.env.applicationsTable,
    Key: { applicationId },
    UpdateExpression: updateExpression.join(", "),
    ExpressionAttributeValues: expressionValues,
    ExpressionAttributeNames: {
      "#status": "status"
    }
  });

  // Create notification for the seeker
  const notificationId = utilLib.generateId();
  let message = `Your application for ${job.title} has been ${status}.`;
  if (status === "accepted" && scheduledAt) {
    message = `Interview scheduled for ${job.title} on ${new Date(scheduledAt).toLocaleString()}.`;
  }

  try {
    await dynamoDb.put({
      TableName: process.env.notificationsTable,
      Item: {
        notificationId,
        userId: application.appliedBy,
        type: "JOB_STATUS_UPDATE",
        message,
        jobId: job.jobId,
        applicationId,
        status,
        scheduledAt,
        createdAt: timestamp,
        read: false
      }
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }

  return {
    message: `Application status updated successfully`,
    data: { applicationId, status, scheduledAt, interviewType, updatedAt: timestamp }
  };
});
