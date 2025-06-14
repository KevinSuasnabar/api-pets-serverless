import { DynamoDBService } from "dynamo-layer";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { httpResponse } from "common-layer";

const ERROR_MESSAGES = {
  SERVER_ERROR: "Internal server error",
} as const;

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
    const petId = event.pathParameters?.petId;

    if (!foundationId || !petId) {
      return httpResponse.badRequest("Foundation ID and Pet ID are required");
    }

    await dynamoDBService.deletePet(foundationId, petId);
    return httpResponse.ok({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return httpResponse.internalError(
      ERROR_MESSAGES.SERVER_ERROR,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
