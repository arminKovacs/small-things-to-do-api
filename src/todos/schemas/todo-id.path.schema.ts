import { JSONSchema7 } from 'json-schema'

export const todoIdPathSchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['todoId'],
  properties: {
    todoId: {
      type: 'string',
      pattern: '^[a-fA-F0-9]{24}$',
    },
  },
}
