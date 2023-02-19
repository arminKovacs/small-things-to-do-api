import { JSONSchema7 } from 'json-schema'
import { userBaseBodySchema } from './user-base.body.schema'

export const updateUserBaseBodySchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ...userBaseBodySchema.properties,
  },
}
