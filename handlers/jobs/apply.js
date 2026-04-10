import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import utilLib from "../../libs/util-lib";

export const main = handler(async (event) => {
  const { jobId } = event.pathParameters;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;
  const { coverLetter, resumeUrl } = JSON.parse(event.body);

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

  // Check if already applied
  const existingApplication = await dynamoDb.query({
    TableName: process.env.applicationsTable,
    IndexName: "userApplicationsIndex",
    KeyConditionExpression: "appliedBy = :appliedBy",
    ExpressionAttributeValues: {
      ":appliedBy": userId,
      ":jobId": jobId
    },
    FilterExpression: "jobId = :jobId"
  });

  if (existingApplication.Items && existingApplication.Items.length > 0) {
    throw new Error("Already applied for this job");
  }

  const applicationId = utilLib.generateId();
  const timestamp = utilLib.getCurrentTimestamp();

  const application = {
    applicationId,
    jobId,
    appliedBy: userId,
    coverLetter: coverLetter || "",
    resumeUrl: resumeUrl || "",
    status: "pending",
    appliedAt: timestamp
  };

  await dynamoDb.put({
    TableName: process.env.applicationsTable,
    Item: application
  });

  // Update job applications count
  await dynamoDb.update({
    TableName: process.env.jobsTable,
    Key: { jobId },
    UpdateExpression: "SET applications = if_not_exists(applications, :zero) + :inc",
    ExpressionAttributeValues: {
      ":zero": 0,
      ":inc": 1
    }
  });

  return {
    message: "Application submitted successfully",
    data: application
  };
});
