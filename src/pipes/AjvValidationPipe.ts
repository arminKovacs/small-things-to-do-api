import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { JSONSchema7 } from 'json-schema'
import ajv from 'ajv'
import ajvAddFormat from 'ajv-formats'

@Injectable()
export class AjvValidationPipe implements PipeTransform {
  constructor(private schema: JSONSchema7) {}

  transform(value: object, metadata: ArgumentMetadata) {
    const isValid = ajvAddFormat(new ajv()).validate(this.schema, value)

    if (!isValid) {
      throw new BadRequestException(
        `Validation failed for ${metadata.type}`,
        JSON.stringify(value),
      )
    }

    return value
  }
}
