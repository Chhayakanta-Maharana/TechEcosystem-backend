import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import utilLib from "../../libs/util-lib";

export const main = handler(async (event) => {
  const { title, description, location, salary, company, jobType, requirements, benefits } = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!title || !company) {
    throw new Error("Title and company are required");
  }

  const jobId = utilLib.generateId();
  const timestamp = utilLib.getCurrentTimestamp();

  const job = {
    jobId,
    title,
    description: description || "",
    location: location || "",
    salary: salary || "",
    company,
    jobType: jobType || "Full-time",
    requirements: requirements || [],
    benefits: benefits || [],
    postedBy: userId,
    postedAt: timestamp,
    applications: 0,
    updatedAt: timestamp
  };

  await dynamoDb.put({
    TableName: process.env.jobsTable,
    Item: job
  });

  return {
    message: "Job posted successfully",
    data: job
  };
});
