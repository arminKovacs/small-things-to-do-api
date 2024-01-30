import { Body, Controller, UseGuards, Post, HttpCode } from '@nestjs/common'
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator'
import { Req } from '@nestjs/common/decorators/http/route-params.decorator'
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard'
import { RefreshTokenGuard } from 'src/modules/auth/guards/refresh-token.guard'
import { AjvValidationPipe } from 'src/common/pipes/AjvValidationPipe'
import { AuthRequest } from 'src/types/auth-request'
import { UserDto } from 'src/types/dto/user-base.dto'
import { userBaseBodySchema } from 'src/types/schemas/json-schemas/user-base.body.schema'
import { AuthService } from './auth.service'
import { ResponseTokens } from 'src/types/reponseTokens'

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  async signUp(
    @Body(new AjvValidationPipe(userBaseBodySchema)) user: UserDto,
  ): Promise<ResponseTokens> {
    return this.authService.signup(user)
  }

  @Post('signin')
  @HttpCode(200)
  async signin(@Body(new AjvValidationPipe(userBaseBodySchema)) user: UserDto) {
    return this.authService.signIn(user)
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: AuthRequest) {
    this.authService.logout(req.user.sub)
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshToken(@Req() req: AuthRequest) {
    const { sub, refreshToken } = req.user
    return this.authService.refreshTokens(sub, refreshToken)
  }
}
