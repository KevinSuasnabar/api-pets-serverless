import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBService } from "dynamo-layer";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const petId = event.pathParameters?.petId;
    const body = event.body ? JSON.parse(event.body) : {};
    const foundationId = body.foundationId;

    if (!petId || !foundationId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Pet ID and foundationId are required",
        }),
      };
    }

    const tableName = process.env.PETS_TABLE_NAME;
    if (!tableName) {
      throw new Error("PETS_TABLE_NAME environment variable is not defined");
    }
    const dynamoDBService = new DynamoDBService({ tableName });

    const pet = await dynamoDBService.getPetById(foundationId, petId);
    if (!pet) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Pet not found for this foundation" }),
      };
    }

    await dynamoDBService.deletePet(foundationId, petId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Pet disabled successfully",
      }),
    };
  } catch (error) {
    console.error("Error deleting pet:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
      }),
    };
  }
};
