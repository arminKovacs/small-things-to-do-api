import { JSONSchema7 } from 'json-schema'

export const userBaseBodySchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['userName', 'password'],
  properties: {
    userName: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
    },
    password: {
      type: 'string',
    },
  },
}
