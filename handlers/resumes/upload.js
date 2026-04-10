import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import utilLib from "../../libs/util-lib";
import AWS from "aws-sdk";

const s3 = new AWS.S3();

export const main = handler(async (event) => {
  const { name, templateId, data } = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.userId;

  if (!name || !templateId || !data) {
    throw new Error("Name, templateId, and data are required");
  }

  const resumeId = utilLib.generateId();
  const timestamp = utilLib.getCurrentTimestamp();

  // Store raw JSON data to S3
  const s3Key = `resumes/${userId}/${resumeId}.json`;
  await s3.putObject({
    Bucket: process.env.resumesBucket,
    Key: s3Key,
    Body: JSON.stringify(data),
    ContentType: "application/json"
  }).promise();

  const resume = {
    resumeId,
    userId,
    name,
    templateId,
    s3Key,
    uploadedAt: timestamp,
    updatedAt: timestamp
  };

  await dynamoDb.put({
    TableName: process.env.resumesTable,
    Item: resume
  });

  return {
    message: "Resume uploaded successfully",
    data: resume
  };
});
