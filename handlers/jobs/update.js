import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import utilLib from "../../libs/util-lib";

export const main = handler(async (event) => {
  const { jobId } = event.pathParameters;
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;
  const { title, description, location, salary, jobType } = JSON.parse(event.body);

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

  const timestamp = utilLib.getCurrentTimestamp();
  const updateData = { updatedAt: timestamp };
  let updateExpression = "SET updatedAt = :updatedAt";
  const expressionAttributeValues = { ":updatedAt": timestamp };

  if (title) {
    updateExpression += ", title = :title";
    expressionAttributeValues[":title"] = title;
  }
  if (description) {
    updateExpression += ", description = :description";
    expressionAttributeValues[":description"] = description;
  }
  if (location) {
    updateExpression += ", #location = :location";
    expressionAttributeValues[":location"] = location;
  }
  if (salary) {
    updateExpression += ", salary = :salary";
    expressionAttributeValues[":salary"] = salary;
  }
  if (jobType) {
    updateExpression += ", jobType = :jobType";
    expressionAttributeValues[":jobType"] = jobType;
  }

  await dynamoDb.update({
    TableName: process.env.jobsTable,
    Key: { jobId },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: location ? { "#location": "location" } : undefined
  });

  return {
    message: "Job updated successfully",
    data: { jobId, ...updateData }
  };
});
