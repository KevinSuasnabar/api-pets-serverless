export interface DynamoDBConfig {
  region?: string;
  tableName: string;
}

export interface Foundation {
  foundationId: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Pet {
  petId: string;
  foundationId: string;
  name: string;
  type: string;
  breed: string;
  status: string;
  createdAt: string;
}

export interface CreateFoundationInput {
  name: string;
  email: string;
}

export interface CreatePetInput {
  name: string;
  type: string;
  breed: string;
  status: string;
}

export interface PetFilters {
  type?: string;
  breed?: string;
  name?: string;
} 