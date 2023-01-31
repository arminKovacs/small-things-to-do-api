import { Controller, Post, Body } from '@nestjs/common'
import { hash } from 'bcrypt'
import { AjvValidationPipe } from 'src/pipes/AjvValidationPipe'
import { UserDto } from 'src/types/dto/user-base.dto'
import { userBaseBodySchema } from 'src/types/schemas/json-schemas/user-base.body.schema'
import { UserLeanDocument } from 'src/types/schemas/mongo/users.schema'
import { UsersService } from './users.service'

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async createUser(
    @Body(new AjvValidationPipe(userBaseBodySchema))
    { userName, password }: UserDto,
  ): Promise<UserLeanDocument> {
    const saltOrRounds = 10
    const hashedPassword = await hash(password, saltOrRounds)
    const createdUser = await this.usersService.create({
      userName,
      password: hashedPassword,
    })

    return createdUser
  }
}
