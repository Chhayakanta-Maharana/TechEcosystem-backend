import jwtLib from "../../libs/jwt-lib";

export const main = async (event) => {
  const token = event.authorizationToken;

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = jwtLib.verify(token.replace("Bearer ", ""));

    return {
      principalId: decoded.userId,
      policyDocument: {
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*"
          }
        ]
      },
      context: {
        userId: decoded.userId,
        email: decoded.email
      }
    };
  } catch (error) {
    throw new Error("Unauthorized");
  }
};
