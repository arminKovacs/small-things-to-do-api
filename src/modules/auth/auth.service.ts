import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt/dist'
import { compare } from 'bcrypt'
import { UsersService } from 'src/modules/users/users.service'
import { UserDto } from 'src/types/dto/user-base.dto'
import { UserLeanDocument } from 'src/types/schemas/mongo/users.schema'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUserCredentials(
    userName: string,
    password: string,
  ): Promise<UserLeanDocument | null> {
    const user = await this.usersService.findUser(userName)
    const passwordValid = await compare(password, user.password)

    return passwordValid ? user : null
  }

  async login(user: UserDto) {
    const payload = { username: user.username }
    console.log(payload)

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
