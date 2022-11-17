import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { JSONSchema7 } from 'json-schema'
import Ajv from 'ajv'

type RequestSchemaTypes = {
  body?: JSONSchema7
  param?: JSONSchema7
  query?: JSONSchema7
  custom?: JSONSchema7
}

@Injectable()
export class AjvValidationPipe implements PipeTransform {
  constructor(private schema: RequestSchemaTypes) {}

  transform(value: object, metadata: ArgumentMetadata) {
    const isValid = new Ajv().validate(this.schema[metadata.type]!, value)

    if (!isValid) {
      throw new BadRequestException(
        `Validation failed for ${metadata.type}`,
        value,
      )
    }

    return value
  }
}
