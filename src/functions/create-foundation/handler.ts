import { DynamoDBService } from "dynamo-layer";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { httpResponse } from "common-layer";

interface CreateFoundationRequest {
  name: string;
  email: string;
}

interface FoundationResponse {
  foundationId: string;
  name: string;
  email: string;
  createdAt: string;
}

const ERROR_MESSAGES = {
  MISSING_FIELDS: "Required fields are missing",
  INVALID_EMAIL: "Invalid email format",
  SERVER_ERROR: "Internal server error",
} as const;

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateInput = (input: CreateFoundationRequest): string | null => {
  if (!input.name || !input.email) {
    return ERROR_MESSAGES.MISSING_FIELDS;
  }

  if (!isValidEmail(input.email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }

  return null;
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.PETS_TABLE_NAME;
    if (!tableName) {
      throw new Error('PETS_TABLE_NAME environment variable is not defined');
    }
    const dynamoDBService = new DynamoDBService({ tableName });

    const requestBody: CreateFoundationRequest = JSON.parse(event.body || "{}");
    const validationError = validateInput(requestBody);

    if (validationError) {
      return httpResponse.badRequest(validationError, {
        requiredFields: ["name", "email"],
      });
    }

    const foundation = await dynamoDBService.createFoundation({
      name: requestBody.name,
      email: requestBody.email,
    });

    const response: FoundationResponse = {
      foundationId: foundation.foundationId,
      name: foundation.name,
      email: foundation.email,
      createdAt: foundation.createdAt,
    };

    return httpResponse.created({
      message: "Foundation created successfully",
      foundation: response,
    });
  } catch (error) {
    console.error("Error creating foundation:", error);
    return httpResponse.internalError(
      ERROR_MESSAGES.SERVER_ERROR,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}; 