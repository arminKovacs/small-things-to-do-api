import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt/dist'
import { compare } from 'bcrypt'
import { UsersService } from 'src/modules/users/users.service'
import { UserLeanDocument } from 'src/types/schemas/mongo/users.schema'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    userName: string,
    password: string,
  ): Promise<UserLeanDocument | null> {
    const user = await this.usersService.findUser(userName)
    const passwordValid = await compare(password, user.password)

    if (passwordValid) {
      return user
    }

    return null
  }

  async login(user: UserLeanDocument) {
    const payload = { userName: user.userName, sub: user._id }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
