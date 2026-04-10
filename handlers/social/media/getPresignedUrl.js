import handler from "../../../libs/handler-lib";
import AWS from "aws-sdk";

const s3 = new AWS.S3();

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.userId;
  const { fileName, fileType } = JSON.parse(event.body);

  if (!fileName || !fileType) {
    throw new Error("fileName and fileType are required");
  }

  // Accept both images and videos for social posts and stories
  const allowedTypes = [
    // Videos
    "video/webm", "video/mp4", "video/quicktime", "video/x-msvideo", "video/mpeg",
    // Images
    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
    "image/heic", "image/heif", "image/avif"
  ];

  if (!allowedTypes.includes(fileType)) {
    throw new Error(`Unsupported media type: ${fileType}. Allowed: mp4, webm, mov, avi, jpg, png, gif, webp`);
  }

  const timestamp = Date.now();
  const mediaKey = `social/${userId}/${timestamp}-${fileName}`;

  const presignedUrl = s3.getSignedUrl("putObject", {
    Bucket: process.env.videosBucket,
    Key: mediaKey,
    ContentType: fileType,
    Expires: 3600
  });

  return {
    message: "Presigned URL generated successfully",
    data: {
      uploadUrl: presignedUrl,
      mediaKey,
      s3Bucket: process.env.videosBucket,
      expiresIn: 3600
    }
  };
});
