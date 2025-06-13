import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBService } from "dynamo-layer";

// Types
interface PetResponse {
  petId: string;
  foundationId: string;
  name: string;
  type: string;
  breed: string;
  status: string;
  createdAt: string;
}

interface PetFilters {
  type?: string;
  breed?: string;
  name?: string;
}

// Constants
const ERROR_MESSAGES = {
  MISSING_FOUNDATION_ID: "Foundation ID is required",
  SERVER_ERROR: "Internal server error",
} as const;

// Helper functions
const validateFoundationId = (foundationId?: string): string => {
  if (!foundationId) {
    throw new Error(ERROR_MESSAGES.MISSING_FOUNDATION_ID);
  }
  return foundationId;
};

const getFiltersFromQueryParams = (
  queryParams: Record<string, string | undefined>
): PetFilters | undefined => {
  const filters = {
    type: queryParams.type,
    breed: queryParams.breed,
    name: queryParams.name,
  };

  return Object.values(filters).some((value) => value !== undefined)
    ? filters
    : undefined;
};

const mapPetsToResponse = (pets: any[]): PetResponse[] => {
  return pets.map((pet) => ({
    petId: pet.petId,
    foundationId: pet.foundationId,
    name: pet.name,
    type: pet.type,
    breed: pet.breed,
    status: pet.status,
    createdAt: pet.createdAt,
  }));
};

// Main handler
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const foundationId = validateFoundationId(
      event.pathParameters?.foundationId
    );
    const tableName = process.env.PETS_TABLE_NAME;
    if (!tableName) {
      throw new Error("PETS_TABLE_NAME environment variable is not defined");
    }
    const dynamoDBService = new DynamoDBService({ tableName });

    const filters = getFiltersFromQueryParams(
      event.queryStringParameters || {}
    );
    const pets = await dynamoDBService.getPetsByFoundation(
      foundationId,
      filters
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Pets retrieved successfully",
        pets: mapPetsToResponse(pets),
      }),
    };
  } catch (error) {
    console.error("Error getting pets:", error);
    const statusCode =
      error instanceof Error &&
      error.message === ERROR_MESSAGES.MISSING_FOUNDATION_ID
        ? 400
        : 500;

    return {
      statusCode,
      body: JSON.stringify({
        message:
          error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
