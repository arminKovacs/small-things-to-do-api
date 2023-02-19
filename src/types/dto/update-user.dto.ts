import { PartialType } from '@nestjs/mapped-types'
import { UserDto } from './user-base.dto'

export class UpdateUserDto extends PartialType(UserDto) {}
