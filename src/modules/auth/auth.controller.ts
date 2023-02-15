import { Body, Controller, UseGuards, Post } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AjvValidationPipe } from 'src/pipes/AjvValidationPipe'
import { userBaseBodySchema } from 'src/types/schemas/json-schemas/user-base.body.schema'
import { UserLeanDocument } from 'src/types/schemas/mongo/users.schema'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(
    @Body(new AjvValidationPipe(userBaseBodySchema))
    user: UserLeanDocument,
  ) {
    return this.authService.login(user)
  }
}
