import { JSONSchema7 } from 'json-schema'

export const userIdPathSchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['userId'],
  properties: {
    userId: {
      type: 'string',
      format: 'email',
    },
  },
}
