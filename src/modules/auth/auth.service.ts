import { Injectable, HttpStatus, HttpException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt/dist'
import { compare, hash } from 'bcrypt'
import { AppConfigurationService } from 'src/infrastructure/configuration/app-configuration.service'
import { UsersService } from 'src/modules/users/users.service'
import { UserDto } from 'src/types/dto/user-base.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigurationService,
  ) {}

  async signup(user: UserDto) {
    const { password, username } = user
    const userExists = await this.usersService.findUser(username)

    if (userExists) {
      throw new HttpException(`User already exists.`, HttpStatus.BAD_REQUEST)
    }

    const hashedPassword = await hash(password, 10)
    const createdUser = await this.usersService.create({
      username,
      password: hashedPassword,
    })
    const tokens = await this.getTokens(
      createdUser._id.toString(),
      createdUser.username,
    )

    return tokens
  }

  async signIn(authData: UserDto) {
    const { password, username } = authData
    const retrievedUser = await this.usersService.findUser(username)

    if (!retrievedUser) {
      throw new HttpException(
        `Wrong credentails or user does not exist.`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const passwordValid = await compare(password, retrievedUser.password)

    if (!passwordValid) {
      throw new HttpException(
        `Wrong credentails or user does not exist.`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const tokens = await this.getTokens(
      retrievedUser._id.toString(),
      retrievedUser.username,
    )

    await this.updateRefreshToken(
      retrievedUser._id.toString(),
      tokens.refreshToken,
    )

    return tokens
  }

  async logout(userId: string) {
    this.usersService.updateUser(userId, { refreshToken: undefined })
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken, 10)
    await this.usersService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    })
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.appConfigService.jwtSecretString,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.appConfigService.jwtRefreshSecretString,
          expiresIn: '7d',
        },
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findUserById(userId)

    if (!user || !user.refreshToken) {
      throw new HttpException(`Access denied.`, HttpStatus.FORBIDDEN)
    }

    const refreshTokenMathces = await compare(refreshToken, user.refreshToken)

    if (!refreshTokenMathces) {
      throw new HttpException(`Access denied.`, HttpStatus.FORBIDDEN)
    }

    const tokens = await this.getTokens(user._id.toString(), user.username)
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken)
    return tokens
  }
}
