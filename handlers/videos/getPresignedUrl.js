import handler from "../../libs/handler-lib";
import AWS from "aws-sdk";

const s3 = new AWS.S3();

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.userId;
  const { fileName, fileType } = JSON.parse(event.body);

  if (!fileName || !fileType) {
    throw new Error("fileName and fileType are required");
  }

  // Validate file type
  const allowedTypes = ["video/webm", "video/mp4", "video/quicktime", "video/x-msvideo"];
  if (!allowedTypes.includes(fileType)) {
    throw new Error("Invalid video format. Allowed: webm, mp4, mov, avi");
  }

  // Generate unique key for S3
  const timestamp = Date.now();
  const videoKey = `${userId}/${timestamp}-${fileName}`;

  // Generate presigned URL for PUT request
  const presignedUrl = s3.getSignedUrl("putObject", {
    Bucket: process.env.videosBucket,
    Key: videoKey,
    ContentType: fileType,
    Expires: 3600 // 1 hour expiration
  });

  return {
    message: "Presigned URL generated successfully",
    data: {
      uploadUrl: presignedUrl,
      videoKey: videoKey,
      s3Bucket: process.env.videosBucket,
      expiresIn: 3600
    }
  };
});
