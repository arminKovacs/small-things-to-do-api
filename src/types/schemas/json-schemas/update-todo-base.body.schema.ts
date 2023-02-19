import { JSONSchema7 } from 'json-schema'
import { todoBaseBodySchema } from './todo-base.body.schema'

export const updateTodoBaseBodySchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ...todoBaseBodySchema.properties,
  },
}
