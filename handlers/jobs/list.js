import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const limit = parseInt(event.queryStringParameters?.limit || "20");
  const search = event.queryStringParameters?.search;

  let params = {
    TableName: process.env.jobsTable,
    Limit: limit
  };

  if (search) {
    params.FilterExpression = "contains(#title, :search) OR contains(company, :search) OR contains(#location, :location)";
    params.ExpressionAttributeNames = {
      "#title": "title",
      "#location": "location"
    };
    params.ExpressionAttributeValues = {
      ":search": search,
      ":location": search
    };
  }

  const result = await dynamoDb.scan ?
    dynamoDb.scan(params) :
    dynamoDb.query(params);

  return {
    data: result.Items || [],
    lastEvaluatedKey: result.LastEvaluatedKey
  };
});
