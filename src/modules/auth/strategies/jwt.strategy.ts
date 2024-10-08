import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AppConfigurationService } from 'src/infrastructure/configuration/app-configuration.service'
import { JwtPayload } from 'src/types/jwt-payload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly appConfigService: AppConfigurationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtSecretString,
    })
  }

  async validate(payload: JwtPayload) {
    return { username: payload.username, sub: payload.sub }
  }
}
