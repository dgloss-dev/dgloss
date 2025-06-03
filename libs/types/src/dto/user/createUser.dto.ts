export const createUserDtoSchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
  },
  additionalProperties: false,
  required: ['username', 'email', 'password'],
};

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}
