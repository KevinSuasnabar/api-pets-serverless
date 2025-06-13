import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import {
  Pet,
  Foundation,
  PetFilters,
  DynamoDBConfig,
  CreatePetInput,
  CreateFoundationInput,
} from "./types";

export class DynamoDBService {
  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(config: DynamoDBConfig) {
    this.client = new DynamoDBClient({ region: config.region || "us-east-1" });
    this.docClient = DynamoDBDocumentClient.from(this.client);
    this.tableName = config.tableName;
  }

  async createFoundation(input: CreateFoundationInput): Promise<Foundation> {
    const foundationId = uuidv4();
    const now = new Date().toISOString();

    const foundation: Foundation = {
      foundationId,
      name: input.name,
      email: input.email,
      createdAt: now,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          PK: `FOUNDATION#${foundationId}`,
          SK: "METADATA",
          ...foundation,
        },
      })
    );

    return foundation;
  }

  async createPet(foundationId: string, input: CreatePetInput): Promise<Pet> {
    const petId = uuidv4();
    const now = new Date().toISOString();

    const pet: Pet = {
      petId,
      foundationId,
      name: input.name,
      type: input.type,
      breed: input.breed,
      status: input.status,
      createdAt: now,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          PK: `FOUNDATION#${foundationId}`,
          SK: `PET#${petId}`,
          ...pet,
        },
      })
    );

    return pet;
  }

  async getFoundation(foundationId: string): Promise<Foundation | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `FOUNDATION#${foundationId}`,
          SK: "METADATA",
        },
      })
    );

    return result.Item as Foundation || null;
  }

  async getPetById(foundationId: string, petId: string): Promise<Pet | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `FOUNDATION#${foundationId}`,
          SK: `PET#${petId}`,
        },
      })
    );

    return result.Item as Pet || null;
  }

  async getPetsByFoundation(
    foundationId: string,
    filters?: PetFilters
  ): Promise<Pet[]> {
    const queryParams: any = {
      TableName: this.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": `FOUNDATION#${foundationId}`,
        ":sk": "PET#",
      },
    };

    if (filters) {
      const filterExpressions: string[] = [];
      const expressionValues: Record<string, any> = {};

      if (filters.type) {
        filterExpressions.push("#type = :type");
        expressionValues[":type"] = filters.type;
      }
      if (filters.breed) {
        filterExpressions.push("#breed = :breed");
        expressionValues[":breed"] = filters.breed;
      }
      if (filters.name) {
        filterExpressions.push("contains(#name, :name)");
        expressionValues[":name"] = filters.name;
      }

      if (filterExpressions.length > 0) {
        queryParams.FilterExpression = filterExpressions.join(" AND ");
        queryParams.ExpressionAttributeValues = {
          ...queryParams.ExpressionAttributeValues,
          ...expressionValues,
        };
        queryParams.ExpressionAttributeNames = {
          "#type": "type",
          "#breed": "breed",
          "#name": "name",
        };
      }
    }

    const result = await this.docClient.send(new QueryCommand(queryParams));
    return (result.Items || []) as Pet[];
  }

  async deletePet(foundationId: string, petId: string): Promise<void> {
    await this.docClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          PK: `FOUNDATION#${foundationId}`,
          SK: `PET#${petId}`,
        },
      })
    );
  }
} 