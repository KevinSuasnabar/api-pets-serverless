import { DynamoDBService } from "dynamo-layer";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { httpResponse } from "common-layer";

interface AddPetRequest {
  foundationId: string;
  name: string;
  type: string;
  breed: string;
  status: string;
}

interface PetResponse {
  petId: string;
  foundationId: string;
  name: string;
  type: string;
  breed: string;
  status: string;
  createdAt: string;
}

const ERROR_MESSAGES = {
  MISSING_FIELDS: "Required fields are missing",
  SERVER_ERROR: "Internal server error",
} as const;

const validateInput = (data: AddPetRequest): string | null => {
  const requiredFields = [
    "foundationId",
    "name",
    "type",
    "breed",
    "status",
  ] as const;
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    return ERROR_MESSAGES.MISSING_FIELDS;
  }
  return null;
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.PETS_TABLE_NAME;
    if (!tableName) {
      throw new Error("PETS_TABLE_NAME environment variable is not defined");
    }
    const dynamoDBService = new DynamoDBService({ tableName });

    const requestBody: AddPetRequest = JSON.parse(event.body || "{}");
    const validationError = validateInput(requestBody);

    if (validationError) {
      return httpResponse.badRequest(validationError);
    }

    const pet = await dynamoDBService.createPet(requestBody.foundationId, {
      name: requestBody.name,
      type: requestBody.type,
      breed: requestBody.breed,
      status: requestBody.status,
    });

    const response: PetResponse = {
      petId: pet.petId,
      foundationId: pet.foundationId,
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      status: pet.status,
      createdAt: pet.createdAt,
    };

    return httpResponse.created(response);
  } catch (error) {
    console.error("Error adding pet:", error);
    return httpResponse.internalError(
      ERROR_MESSAGES.SERVER_ERROR,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
