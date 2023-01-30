import { JSONSchema7 } from 'json-schema'
import { todoIdPathSchema } from './todo-id.path.schema'
import { userIdPathSchema } from './user-id.path.schema'

export const userAndTodoIdPathSchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: [...userIdPathSchema.required!, ...todoIdPathSchema.required!],
  properties: {
    ...userIdPathSchema.properties!,
    ...todoIdPathSchema.properties!,
  },
}
