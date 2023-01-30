import { JSONSchema7 } from 'json-schema'

export const todoBaseBodySchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'dueDate'],
  properties: {
    title: {
      type: 'string',
      minLength: 3,
      maxLength: 30,
    },
    description: {
      type: 'string',
      maxLength: 300,
    },
    dueDate: {
      type: 'string',
      format: 'date-time',
    },
  },
}
