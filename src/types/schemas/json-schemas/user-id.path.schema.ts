import { JSONSchema7 } from 'json-schema'

export const userIdPathSchema: JSONSchema7 = {
  type: 'string',
  pattern: '^[a-fA-F0-9]{24}$',
}
