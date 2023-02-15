import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { UserLeanDocument } from 'src/types/schemas/mongo/users.schema'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(username: string, password: string): Promise<UserLeanDocument> {
    const user = await this.authService.validateUserCredentials(username, password)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
