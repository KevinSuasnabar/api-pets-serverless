import { DynamoDBService } from "dynamo-layer";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { httpResponse } from "common-layer";

// Constants
const ERROR_MESSAGES = {
  MISSING_FOUNDATION_ID: "Foundation ID is required",
  SERVER_ERROR: "Internal server error",
} as const;

// Main handler
export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const tableName = process.env.PETS_TABLE_NAME;
    if (!tableName) {
      throw new Error("PETS_TABLE_NAME environment variable is not defined");
    }
    const dynamoDBService = new DynamoDBService({ tableName });

    const foundationId = event.pathParameters?.foundationId;
    if (!foundationId) {
      return httpResponse.badRequest("Foundation ID is required");
    }

    const queryParams = event.queryStringParameters || {};
    const filters = {
      type: queryParams.type,
      breed: queryParams.breed,
      name: queryParams.name,
    };

    const pets = await dynamoDBService.getPetsByFoundation(
      foundationId,
      filters
    );
    return httpResponse.ok(pets);
  } catch (error) {
    console.error("Error getting pets by foundation:", error);
    return httpResponse.internalError(
      ERROR_MESSAGES.SERVER_ERROR,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
