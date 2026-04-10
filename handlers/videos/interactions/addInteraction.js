import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";
import utilLib from "../../../libs/util-lib";

export const main = handler(async (event) => {
  const { videoId, interactionType } = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.userId || event.requestContext.authorizer.userId;

  if (!videoId || !interactionType) {
    throw new Error("videoId and interactionType are required");
  }

  if (!["like", "dislike", "none"].includes(interactionType)) {
    throw new Error("interactionType must be 'like', 'dislike', or 'none'");
  }

  const interactionId = `${userId}#${videoId}`;
  const timestamp = utilLib.getCurrentTimestamp();

  // Get current interaction
  const currentResult = await dynamoDb.get({
    TableName: process.env.videoInteractionsTable,
    Key: { interactionId: interactionId }
  });

  const currentInteraction = currentResult.Item;
  let likesDelta = 0;
  let dislikesDelta = 0;

  if (interactionType === "none") {
    // Remove interaction
    if (currentInteraction) {
      if (currentInteraction.type === "like") {
        likesDelta = -1;
      } else if (currentInteraction.type === "dislike") {
        dislikesDelta = -1;
      }

      await dynamoDb.delete({
        TableName: process.env.interactionsTable,
        Key: { interactionId: interactionId }
      });
    }
  } else {
    // Add or update interaction
    if (currentInteraction) {
      // Update existing interaction
      if (currentInteraction.type === "like" && interactionType === "dislike") {
        likesDelta = -1;
        dislikesDelta = 1;
      } else if (currentInteraction.type === "dislike" && interactionType === "like") {
        likesDelta = 1;
        dislikesDelta = -1;
      }
      // If same type, removing by sending "none" next time
    } else {
      // New interaction
      if (interactionType === "like") {
        likesDelta = 1;
      } else {
        dislikesDelta = 1;
      }
    }

    const interaction = {
      interactionId,
      userId,
      videoId,
      type: interactionType,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await dynamoDb.put({
      TableName: process.env.videoInteractionsTable,
      Item: interaction
    });
  }

  // Update video likes/dislikes
  if (likesDelta !== 0 || dislikesDelta !== 0) {
    let updateExpression = "SET ";
    const expressionAttributeValues = {};

    if (likesDelta !== 0) {
      updateExpression += "likes = if_not_exists(likes, :zero) + :likesDelta";
      expressionAttributeValues[":likesDelta"] = likesDelta;
    }

    if (dislikesDelta !== 0) {
      if (likesDelta !== 0) updateExpression += ", ";
      updateExpression += "dislikes = if_not_exists(dislikes, :zero) + :dislikesDelta";
      expressionAttributeValues[":dislikesDelta"] = dislikesDelta;
    }

    expressionAttributeValues[":zero"] = 0;

    await dynamoDb.update({
      TableName: process.env.videosTable,
      Key: { videoId: videoId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues
    });
  }

  return {
    message: "Interaction updated successfully",
    data: {
      videoId,
      interactionType,
      likesDelta,
      dislikesDelta
    }
  };
});
