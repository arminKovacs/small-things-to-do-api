import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { JSONSchema7 } from 'json-schema'
import ajv from 'ajv'

@Injectable()
export class AjvValidationPipe implements PipeTransform {
  constructor(private schema: JSONSchema7) {}

  transform(value: object, metadata: ArgumentMetadata) {
    const isValid = new ajv().validate(value, this.schema)

    if (!isValid) {
      throw new BadRequestException('Validation failed')
    }

    return value
  }
}
