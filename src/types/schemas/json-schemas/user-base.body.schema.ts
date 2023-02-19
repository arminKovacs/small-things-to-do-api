import { JSONSchema7 } from 'json-schema'

export const userBaseBodySchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['username', 'password'],
  properties: {
    username: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      maxLength: 50,
    },
  },
}
